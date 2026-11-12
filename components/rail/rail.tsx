import React from "react";
import { HOLE_Y } from "@/components/bottle-image";

export function RailBracket({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <svg
      width="36"
      height="48"
      viewBox="0 0 36 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${isLeft ? "" : "scale-x-[-1]"}`}
      aria-hidden="true"
    >
      <path
        d="M6 4C6 2.89543 6.89543 2 8 2H28C29.1046 2 30 2.89543 30 4V36C30 42.6274 24.6274 48 18 48C11.3726 48 6 42.6274 6 36V4Z"
        fill="url(#bracket-gradient)"
      />
      <circle cx="18" cy="16" r="4" fill="#0A291F" />
      <circle cx="18" cy="16" r="2.5" fill="var(--hook-metal, #D4AF37)" />
      <rect x="2" y="18" width="32" height="12" rx="2" fill="url(#bracket-gradient)" stroke="#0A291F" strokeWidth="0.5" />
      <defs>
        <linearGradient id="bracket-gradient" x1="6" y1="2" x2="30" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#17453A" />
          <stop offset="1" stopColor="#0F3D2E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RailHook() {
  return (
    <svg
      width="24"
      height="36"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto select-none"
      aria-hidden="true"
    >
      {/* Top loop gripping the rail bar */}
      <path
        d="M12 2C8.68629 2 6 4.68629 6 8V12H18V8C18 4.68629 15.3137 2 12 2Z"
        stroke="var(--hook-metal, #D4AF37)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Vertical shank */}
      <line x1="12" y1="12" x2="12" y2="24" stroke="var(--hook-metal, #D4AF37)" strokeWidth="3" />
      {/* Curved hook tip holding bottle cap loop */}
      <path
        d="M12 24C12 28.4183 8.41828 32 4 32C2.5 32 1.5 31.5 1 30.5"
        stroke="var(--hook-metal, #D4AF37)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BottleEyelet({ h = 440 }: { h?: number }) {
  const ringWidth = Math.max(12, Math.round(h * 0.03));
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
      style={{ top: `${HOLE_Y * 100}%` }}
      aria-hidden="true"
    >
      {/* Gold eyelet ring */}
      <div
        className="rounded-full flex items-center justify-center shadow-sm"
        style={{
          width: ringWidth,
          height: ringWidth,
          border: "2px solid #E8B923",
          backgroundColor: "#1B1B1B",
        }}
      />
      {/* Small rounded gold tab overlapping the cap by about 2px */}
      <div
        className="w-2.5 h-1.5 rounded-t-sm -mt-0.5"
        style={{ backgroundColor: "#E8B923" }}
      />
    </div>
  );
}

export function RailBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Brass Suspension Bar */}
      <div className="relative w-full flex items-center justify-between px-2">
        <RailBracket side="left" />
        <div
          className="flex-1 h-3 rounded-full shadow-inner mx-[-8px] z-10"
          style={{
            background: "linear-gradient(180deg, #D9B25A, #C9A24A, #A8842F)",
            boxShadow:
              "0 2px 4px rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(0,0,0,0.3)",
          }}
        />
        <RailBracket side="right" />
      </div>

      {/* Hanging items attached directly around the rail bar */}
      <div className="w-full relative mt-[-10px]">{children}</div>
    </div>
  );
}
