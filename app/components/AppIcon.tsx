import type { ReactNode } from "react";

export type AppIconName =
  | "home"
  | "history"
  | "chart"
  | "image"
  | "fire"
  | "query"
  | "book"
  | "terminal"
  | "trending"
  | "sliders"
  | "verified"
  | "calendar"
  | "cameraPlus"
  | "checklist"
  | "camera"
  | "brokenImage"
  | "check"
  | "expand"
  | "chevronLeft"
  | "chevronRight"
  | "chevronDown"
  | "database"
  | "close"
  | "upload";

export default function AppIcon({
  name,
  className = "",
}: {
  name: AppIconName;
  className?: string;
}) {
  let shape: ReactNode = null;

  switch (name) {
    case "home":
      shape = <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>;
      break;
    case "history":
      shape = <><path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>;
      break;
    case "chart":
    case "query":
      shape = <><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 6-7" /><path d="M17 6h3v3" /></>;
      break;
    case "image":
      shape = <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" /></>;
      break;
    case "fire":
      shape = <><path d="M12 22c4.4 0 7-3 7-7 0-3.4-2.1-5.7-4.7-8.7.1 2.8-1 4.2-2.2 4.7C11.7 7.2 9.5 4.3 7 2 7.4 6.6 5 8.8 5 14c0 4.8 2.9 8 7 8Z" /><path d="M12 19a3 3 0 0 1-3-3c0-1.4.7-2.3 1.8-3.7.1 1.5.6 2.2 1.5 2.5.7-.5 1.2-1.1 1.5-2.2.8 1.1 1.2 2 1.2 3.3a3 3 0 0 1-3 3Z" /></>;
      break;
    case "book":
      shape = <><path d="M12 7v14" /><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 0 3 23V5.5Z" /><path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H12v18h6.5A2.5 2.5 0 0 1 21 23V5.5Z" /></>;
      break;
    case "terminal":
      shape = <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3m6 0h4" /></>;
      break;
    case "trending":
      shape = <><path d="M3 3v18h18" /><path d="M7 14h3v4H7zm6-6h3v10h-3zm6-4h3v14h-3z" /></>;
      break;
    case "sliders":
      shape = <><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3" /><path d="M2 14h4m4-6h4m4 8h4" /></>;
      break;
    case "verified":
      shape = <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>;
      break;
    case "calendar":
      shape = <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /><path d="M8 14h2m4 0h2M8 17h2" /></>;
      break;
    case "cameraPlus":
      shape = <><path d="M14 5h-4l-2 3H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" /><circle cx="11" cy="14" r="3" /><path d="M19 3v6m-3-3h6" /></>;
      break;
    case "checklist":
      shape = <><path d="m4 6 1 1 2-2m3 1h10M4 12l1 1 2-2m3 1h10M4 18l1 1 2-2m3 1h10" /></>;
      break;
    case "camera":
      shape = <><path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" /><circle cx="12" cy="13" r="4" /></>;
      break;
    case "brokenImage":
      shape = <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m4 17 5-5 3 3 2-2 6 6M8.5 9h.01M5 5l14 14" /></>;
      break;
    case "check":
      shape = <path d="m5 12 4 4L19 6" />;
      break;
    case "expand":
      shape = <><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3" /><path d="m8 8-5-5m13 5 5-5M8 16l-5 5m13-5 5 5" /></>;
      break;
    case "chevronLeft":
      shape = <path d="m15 18-6-6 6-6" />;
      break;
    case "chevronRight":
      shape = <path d="m9 18 6-6-6-6" />;
      break;
    case "chevronDown":
      shape = <path d="m6 9 6 6 6-6" />;
      break;
    case "database":
      shape = <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3" /></>;
      break;
    case "close":
      shape = <path d="m6 6 12 12M18 6 6 18" />;
      break;
    case "upload":
      shape = <><path d="M12 16V4m-5 5 5-5 5 5" /><path d="M20 16.5v2A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-2" /></>;
      break;
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {shape}
    </svg>
  );
}

