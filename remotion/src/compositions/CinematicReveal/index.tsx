import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Easing,
} from "remotion";

/* ─── Colores de marca ──────────────────────────────────────── */
const BG = "#0b0b0b";
const EMBER = "#f1a93a";
const RED = "#c7422e";

/**
 * CinematicReveal – Intro cinematográfica del logo Black Gum.
 *
 * Timeline (30 fps, 180 frames = 6 s):
 *   0–30   → Darkness + horizontal light streak grows
 *  30–60   → Logo scales up from 0 with intense glow burst
 *  60–100  → Logo settles, glow calms, subtle ember particles
 * 100–140  → "BLACK GUM STUDIO" text fades in below
 * 140–180  → Everything holds, gentle pulse on logo
 */
export const CinematicReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Phase 1: Light streak (0-40) ───────────────────────── */
  const streakWidth = interpolate(frame, [0, 35], [0, 120], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const streakOpacity = interpolate(frame, [0, 15, 35, 55], [0, 0.8, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Phase 2: Logo entrance (25-65) ────────────────────── */
  const logoScale = spring({
    frame: Math.max(0, frame - 25),
    fps,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });

  const logoOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Glow burst on entrance ────────────────────────────── */
  const glowBurstSize = interpolate(frame, [25, 45, 75], [0, 200, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const glowBurstOpacity = interpolate(frame, [25, 38, 75], [0, 0.9, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Ambient glow (after settle, 60+) ──────────────────── */
  const breathe = Math.sin((frame / fps) * Math.PI * 2 * 0.4);
  const ambientGlow = interpolate(breathe, [-1, 1], [30, 50]);
  const ambientOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Phase 3: Text reveal (100-140) ────────────────────── */
  const textOpacity = interpolate(frame, [100, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [100, 130], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  /* ── Subtle logo pulse in hold phase (140+) ────────────── */
  const holdPulse =
    frame > 140
      ? interpolate(
          Math.sin(((frame - 140) / fps) * Math.PI * 2 * 0.5),
          [-1, 1],
          [0.97, 1.03]
        )
      : 1;

  /* ── Horizontal flare lines ────────────────────────────── */
  const flareOpacity = interpolate(frame, [30, 50, 90], [0.7, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ── Light streak ──────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          width: `${streakWidth}%`,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${EMBER}, transparent)`,
          opacity: streakOpacity,
          filter: "blur(1px)",
        }}
      />

      {/* ── Horizontal flare lines (cinematic anamorphic) ── */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: 1,
          background: `linear-gradient(90deg, transparent 10%, rgba(241,169,58,0.3) 30%, rgba(199,66,46,0.5) 50%, rgba(241,169,58,0.3) 70%, transparent 90%)`,
          opacity: flareOpacity,
          filter: "blur(3px)",
          transform: "scaleX(1.5)",
        }}
      />

      {/* ── Glow burst ────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          width: glowBurstSize,
          height: glowBurstSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${EMBER} 0%, ${RED} 40%, transparent 70%)`,
          opacity: glowBurstOpacity,
          filter: `blur(${glowBurstSize * 0.3}px)`,
        }}
      />

      {/* ── Ambient glow (breathing) ─────────────────────── */}
      <div
        style={{
          position: "absolute",
          width: ambientGlow * 3,
          height: ambientGlow * 3,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(241,169,58,0.35) 0%, rgba(199,66,46,0.15) 50%, transparent 70%)`,
          opacity: ambientOpacity * 0.6,
          filter: `blur(${ambientGlow * 0.5}px)`,
        }}
      />

      {/* ── Logo ──────────────────────────────────────────── */}
      <Img
        src={staticFile("logo-white.png")}
        style={{
          width: 220,
          height: 220,
          objectFit: "contain",
          transform: `scale(${logoScale * holdPulse})`,
          opacity: logoOpacity,
          filter: `drop-shadow(0 0 ${ambientGlow * 0.6}px rgba(241,169,58,${
            ambientOpacity * 0.5
          }))`,
          zIndex: 2,
        }}
      />

      {/* ── Text: BLACK GUM STUDIO ────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "28%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "#f5f0e8",
          }}
        >
          Black Gum
        </span>
        <span
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: EMBER,
            opacity: 0.7,
          }}
        >
          Studio
        </span>
      </div>

      {/* ── Vignette overlay ──────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(11,11,11,0.7) 100%)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
    </AbsoluteFill>
  );
};
