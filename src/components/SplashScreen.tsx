import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  /* ── particles init ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particlesRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      hue: Math.random() > 0.5 ? 320 : 340,
    }));

    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.opacity})`;
        ctx.fill();
      });

      /* draw connecting lines between close particles */
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(320, 100%, 65%, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  /* ── phase timeline ── */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"), 4200);
    const t3 = setTimeout(() => onDone(), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "out" ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* glow blob */}
      <div style={{
        position: "absolute",
        width: 320,
        height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)",
        filter: "blur(40px)",
        pointerEvents: "none",
      }} />

      {/* logo */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          transform: phase === "in" ? "scale(0.7) translateY(20px)" : "scale(1) translateY(0)",
          opacity: phase === "in" ? 0 : 1,
          transition: "transform 0.55s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
        }}
      >
        {/* icon ring */}
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            inset: -12,
            borderRadius: "50%",
            border: "1px solid rgba(236,72,153,0.3)",
            animation: "pulse-ring 2s ease-in-out infinite",
          }} />
          <div style={{
            width: 88,
            height: 88,
            borderRadius: 24,
            background: "linear-gradient(135deg, #ec4899, #be185d)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px rgba(236,72,153,0.5), 0 0 80px rgba(236,72,153,0.2)",
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
        </div>

        {/* name */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 30,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.5px",
            lineHeight: 1,
            fontFamily: "'Poppins', sans-serif",
          }}>
            Marketplace
          </div>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#ec4899",
            letterSpacing: "0.35em",
            marginTop: 4,
            fontFamily: "'Poppins', sans-serif",
          }}>
            MALAWI
          </div>
        </div>

        {/* tagline */}
        <div style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.4)",
          fontWeight: 500,
          letterSpacing: "0.05em",
          fontFamily: "'Poppins', sans-serif",
        }}>
          Buy &amp; Sell across all 28 districts
        </div>

        {/* loading dots */}
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ec4899",
                animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.6; }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
