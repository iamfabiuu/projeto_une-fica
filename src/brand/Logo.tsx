import { useState } from "react";

const SIZES = {
  xs: "h-6",
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
  xl: "h-20",
  "2xl": "h-28",
  "3xl": "h-40",
} as const;

export function Logo({
  size = "xl",
  invert = false,
  className = "",
}: {
  size?: keyof typeof SIZES;
  invert?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="inline-flex flex-col items-start leading-[0.8]">
        <span className="display text-xl">
          <span className="text-une">UNE</span>
          <span className="text-sun">&</span>
        </span>
        <span className="display text-xl text-fica">FICA</span>
      </span>
    );
  }

  return (
    <img
      src="/assets/une-fica-logo.svg"
      alt="UNE&FICA"
      onError={() => setFailed(true)}
      draggable={false}
      className={`${SIZES[size]} w-auto select-none ${invert ? "brightness-0 invert" : ""} ${className}`}
    />
  );
}
