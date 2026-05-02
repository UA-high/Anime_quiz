import { useState } from "react";
import T from "../tokens";
import { Tag, useScrollReveal } from "./shared";

export default function DashPreview() {
  const { ref, vis } = useScrollReveal();
  return (
    <section style={{
      padding: "90px 48px", background: T.white,
      borderTop: T.border, borderBottom: T.border,
    }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "60px", alignItems: "center",
      }}>
        {/* Left: text */}
        <div ref={ref} style={{
          opacity: vis ? 1 : 0,
          transform: vis ? "translateX(0)" : "translateX(-40px)",
          transition: "all 0.7s ease",
        }}>
          <Tag label="🎮 Your Profile & Dashboard" bg={T.yellow} />
          <h2 style={{
            fontFamily: T.fonts.head, fontWeight: "900",
            fontSize: "clamp(2rem, 3.5vw, 3rem)", color: T.black,
            margin: "16px 0 16px", letterSpacing: "-1px",
          }}>
            Track Every Win,<br />
            <span style={{
              background: T.lavender, border: T.border, borderRadius: "10px",
              padding: "2px 14px", boxShadow: "4px 4px 0 #111", display: "inline-block",
            }}>
              Every Badge.
            </span>
          </h2>
          <p style={{
            fontFamily: T.fonts.body, color: "#555", fontWeight: "600",
            lineHeight: 1.7, marginBottom: "28px",
          }}>
            Your personal otaku dashboard shows quiz history, scores, earned achievements, and your rank among 500K players worldwide.
          </p>

          <FeatureList />
          <DashCTAButton />
        </div>

        {/* Right: mockup */}
        <div style={{
          opacity: vis ? 1 : 0,
          transform: vis ? "translateX(0) rotate(1.5deg)" : "translateX(40px)",
          transition: "all 0.7s 0.15s ease",
        }}>
          <MiniDashboard />
        </div>
      </div>
    </section>
  );
}

// ── Feature list ──────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "📊", text: "Live score tracking & quiz history",  bg: T.yellow  },
  { icon: "🏅", text: "Unlock 50+ anime achievement badges", bg: T.lavender },
  { icon: "🌍", text: "Global & friends leaderboard",        bg: T.mint    },
  { icon: "📈", text: "Know your weak spots, improve daily", bg: T.coral   },
];

function FeatureList() {
  return (
    <div>
      {FEATURES.map((f, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: "12px",
          marginBottom: "14px", fontFamily: T.fonts.body,
          fontWeight: "700", color: T.black,
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "8px",
            background: f.bg, border: T.border,
            boxShadow: "2px 2px 0 #111",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", flexShrink: 0,
          }}>
            {f.icon}
          </div>
          {f.text}
        </div>
      ))}
    </div>
  );
}

function DashCTAButton() {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        marginTop: "12px",
        background: T.black, border: T.border, borderRadius: T.radius,
        padding: "15px 36px", fontFamily: T.fonts.head, fontWeight: "900",
        fontSize: "1rem", cursor: "pointer", color: T.yellow,
        boxShadow: hov ? "8px 8px 0 #333" : T.shadowLg,
        transform: hov ? "translate(-2px,-2px)" : "translate(0,0)",
        transition: "all 0.15s",
      }}
    >
      Create Free Account →
    </button>
  );
}

// ── Mini dashboard mockup ─────────────────────────────────────────────────────
function MiniDashboard() {
  const statCards = [
    { label: "Quiz Score", val: "9,850", bg: T.lavender, icon: "⚡" },
    { label: "Rank",       val: "#42",   bg: T.coral,    icon: "🏆" },
    { label: "Badges",     val: "17",    bg: T.mint,     icon: "🏅" },
  ];
  const recentQuizzes = [
    { name: "Naruto Arc Quiz", score: "95%", bg: T.mint     },
    { name: "Death Note IQ",   score: "82%", bg: T.lavender },
    { name: "Ghibli Worlds",   score: "88%", bg: T.yellow   },
  ];

  return (
    <div style={{
      background: T.bg, border: T.border, borderRadius: "18px",
      boxShadow: "8px 8px 0 #111",
      backgroundImage: "radial-gradient(circle, #ccc 1px, transparent 1px)",
      backgroundSize: "18px 18px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        background: T.white, borderBottom: T.border,
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: T.fonts.head, fontWeight: "900", fontSize: "1rem" }}>
          📊 My Otaku Dash
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          {["Daily", "Weekly", "All"].map((l, i) => (
            <span key={l} style={{
              padding: "4px 12px", borderRadius: "20px", border: T.border,
              fontSize: "11px", fontWeight: "800", fontFamily: T.fonts.head,
              background: i === 1 ? T.yellow : T.white, cursor: "pointer",
            }}>
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", padding: "16px" }}>
        {statCards.map((s, i) => (
          <div key={i} style={{
            background: s.bg, border: T.border, borderRadius: "12px",
            padding: "14px 12px", boxShadow: "3px 3px 0 #111",
          }}>
            <div style={{ fontSize: "16px", marginBottom: "6px" }}>{s.icon}</div>
            <div style={{ fontFamily: T.fonts.head, fontWeight: "900", fontSize: "1.3rem", color: T.black }}>
              {s.val}
            </div>
            <div style={{ fontFamily: T.fonts.body, fontWeight: "700", fontSize: "0.7rem", color: "#444" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent quizzes */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{
          background: T.white, border: T.border, borderRadius: "12px",
          boxShadow: "3px 3px 0 #111", padding: "14px",
        }}>
          <div style={{ fontFamily: T.fonts.head, fontWeight: "900", fontSize: "0.85rem", marginBottom: "10px" }}>
            📝 Recent Quizzes
          </div>
          {recentQuizzes.map((q, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 0",
              borderBottom: i < recentQuizzes.length - 1 ? "1.5px dashed #ddd" : "none",
            }}>
              <span style={{ fontFamily: T.fonts.body, fontWeight: "700", fontSize: "0.8rem" }}>
                {q.name}
              </span>
              <span style={{
                background: q.bg, border: T.border, borderRadius: "6px",
                padding: "2px 8px", fontSize: "11px", fontWeight: "800", fontFamily: T.fonts.head,
              }}>
                {q.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
