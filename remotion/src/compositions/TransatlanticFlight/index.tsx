import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { geoGraticule10, geoInterpolate, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import landAtlas from "world-atlas/land-110m.json";
import countriesAtlas from "world-atlas/countries-110m.json";

const WIDTH = 1920;
const HEIGHT = 1080;

const ORIGIN_COORD: [number, number] = [-3.7038, 40.4168];
const DEST_COORD: [number, number] = [-74.006, 40.7128];

const ORIGIN_CITY = "MADRID";
const DEST_CITY = "NUEVA YORK";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const pointsToPath = (points: Array<[number, number]>) => {
  if (points.length === 0) {
    return "";
  }

  return points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
};

const projection = geoNaturalEarth1()
  .translate([WIDTH * 0.5, HEIGHT * 0.56])
  .scale(390);

const mapPath = geoPath(projection);

const landFeature = feature(
  landAtlas as never,
  (landAtlas as unknown as { objects: { land: object } }).objects.land
) as unknown;

const countriesFeatureCollection = feature(
  countriesAtlas as never,
  (countriesAtlas as unknown as { objects: { countries: object } }).objects.countries
) as unknown as { features: Array<{ id: string | number; geometry: unknown }> };

const countryFeatures = countriesFeatureCollection.features;

const bordersFeature = mesh(
  countriesAtlas as never,
  (countriesAtlas as unknown as { objects: { countries: object } }).objects.countries,
  // Draw border only when two geometries differ.
  (a: unknown, b: unknown) => a !== b
) as unknown;

const spainFeature = countryFeatures.find((country) => String(country.id) === "724");
const usaFeature = countryFeatures.find((country) => String(country.id) === "840");

const landPath = mapPath(landFeature as never) ?? "";
const bordersPath = mapPath(bordersFeature as never) ?? "";
const graticulePath = mapPath(geoGraticule10()) ?? "";
const spainPath = spainFeature ? mapPath(spainFeature as never) ?? "" : "";
const usaPath = usaFeature ? mapPath(usaFeature as never) ?? "" : "";

const originPoint = projection(ORIGIN_COORD) ?? [1000, 440];
const destinationPoint = projection(DEST_COORD) ?? [670, 430];

const routeInterpolator = geoInterpolate(ORIGIN_COORD, DEST_COORD);
const fullRoutePoints = Array.from({ length: 200 }, (_, index) => {
  const geoPoint = routeInterpolator(index / 199);
  return projection(geoPoint) as [number, number];
}).filter((point): point is [number, number] => Boolean(point));
const fullRoutePath = pointsToPath(fullRoutePoints);

const AirplaneModel: React.FC = () => {
  return (
    <svg
      viewBox="0 0 360 220"
      width="360"
      height="220"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="fuselage-gradient" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#a6b0bf" />
          <stop offset="18%" stopColor="#f6f9ff" />
          <stop offset="45%" stopColor="#adb9c8" />
          <stop offset="72%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#737f90" />
        </linearGradient>
        <linearGradient id="wing-top-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9fcff" />
          <stop offset="48%" stopColor="#d0d8e3" />
          <stop offset="100%" stopColor="#8794a5" />
        </linearGradient>
        <linearGradient id="wing-bottom-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7f8a9b" />
          <stop offset="50%" stopColor="#d7dee8" />
          <stop offset="100%" stopColor="#eff4fb" />
        </linearGradient>
        <linearGradient id="stripe-gradient" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#0e325f" />
          <stop offset="60%" stopColor="#1d5c9f" />
          <stop offset="100%" stopColor="#4f8ad2" />
        </linearGradient>
        <linearGradient id="engine-gradient" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#8c98a8" />
          <stop offset="30%" stopColor="#dde5ef" />
          <stop offset="100%" stopColor="#5c6878" />
        </linearGradient>
        <filter id="plane-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="rgba(0,0,0,0.42)" />
        </filter>
      </defs>

      <g filter="url(#plane-shadow)">
        <ellipse cx="178" cy="162" rx="112" ry="15" fill="rgba(5, 10, 22, 0.22)" />

        <path
          d="M 152 102 L 57 43 L 122 36 L 202 85 Z"
          fill="url(#wing-top-gradient)"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1"
        />
        <path
          d="M 162 124 L 84 184 L 146 188 L 216 139 Z"
          fill="url(#wing-bottom-gradient)"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
        />

        <rect x="116" y="86" width="30" height="16" rx="8" fill="url(#engine-gradient)" />
        <rect x="132" y="135" width="34" height="18" rx="9" fill="url(#engine-gradient)" />
        <ellipse cx="144" cy="94" rx="4" ry="6" fill="rgba(20, 28, 40, 0.55)" />
        <ellipse cx="162" cy="144" rx="4" ry="6" fill="rgba(20, 28, 40, 0.55)" />

        <path
          d="M 52 110 C 74 85 118 72 191 73 H 262 C 298 73 322 89 338 110 C 322 131 298 147 262 147 H 191 C 118 148 74 135 52 110 Z"
          fill="url(#fuselage-gradient)"
        />
        <path
          d="M 67 110 C 90 92 134 83 195 83 H 258 C 278 83 298 91 315 108"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 69 121 C 95 130 132 136 198 136 H 258 C 281 136 302 127 318 114"
          fill="none"
          stroke="rgba(26, 36, 49, 0.32)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <rect x="84" y="104" width="208" height="8" rx="4" fill="url(#stripe-gradient)" opacity="0.95" />

        <path
          d="M 281 89 C 297 92 309 99 316 109 L 287 108 Z"
          fill="#101e2f"
          opacity="0.9"
        />

        <g fill="#6f7c8c" opacity="0.95">
          <circle cx="118" cy="99" r="4" />
          <circle cx="136" cy="99" r="4" />
          <circle cx="154" cy="99" r="4" />
          <circle cx="172" cy="99" r="4" />
          <circle cx="190" cy="99" r="4" />
          <circle cx="208" cy="99" r="4" />
          <circle cx="226" cy="99" r="4" />
          <circle cx="244" cy="99" r="4" />
          <circle cx="262" cy="99" r="4" />
        </g>

        <path
          d="M 84 102 C 86 96 94 91 102 89"
          stroke="rgba(255,255,255,0.82)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M 80 88 L 38 48 L 66 50 L 101 88 Z"
          fill="url(#wing-top-gradient)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
        />
        <path
          d="M 86 132 L 45 168 L 74 170 L 108 136 Z"
          fill="url(#wing-bottom-gradient)"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1"
        />
        <path
          d="M 60 71 L 46 30 L 77 63 Z"
          fill="url(#wing-top-gradient)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

type LowerThirdProps = {
  label: string;
  value: string;
  x: number;
};

const LowerThirdBlock: React.FC<LowerThirdProps> = ({ label, value, x }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: 58,
        width: 410,
        padding: "14px 18px",
        borderRadius: 10,
        border: "1px solid rgba(145, 197, 255, 0.35)",
        background:
          "linear-gradient(180deg, rgba(6, 18, 34, 0.92), rgba(6, 18, 34, 0.68))",
        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: 3,
          color: "rgba(181, 214, 252, 0.84)",
          textTransform: "uppercase",
          marginBottom: 7,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 1,
          color: "#f1f8ff",
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
};

export const TransatlanticFlight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame, [24, 232], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 2 * 0.8), [-1, 1], [0.84, 1.1]);
  const introOpacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const destinationOpacity = interpolate(frame, [58, 102], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const geoPoint = routeInterpolator(progress);
  const geoPrevPoint = routeInterpolator(clamp(progress - 0.003, 0, 1));
  const planePoint = projection(geoPoint) ?? originPoint;
  const planePrevPoint = projection(geoPrevPoint) ?? originPoint;

  const heading =
    (Math.atan2(planePoint[1] - planePrevPoint[1], planePoint[0] - planePrevPoint[0]) * 180) /
    Math.PI;
  const bank = Math.sin(progress * Math.PI * 1.4) * 9;
  const pitch = interpolate(progress, [0, 0.45, 1], [18, 7, -4]);

  const visibleRoutePointsCount = Math.max(
    2,
    Math.floor(progress * (fullRoutePoints.length - 1)) + 1
  );
  const visibleRoutePoints = fullRoutePoints.slice(0, visibleRoutePointsCount);
  const visibleRoutePath = pointsToPath(visibleRoutePoints);

  const contrailClouds = Array.from({ length: 30 }, (_, index) => {
    const offset = index * 2;
    const trailIndex = visibleRoutePoints.length - 1 - offset;
    if (trailIndex <= 0) {
      return null;
    }

    const cloudPoint = visibleRoutePoints[trailIndex];
    const trailPrev = visibleRoutePoints[Math.max(trailIndex - 2, 0)];
    const angle =
      (Math.atan2(cloudPoint[1] - trailPrev[1], cloudPoint[0] - trailPrev[0]) * 180) / Math.PI;
    const size = 24 + index * 4.8;
    const opacity = clamp(0.52 - index * 0.014, 0, 0.52);
    const drift = Math.sin(frame * 0.04 + index * 1.3) * (5 + index * 0.4);

    return {
      key: `cloud-${index}`,
      x: cloudPoint[0] + drift,
      y: cloudPoint[1] + Math.cos(frame * 0.03 + index) * 2.8,
      size,
      opacity,
      angle,
      blur: 7 + index * 0.5,
    };
  }).filter(
    (
      cloud
    ): cloud is {
      key: string;
      x: number;
      y: number;
      size: number;
      opacity: number;
      angle: number;
      blur: number;
    } => cloud !== null
  );

  const planeScale =
    spring({
      fps,
      frame: Math.max(0, frame - 18),
      config: { damping: 18, stiffness: 90, mass: 0.7 },
      from: 0.76,
      to: 1,
    }) * 0.84;

  const dataPanelOpacity = interpolate(frame, [36, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "radial-gradient(circle at 35% 5%, rgba(128, 193, 255, 0.2), transparent 42%), linear-gradient(180deg, #020711 0%, #08182c 28%, #0d294a 68%, #08172e 100%)",
        fontFamily: '"Inter Variable", "Inter", "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(2, 8, 16, 0.14) 0%, rgba(8, 22, 40, 0.34) 52%, rgba(2, 7, 14, 0.44) 100%)",
          pointerEvents: "none",
        }}
      />

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="ocean-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#103968" />
            <stop offset="55%" stopColor="#0c2b4f" />
            <stop offset="100%" stopColor="#071a34" />
          </linearGradient>
          <linearGradient id="land-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#214f73" />
            <stop offset="48%" stopColor="#173f60" />
            <stop offset="100%" stopColor="#0f2d49" />
          </linearGradient>
          <radialGradient id="highlight-gradient" cx="38%" cy="28%" r="72%">
            <stop offset="0%" stopColor="rgba(126, 186, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(126, 186, 255, 0)" />
          </radialGradient>
          <filter id="glow-route" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5.5" />
          </filter>
          <filter id="marker-glow" x="-250%" y="-250%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="8.5" />
          </filter>
        </defs>

        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="url(#ocean-gradient)" />
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="url(#highlight-gradient)" />

        <path
          d={graticulePath}
          fill="none"
          stroke="rgba(130, 188, 255, 0.12)"
          strokeWidth="1"
        />

        <path d={landPath} fill="url(#land-gradient)" />
        <path d={landPath} fill="none" stroke="rgba(184, 229, 255, 0.2)" strokeWidth="1.2" />
        <path d={bordersPath} fill="none" stroke="rgba(160, 210, 255, 0.16)" strokeWidth="0.8" />

        {usaPath ? (
          <path
            d={usaPath}
            fill="rgba(111, 182, 255, 0.34)"
            stroke="rgba(205, 236, 255, 0.36)"
            strokeWidth="1"
          />
        ) : null}
        {spainPath ? (
          <path
            d={spainPath}
            fill="rgba(111, 182, 255, 0.42)"
            stroke="rgba(205, 236, 255, 0.5)"
            strokeWidth="1"
          />
        ) : null}

        <path
          d={fullRoutePath}
          fill="none"
          stroke="rgba(207, 233, 255, 0.16)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d={visibleRoutePath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#glow-route)"
        />
        <path
          d={visibleRoutePath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.95)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <circle
          cx={originPoint[0]}
          cy={originPoint[1]}
          r={22 * pulse}
          fill="rgba(201, 233, 255, 0.22)"
          filter="url(#marker-glow)"
        />
        <circle cx={originPoint[0]} cy={originPoint[1]} r="6" fill="#f3fbff" />

        <circle
          cx={destinationPoint[0]}
          cy={destinationPoint[1]}
          r={22 * (0.9 + pulse * 0.2)}
          fill="rgba(201, 233, 255, 0.22)"
          filter="url(#marker-glow)"
        />
        <circle cx={destinationPoint[0]} cy={destinationPoint[1]} r="6" fill="#f3fbff" />

        <text
          x={originPoint[0] + 14}
          y={originPoint[1] - 14}
          fill="rgba(235, 248, 255, 0.96)"
          fontSize="26"
          fontWeight="700"
          letterSpacing="1.4"
          opacity={introOpacity}
        >
          ESPANA
        </text>
        <text
          x={destinationPoint[0] + 14}
          y={destinationPoint[1] - 14}
          fill="rgba(235, 248, 255, 0.96)"
          fontSize="26"
          fontWeight="700"
          letterSpacing="1.2"
          opacity={destinationOpacity}
        >
          ESTADOS UNIDOS
        </text>
      </svg>

      {contrailClouds.map((cloud) => (
        <div
          key={cloud.key}
          style={{
            position: "absolute",
            left: cloud.x - cloud.size / 2,
            top: cloud.y - cloud.size / 2,
            width: cloud.size,
            height: cloud.size * 0.7,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 36% 46%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.66) 32%, rgba(255,255,255,0.18) 62%, rgba(255,255,255,0) 100%)",
            filter: `blur(${cloud.blur}px)`,
            opacity: cloud.opacity,
            transform: `rotate(${cloud.angle}deg)`,
            mixBlendMode: "screen",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: planePoint[0] - 156 + 26,
          top: planePoint[1] - 94 + 40,
          transform: `rotate(${heading}deg) scale(${planeScale * 0.97})`,
          filter: "blur(16px) brightness(0) opacity(0.25)",
          transformOrigin: "50% 50%",
          pointerEvents: "none",
        }}
      >
        <AirplaneModel />
      </div>

      <div
        style={{
          position: "absolute",
          left: planePoint[0] - 156,
          top: planePoint[1] - 94,
          width: 312,
          height: 188,
          transform: `rotate(${heading}deg) scale(${planeScale})`,
          transformOrigin: "50% 50%",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transform: `perspective(1400px) rotateX(${58 + pitch}deg) rotateY(${
              -13 + bank * 0.6
            }deg) rotateZ(${5 + bank}deg)`,
            filter:
              "drop-shadow(0 16px 28px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.15))",
          }}
        >
          <AirplaneModel />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 28,
          top: 28,
          display: "flex",
          alignItems: "center",
          height: 56,
          minWidth: 620,
          borderRadius: 9,
          border: "1px solid rgba(137, 195, 255, 0.36)",
          background:
            "linear-gradient(90deg, rgba(13, 33, 58, 0.92) 0%, rgba(13, 33, 58, 0.74) 55%, rgba(13, 33, 58, 0.54) 100%)",
          boxShadow: "0 8px 18px rgba(0, 0, 0, 0.36)",
          overflow: "hidden",
          opacity: introOpacity,
        }}
      >
        <div
          style={{
            width: 118,
            height: "100%",
            background: "linear-gradient(90deg, #db2a2a 0%, #af1f1f 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 2,
            color: "#fff6f6",
          }}
        >
          DIRECTO
        </div>
        <div
          style={{
            paddingLeft: 18,
            fontSize: 22,
            letterSpacing: 1.4,
            color: "#e7f4ff",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Ruta transatlantica Espana - Estados Unidos
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 34,
          top: 102,
          width: 420,
          borderRadius: 12,
          border: "1px solid rgba(137, 195, 255, 0.3)",
          background:
            "linear-gradient(180deg, rgba(8, 24, 45, 0.88), rgba(8, 24, 45, 0.66))",
          boxShadow: "0 14px 30px rgba(0, 0, 0, 0.36)",
          padding: "16px 18px",
          opacity: dataPanelOpacity,
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: 2.8,
            textTransform: "uppercase",
            color: "rgba(183, 220, 255, 0.84)",
            marginBottom: 12,
          }}
        >
          Datos del vuelo
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            rowGap: 10,
            columnGap: 16,
            color: "#ecf7ff",
            fontSize: 21,
            fontWeight: 600,
          }}
        >
          <span style={{ opacity: 0.76, fontSize: 15, letterSpacing: 1.2 }}>ORIGEN</span>
          <span>{`${ORIGIN_CITY}, ESPANA`}</span>
          <span style={{ opacity: 0.76, fontSize: 15, letterSpacing: 1.2 }}>DESTINO</span>
          <span>{`${DEST_CITY}, ESTADOS UNIDOS`}</span>
          <span style={{ opacity: 0.76, fontSize: 15, letterSpacing: 1.2 }}>DISTANCIA</span>
          <span>5 768 KM</span>
          <span style={{ opacity: 0.76, fontSize: 15, letterSpacing: 1.2 }}>RUMBO</span>
          <span>OESTE-NOROESTE</span>
        </div>
      </div>

      <LowerThirdBlock label="Origen" value={`${ORIGIN_CITY} | ESPANA`} x={32} />
      <LowerThirdBlock label="Destino" value={`${DEST_CITY} | ESTADOS UNIDOS`} x={474} />
      <LowerThirdBlock label="Cobertura" value="Grafismo TV en directo" x={916} />
    </AbsoluteFill>
  );
};
