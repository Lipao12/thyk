import Logo from "../assets/logo.png";
import Thinky from "../assets/thinky.png";

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
    <div className={`flex items-center ${className}`}>
      {/* SVG logo based on the reference image */}
      <img width={logoSize} height={logoSize} src={Logo} alt="Thyk logo" />

      {withText && (
        <span className={`font-bold ${textSize} text-thyk-gradient`}>hyk</span>
      )}
    </div>
  );
}

export function ThykMascot({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <img src={Thinky} alt="Hey, I'm Thinky" />
    </div>
  );
}
