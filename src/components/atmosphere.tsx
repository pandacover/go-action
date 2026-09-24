export function Atmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#0c0a14]" />
      <svg
        className="absolute inset-0 h-full w-full origin-center scale-[1.35] blur-[72px]"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ga-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#161225" />
            <stop offset="36%" stopColor="#2c2150" />
            <stop offset="54%" stopColor="#8f5464" />
            <stop offset="68%" stopColor="#efc39a" />
            <stop offset="100%" stopColor="#171322" />
          </linearGradient>
          <radialGradient id="ga-sun" cx="50%" cy="58%" r="22%">
            <stop offset="0%" stopColor="#fff6e4" />
            <stop offset="38%" stopColor="#f0b27d" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#ga-sky)" />
        <circle cx="800" cy="530" r="210" fill="url(#ga-sun)" />
        <ellipse
          cx="800"
          cy="620"
          rx="1100"
          ry="90"
          fill="#ead5cc"
          opacity="0.28"
        />
        <ellipse
          cx="420"
          cy="760"
          rx="780"
          ry="170"
          fill="#2a2444"
          opacity="0.72"
        />
        <ellipse
          cx="1180"
          cy="790"
          rx="760"
          ry="160"
          fill="#1a1630"
          opacity="0.82"
        />
        <ellipse
          cx="800"
          cy="840"
          rx="980"
          ry="140"
          fill="#100e1a"
          opacity="0.9"
        />
      </svg>
      <div className="absolute -top-[18%] left-[8%] size-[42rem] rounded-full bg-[radial-gradient(circle,oklch(0.62_0.12_300/0.28),transparent_68%)] blur-3xl" />
      <div className="absolute top-[38%] -right-[12%] size-[36rem] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.1_40/0.22),transparent_70%)] blur-3xl" />
      <div className="atmosphere-grain absolute inset-0 opacity-[0.18] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_28%,oklch(0.12_0.03_280/0.55)_100%)]" />
    </div>
  )
}
