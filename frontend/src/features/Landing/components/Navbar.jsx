import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import T from "../tokens";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

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
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
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
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Link
          to="/interview"
          style={{
            fontFamily: T.fonts.body, fontWeight: "700",
            color: T.black, textDecoration: "none", fontSize: "0.95rem",
          }}
        >
          ⚡ Take Quiz
        </Link>

        {user ? (
          <>
            <Link
              to="/dashboard"
              style={{
                background: "#C4B5FD", border: T.border, borderRadius: "10px",
                padding: "8px 18px", fontWeight: "800", fontFamily: T.fonts.head,
                fontSize: "0.9rem", color: T.black, textDecoration: "none",
                boxShadow: "3px 3px 0 #111",
              }}
            >
              Dashboard ({user.username})
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "white", border: T.border, borderRadius: "10px",
                padding: "8px 16px", fontWeight: "800", fontFamily: T.fonts.head,
                cursor: "pointer", fontSize: "0.85rem", color: T.black,
                boxShadow: "2px 2px 0 #111",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                fontFamily: T.fonts.body, fontWeight: "700",
                color: T.black, textDecoration: "none", fontSize: "0.95rem",
              }}
            >
              Log In
            </Link>
            <Link
              to="/register"
              style={{
                background: T.yellow, border: T.border, borderRadius: "10px",
                padding: "10px 22px", fontWeight: "800", fontFamily: T.fonts.head,
                cursor: "pointer", fontSize: "0.9rem", color: T.black,
                boxShadow: T.shadow, textDecoration: "none", display: "inline-block",
              }}
            >
              Sign Up Free →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
