import React from "react";

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
      <circle cx="18" cy="16" r="4" fill="#6A6F77" />
      <circle cx="18" cy="16" r="2.5" fill="#C9CCD1" />
      <rect x="2" y="18" width="32" height="12" rx="2" fill="url(#bracket-metal)" />
      <defs>
        <linearGradient id="bracket-gradient" x1="6" y1="2" x2="30" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D9DCE0" />
          <stop offset="0.5" stopColor="#B2B6BC" />
          <stop offset="1" stopColor="#7B7F86" />
        </linearGradient>
        <linearGradient id="bracket-metal" x1="2" y1="18" x2="34" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4F5F7" />
          <stop offset="0.5" stopColor="#C9CCD1" />
          <stop offset="1" stopColor="#8B8F96" />
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
        stroke="url(#hook-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Vertical shank */}
      <line x1="12" y1="12" x2="12" y2="24" stroke="url(#hook-grad)" strokeWidth="3" />
      {/* Curved hook tip holding bottle cap loop */}
      <path
        d="M12 24C12 28.4183 8.41828 32 4 32C2.5 32 1.5 31.5 1 30.5"
        stroke="url(#hook-grad)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="hook-grad" x1="6" y1="2" x2="18" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4F5F7" />
          <stop offset="0.5" stopColor="#C9CCD1" />
          <stop offset="1" stopColor="#8B8F96" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RailBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Chrome Suspension Bar */}
      <div className="relative w-full flex items-center justify-between px-2">
        <RailBracket side="left" />
        <div
          className="flex-1 h-3 rounded-full shadow-inner mx-[-8px] z-10"
          style={{
            background: "linear-gradient(180deg, #c9ccd1 0%, #f4f5f7 50%, #8b8f96 100%)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.8)",
          }}
        />
        <RailBracket side="right" />
      </div>

      {/* Hanging items attached beneath the rail bar */}
      <div className="w-full relative mt-[-6px]">{children}</div>
    </div>
  );
}
