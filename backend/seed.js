const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("./src/db/db");
const mcqModel = require("./src/models/mcq.model");
const picqsModel = require("./src/models/picqs.model");
const userModel = require("./src/models/user.model");
const dotenv = require("dotenv");

dotenv.config();

const getMCQs = (adminId) => [
  {
    title: "Who is the protagonist of One Piece?",
    desc: "A boy with rubber body who wants to be Pirate King.",
    ans: "Luffy",
    opts: ["Naruto", "Luffy", "Ichigo", "Goku"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    author: adminId,
  },
  {
    title: "What is Naruto's signature move?",
    desc: "A spinning ball of chakra formed in the palm.",
    ans: "Rasengan",
    opts: ["Chidori", "Rasengan", "Amaterasu", "Shinra Tensei"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    author: adminId,
  },
  {
    title: "Which anime features a 'Death Note'?",
    desc: "A notebook that can kill anyone whose name is written in it.",
    ans: "Death Note",
    opts: ["Bleach", "Code Geass", "Death Note", "Monster"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    author: adminId,
  },
  {
    title: "In 'Attack on Titan', what is the name of the outermost wall?",
    desc: "The wall that was first breached by the Colossal Titan.",
    ans: "Wall Maria",
    opts: ["Wall Maria", "Wall Rose", "Wall Sheena", "Wall Sina"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    author: adminId,
  },
  {
    title: "What is the name of the wizard guild in 'Fairy Tail'?",
    desc: "The guild Natsu and Lucy belong to.",
    ans: "Fairy Tail",
    opts: ["Sabertooth", "Blue Pegasus", "Fairy Tail", "Lamia Scale"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    author: adminId,
  },
  {
    title: "Who is known as the 'Fullmetal Alchemist'?",
    desc: "The youngest State Alchemist in history.",
    ans: "Edward Elric",
    opts: ["Alphonse Elric", "Edward Elric", "Roy Mustang", "Scar"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    author: adminId,
  },
  {
    title: "What is the name of the spirit inside Naruto?",
    desc: "The powerful beast sealed within him at birth.",
    ans: "Kurama",
    opts: ["Shukaku", "Matatabi", "Kurama", "Gyuki"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    author: adminId,
  },
  {
    title: "In 'Bleach', what are the soul reapers' weapons called?",
    desc: "Swords that reflect the user's soul.",
    ans: "Zanpakuto",
    opts: ["Kunai", "Katana", "Zanpakuto", "Nichirin Sword"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    author: adminId,
  },
  {
    title: "Who is the author of 'Dragon Ball'?",
    desc: "The legendary mangaka who created Goku.",
    ans: "Akira Toriyama",
    opts: ["Eiichiro Oda", "Masashi Kishimoto", "Akira Toriyama", "Tite Kubo"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    author: adminId,
  },
  {
    title: "What is the name of the virtual world in 'Sword Art Online'?",
    desc: "The first game world where Kirito was trapped.",
    ans: "Aincrad",
    opts: ["Alfheim Online", "Gun Gale Online", "Aincrad", "Underworld"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    author: adminId,
  },
];

const getPicqs = (adminId) => [
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Straw Hat", "Gomu Gomu no Mi", "Monkey D."],
    ans: "Monkey D. Luffy",
    author: adminId,
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Saiyan", "Kamehameha", "Vegeta's Rival"],
    ans: "Son Goku",
    author: adminId,
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Fullmetal Alchemist", "Edward Elric", "Equivalent Exchange"],
    ans: "Edward Elric",
    author: adminId,
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Detective", "High Schooler", "Shrunken Body"],
    ans: "Conan Edogawa",
    author: adminId,
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Titan Shifter", "Attack Titan", "Eren"],
    ans: "Eren Yeager",
    author: adminId,
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Electric Mouse", "Pikachu", "Ash's Buddy"],
    ans: "Pikachu",
    author: adminId,
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Demon Slayer", "Water Breathing", "Tanjiro"],
    ans: "Tanjiro Kamado",
    author: adminId,
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Hunter x Hunter", "Green Outfit", "Fishing Rod"],
    ans: "Gon Freecss",
    author: adminId,
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Uchiha", "Sharingan", "Sasuke"],
    ans: "Sasuke Uchiha",
    author: adminId,
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mv-S2Y_K5_C2-v_N-x-r-r-n-q-q-q-q-q",
    hints: ["Ghouls", "One-Eyed Ghoul", "Ken"],
    ans: "Ken Kaneki",
    author: adminId,
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

    console.log("Seeding Users...");
    await userModel.deleteMany({});
    const userData = await seedUsers();
    const createdUsers = await userModel.insertMany(userData);
    const adminUser = createdUsers.find(u => u.role === "admin");

    if (!adminUser) {
      throw new Error("Admin user not created");
    }

    console.log("Seeding MCQs...");
    await mcqModel.deleteMany({});
    await mcqModel.insertMany(getMCQs(adminUser._id));

    console.log("Seeding Picqs...");
    await picqsModel.deleteMany({});
    await picqsModel.insertMany(getPicqs(adminUser._id));

    console.log("Database seeded successfully with 10+ entries per collection!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

runSeed();
