import { useState } from "react";
import T from "../tokens";
import { Tag, useScrollReveal } from "./shared";

const STEPS = [
  { num: "01", icon: "🎯", title: "Pick a Category", desc: "Browse 20+ genres and pick the anime universe you know best.",              bg: T.yellow  },
  { num: "02", icon: "⏱️", title: "Race the Clock",  desc: "Answer 10–20 questions before the timer runs out. Speed = bonus points.", bg: T.coral   },
  { num: "03", icon: "📊", title: "See Your Score",  desc: "Instant results, detailed breakdowns, and your global rank update.",       bg: T.lavender },
  { num: "04", icon: "🏆", title: "Climb the Ranks", desc: "Earn badges, beat rivals, unlock titles, and cement your otaku legacy.",   bg: T.mint    },
];

export default function HowItWorks() {
  const { ref, vis } = useScrollReveal();
  return (
    <section style={{
      padding: "90px 48px", borderTop: T.border,
      background: T.bg,
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
          <Tag label="🎮 How To Play" bg={T.mint} />
          <h2 style={{
            fontFamily: T.fonts.head, fontWeight: "900",
            fontSize: "clamp(2rem, 4vw, 3.2rem)", color: T.black,
            margin: "16px 0 0", letterSpacing: "-1px",
          }}>
            Four Steps to{" "}
            <span style={{
              background: T.coral, border: T.border, borderRadius: "10px",
              padding: "2px 14px", boxShadow: "4px 4px 0 #111", display: "inline-block",
            }}>
              Glory
            </span>
          </h2>
        </div>

        {/* Step cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "20px",
        }}>
          {STEPS.map((s, i) => <StepCard key={i} step={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, index }) {
  const { ref, vis } = useScrollReveal();
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(40px)",
      transition: `all 0.5s ${index * 0.1}s ease`,
    }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: T.white, border: T.border, borderRadius: T.radius,
          boxShadow: hov ? "7px 7px 0 #111" : T.shadow,
          transform: hov ? "translate(-2px,-2px)" : "translate(0,0)",
          transition: "all 0.15s", padding: "28px 24px",
        }}
      >
        {/* Icon box */}
        <div style={{
          width: "48px", height: "48px", borderRadius: "12px",
          background: step.bg, border: T.border,
          boxShadow: "3px 3px 0 #111",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "22px", marginBottom: "20px",
        }}>
          {step.icon}
        </div>

        {/* Step number (ghost) */}
        <div style={{
          fontFamily: T.fonts.head, fontWeight: "900",
          fontSize: "2rem", color: "#ddd", marginBottom: "6px", lineHeight: 1,
        }}>
          {step.num}
        </div>

        <h3 style={{
          fontFamily: T.fonts.head, fontWeight: "900",
          fontSize: "1.05rem", margin: "0 0 8px", color: T.black,
        }}>
          {step.title}
        </h3>
        <p style={{
          fontFamily: T.fonts.body, fontWeight: "600",
          fontSize: "0.875rem", color: "#555", margin: 0, lineHeight: 1.6,
        }}>
          {step.desc}
        </p>
      </div>
    </div>
  );
}
