import { useState } from "react";
import T from "../tokens";
import { Star, Squiggle } from "./shared";

export default function Hero() {
  return (
    <section style={{
      minHeight: "100vh",
      width:"100%",
      background: T.bg,
      backgroundImage: "radial-gradient(circle, #ccc 1px, transparent 1px)",
      backgroundSize: "22px 22px",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "120px 48px 80px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Floating deco sticky-note cards */}
      <DecoFloat style={{ top: "12%", left: "3%" }}  bg={T.lavender} rotate="-8deg" label="1,200+ Questions" emoji="📚" />
      <DecoFloat style={{ top: "18%", right: "4%" }} bg={T.coral}    rotate="6deg"  label="500K Otaku"       emoji="👥" />
      <DecoFloat style={{ bottom: "18%", left: "4%" }} bg={T.mint}   rotate="5deg"  label="800+ Anime"       emoji="🎌" />
      <DecoFloat style={{ bottom: "14%", right: "3%" }} bg={T.sky}   rotate="-6deg" label="Live Rankings"    emoji="🏆" />

      {/* Center content */}
      <div style={{ textAlign: "center", maxWidth: "780px", position: "relative", zIndex: 2 }}>
        {/* Eyebrow badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: T.lavender, border: T.border, borderRadius: "30px",
          padding: "7px 20px", marginBottom: "28px",
          boxShadow: "3px 3px 0 #111",
          fontFamily: T.fonts.head, fontWeight: "800", fontSize: "0.85rem",
        }}>
          <Star size={16} color={T.yellow} />
          The #1 Anime Quiz Platform
          <Star size={16} color={T.yellow} />
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: T.fonts.head, fontSize: "clamp(3.2rem, 7vw, 6.5rem)",
          fontWeight: "900", lineHeight: 1.0, color: T.black,
          margin: "0 0 8px", letterSpacing: "-2px",
        }}>
          Test Your
        </h1>

        <h1 style={{
          fontFamily: T.fonts.head, fontSize: "clamp(3.2rem, 7vw, 6.5rem)",
          fontWeight: "900", lineHeight: 1.0, color: T.black,
          margin: "0 0 24px", letterSpacing: "-2px",
          position: "relative", display: "inline-block",
        }}>
          Otaku{" "}
          <span style={{
            background: T.yellow, border: T.border, borderRadius: "12px",
            padding: "0 16px", boxShadow: "5px 5px 0 #111", display: "inline-block",
          }}>
            Knowledge!
          </span>
          <Squiggle
            color={T.coral} width={260}
            style={{ position: "absolute", bottom: "-14px", left: "50%", transform: "translateX(-50%)" }}
          />
        </h1>

        {/* Subtext */}
        <p style={{
          fontFamily: T.fonts.body, fontSize: "1.15rem", color: "#444",
          maxWidth: "520px", margin: "32px auto 48px", lineHeight: 1.7, fontWeight: "600",
        }}>
          From Naruto to Evangelion — challenge yourself across 800+ anime series, climb the global leaderboard, and prove you're the ultimate fan.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <HeroButton bg={T.yellow} label="⚡ Start Quizzing — It's Free" />
          <HeroButton bg={T.white}  label="🎮 Browse Quizzes" />
        </div>

        {/* Social proof */}
        <SocialProof />
      </div>
    </section>
  );
}

// ── Floating sticky-note card ─────────────────────────────────────────────────
function DecoFloat({ style, bg, rotate, label, emoji }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "absolute",
        background: bg, border: T.border, borderRadius: T.radius,
        padding: "12px 16px",
        boxShadow: hov ? "6px 6px 0 #111" : T.shadow,
        transform: `rotate(${rotate}) translate(${hov ? "-2px,-2px" : "0,0"})`,
        transition: "all 0.2s ease",
        fontFamily: T.fonts.head, fontWeight: "800", fontSize: "0.85rem",
        color: T.black, display: "flex", alignItems: "center", gap: "8px",
        zIndex: 1, ...style,
      }}
    >
      <span style={{ fontSize: "18px" }}>{emoji}</span>
      {label}
    </div>
  );
}

// ── CTA button ────────────────────────────────────────────────────────────────
function HeroButton({ bg, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: bg, border: T.border, borderRadius: T.radius,
        padding: "18px 44px", fontFamily: T.fonts.head, fontWeight: "900",
        fontSize: "1.1rem", cursor: "pointer", color: T.black,
        boxShadow: hov ? "8px 8px 0 #111" : T.shadowLg,
        transform: hov ? "translate(-2px,-2px)" : "translate(0,0)",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

// ── Social proof avatars ──────────────────────────────────────────────────────
function SocialProof() {
  const avatars = [
    { emoji: "😎", bg: T.lavender }, { emoji: "🧠", bg: T.coral },
    { emoji: "⚡", bg: T.mint },    { emoji: "🌸", bg: T.yellow },
    { emoji: "👾", bg: T.sky },
  ];
  return (
    <div style={{
      marginTop: "48px", display: "flex",
      alignItems: "center", justifyContent: "center", gap: "16px",
    }}>
      <div style={{ display: "flex" }}>
        {avatars.map((a, i) => (
          <div key={i} style={{
            width: "36px", height: "36px", borderRadius: "50%",
            border: T.border, background: a.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", marginLeft: i > 0 ? "-10px" : 0,
            zIndex: 5 - i, position: "relative",
          }}>
            {a.emoji}
          </div>
        ))}
      </div>
      <span style={{ fontFamily: T.fonts.body, fontWeight: "700", color: "#555", fontSize: "0.9rem" }}>
        <strong style={{ color: T.black }}>500,000+</strong> otaku already playing
      </span>
    </div>
  );
}
