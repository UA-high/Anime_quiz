import T from "../tokens";
import { useScrollReveal } from "./shared";

const STATS = [
  { val: "$0", label: "Entry Cost", bg: T.lavender, icon: "💸" },
  { val: "10K+", label: "Questions", bg: T.coral, icon: "📚" },
  { val: "2M+", label: "Quizzes Taken", bg: T.mint, icon: "🎯" },
  { val: "800+", label: "Anime Titles", bg: T.yellow, icon: "🎌" },
];

export default function StatsBar() {
  const { ref, vis } = useScrollReveal();
  return (
    <section
      ref={ref}
      style={{
        background: T.black, padding: "0",
        borderTop: T.border, borderBottom: T.border,
      }}
    >
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        maxWidth: "1100px", margin: "0 auto",
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            padding: "28px 24px",
            borderRight: i < 3 ? "2.5px solid #333" : "none",
            textAlign: "center",
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.5s ${i * 0.1}s ease`,
          }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>{s.icon}</div>
            <div style={{
              fontFamily: T.fonts.head, fontWeight: "900",
              fontSize: "2rem", color: s.bg, marginBottom: "4px",
            }}>
              {s.val}
            </div>
            <div style={{
              fontFamily: T.fonts.body, fontWeight: "700",
              color: "#aaa", fontSize: "0.85rem",
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
