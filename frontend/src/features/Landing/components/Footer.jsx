import { useState } from "react";
import T from "../tokens";

const LINKS = ["Privacy", "Terms", "Contact"];

export default function Footer() {
  return (
    <footer style={{
      background: T.bg, borderTop: T.border,
      padding: "40px 48px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      backgroundImage: "radial-gradient(circle, #ccc 1px, transparent 1px)",
      backgroundSize: "22px 22px",
      fontFamily: T.fonts.body,
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: T.yellow, border: T.border,
          boxShadow: "2px 2px 0 #111",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px",
        }}>
          🎌
        </div>
        <span style={{ fontFamily: T.fonts.head, fontWeight: "900", color: T.black }}>
          OtakuQuiz
        </span>
      </div>

      {/* Copyright */}
      <p style={{ color: "#777", fontWeight: "700", fontSize: "0.85rem", margin: 0 }}>
        © 2025 OtakuQuiz. Made with ❤️ for anime fans everywhere.
      </p>

      {/* Links */}
      <div style={{ display: "flex", gap: "20px" }}>
        {LINKS.map(l => <FooterLink key={l} label={l} />)}
      </div>
    </footer>
  );
}

function FooterLink({ label }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        color: hov ? T.black : "#555",
        fontWeight: "700", fontSize: "0.85rem",
        textDecoration: "none", transition: "color 0.15s",
      }}
    >
      {label}
    </a>
  );
}
