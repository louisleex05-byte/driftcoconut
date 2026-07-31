// Decorative SVG icons — subtle beach/island accents.
// All icons: aria-hidden, use `currentColor` so parent Tailwind text-* controls tint.

type IconProps = { className?: string };

export function PalmLeaf({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M100 190 Q95 130 100 60 Q102 20 100 10 Q98 20 100 60 Q90 130 100 190Z" opacity="0.7" />
      {/* Frond leaflets — left side */}
      <path d="M100 60 Q60 55 30 30 Q60 45 100 70Z" opacity="0.85" />
      <path d="M100 90 Q55 88 20 70 Q55 85 100 100Z" opacity="0.85" />
      <path d="M100 120 Q60 125 25 118 Q60 128 100 130Z" opacity="0.85" />
      <path d="M100 150 Q65 158 35 160 Q65 162 100 160Z" opacity="0.85" />
      {/* Frond leaflets — right side */}
      <path d="M100 60 Q140 55 170 30 Q140 45 100 70Z" opacity="0.85" />
      <path d="M100 90 Q145 88 180 70 Q145 85 100 100Z" opacity="0.85" />
      <path d="M100 120 Q140 125 175 118 Q140 128 100 130Z" opacity="0.85" />
      <path d="M100 150 Q135 158 165 160 Q135 162 100 160Z" opacity="0.85" />
    </svg>
  );
}

export function Shell({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {/* Scallop shell outline */}
      <path d="M50 85 Q10 85 12 40 Q30 20 50 15 Q70 20 88 40 Q90 85 50 85Z" fill="currentColor" opacity="0.15" />
      <path d="M50 85 Q10 85 12 40 Q30 20 50 15 Q70 20 88 40 Q90 85 50 85Z" />
      {/* Ribs */}
      <path d="M50 15 L50 85" />
      <path d="M35 18 Q30 50 32 82" />
      <path d="M65 18 Q70 50 68 82" />
      <path d="M22 30 Q20 55 22 80" />
      <path d="M78 30 Q80 55 78 80" />
      {/* Hinge dot */}
      <circle cx="50" cy="15" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Pebble({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <ellipse cx="30" cy="35" rx="22" ry="14" opacity="0.35" />
      <ellipse cx="65" cy="30" rx="18" ry="12" opacity="0.5" />
      <ellipse cx="85" cy="40" rx="12" ry="8" opacity="0.4" />
      <ellipse cx="15" cy="42" rx="10" ry="6" opacity="0.55" />
    </svg>
  );
}

export function Wave({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 600 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M0 20 Q50 6 100 20 T200 20 T300 20 T400 20 T500 20 T600 20" opacity="0.7" />
      <path d="M0 30 Q50 20 100 30 T200 30 T300 30 T400 30 T500 30 T600 30" opacity="0.4" />
    </svg>
  );
}

export function Hibiscus({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      {/* 5 petals radiating around center */}
      <g opacity="0.7">
        <ellipse cx="60" cy="30" rx="18" ry="26" />
        <ellipse cx="90" cy="50" rx="18" ry="26" transform="rotate(72 90 50)" />
        <ellipse cx="80" cy="88" rx="18" ry="26" transform="rotate(144 80 88)" />
        <ellipse cx="40" cy="88" rx="18" ry="26" transform="rotate(216 40 88)" />
        <ellipse cx="30" cy="50" rx="18" ry="26" transform="rotate(288 30 50)" />
      </g>
      <circle cx="60" cy="60" r="8" opacity="0.9" />
      {/* Stamen */}
      <line x1="60" y1="60" x2="60" y2="42" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="40" r="2.5" />
    </svg>
  );
}

export function Boat({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 140 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      {/* Triangular sail */}
      <path d="M70 15 L70 68 L30 68 Z" opacity="0.85" />
      {/* Second smaller sail */}
      <path d="M72 20 L72 68 L108 68 Z" opacity="0.65" />
      {/* Mast */}
      <line x1="70" y1="12" x2="70" y2="72" stroke="currentColor" strokeWidth="2" />
      {/* Hull */}
      <path d="M15 72 Q70 92 125 72 Q120 82 70 84 Q20 82 15 72 Z" opacity="0.9" />
      {/* Water line ripple */}
      <path d="M0 92 Q30 88 60 92 T120 92 T140 92" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
  );
}

export function StrawHat({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 90"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      {/* Wide brim */}
      <ellipse cx="60" cy="65" rx="55" ry="12" opacity="0.75" />
      {/* Crown */}
      <path d="M25 65 Q30 25 60 20 Q90 25 95 65 Z" opacity="0.9" />
      {/* Band */}
      <path d="M27 58 Q60 66 93 58 L92 64 Q60 71 28 64 Z" opacity="0.5" />
      {/* Woven texture — subtle lines on crown */}
      <path d="M35 55 Q60 60 85 55" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.4" />
      <path d="M32 45 Q60 51 88 45" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.4" />
      <path d="M32 35 Q60 40 88 35" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.4" />
    </svg>
  );
}

export function Coral({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      {/* Base */}
      <ellipse cx="50" cy="115" rx="28" ry="4" opacity="0.4" />
      {/* Main trunk */}
      <path
        d="M50 115 Q48 90 45 75 Q42 60 45 45 Q48 30 46 15"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* Left branch */}
      <path
        d="M45 60 Q30 55 22 40 Q18 30 22 20"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      {/* Right branch */}
      <path
        d="M46 70 Q65 65 72 50 Q78 40 76 28"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      {/* Small side branch */}
      <path
        d="M45 85 Q35 80 32 72"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />
      {/* Polyps — small dots for texture */}
      <circle cx="22" cy="22" r="3" opacity="0.7" />
      <circle cx="76" cy="30" r="3" opacity="0.7" />
      <circle cx="46" cy="17" r="3" opacity="0.7" />
      <circle cx="32" cy="70" r="2.5" opacity="0.6" />
    </svg>
  );
}

export function Conch({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {/* Outer shell body */}
      <path
        d="M20 78 Q10 55 20 32 Q35 12 60 15 Q85 22 88 45 Q88 68 72 82 Q52 92 30 88 Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path d="M20 78 Q10 55 20 32 Q35 12 60 15 Q85 22 88 45 Q88 68 72 82 Q52 92 30 88 Z" />
      {/* Inner spiral swirl */}
      <path d="M50 82 Q30 75 32 55 Q38 40 55 42 Q68 46 66 60 Q60 70 50 68" />
      <path d="M52 60 Q47 58 47 54" />
      {/* Ribs */}
      <path d="M25 40 Q40 25 60 22" opacity="0.6" />
      <path d="M30 55 Q45 45 65 45" opacity="0.6" />
    </svg>
  );
}

export function Starfish({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M50 10 L60 40 L92 42 L67 62 L76 92 L50 74 L24 92 L33 62 L8 42 L40 40 Z" opacity="0.5" />
      {/* Center dimples */}
      <circle cx="50" cy="52" r="3" opacity="0.4" />
      <circle cx="43" cy="48" r="1.5" opacity="0.4" />
      <circle cx="57" cy="48" r="1.5" opacity="0.4" />
      <circle cx="45" cy="58" r="1.5" opacity="0.4" />
      <circle cx="55" cy="58" r="1.5" opacity="0.4" />
    </svg>
  );
}
