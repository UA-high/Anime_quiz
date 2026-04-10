const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("./src/db/db");
const mcqModel = require("./src/models/mcq.model");
const picqsModel = require("./src/models/picqs.model");
const userModel = require("./src/models/user.model");
const dotenv = require("dotenv");

dotenv.config();

const seedMCQs = [
  {
    title: "Who is the protagonist of One Piece?",
    desc: "A boy with rubber body who wants to be Pirate King.",
    opts: ["Naruto", "Luffy", "Ichigo", "Goku"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
  },
  {
    title: "What is Naruto's signature move?",
    desc: "A spinning ball of chakra formed in the palm.",
    opts: ["Chidori", "Rasengan", "Amaterasu", "Shinra Tensei"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
  },
  {
    title: "Which anime features a 'Death Note'?",
    desc: "A notebook that can kill anyone whose name is written in it.",
    opts: ["Bleach", "Code Geass", "Death Note", "Monster"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
  },
  {
    title: "In 'Attack on Titan', what is the name of the outermost wall?",
    desc: "The wall that was first breached by the Colossal Titan.",
    opts: ["Wall Maria", "Wall Rose", "Wall Sheena", "Wall Sina"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
  },
  {
    title: "What is the name of the wizard guild in 'Fairy Tail'?",
    desc: "The guild Natsu and Lucy belong to.",
    opts: ["Sabertooth", "Blue Pegasus", "Fairy Tail", "Lamia Scale"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
  },
  {
    title: "Who is known as the 'Fullmetal Alchemist'?",
    desc: "The youngest State Alchemist in history.",
    opts: ["Alphonse Elric", "Edward Elric", "Roy Mustang", "Scar"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
  },
  {
    title: "What is the name of the spirit inside Naruto?",
    desc: "The powerful beast sealed within him at birth.",
    opts: ["Shukaku", "Matatabi", "Kurama", "Gyuki"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
  },
  {
    title: "In 'Bleach', what are the soul reapers' weapons called?",
    desc: "Swords that reflect the user's soul.",
    opts: ["Kunai", "Katana", "Zanpakuto", "Nichirin Sword"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
  },
  {
    title: "Who is the author of 'Dragon Ball'?",
    desc: "The legendary mangaka who created Goku.",
    opts: ["Eiichiro Oda", "Masashi Kishimoto", "Akira Toriyama", "Tite Kubo"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
  },
  {
    title: "What is the name of the virtual world in 'Sword Art Online'?",
    desc: "The first game world where Kirito was trapped.",
    opts: ["Alfheim Online", "Gun Gale Online", "Aincrad", "Underworld"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
  },
];

const seedPicqs = [
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Straw Hat", "Gomu Gomu no Mi", "Monkey D."],
    ans: "Monkey D. Luffy",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Saiyan", "Kamehameha", "Vegeta's Rival"],
    ans: "Son Goku",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Fullmetal Alchemist", "Edward Elric", "Equivalent Exchange"],
    ans: "Edward Elric",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Detective", "High Schooler", "Shrunken Body"],
    ans: "Conan Edogawa",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Titan Shifter", "Attack Titan", "Eren"],
    ans: "Eren Yeager",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Electric Mouse", "Pikachu", "Ash's Buddy"],
    ans: "Pikachu",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Demon Slayer", "Water Breathing", "Tanjiro"],
    ans: "Tanjiro Kamado",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Hunter x Hunter", "Green Outfit", "Fishing Rod"],
    ans: "Gon Freecss",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Uchiha", "Sharingan", "Sasuke"],
    ans: "Sasuke Uchiha",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Ghouls", "One-Eyed Ghoul", "Ken"],
    ans: "Ken Kaneki",
  },
];

const seedUsers = async () => {
  const commonPassword = await bcrypt.hash("password123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  const users = [
    { username: "admin", email: "admin@test.com", password: adminPassword, role: "admin" },
  ];

  for (let i = 1; i <= 9; i++) {
    users.push({
      username: `user${i}`,
      email: `user${i}@test.com`,
      password: commonPassword,
      role: "user",
    });
  }

  return users;
};

const runSeed = async () => {
  try {
    await connectDB();

    console.log("Seeding MCQs...");
    await mcqModel.deleteMany({});
    await mcqModel.insertMany(seedMCQs);

    console.log("Seeding Picqs...");
    await picqsModel.deleteMany({});
    await picqsModel.insertMany(seedPicqs);

    console.log("Seeding Users...");
    await userModel.deleteMany({});
    const users = await seedUsers();
    await userModel.insertMany(users);

    console.log("Database seeded successfully with 10+ entries per collection!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

runSeed();
