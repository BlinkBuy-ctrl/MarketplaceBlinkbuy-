import { useEffect, useRef, useState } from "react";
 
interface Star {
  x: number; y: number; size: number;
  opacity: number; twinkleSpeed: number;
  twinkleOffset: number; color: string;
}
 
interface ShootingStar {
  x: number; y: number; vx: number; vy: number;
  length: number; opacity: number; active: boolean;
  color: string;
}
 
export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase]       = useState<"in" | "hold" | "out">("in");
  const [progress, setProgress] = useState(0);
  const [walkFrame, setWalkFrame] = useState(0); // 0-3 walk cycle frames
  const animRef     = useRef<number>(0);
  const starsRef    = useRef<Star[]>([]);
  const shootersRef = useRef<ShootingStar[]>([]);
 
  /* ── space canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
 
    const starColors = [
      "#ffffff","#ffffff","#ffffff","#ffffff",
      "#ffe0f0","#ffb3d9","#ff80bf",   // pink stars
      "#cce0ff","#ffeedd","#aaddff",
    ];
 
    starsRef.current = Array.from({ length: 320 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() < 0.06 ? Math.random() * 2.8 + 1.8
           : Math.random() < 0.22 ? Math.random() * 1.3 + 0.9
           : Math.random() * 0.6 + 0.2,
      opacity: Math.random() * 0.65 + 0.3,
      twinkleSpeed:  Math.random() * 0.022 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));
 
    /* bigger pool — 14 concurrent shooters */
    shootersRef.current = Array.from({ length: 14 }, () => ({
      x: -200, y: -200, vx: 0, vy: 0,
      length: 0, opacity: 0, active: false, color: "#ffffff",
    }));
 
    const ctx = canvas.getContext("2d")!;
 
    const shootColors = [
      "#ffffff","#ffffff","#ffffff",
      "#ffaadd","#ff77cc","#ec4899",  // pink shooting stars
      "#ffddee",
    ];
 
    const spawnShooter = (s: ShootingStar) => {
      s.x      = Math.random() * canvas.width * 0.8;
      s.y      = Math.random() * canvas.height * 0.5;
      const angle = (Math.random() * 28 + 10) * (Math.PI / 180);
      const spd   = Math.random() * 8 + 5;
      s.vx     = Math.cos(angle) * spd;
      s.vy     = Math.sin(angle) * spd;
      s.length = Math.random() * 100 + 60;
      s.opacity = 1;
      s.active  = true;
      s.color   = shootColors[Math.floor(Math.random() * shootColors.length)];
    };
 
    // pre-spawn 4 right away so screen isn't empty
    for (let i = 0; i < 4; i++) spawnShooter(shootersRef.current[i]);
 
    const draw = (ts: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
 
      /* ── deep space bg — heavy pink tint ── */
      const bg = ctx.createRadialGradient(
        canvas.width * 0.35, canvas.height * 0.32, 0,
        canvas.width * 0.5,  canvas.height * 0.5,  canvas.width
      );
      bg.addColorStop(0,   "#1a0520"); // deep magenta-dark
      bg.addColorStop(0.25,"#120318");
      bg.addColorStop(0.55,"#08020f");
      bg.addColorStop(1,   "#020005");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
 
      /* ── nebulae — mostly pink / magenta ── */
      const nebulas: [number, number, number, number, string][] = [
        // PINK dominant clouds
        [canvas.width * 0.20, canvas.height * 0.20, 260, 0.13, "236,72,153"],
        [canvas.width * 0.75, canvas.height * 0.15, 220, 0.11, "219,39,119"],
        [canvas.width * 0.50, canvas.height * 0.80, 300, 0.10, "244,114,182"],
        [canvas.width * 0.88, canvas.height * 0.55, 240, 0.09, "236,72,153"],
        [canvas.width * 0.05, canvas.height * 0.60, 200, 0.09, "249,168,212"],
        // purple/violet accents
        [canvas.width * 0.60, canvas.height * 0.35, 180, 0.06, "124,58,237"],
        [canvas.width * 0.30, canvas.height * 0.70, 160, 0.05, "109,40,217"],
        // deep rose
        [canvas.width * 0.92, canvas.height * 0.85, 180, 0.08, "190,24,93"],
      ];
 
      nebulas.forEach(([nx, ny, nr, no, nc]) => {
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
        g.addColorStop(0,   `rgba(${nc},${no * 2.2})`);
        g.addColorStop(0.45,`rgba(${nc},${no})`);
        g.addColorStop(1,   `rgba(${nc},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(nx, ny, nr, nr * 0.58, ts * 0.000018, 0, Math.PI * 2);
        ctx.fill();
      });
 
      /* ── milky way band — pink tinted ── */
      const mw = ctx.createLinearGradient(0, canvas.height * 0.15, canvas.width, canvas.height * 0.85);
      mw.addColorStop(0,   "rgba(100,10,50,0)");
      mw.addColorStop(0.35,"rgba(150,20,70,0.10)");
      mw.addColorStop(0.5, "rgba(180,30,90,0.13)");
      mw.addColorStop(0.65,"rgba(150,20,70,0.10)");
      mw.addColorStop(1,   "rgba(100,10,50,0)");
      ctx.fillStyle = mw;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
 
      /* ── stars ── */
      starsRef.current.forEach((s) => {
        const tw    = Math.sin(ts * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7;
        const alpha = s.opacity * tw;
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        if (s.size > 1.2) {
          ctx.globalAlpha = alpha * 0.38;
          ctx.strokeStyle = s.color;
          ctx.lineWidth   = 0.5;
          const fl = s.size * 3.2;
          ctx.beginPath();
          ctx.moveTo(s.x - fl, s.y); ctx.lineTo(s.x + fl, s.y);
          ctx.moveTo(s.x, s.y - fl); ctx.lineTo(s.x, s.y + fl);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      });
 
      /* ── shooting stars — spawn aggressively ── */
      if (Math.random() < 0.045) {           // high spawn rate
        const idle = shootersRef.current.find((s) => !s.active);
        if (idle) spawnShooter(idle);
      }
      shootersRef.current.forEach((s) => {
        if (!s.active) return;
        s.x += s.vx;
        s.y += s.vy;
        s.opacity -= 0.016;
        if (s.opacity <= 0 || s.x > canvas.width + 120 || s.y > canvas.height + 120) {
          s.active = false;
          return;
        }
        const spd  = Math.hypot(s.vx, s.vy);
        const tail = s.length / spd;
        const grad = ctx.createLinearGradient(
          s.x - s.vx * tail, s.y - s.vy * tail, s.x, s.y
        );
        // parse hex to rgba for the gradient tip
        const hex = s.color.replace("#","");
        const r   = parseInt(hex.slice(0,2),16);
        const g2  = parseInt(hex.slice(2,4),16);
        const b   = parseInt(hex.slice(4,6),16);
        grad.addColorStop(0, `rgba(${r},${g2},${b},0)`);
        grad.addColorStop(1, `rgba(${r},${g2},${b},${s.opacity})`);
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * tail, s.y - s.vy * tail);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = s.color === "#ffffff" ? 1.5 : 2;
        ctx.stroke();
      });
 
      animRef.current = requestAnimationFrame(draw);
    };
 
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);
 
  /* ── phase + progress timeline ── */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"),  4200);
    const t3 = setTimeout(() => onDone(),          4750);
 
    let start: number | null = null;
    const duration = 3600;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const pct = Math.min(100, Math.round(((ts - start) / duration) * 100));
      setProgress(pct);
      if (pct < 100) requestAnimationFrame(tick);
    };
    const pid = requestAnimationFrame(tick);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); cancelAnimationFrame(pid); };
  }, [onDone]);
 
  /* ── walk cycle: 4 frames at ~120ms each ── */
  useEffect(() => {
    if (progress >= 100) return;
    const id = setInterval(() => setWalkFrame((f) => (f + 1) % 4), 120);
    return () => clearInterval(id);
  }, [progress]);
 
  const trolleyX = `${Math.max(2, Math.min(progress - 4, 92))}%`;
 
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: phase === "out" ? 0 : 1,
      transition: "opacity 0.55s ease",
      pointerEvents: phase === "out" ? "none" : "all",
      overflow: "hidden",
    }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
 
      <div style={{
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "0 28px",
        width: "100%", maxWidth: 380,
        transform: phase === "in" ? "scale(0.85) translateY(24px)" : "scale(1) translateY(0)",
        opacity: phase === "in" ? 0 : 1,
        transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.45s ease",
      }}>
 
        {/* ── Icon ── */}
        <div style={{ position: "relative", marginBottom: 22 }}>
          <div style={{
            position: "absolute", inset: -16, borderRadius: "50%",
            border: "1px solid rgba(236,72,153,0.4)",
            animation: "ring-pulse 2.8s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", inset: -28, borderRadius: "50%",
            border: "1px solid rgba(236,72,153,0.18)",
            animation: "ring-pulse 2.8s ease-in-out 0.5s infinite",
          }} />
          <div style={{
            width: 90, height: 90, borderRadius: 22,
            overflow: "hidden",
            boxShadow: "0 0 32px rgba(236,72,153,0.65), 0 0 70px rgba(236,72,153,0.28)",
          }}>
            <img
              src="/icon.svg"
              alt="Market Hub Malawi"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
 
        {/* ── App name ── */}
        <div style={{ textAlign: "center", marginBottom: 5 }}>
          <div style={{
            fontSize: 32, fontWeight: 900,
            color: "#ffffff", letterSpacing: "-0.5px", lineHeight: 1,
            fontFamily: "'Poppins', system-ui, sans-serif",
            textShadow: "0 0 30px rgba(236,72,153,0.55)",
          }}>Market Hub</div>
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: "#f9a8d4", letterSpacing: "0.38em", marginTop: 5,
            fontFamily: "'Poppins', system-ui, sans-serif",
            textShadow: "0 0 12px rgba(236,72,153,0.7)",
          }}>MALAWI</div>
        </div>
 
        {/* ── Tagline ── */}
        <div style={{
          fontSize: 11.5, color: "rgba(255,182,218,0.5)",
          fontWeight: 500, letterSpacing: "0.06em",
          fontFamily: "'Poppins', system-ui, sans-serif",
          marginBottom: 32,
        }}>Buy &amp; Sell across all 28 districts</div>
 
        {/* ── Loading section ── */}
        <div style={{ width: "100%" }}>
          {/* Trolley lane */}
          <div style={{ position: "relative", width: "100%", height: 56, marginBottom: 4 }}>
            <WalkingTrolley x={trolleyX} frame={walkFrame} />
          </div>
 
          {/* Bar */}
          <div style={{
            width: "100%", height: 9, borderRadius: 99,
            background: "rgba(180,40,100,0.15)",
            border: "1px solid rgba(236,72,153,0.28)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              borderRadius: 99,
              background: "linear-gradient(90deg, #831843, #ec4899, #f472b6)",
              boxShadow: "0 0 12px rgba(236,72,153,0.7)",
              transition: "width 0.1s linear",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: "-60%",
                width: "50%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                animation: "shimmer 1.5s ease-in-out infinite",
              }} />
            </div>
          </div>
 
          {/* Percentage */}
          <div style={{
            textAlign: "right", fontSize: 11,
            color: "rgba(249,168,212,0.75)",
            fontFamily: "'Poppins', system-ui, sans-serif",
            fontWeight: 600, letterSpacing: "0.05em",
            marginTop: 6,
          }}>{progress}%</div>
        </div>
 
        {/* ── Powered By Otechy — sparkle sweeps P→y ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
          <div style={{ height: 1, width: 24, background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.45))" }} />
          <div style={{
            fontFamily: "'Poppins', system-ui, sans-serif",
            letterSpacing: "0.04em", whiteSpace: "nowrap",
          }}>
            <OtechySparkle progress={progress} />
          </div>
          <div style={{ height: 1, width: 24, background: "linear-gradient(90deg, rgba(236,72,153,0.45), transparent)" }} />
        </div>
      </div>
 
      <style>{`
        @keyframes ring-pulse {
          0%,100% { transform: scale(1); opacity:0.35; }
          50%      { transform: scale(1.14); opacity:0.8; }
        }
        @keyframes shimmer {
          0%   { left:-60%; }
          100% { left:120%; }
        }
        @keyframes sparkle-pulse {
          0%,100% { opacity:0; transform:scale(0.3) rotate(0deg); }
          50%     { opacity:1; transform:scale(1.1) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
 
/* ────────────────────────────────────────────────
   Walking trolley person — real walk cycle
   4 frames: contact → mid-swing → opposite contact → mid-swing
──────────────────────────────────────────────── */
function WalkingTrolley({ x, frame }: { x: string; frame: number }) {
  // Each frame defines joint angles for a realistic walk cycle
  // leg angles from hip (degrees): [leftThigh, leftShin, rightThigh, rightShin]
  // arm angles from shoulder:       [leftArm, rightArm]
  // body lean angle
  const cycles = [
    // Frame 0: right foot contact (right leg forward, left back)
    { lThigh: 30, lShin: -10, rThigh: -28, rShin: 5,  lArm: -22, rArm: 20,  lean: 3  },
    // Frame 1: mid stance (legs crossing)
    { lThigh: 5,  lShin: -18, rThigh: -5,  rShin: 12, lArm: -8,  rArm: 6,   lean: 0  },
    // Frame 2: left foot contact (left leg forward, right back)
    { lThigh: -28,lShin: 5,   rThigh: 30,  rShin: -10,lArm: 20,  rArm: -22, lean: -3 },
    // Frame 3: mid stance other side
    { lThigh: -5, lShin: 12,  rThigh: 5,   rShin: -18,lArm: 6,   rArm: -8,  lean: 0  },
  ];
 
  const c = cycles[frame];
  const toRad = (d: number) => (d * Math.PI) / 180;
 
  // Body centre
  const bx = 16, by = 20;
  const thighLen = 14, shinLen = 13, armLen = 11;
 
  // Left leg
  const lHipX = bx - 2, lHipY = by + 12;
  const lKneeX = lHipX + Math.sin(toRad(c.lThigh)) * thighLen;
  const lKneeY = lHipY + Math.cos(toRad(c.lThigh)) * thighLen;
  const lFootX = lKneeX + Math.sin(toRad(c.lThigh + c.lShin)) * shinLen;
  const lFootY = lKneeY + Math.cos(toRad(c.lThigh + c.lShin)) * shinLen;
 
  // Right leg
  const rHipX = bx + 2, rHipY = by + 12;
  const rKneeX = rHipX + Math.sin(toRad(c.rThigh)) * thighLen;
  const rKneeY = rHipY + Math.cos(toRad(c.rThigh)) * thighLen;
  const rFootX = rKneeX + Math.sin(toRad(c.rThigh + c.rShin)) * shinLen;
  const rFootY = rKneeY + Math.cos(toRad(c.rThigh + c.rShin)) * shinLen;
 
  // Left arm (swings opposite leg)
  const lShoulderX = bx - 4, lShoulderY = by + 2;
  const lElbowX = lShoulderX + Math.sin(toRad(c.lArm)) * armLen;
  const lElbowY = lShoulderY + Math.cos(toRad(c.lArm)) * armLen;
 
  // Right arm (pushing trolley — stays mostly forward)
  const rShoulderX = bx + 4, rShoulderY = by + 2;
  const rElbowX = rShoulderX + Math.sin(toRad(18)) * armLen;
  const rElbowY = rShoulderY + Math.cos(toRad(18)) * armLen;
 
  // Trolley handle connects from right elbow/hand
  const handleX = rElbowX + 6;
  const handleY = rElbowY + 2;
 
  // Bounce: feet hitting ground adds tiny vertical bob
  const bob = (frame === 0 || frame === 2) ? 1 : 0;
 
  return (
    <div style={{
      position: "absolute",
      bottom: 0, left: x,
      transform: "translateX(-50%)",
      transition: "left 0.1s linear",
    }}>
      <svg width="60" height="56" viewBox="0 0 60 56" style={{ overflow: "visible" }}>
        <g transform={`translate(0, ${bob})`}>
          {/* ── Left leg (behind) ── */}
          <line x1={lHipX} y1={lHipY} x2={lKneeX} y2={lKneeY}
                stroke="#be185d" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1={lKneeX} y1={lKneeY} x2={lFootX} y2={lFootY}
                stroke="#be185d" strokeWidth="3" strokeLinecap="round"/>
          {/* Left shoe */}
          <ellipse cx={lFootX + 2} cy={lFootY + 1} rx="4" ry="2.2" fill="#831843"/>
 
          {/* ── Right leg (front) ── */}
          <line x1={rHipX} y1={rHipY} x2={rKneeX} y2={rKneeY}
                stroke="#ec4899" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1={rKneeX} y1={rKneeY} x2={rFootX} y2={rFootY}
                stroke="#ec4899" strokeWidth="3" strokeLinecap="round"/>
          {/* Right shoe */}
          <ellipse cx={rFootX + 2} cy={rFootY + 1} rx="4" ry="2.2" fill="#be185d"/>
 
          {/* ── Torso ── */}
          <rect x={bx - 6} y={by - 1} width="12" height="14" rx="3"
                fill="#ec4899"/>
          {/* shirt detail */}
          <line x1={bx} y1={by} x2={bx} y2={by + 13} stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
 
          {/* ── Left arm (swinging free) ── */}
          <line x1={lShoulderX} y1={lShoulderY} x2={lElbowX} y2={lElbowY}
                stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
 
          {/* ── Right arm (pushing trolley) ── */}
          <line x1={rShoulderX} y1={rShoulderY} x2={rElbowX} y2={rElbowY}
                stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
          <line x1={rElbowX} y1={rElbowY} x2={handleX} y2={handleY}
                stroke="#f9a8d4" strokeWidth="2.5" strokeLinecap="round"/>
 
          {/* ── Head ── */}
          <circle cx={bx} cy={by - 8} r="7" fill="#fda4af"/>
          {/* hair */}
          <path d={`M ${bx-6} ${by-11} Q ${bx} ${by-19} ${bx+6} ${by-11}`}
                fill="#831843" stroke="none"/>
          {/* face dots */}
          <circle cx={bx - 2} cy={by - 9} r="1" fill="#831843"/>
          <circle cx={bx + 2} cy={by - 9} r="1" fill="#831843"/>
          {/* smile */}
          <path d={`M ${bx-2.5} ${by-5.5} Q ${bx} ${by-3.5} ${bx+2.5} ${by-5.5}`}
                stroke="#831843" strokeWidth="1" fill="none" strokeLinecap="round"/>
 
          {/* ── Trolley ── */}
          {/* Handle bar */}
          <line x1={handleX} y1={handleY} x2={handleX} y2={handleY + 12}
                stroke="#f472b6" strokeWidth="2.2" strokeLinecap="round"/>
          {/* Basket frame */}
          <rect x={handleX - 1} y={handleY + 8} width="18" height="11" rx="2"
                fill="none" stroke="#f472b6" strokeWidth="1.8"/>
          {/* Basket inner grid */}
          <line x1={handleX + 5} y1={handleY + 8} x2={handleX + 5} y2={handleY + 19}
                stroke="#f472b6" strokeWidth="0.8" opacity="0.5"/>
          <line x1={handleX + 10} y1={handleY + 8} x2={handleX + 10} y2={handleY + 19}
                stroke="#f472b6" strokeWidth="0.8" opacity="0.5"/>
          <line x1={handleX - 1} y1={handleY + 13} x2={handleX + 17} y2={handleY + 13}
                stroke="#f472b6" strokeWidth="0.8" opacity="0.5"/>
          {/* Items in basket */}
          <circle cx={handleX + 4}  cy={handleY + 12} r="2.5" fill="#ec4899" opacity="0.8"/>
          <rect   x={handleX + 8}  y={handleY + 10}  width="5" height="6" rx="1" fill="#be185d" opacity="0.7"/>
          {/* Bottom chassis */}
          <line x1={handleX - 2} y1={handleY + 19} x2={handleX + 18} y2={handleY + 19}
                stroke="#f472b6" strokeWidth="2" strokeLinecap="round"/>
          {/* Wheels */}
          <circle cx={handleX + 2}  cy={handleY + 22} r="3.5" fill="none" stroke="#f472b6" strokeWidth="1.8"/>
          <circle cx={handleX + 14} cy={handleY + 22} r="3.5" fill="none" stroke="#f472b6" strokeWidth="1.8"/>
          {/* Wheel spokes */}
          <line x1={handleX + 2}  y1={handleY + 18.5} x2={handleX + 2}  y2={handleY + 25.5} stroke="#f472b6" strokeWidth="0.9"/>
          <line x1={handleX - 1.5} y1={handleY + 22}  x2={handleX + 5.5} y2={handleY + 22}  stroke="#f472b6" strokeWidth="0.9"/>
          <line x1={handleX + 14} y1={handleY + 18.5} x2={handleX + 14} y2={handleY + 25.5} stroke="#f472b6" strokeWidth="0.9"/>
          <line x1={handleX + 10.5} y1={handleY + 22} x2={handleX + 17.5} y2={handleY + 22} stroke="#f472b6" strokeWidth="0.9"/>
        </g>
      </svg>
    </div>
  );
}
 
/* ── Full "Powered By Otechy" sparkle — P travels to y ── */
function OtechySparkle({ progress }: { progress: number }) {
  // All characters in the full phrase (spaces included for layout, but sparkle skips them)
  // We split into two visible groups: "Powered By " and "Otechy"
  // The sparkle index sweeps across all 14 non-space letters: P-o-w-e-r-e-d-B-y-O-t-e-c-h-y (15 chars with spaces = 13 letters)
  const poweredBy = ["P","o","w","e","r","e","d"," ","B","y"," "];
  const otechy    = ["O","t","e","c","h","y"];
  const allLetters = [...poweredBy, ...otechy]; // 17 chars total
  // Only spark on non-space chars — build index map
  const sparkableIndices = allLetters
    .map((ch, i) => (ch !== " " ? i : -1))
    .filter((i) => i >= 0); // 15 sparkable letters
  const totalSparkable = sparkableIndices.length; // 15
 
  // Which sparkable slot is currently lit (0-14), driven by progress 0-100
  const sparkSlot = Math.min(
    totalSparkable - 1,
    Math.floor((progress / 100) * totalSparkable)
  );
  const activeIdx = sparkableIndices[sparkSlot]; // actual index in allLetters
 
  const intensity = Math.abs(Math.sin((progress / 100) * Math.PI * totalSparkable));
 
  const renderLetters = (chars: string[], offset: number) =>
    chars.map((ch, i) => {
      const globalIdx = offset + i;
      const active = globalIdx === activeIdx;
      if (ch === " ") return <span key={i} style={{ fontSize: 11 }}>&nbsp;</span>;
      return (
        <span key={i} style={{
          position: "relative",
          fontSize: 11,
          color: active ? `rgba(255,210,230,${0.8 + intensity * 0.2})` : "rgba(255,182,218,0.5)",
          fontWeight: active ? 700 : 500,
          textShadow: active
            ? `0 0 ${7 + intensity * 14}px #ec4899, 0 0 ${15 + intensity * 22}px rgba(236,72,153,0.5)`
            : "none",
          transition: "color 0.15s, text-shadow 0.15s",
        }}>
          {ch}
          {active && (
            <>
              <SparkDot dx={-5} dy={-8}  delay={0}    intensity={intensity} />
              <SparkDot dx={6}  dy={-9}  delay={0.13} intensity={intensity} />
              <SparkDot dx={8}  dy={2}   delay={0.26} intensity={intensity} />
              <SparkDot dx={-7} dy={3}   delay={0.08} intensity={intensity} />
            </>
          )}
        </span>
      );
    });
 
  return (
    <span style={{ display: "inline-flex", alignItems: "center", flexWrap: "nowrap" }}>
      {renderLetters(poweredBy, 0)}
      {renderLetters(otechy, poweredBy.length)}
    </span>
  );
}
 
function SparkDot({ dx, dy, delay, intensity }: {
  dx: number; dy: number; delay: number; intensity: number;
}) {
  return (
    <span style={{
      position: "absolute",
      left: `calc(50% + ${dx}px)`, top: `calc(50% + ${dy}px)`,
      width: 3, height: 3, borderRadius: "50%",
      background: "#f9a8d4",
      opacity: intensity * 0.9,
      transform: `scale(${0.4 + intensity * 0.75})`,
      boxShadow: `0 0 ${3 + intensity * 5}px #ec4899`,
      animation: `sparkle-pulse 0.58s ease-in-out ${delay}s infinite`,
      pointerEvents: "none",
    }} />
  );
}
