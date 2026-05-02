import { useState } from "react";
import T from "../tokens";
import { Tag, Card, useScrollReveal } from "./shared";

const LB = [
  { rank: 1, name: "ShadowNinja_X", pts: "9,850", cat: "Shonen", badge: "🥇", bg: T.yellow },
  { rank: 2, name: "SakuraQueen", pts: "9,200", cat: "Ghibli", badge: "🥈", bg: T.lavender },
  { rank: 3, name: "OtakuGod99", pts: "8,750", cat: "Psychological", badge: "🥉", bg: T.coral },
  { rank: 4, name: "AnimeForever", pts: "8,100", cat: "Isekai", badge: "⭐", bg: T.white },
  { rank: 5, name: "MangaWizard", pts: "7,650", cat: "Mecha", badge: "⭐", bg: T.white },
];

const CAT_COLORS = [T.yellow, T.lavender, T.coral, T.mint, T.sky];

export default function Leaderboard() {
  const { ref, vis } = useScrollReveal();
  const [hov, setHov] = useState(false);

  return (
    <section style={{ padding: "90px 48px", background: T.white, borderTop: T.border }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {/* Header */}
        <div ref={ref} style={{
          marginBottom: "48px", textAlign: "center",
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.6s ease",
        }}>
          <Tag label="🏆 Hall of Legends" bg={T.yellow} />
          <h2 style={{
            fontFamily: T.fonts.head, fontWeight: "900",
            fontSize: "clamp(2rem, 4vw, 3rem)", color: T.black,
            margin: "16px 0 0", letterSpacing: "-1px",
          }}>
            This Week's Top Otaku
          </h2>
        </div>

        {/* Table card */}
        <Card bg={T.white} hover={false} style={{ overflow: "hidden" }}>
          {/* Table header */}
          <div style={{
            background: T.black, padding: "14px 24px",
            display: "grid", gridTemplateColumns: "40px 1fr 100px 80px",
            gap: "12px", fontFamily: T.fonts.head, fontWeight: "800",
            fontSize: "0.75rem", color: T.yellow,
            letterSpacing: "1px", textTransform: "uppercase",
          }}>
            <span>#</span>
            <span>Player</span>
            <span>Top Category</span>
            <span style={{ textAlign: "right" }}>Score</span>
          </div>

          {LB.map((p, i) => <LBRow key={i} p={p} index={i} />)}
        </Card>

        {/* View all button */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              background: T.bg, border: T.border, borderRadius: T.radius,
              padding: "13px 32px", fontFamily: T.fonts.head, fontWeight: "800",
              fontSize: "0.9rem", cursor: "pointer", color: T.black,
              boxShadow: hov ? T.shadowHover : T.shadow,
              transform: hov ? "translate(-1px,-1px)" : "translate(0,0)",
              transition: "all 0.15s",
            }}
          >
            View Full Leaderboard →
          </button>
        </div>
      </div>
    </section>
  );
}

function LBRow({ p, index }) {
  const { ref, vis } = useScrollReveal();
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid", gridTemplateColumns: "40px 1fr 100px 80px",
        gap: "12px", padding: "16px 24px", alignItems: "center",
        borderBottom: index < LB.length - 1 ? "1.5px solid #eee" : "none",
        background: hov ? T.bg : p.bg,
        opacity: vis ? 1 : 0,
        transform: vis ? "translateX(0)" : "translateX(-30px)",
        transitionProperty: "opacity, transform, background",
        transitionDuration: "0.5s, 0.5s, 0.15s",
        transitionDelay: `${index * 0.08}s, ${index * 0.08}s, 0s`,
      }}
    >
      <span style={{ fontSize: "1.3rem" }}>{p.badge}</span>
      <div>
        <div style={{ fontFamily: T.fonts.head, fontWeight: "900", fontSize: "0.95rem", color: T.black }}>
          {p.name}
        </div>
        <div style={{ fontFamily: T.fonts.body, fontWeight: "700", fontSize: "0.75rem", color: "#777" }}>
          Rank #{p.rank}
        </div>
      </div>
      <Tag label={p.cat} bg={CAT_COLORS[index]} />
      <div style={{ textAlign: "right", fontFamily: T.fonts.head, fontWeight: "900", fontSize: "1rem", color: T.black }}>
        {p.pts}
      </div>
    </div>
  );
}
