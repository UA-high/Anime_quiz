import { useState } from "react";
import T from "../tokens";
import { Star, Squiggle, useScrollReveal } from "./shared";

export default function FinalCTA() {
  const { ref, vis } = useScrollReveal();
  return (
    <section style={{
      padding: "100px 48px", background: T.black,
      borderTop: T.border, position: "relative", overflow: "hidden",
    }}>
      {/* Decorative background stars */}
      <Star size={48} color={T.yellow}   style={{ position: "absolute", top: "20%",    left: "8%",   opacity: 0.5, transform: "rotate(-20deg)" }} />
      <Star size={32} color={T.lavender} style={{ position: "absolute", top: "30%",    right: "10%", opacity: 0.4, transform: "rotate(15deg)"  }} />
      <Star size={60} color={T.coral}    style={{ position: "absolute", bottom: "20%", left: "15%",  opacity: 0.3, transform: "rotate(5deg)"   }} />
      <Star size={24} color={T.mint}     style={{ position: "absolute", bottom: "25%", right: "8%",  opacity: 0.5, transform: "rotate(-10deg)" }} />

      <div ref={ref} style={{
        textAlign: "center", position: "relative", zIndex: 2,
        opacity: vis ? 1 : 0,
        transform: vis ? "scale(1)" : "scale(0.95)",
        transition: "all 0.7s ease",
      }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🎌</div>

        <h2 style={{
          fontFamily: T.fonts.head, fontWeight: "900",
          fontSize: "clamp(2.2rem, 5vw, 4rem)", color: T.white,
          margin: "0 0 14px", letterSpacing: "-1px",
        }}>
          Your Otaku Journey<br />
          <span style={{
            background: T.yellow, color: T.black,
            border: T.border, borderRadius: "12px",
            padding: "0 16px", boxShadow: "5px 5px 0 #fff4",
            display: "inline-block",
          }}>
            Starts Now.
          </span>
        </h2>

        <p style={{
          fontFamily: T.fonts.body, fontWeight: "600",
          color: "#aaa", fontSize: "1rem",
          maxWidth: "480px", margin: "0 auto 40px", lineHeight: 1.7,
        }}>
          Free forever. No credit card needed. Just your anime knowledge and the will to win.
        </p>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <CTAButton
            bg={T.yellow} color={T.black}
            shadow="5px 5px 0 #ffffff60" hoverShadow="8px 8px 0 #ffffff60"
            label="⚡ Begin Your Quest — Free"
          />
          <CTAButton
            bg="transparent" color={T.white}
            border="2.5px solid #444" hoverBorder="2.5px solid #888"
            label="👀 Watch Demo"
          />
        </div>

        <Squiggle
          color={T.yellow} width={200}
          style={{ margin: "40px auto 0", display: "block", opacity: 0.5 }}
        />
      </div>
    </section>
  );
}

function CTAButton({ bg, color, border, hoverBorder, shadow, hoverShadow, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: bg, color,
        border: hov ? (hoverBorder || border || T.border) : (border || T.border),
        borderRadius: T.radius,
        padding: "18px 48px",
        fontFamily: T.fonts.head, fontWeight: "900", fontSize: "1.1rem",
        cursor: "pointer",
        boxShadow: hov ? (hoverShadow || "none") : (shadow || "none"),
        transform: shadow && hov ? "translate(-2px,-2px)" : "translate(0,0)",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
