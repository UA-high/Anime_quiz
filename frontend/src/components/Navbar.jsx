import { useState, useEffect } from "react";
import T from "../tokens";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 99,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 48px",
      background: scrolled ? T.bg : "transparent",
      borderBottom: scrolled ? T.border : "none",
      transition: "all 0.2s ease",
      fontFamily: T.fonts.body,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "10px",
          background: T.yellow, border: T.border,
          boxShadow: "3px 3px 0 #111",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px",
        }}>🎌</div>
        <span style={{
          fontFamily: T.fonts.head, fontWeight: "900",
          fontSize: "1.3rem", color: T.black, letterSpacing: "-0.5px",
        }}>
          Otaku<span style={{ color: "#7C3AED" }}>Quiz</span>
        </span>
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        {["Quizzes", "Leaderboard", "Community", "About"].map(l => (
          <NavLink key={l} label={l} />
        ))}
        <NavButton />
      </div>
    </nav>
  );
}

function NavLink({ label }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: T.fonts.body, fontWeight: "700",
        color: hov ? "#7C3AED" : T.black,
        textDecoration: "none", fontSize: "0.9rem",
        transition: "color 0.15s",
      }}
    >
      {label}
    </a>
  );
}

function NavButton() {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.yellow, border: T.border, borderRadius: "10px",
        padding: "10px 22px", fontWeight: "800", fontFamily: T.fonts.head,
        cursor: "pointer", fontSize: "0.9rem", color: T.black,
        boxShadow: hov ? T.shadowHover : T.shadow,
        transform: hov ? "translate(-1px,-1px)" : "translate(0,0)",
        transition: "all 0.15s",
      }}
    >
      Sign Up Free →
    </button>
  );
}
