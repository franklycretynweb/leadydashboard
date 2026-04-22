"use client";

export function Atmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Blob 1 — Purple, upper right */}
      <div
        className="absolute"
        style={{
          width: 900,
          height: 900,
          top: -280,
          right: -80,
          background:
            "radial-gradient(circle at center, rgba(107,78,255,0.12) 0%, rgba(107,78,255,0.04) 40%, transparent 70%)",
          animation: "drift-1 32s ease-in-out infinite",
        }}
      />
      {/* Blob 2 — Blue, lower left */}
      <div
        className="absolute"
        style={{
          width: 800,
          height: 800,
          bottom: -180,
          left: 60,
          background:
            "radial-gradient(circle at center, rgba(78,168,255,0.10) 0%, rgba(78,168,255,0.03) 40%, transparent 70%)",
          animation: "drift-2 40s ease-in-out infinite",
        }}
      />
      {/* Blob 3 — Lavender, center-right */}
      <div
        className="absolute"
        style={{
          width: 600,
          height: 600,
          top: "35%",
          right: "22%",
          background:
            "radial-gradient(circle at center, rgba(155,102,255,0.07) 0%, transparent 65%)",
          animation: "drift-3 26s ease-in-out infinite",
        }}
      />
    </div>
  );
}
