import { useState, useEffect, useRef } from "react";
import T from "../tokens";

// ─── Hook: Scroll Reveal ──────────────────────────────────────────────────────
export function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, bg = T.white, style = {}, hover = true, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: bg,
        border: T.border,
        borderRadius: T.radius,
        boxShadow: hov ? T.shadowHover : T.shadow,
        transform: hov ? "translate(-1px, -1px)" : "translate(0,0)",
        transition: "box-shadow 0.15s ease, transform 0.15s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Tag / Badge ──────────────────────────────────────────────────────────────
export function Tag({ label, bg }) {
  return (
    <span style={{
      display: "inline-block",
      background: bg,
      border: T.border,
      borderRadius: "6px",
      padding: "2px 9px",
      fontSize: "11px",
      fontWeight: "800",
      fontFamily: T.fonts.head,
      color: T.black,
      letterSpacing: "0.5px",
      textTransform: "uppercase",
    }}>
      {label}
    </span>
  );
}

// ─── Doodle Star ─────────────────────────────────────────────────────────────
export function Star({ size = 28, color = T.yellow, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={style}>
      <path
        d="M14 2 L16.5 11 L26 11 L18.5 17 L21 26 L14 21 L7 26 L9.5 17 L2 11 L11.5 11 Z"
        fill={color} stroke={T.black} strokeWidth="2" strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Squiggle Underline ───────────────────────────────────────────────────────
export function Squiggle({ color = T.yellow, width = 120, style = {} }) {
  return (
    <svg width={width} height="18" viewBox={`0 0 ${width} 18`} fill="none" style={style}>
      <path
        d={`M0 9 Q${width*0.1} 2 ${width*0.2} 9 Q${width*0.3} 16 ${width*0.4} 9 Q${width*0.5} 2 ${width*0.6} 9 Q${width*0.7} 16 ${width*0.8} 9 Q${width*0.9} 2 ${width} 9`}
        stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none"
      />
    </svg>
  );
}
