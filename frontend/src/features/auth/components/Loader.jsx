import { useEffect, useState } from "react"

export default function Loader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone]         = useState(false)

  useEffect(() => {
    if (progress >= 100) { setDone(true); return }
    const t = setTimeout(
      () => setProgress(p => Math.min(p + Math.random() * 2.5 + 1, 100)),
      80
    )
    return () => clearTimeout(t)
  }, [progress])

  // Each ? gets its own random wobble config so they feel independent
  const qmarks = [
    { color: "#C4B5FD", size: "text-5xl", delay: "0s",    dur: "1.8s", x: "4px",  r: "8deg"  },
    { color: "#FCA5A5", size: "text-3xl", delay: "0.3s",  dur: "1.4s", x: "-5px", r: "-10deg" },
    { color: "#6EE7B7", size: "text-6xl", delay: "0.15s", dur: "2.1s", x: "3px",  r: "6deg"  },
    { color: "#FDE047", size: "text-4xl", delay: "0.45s", dur: "1.6s", x: "-4px", r: "-7deg" },
    { color: "#7DD3FC", size: "text-3xl", delay: "0.6s",  dur: "1.9s", x: "6px",  r: "12deg" },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center font-['Nunito',sans-serif]">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gabarito:wght@700;900&family=Nunito:wght@600;700;800&display=swap');

        @keyframes marquee {
          from { transform: translateX(0);   }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-rev {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0);   }
        }
        @keyframes wobble {
          0%,100% { transform: translateY(0)    rotate(0deg); }
          25%      { transform: translateY(-12px) rotate(var(--r)); }
          75%      { transform: translateY(6px)   rotate(calc(var(--r) * -0.6)); }
        }
        @keyframes stripe-slide {
          from { background-position: 0 0;    }
          to   { background-position: 28px 0; }
        }
        @keyframes pop-in {
          0%   { transform: scale(0.88); opacity: 0; }
          60%  { transform: scale(1.03); }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes float-slow {
          0%,100% { transform: translateY(0);    }
          50%      { transform: translateY(-8px); }
        }
        @keyframes done-bounce {
          0%,100% { transform: translateY(0); }
          40%      { transform: translateY(-16px) rotate(10deg); }
          70%      { transform: translateY(4px)   rotate(-4deg); }
        }
      `}</style>

      {/* ── Yellow dot-grid background ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-[#FDE047]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.18) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── Top marquee ────────────────────────────────────────────────────── */}
      <div className="absolute top-10 left-0 right-0 overflow-hidden border-y-[2.5px] border-black bg-black py-2 rotate-[-1.5deg] scale-x-110">
        <div className="flex whitespace-nowrap" style={{ animation: "marquee 14s linear infinite" }}>
          {Array(8).fill("⚡ OTAKUQUIZ  ✦  TEST YOUR KNOWLEDGE  ✦  ").map((t, i) => (
            <span key={i} className="font-['Gabarito',sans-serif] font-black text-xs tracking-widest uppercase text-[#FDE047] px-4">{t}</span>
          ))}
        </div>
      </div>

      {/* ── Bottom marquee ─────────────────────────────────────────────────── */}
      <div className="absolute bottom-10 left-0 right-0 overflow-hidden border-y-[2.5px] border-black bg-black py-2 rotate-[1.5deg] scale-x-110">
        <div className="flex whitespace-nowrap" style={{ animation: "marquee-rev 14s linear infinite" }}>
          {Array(8).fill("🎌 ANIME QUIZ  ✦  PROVE YOU'RE THE BEST  ✦  ").map((t, i) => (
            <span key={i} className="font-['Gabarito',sans-serif] font-black text-xs tracking-widest uppercase text-[#FDE047] px-4">{t}</span>
          ))}
        </div>
      </div>

      {/* ── Ghost text ─────────────────────────────────────────────────────── */}
      <div
        className="absolute font-['Gabarito',sans-serif] font-black text-[22vw] text-black opacity-[0.04] select-none pointer-events-none leading-none tracking-tighter"
        style={{ animation: "float-slow 6s ease-in-out infinite" }}
      >
        QUIZ
      </div>

      {/* ── Card ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-80 bg-white border-[2.5px] border-black rounded-2xl shadow-[8px_8px_0_#111] overflow-hidden"
        style={{ animation: "pop-in 0.5s ease forwards" }}
      >
        {/* Top accent */}
        <div className="h-2 bg-[#111]" />

        <div className="p-7 flex flex-col gap-6">

          {/* ── Wobbling question marks ─────────────────────────────────────── */}
          <div className="flex items-end justify-center gap-2 h-20">
            {done
              ? /* On done — all ? turn into ! and bounce */
                qmarks.map((q, i) => (
                  <span
                    key={i}
                    className={`${q.size} font-['Gabarito',sans-serif] font-black select-none`}
                    style={{
                      color: q.color,
                      WebkitTextStroke: "2px #111",
                      animation: `done-bounce ${q.dur} ${q.delay} ease-in-out infinite`,
                    }}
                  >!</span>
                ))
              : qmarks.map((q, i) => (
                  <span
                    key={i}
                    className={`${q.size} font-['Gabarito',sans-serif] font-black select-none`}
                    style={{
                      color: q.color,
                      WebkitTextStroke: "2px #111",
                      "--r": q.r,
                      animation: `wobble ${q.dur} ${q.delay} ease-in-out infinite`,
                    }}
                  >?</span>
                ))
            }
          </div>

          {/* ── Progress bar ────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-2">
            <div className="w-full h-5 bg-[#F5F4EF] border-[2.5px] border-black rounded-lg overflow-hidden shadow-[2px_2px_0_#111]">
              <div
                className="h-full rounded-md relative overflow-hidden"
                style={{
                  width: `${progress}%`,
                  background: done ? "#6EE7B7" : "#111",
                  transition: "background 0.5s ease, width 0.1s linear",
                }}
              >
                {!done && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "repeating-linear-gradient(45deg,transparent,transparent 6px,rgba(255,255,255,0.08) 6px,rgba(255,255,255,0.08) 12px)",
                      animation: "stripe-slide 0.4s linear infinite",
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <span className="font-['Gabarito',sans-serif] font-black text-[10px] uppercase tracking-widest text-black">
                {done ? "✓ Ready!" : "Loading..."}
              </span>
              <span className="font-['Gabarito',sans-serif] font-black text-[10px] text-black">
                {Math.floor(progress)}%
              </span>
            </div>
          </div>

          {/* ── 5 colour segments ───────────────────────────────────────────── */}
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = progress >= (i + 1) * 20
              const bgs    = ["#FDE047", "#C4B5FD", "#FCA5A5", "#6EE7B7", "#7DD3FC"]
              return (
                <div
                  key={i}
                  className="flex-1 h-2 rounded-sm border-[2px] border-black transition-all duration-300"
                  style={{
                    background: filled ? bgs[i] : "#F5F4EF",
                    transform:  filled ? "scaleY(1.4)" : "scaleY(1)",
                    boxShadow:  filled ? "1px 1px 0 #111" : "none",
                  }}
                />
              )
            })}
          </div>

        </div>

        {/* Bottom tag */}
        <div className="bg-[#111] px-7 py-2.5 flex items-center justify-between">
          <span className="font-['Gabarito',sans-serif] font-black text-[10px] uppercase tracking-widest text-[#FDE047]">
            Season 1 · Episode 1
          </span>
          <span className="text-[#FDE047] text-xs">●</span>
        </div>
      </div>

    </div>
  )
}