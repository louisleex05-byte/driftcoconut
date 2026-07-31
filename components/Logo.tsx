// Drifting coconut logo — a half-shell drifting on subtle waves with a young palm sprout.

export default function Logo({
  size,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  // If size prop is passed, use it as width/height. Otherwise rely on className (w-*/h-*).
  const sizeProps = size ? { width: size, height: size } : {};
  return (
    <svg
      {...sizeProps}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Palm fronds sprouting from the coconut */}
      <path
        d="M32 30 Q18 18 8 22 Q16 24 22 30"
        fill="#4FAFC5"
        opacity="0.9"
      />
      <path
        d="M32 30 Q46 18 56 22 Q48 24 42 30"
        fill="#4FAFC5"
        opacity="0.9"
      />
      <path
        d="M32 30 Q28 14 24 8 Q30 16 30 28"
        fill="#2A93AB"
      />
      <path
        d="M32 30 Q36 14 40 8 Q34 16 34 28"
        fill="#2A93AB"
      />

      {/* Coconut half shell */}
      <path
        d="M18 32 Q18 46 32 46 Q46 46 46 32 Z"
        fill="#1A6377"
      />
      {/* Coconut inner rim */}
      <path
        d="M20 32 Q20 34 22 34 L42 34 Q44 34 44 32 Z"
        fill="#F0F9FB"
        opacity="0.35"
      />

      {/* Water ripples — the "drifting" motion */}
      <path
        d="M6 52 Q14 48 22 52 T38 52 T54 52 T62 52"
        stroke="#85CBDB"
        strokeWidth="1.5"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M10 58 Q18 54 26 58 T42 58 T58 58"
        stroke="#85CBDB"
        strokeWidth="1.2"
        fill="none"
        opacity="0.55"
      />
    </svg>
  );
}
