interface LogoProps {
  size?: "small" | "medium" | "large";
  withText?: boolean;
  className?: string;
}

export function ThykLogo({
  size = "medium",
  withText = true,
  className = "",
}: LogoProps) {
  // Size mappings
  const sizeMap = {
    small: 24,
    medium: 32,
    large: 48,
  };

  const logoSize = sizeMap[size];
  const textSize =
    size === "small" ? "text-lg" : size === "medium" ? "text-xl" : "text-2xl";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* SVG logo based on the reference image */}
      <svg
        width={logoSize}
        height={logoSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M20 20H80C90 20 90 40 80 50C90 60 90 80 80 80H20V20Z"
          fill="url(#thyk-gradient)"
        />
        <defs>
          <linearGradient
            id="thyk-gradient"
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#7B57FF" />
            <stop offset="100%" stopColor="#28B7D8" />
          </linearGradient>
        </defs>
      </svg>

      {withText && (
        <span className={`font-bold ${textSize} text-thyk-gradient`}>Thyk</span>
      )}
    </div>
  );
}

export function ThykMascot({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background shape */}
        <ellipse
          cx="100"
          cy="120"
          rx="80"
          ry="60"
          fill="#28B7D8"
          opacity="0.2"
        />

        {/* Body */}
        <ellipse cx="100" cy="120" rx="40" ry="50" fill="#7B57FF" />

        {/* Head */}
        <circle cx="100" cy="70" r="30" fill="#7B57FF" />

        {/* Antennas */}
        <path
          d="M85 50C80 30 70 20 65 15"
          stroke="#7B57FF"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M115 50C120 30 130 20 135 15"
          stroke="#7B57FF"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Eyes */}
        <ellipse cx="85" cy="65" rx="10" ry="12" fill="white" />
        <ellipse cx="115" cy="65" rx="10" ry="12" fill="white" />
        <ellipse cx="85" cy="65" rx="5" ry="7" fill="#323B4E" />
        <ellipse cx="115" cy="65" rx="5" ry="7" fill="#323B4E" />

        {/* Smile */}
        <path
          d="M90 85C95 90 105 90 110 85"
          stroke="#323B4E"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Arms */}
        <path
          d="M70 110C60 115 55 125 55 135"
          stroke="#7B57FF"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M130 110C140 115 145 125 145 135"
          stroke="#7B57FF"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Laptop */}
        <rect x="70" y="140" width="60" height="5" rx="2" fill="#28B7D8" />
        <rect
          x="70"
          y="120"
          width="60"
          height="20"
          rx="2"
          fill="#28B7D8"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
