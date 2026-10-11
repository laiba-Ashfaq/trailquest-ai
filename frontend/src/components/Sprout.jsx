export default function Sprout({ mood = "idle" }) {
  return (
    <div className="sprout-wrap" aria-hidden="true">
      <svg className={`sprout ${mood === "think" ? "bounce" : "wiggle"}`} viewBox="0 0 120 130">
        <ellipse className="leaf" cx="42" cy="28" rx="18" ry="26" transform="rotate(-28 42 28)" />
        <ellipse className="leaf" cx="78" cy="26" rx="16" ry="24" transform="rotate(24 78 26)" />
        <circle className="body" cx="60" cy="78" r="38" />
        <circle className="cheek" cx="42" cy="86" r="7" />
        <circle className="cheek" cx="78" cy="86" r="7" />
        <circle className="eye" cx="48" cy="74" r="5" />
        <circle className="eye" cx="72" cy="74" r="5" />
        <path d="M52 96 Q60 104 68 96" fill="none" stroke="#2a261c" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {mood === "think" && (
        <div className="dots" aria-label="thinking">
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
}
