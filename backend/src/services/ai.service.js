const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const animeQuizJsonSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description:
        "The title of the anime that the quiz question is based on. This should be the official or commonly recognized English title of the anime.",
    },

    genres: {
      type: "array",
      description:
        "A list of genres that accurately describe the anime, such as shounen, shoujo, isekai, action, adventure, fantasy, science fiction, romance, comedy, or thriller.",
      items: {
        type: "string",
        description: "A genre that accurately describes the anime.",
      },
    },

    question: {
      type: "string",
      description:
        "A clear and unambiguous multiple-choice question about the anime. The question must have exactly one objectively correct answer and must be answerable using established information about the anime.",
    },

    answer: {
      type: "string",
      description:
        "The correct answer to the question. This value must exactly match one of the four options provided in the options array.",
    },

    options: {
      type: "array",
      description:
        "Exactly four distinct answer choices for the multiple-choice question. The options should be plausible, relevant to the question, and contain exactly one correct answer.",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "string",
        description:
          "A single possible answer to the question. Each option must be distinct and relevant to the question.",
      },
    },

    hints: {
      type: "array",
      description:
        "Exactly two hints that help the user recall or reason about the answer without directly revealing it.",
      minItems: 2,
      maxItems: 2,
      items: {
        type: "string",
        description:
          "A concise hint related to the question that provides useful context without explicitly stating the correct answer.",
      },
    },

    explanation: {
      type: "string",
      description:
        "A concise explanation of why the correct answer is correct. The explanation should provide relevant context or facts from the anime that support the answer.",
    },

    difficulty: {
      type: "string",
      enum: ["easy", "medium", "hard"],
      description:
        "The difficulty level of the question. Easy questions test basic and commonly known facts, medium questions require more detailed knowledge of the anime, and hard questions require deep knowledge of characters, events, abilities, relationships, or lore.",
    },
  },

  required: [
    "title",
    "genres",
    "question",
    "answer",
    "options",
    "hints",
    "explanation",
    "difficulty",
  ],
};

const questionSchema = z.fromJSONSchema(animeQuizJsonSchema);

async function generateQuestion() {
  const prompt = `
Generate one high-quality anime quiz question.

Follow the provided JSON schema exactly.

Rules:
- Generate a factual question about a real anime.
- The question must have exactly one objectively correct answer.
- The answer must exactly match one of the four options.
- All four options must be distinct, plausible, and relevant.
- Do not create subjective, opinion-based, or ambiguous questions.
- Do not invent anime facts, characters, events, abilities, relationships, or episode details.
- Prefer well-established facts from the anime.
- Generate exactly two useful hints. Hints must help the user reason toward the answer without directly revealing it.
- The explanation must clearly explain why the correct answer is correct.
- Assign an appropriate difficulty: easy, medium, or hard.
- Avoid making the correct answer obvious because of its length, wording, or formatting.
- Return only the JSON object. Do not include Markdown or additional text.
`;

  const interaction = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: animeQuizJsonSchema,
    },
  });

  const question = questionSchema.parse(JSON.parse(interaction.output_text));
  console.log(interaction.output_text);

  return question;
}

module.exports = { generateQuestion };
