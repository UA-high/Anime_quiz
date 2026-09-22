import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Crown, MessageCircle, Play, Send, Users } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { getRefreshToken } from '../../auth/services/auth.api';
import McqCard from '../../interview/components/McqCard';
import PicqCard from '../../interview/components/PicqCard';
import { createRoomSocket } from '../services/room.socket';

const ask = (socket, event, payload = {}, timeout = 6000) =>
  new Promise((resolve) => {
    if (!socket || !socket.connected) {
      return resolve({ error: 'Not connected to room server. Please wait or check your connection.' });
    }
    const timer = setTimeout(() => {
      resolve({ error: 'Server request timed out. Please try again.' });
    }, timeout);
    socket.emit(event, payload, (res) => {
      clearTimeout(timer);
      resolve(res);
    });
  });

export default function RoomQuizPage() {
  const { user, refreshUserData } = useAuth();
  const refreshUserDataRef = useRef(refreshUserData);
  const socketRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [question, setQuestion] = useState(null);
  const [questionMeta, setQuestionMeta] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [settings, setSettings] = useState({ mode: 'duel', quizType: 'mcq', questionCount: 10 });
  const [error, setError] = useState('');
  const [clock, setClock] = useState(0);
  const [socketId, setSocketId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    refreshUserDataRef.current = refreshUserData;
  }, [refreshUserData]);

  useEffect(() => {
    const socket = createRoomSocket();
    socketRef.current = socket;
    let refreshing = false;

    socket.on('connect', () => {
      setSocketId(socket.id);
      setError('');
    });

    socket.on('connect_error', async (err) => {
      if (err?.message === 'Unauthorized' && !refreshing) {
        refreshing = true;
        try {
          const refreshData = await getRefreshToken();
          if (refreshData?.accessToken) {
            socket.connect();
            refreshing = false;
            return;
          }
        } catch (_) {
          // Token refresh failed
        }
        refreshing = false;
        setError('Your session expired. Please sign in again.');
      } else {
        setError(err?.message || 'Failed to connect to room server.');
      }
    });

    socket.on('room:update', setRoom);
    socket.on('quiz:question', (data) => {
      setQuestion(data.question);
      setQuestionMeta(data);
      setClock(Date.now());
      setAnswer('');
      setFeedback('');
    });
    socket.on('quiz:finished', async (finalRoom) => {
      setRoom(finalRoom);
      setQuestion(null);
      setFeedback('Quiz complete — scores have been added to your profile.');
      await refreshUserDataRef.current?.();
    });
    socket.on('chat:message', (message) => setMessages((items) => [...items, message]));

    return () => {
      setSocketId('');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!room?.endsAt || room.status !== 'playing') return undefined;
    const timer = setInterval(() => setClock(Date.now()), 250);
    return () => clearInterval(timer);
  }, [room?.endsAt, room?.status]);

  const perform = async (event, payload) => {
    setError('');
    setIsSubmitting(true);
    try {
      const response = await ask(socketRef.current, event, payload);
      if (response?.error) setError(response.error);
      if (response?.room) setRoom(response.room);
    } finally {
      setIsSubmitting(false);
    }
  };
  const createRoom = () => perform('room:create', settings);
  const joinRoom = () => perform('room:join', { code: joinCode });
  const startQuiz = () => perform('room:start');
  const sendAnswer = async () => {
    if (!answer || !question) return;
    const response = await ask(socketRef.current, 'quiz:answer', { answer });
    if (response?.error) setError(response.error);
    else setFeedback(response.correct ? 'Correct! +5 points' : 'Not quite — -2 points');
  };
  const sendChat = async (event) => {
    event.preventDefault();
    if (!chat.trim()) return;
    await ask(socketRef.current, 'chat:send', { message: chat });
    setChat('');
  };

  const myId = String(user?.id || user?._id || '');
  const me = room?.players?.find((player) => String(player.userId) === myId);
  const isHost = room?.hostId === socketId;
  const seconds = room?.endsAt ? Math.max(0, Math.ceil((room.endsAt - clock) / 1000)) : 0;

  if (!room) return (
    <main className="min-h-screen bg-[#F5F4EF] px-4 py-10 font-['Nunito',sans-serif]">
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 font-black mb-8"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <section className="bg-white border-[3px] border-black rounded-3xl p-6 md:p-10 shadow-[8px_8px_0_#111]">
          <span className="bg-[#C4B5FD] border-2 border-black rounded-lg px-3 py-1 text-xs font-black">MULTIPLAYER</span>
          <h1 className="text-3xl md:text-4xl font-black font-['Gabarito',sans-serif] mt-4">Battle your fellow otaku</h1>
          <p className="font-bold text-gray-600 mt-2">Create a private room, share the code, and chat while the quiz runs.</p>
          {error && <p className="mt-5 bg-red-100 border-2 border-black rounded-xl p-3 font-bold">{error}</p>}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="border-[2.5px] border-black rounded-2xl p-5 bg-[#FDE047] shadow-[4px_4px_0_#111]">
              <h2 className="font-black text-xl">Create a room</h2>
              <label className="block font-black text-sm mt-4">Mode</label>
              <select value={settings.mode} onChange={(e) => setSettings({ ...settings, mode: e.target.value })} className="w-full mt-1 p-3 border-2 border-black rounded-xl font-bold bg-white"><option value="duel">1v1</option><option value="teams">Many v Many</option></select>
              <label className="block font-black text-sm mt-3">Quiz type</label>
              <select value={settings.quizType} onChange={(e) => setSettings({ ...settings, quizType: e.target.value })} className="w-full mt-1 p-3 border-2 border-black rounded-xl font-bold bg-white"><option value="mcq">Classic MCQ</option><option value="picq">Guess the character</option></select>
              <label className="block font-black text-sm mt-3">Questions</label>
              <select value={settings.questionCount} onChange={(e) => setSettings({ ...settings, questionCount: Number(e.target.value) })} className="w-full mt-1 p-3 border-2 border-black rounded-xl font-bold bg-white"><option value="5">5</option><option value="10">10</option><option value="15">15</option></select>
              <button
                disabled={isSubmitting || !socketId}
                onClick={createRoom}
                className="mt-5 w-full bg-black text-white disabled:opacity-60 border-2 border-black rounded-xl p-3 font-black cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : !socketId ? 'Connecting...' : 'Create room'}
              </button>
            </div>
            <div className="border-[2.5px] border-black rounded-2xl p-5 bg-[#86EFAC] shadow-[4px_4px_0_#111]">
              <h2 className="font-black text-xl">Join a room</h2><p className="font-bold text-sm mt-2">Ask the host for their six-character room code.</p>
              <input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength="6" placeholder="ABC123" className="mt-5 w-full p-3 border-2 border-black rounded-xl font-black tracking-[0.25em] uppercase bg-white" />
              <button
                disabled={isSubmitting || !socketId || !joinCode}
                onClick={joinRoom}
                className="mt-3 w-full bg-white disabled:opacity-60 border-2 border-black rounded-xl p-3 font-black cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Joining...' : 'Join room'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );

  return <main className="min-h-screen bg-[#F5F4EF] px-4 py-6 font-['Nunito',sans-serif]"><div className="max-w-6xl mx-auto">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><Link to="/dashboard" className="inline-flex items-center gap-2 font-black"><ArrowLeft className="w-4 h-4" /> Leave room</Link><div className="bg-white border-2 border-black px-4 py-2 rounded-xl font-black">Room: {room.code} <button title="Copy room code" onClick={() => navigator.clipboard?.writeText(room.code)}><Copy className="inline w-4 ml-1" /></button></div></div>
    {error && <p className="mb-4 bg-red-100 border-2 border-black rounded-xl p-3 font-bold">{error}</p>}
    <div className="grid lg:grid-cols-[1fr_320px] gap-6"><section>
      <div className="bg-white border-[2.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0_#111] mb-5 flex flex-wrap items-center justify-between gap-3"><div><span className="font-black">{room.mode === 'duel' ? '1v1 Duel' : 'Many v Many'}</span><p className="font-bold text-sm text-gray-600">{room.quizType === 'mcq' ? 'Classic MCQ' : 'Guess the character'} · {room.questionCount} questions</p></div>{room.status === 'playing' && <span className="bg-[#C4B5FD] border-2 border-black rounded-lg px-3 py-2 font-black">{questionMeta?.currentIndex + 1}/{questionMeta?.totalQuestions} · {seconds}s</span>}</div>
      {room.status === 'lobby' && <Lobby room={room} me={me} isHost={isHost} onTeam={(team) => perform('room:team', { team })} onStart={startQuiz} />}
      {room.status === 'playing' && question && <><div className="mb-4">{room.quizType === 'mcq' ? <McqCard question={question} selectedAnswer={answer} onSelectAnswer={setAnswer} /> : <PicqCard question={question} selectedAnswer={answer} onSelectAnswer={setAnswer} />}</div><button disabled={!answer || me?.answered} onClick={sendAnswer} className="bg-[#86EFAC] disabled:opacity-50 border-[2.5px] border-black rounded-xl px-6 py-3 font-black shadow-[3px_3px_0_#111]">{me?.answered ? 'Answer locked' : 'Lock answer'}</button>{feedback && <span className="ml-4 font-black">{feedback}</span>}</>}
      {room.status === 'finished' && <div className="bg-white border-[3px] border-black rounded-2xl p-8 shadow-[6px_6px_0_#111]"><h2 className="text-3xl font-black">Quiz finished!</h2><p className="font-bold mt-2">{feedback || 'Final scores are shown in the room panel.'}</p></div>}
    </section><ChatPanel messages={messages} chat={chat} setChat={setChat} sendChat={sendChat} /></div>
  </div></main>;
}

function Lobby({ room, me, isHost, onTeam, onStart }) { return <div className="bg-white border-[3px] border-black rounded-2xl p-6 shadow-[5px_5px_0_#111]"><h2 className="text-2xl font-black">Waiting room <Users className="inline w-5" /></h2><p className="font-bold text-gray-600 mt-1">Share the room code. The host starts once at least two players join.</p><div className="grid sm:grid-cols-2 gap-3 mt-5">{room.players.map((player) => <div key={player.socketId} className="border-2 border-black rounded-xl p-3 font-bold">{player.socketId === room.hostId && <Crown className="inline w-4 mr-1 text-amber-500" />}{player.username}{room.mode === 'teams' && <span className={`ml-2 text-xs px-2 py-1 rounded ${player.team === 'red' ? 'bg-red-200' : 'bg-blue-200'}`}>{player.team}</span>}</div>)}</div>{room.mode === 'teams' && <div className="mt-5"><span className="font-black text-sm">Your team: </span><button onClick={() => onTeam('red')} className={`mx-1 border-2 border-black px-3 py-1 rounded-lg font-black ${me?.team === 'red' ? 'bg-red-300' : 'bg-white'}`}>Red</button><button onClick={() => onTeam('blue')} className={`border-2 border-black px-3 py-1 rounded-lg font-black ${me?.team === 'blue' ? 'bg-blue-300' : 'bg-white'}`}>Blue</button></div>}{isHost && <button onClick={onStart} className="mt-6 bg-black text-white border-2 border-black rounded-xl px-5 py-3 font-black"><Play className="inline w-4 mr-1 fill-white" /> Start quiz</button>}</div> }
function ChatPanel({ messages, chat, setChat, sendChat }) { return <aside className="bg-white border-[2.5px] border-black rounded-2xl shadow-[5px_5px_0_#111] flex flex-col min-h-[440px]"><h2 className="p-4 border-b-2 border-black font-black"><MessageCircle className="inline w-5 mr-1" /> Room chat</h2><div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[460px]">{messages.length ? messages.map((message) => <div key={message.id}><span className="font-black text-sm">{message.username}</span><p className="bg-[#F5F4EF] rounded-lg p-2 font-semibold text-sm break-words">{message.message}</p></div>) : <p className="font-bold text-sm text-gray-500">Say hello to the room.</p>}</div><form onSubmit={sendChat} className="p-3 border-t-2 border-black flex gap-2"><input value={chat} onChange={(e) => setChat(e.target.value)} maxLength="300" placeholder="Message..." className="min-w-0 flex-1 border-2 border-black rounded-lg p-2 font-bold" /><button className="border-2 border-black rounded-lg px-3 bg-[#FDE047]"><Send className="w-4" /></button></form></aside> }
