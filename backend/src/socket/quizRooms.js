const mcqModel = require("../models/mcq.model");
const picqsModel = require("../models/picqs.model");
const userModel = require("../models/user.model");

const rooms = new Map();
const ROOM_CODE_LENGTH = 6;
const QUESTION_SECONDS = 30;
const ROOM_LIMITS = { duel: 2, teams: 5 };

const codeForRoom = () => {
  let code;
  do code = Math.random().toString(36).slice(2, 2 + ROOM_CODE_LENGTH).toUpperCase();
  while (rooms.has(code));
  return code;
};

const publicQuestion = (question, type) => {
  const base = { _id: question._id, image: question.image || "" };
  return type === "mcq"
    ? { ...base, title: question.title, desc: question.desc, opts: question.opts || [] }
    : { ...base, hints: question.hints || [] };
};

const roomSnapshot = (room) => ({
  code: room.code,
  mode: room.mode,
  quizType: room.quizType,
  questionCount: room.questionCount,
  status: room.status,
  hostId: room.hostId,
  currentIndex: room.currentIndex,
  endsAt: room.endsAt,
  players: [...room.players.values()].map(({ socketId, userId, username, team, score, answered }) => ({
    socketId, userId, username, team, score, answered,
  })),
  teamScores: room.mode === "teams"
    ? { red: [...room.players.values()].filter((p) => p.team === "red").reduce((sum, p) => sum + p.score, 0), blue: [...room.players.values()].filter((p) => p.team === "blue").reduce((sum, p) => sum + p.score, 0) }
    : null,
});

const emitRoom = (io, room) => io.to(room.code).emit("room:update", roomSnapshot(room));

async function finishRoom(io, room) {
  clearTimeout(room.timer);
  room.status = "finished";
  const scoreByUser = [...room.players.values()].reduce((scores, player) => {
    scores.set(player.userId, (scores.get(player.userId) || 0) + player.score);
    return scores;
  }, new Map());
  await Promise.all([...scoreByUser].map(([id, score]) => userModel.findByIdAndUpdate(id, { $inc: { totalScore: score } })));
  io.to(room.code).emit("quiz:finished", roomSnapshot(room));
  emitRoom(io, room);
}

function startQuestion(io, room) {
  if (room.currentIndex >= room.questions.length) return finishRoom(io, room);
  room.players.forEach((player) => { player.answered = false; });
  room.endsAt = Date.now() + QUESTION_SECONDS * 1000;
  io.to(room.code).emit("quiz:question", {
    question: publicQuestion(room.questions[room.currentIndex], room.quizType),
    currentIndex: room.currentIndex,
    totalQuestions: room.questions.length,
    endsAt: room.endsAt,
  });
  emitRoom(io, room);
  room.timer = setTimeout(() => {
    room.currentIndex += 1;
    startQuestion(io, room);
  }, QUESTION_SECONDS * 1000);
}

function registerQuizSockets(io) {
  io.on("connection", (socket) => {
    const leaveCurrentRoom = () => {
      const room = [...rooms.values()].find((entry) => entry.players.has(socket.id));
      if (!room) return;
      room.players.delete(socket.id);
      socket.leave(room.code);
      if (room.players.size === 0) {
        clearTimeout(room.timer);
        rooms.delete(room.code);
      } else {
        if (room.hostId === socket.id) room.hostId = room.players.keys().next().value;
        emitRoom(io, room);
      }
    };

    socket.on("room:create", ({ mode, quizType = "mcq", questionCount = 10 }, reply) => {
      if (!['duel', 'teams'].includes(mode) || !['mcq', 'picq'].includes(quizType)) return reply?.({ error: "Invalid room settings." });
      leaveCurrentRoom();
      const code = codeForRoom();
      const room = { code, mode, quizType, questionCount: Math.min(Math.max(Number(questionCount) || 10, 5), 15), hostId: socket.id, status: "lobby", players: new Map(), questions: [], currentIndex: 0, timer: null, endsAt: null };
      room.players.set(socket.id, { socketId: socket.id, userId: socket.user.id, username: socket.user.username, team: "red", score: 0, answered: false });
      rooms.set(code, room);
      socket.join(code);
      reply?.({ room: roomSnapshot(room) });
    });

    socket.on("room:join", ({ code }, reply) => {
      const room = rooms.get(String(code || "").toUpperCase());
      if (!room) return reply?.({ error: "Room not found." });
      if (room.status !== "lobby") return reply?.({ error: "This quiz has already started." });
      if (room.players.size >= ROOM_LIMITS[room.mode]) {
        return reply?.({ error: room.mode === "duel" ? "This 1v1 room is full." : "This team room is full (5 players maximum)." });
      }
      leaveCurrentRoom();
      const team = room.mode === "teams"
        ? ([...room.players.values()].filter((p) => p.team === "red").length <= [...room.players.values()].filter((p) => p.team === "blue").length ? "red" : "blue")
        : "blue";
      room.players.set(socket.id, { socketId: socket.id, userId: socket.user.id, username: socket.user.username, team, score: 0, answered: false });
      socket.join(room.code);
      emitRoom(io, room);
      reply?.({ room: roomSnapshot(room) });
    });

    socket.on("room:team", ({ team }, reply) => {
      const room = [...rooms.values()].find((entry) => entry.players.has(socket.id));
      const player = room?.players.get(socket.id);
      if (!room || !player || room.status !== "lobby" || room.mode !== "teams" || !['red', 'blue'].includes(team)) return reply?.({ error: "Team cannot be changed now." });
      player.team = team;
      emitRoom(io, room);
    });

    socket.on("room:start", async (_, reply) => {
      const room = [...rooms.values()].find((entry) => entry.players.has(socket.id));
      if (!room || room.hostId !== socket.id) return reply?.({ error: "Only the host can start." });
      if (room.players.size < 2 || (room.mode === "duel" && room.players.size !== 2)) return reply?.({ error: "Wait for another player before starting." });
      try {
        const Model = room.quizType === "mcq" ? mcqModel : picqsModel;
        room.questions = await Model.aggregate([{ $sample: { size: room.questionCount } }]);
        if (!room.questions.length) return reply?.({ error: "No questions are available for this type." });
        room.status = "playing";
        room.currentIndex = 0;
        startQuestion(io, room);
        reply?.({ ok: true });
      } catch (error) {
        reply?.({ error: "Could not start the room quiz." });
      }
    });

    socket.on("quiz:answer", ({ answer }, reply) => {
      const room = [...rooms.values()].find((entry) => entry.players.has(socket.id));
      const player = room?.players.get(socket.id);
      if (!room || !player || room.status !== "playing" || player.answered) return reply?.({ error: "Answer is no longer available." });
      const question = room.questions[room.currentIndex];
      player.answered = true;
      const correct = String(answer || "").trim().toLowerCase() === String(question.ans || "").trim().toLowerCase();
      player.score += correct ? 5 : -2;
      reply?.({ correct, score: player.score });
      emitRoom(io, room);
    });

    socket.on("chat:send", ({ message }, reply) => {
      const room = [...rooms.values()].find((entry) => entry.players.has(socket.id));
      const clean = String(message || "").trim().slice(0, 300);
      if (!room || !clean) return;
      io.to(room.code).emit("chat:message", { id: `${socket.id}-${Date.now()}`, username: socket.user.username, message: clean, sentAt: Date.now() });
      reply?.({ ok: true });
    });

    socket.on("disconnect", leaveCurrentRoom);
  });
}

module.exports = { registerQuizSockets };
