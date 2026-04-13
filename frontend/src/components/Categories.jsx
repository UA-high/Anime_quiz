import { useState } from "react";
import T from "../tokens";
import { Tag, useScrollReveal } from "./shared";

const CATS = [
  { title: "Shonen Legends",  desc: "Naruto, DBZ, One Piece & all the classics you grew up with.", bg: T.coral,    icon: "⚡", tag: "EASY",   tagBg: T.mint,     qs: "240 Questions" },
  { title: "Psychological",   desc: "Death Note, Monster, Evangelion — for the big brain fans.",   bg: T.lavender, icon: "🧠", tag: "HARD",   tagBg: T.coral,    qs: "180 Questions" },
  { title: "Studio Ghibli",   desc: "Miyazaki's enchanted worlds, spirits, and moving castles.",   bg: T.mint,     icon: "🌿", tag: "MEDIUM", tagBg: T.yellow,   qs: "120 Questions" },
  { title: "Isekai Worlds",   desc: "SAO, Re:Zero, Konosuba, and another world adventures.",       bg: T.yellow,   icon: "🌀", tag: "MEDIUM", tagBg: T.sky,      qs: "200 Questions" },
  { title: "Mecha & Sci-Fi",  desc: "Gundam, Code Geass, Darling in the FranXX, and more.",       bg: T.sky,      icon: "🤖", tag: "HARD",   tagBg: T.lavender, qs: "150 Questions" },
  { title: "Romance & SoL",   desc: "Toradora, Clannad, K-On — the feels you can't forget.",      bg: T.pink,     icon: "🌸", tag: "EASY",   tagBg: T.yellow,   qs: "190 Questions" },
];

export default function Categories() {
  const { ref, vis } = useScrollReveal();
  return (
    <section style={{
      padding: "90px 48px", background: T.bg,
      backgroundImage: "radial-gradient(circle, #ccc 1px, transparent 1px)",
      backgroundSize: "22px 22px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Section header */}
        <div ref={ref} style={{
          marginBottom: "60px", textAlign: "center",
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.6s ease",
        }}>
          <Tag label="📚 Browse Quizzes" bg={T.lavender} />
          <h2 style={{
            fontFamily: T.fonts.head, fontWeight: "900",
            fontSize: "clamp(2rem, 4vw, 3.2rem)", color: T.black,
            margin: "16px 0 12px", letterSpacing: "-1px",
          }}>
            Pick Your{" "}
            <span style={{
              background: T.yellow, border: T.border, borderRadius: "10px",
              padding: "2px 14px", boxShadow: "4px 4px 0 #111", display: "inline-block",
            }}>
              Category
            </span>
          </h2>
          <p style={{
            fontFamily: T.fonts.body, color: "#555", fontWeight: "600",
            fontSize: "1rem", maxWidth: "480px", margin: "0 auto",
          }}>
            20+ categories covering every corner of the anime universe. Your specialty is in here.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}>
          {CATS.map((c, i) => <CatCard key={i} cat={c} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function CatCard({ cat, index }) {
  const { ref, vis } = useScrollReveal();
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(40px)",
      transition: `all 0.5s ${index * 0.08}s ease`,
    }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: cat.bg, border: T.border, borderRadius: T.radius,
          boxShadow: hov ? "7px 7px 0 #111" : T.shadow,
          transform: hov ? "translate(-2px,-2px)" : "translate(0,0)",
          transition: "all 0.15s ease",
          padding: "28px 24px", cursor: "pointer",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Decorative dashed circle */}
        <div style={{
          position: "absolute", bottom: "-30px", right: "-30px",
          width: "100px", height: "100px", borderRadius: "50%",
          background: "rgba(255,255,255,0.25)",
          border: "2px dashed rgba(0,0,0,0.15)",
        }} />

        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: "16px",
        }}>
          <span style={{ fontSize: "2.4rem", filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.15))" }}>
            {cat.icon}
          </span>
          <Tag label={cat.tag} bg={cat.tagBg} />
        </div>

        <h3 style={{
          fontFamily: T.fonts.head, fontWeight: "900",
          fontSize: "1.2rem", margin: "0 0 8px", color: T.black,
        }}>
          {cat.title}
        </h3>
        <p style={{
          fontFamily: T.fonts.body, fontSize: "0.875rem",
          color: "#333", margin: "0 0 20px", lineHeight: 1.6, fontWeight: "600",
        }}>
          {cat.desc}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            fontFamily: T.fonts.body, fontWeight: "800", fontSize: "0.8rem",
            color: "#555", border: "1.5px solid #555", borderRadius: "6px", padding: "2px 8px",
          }}>
            {cat.qs}
          </span>
          <span style={{ fontFamily: T.fonts.head, fontWeight: "800", fontSize: "0.9rem", color: T.black }}>
            Play →
          </span>
        </div>
      </div>
    </div>
  );
}
