"use client";

import { MeshGradient } from "@paper-design/shaders-react";

export function GrainHeroBg() {
  return (
    <>
      {/* Purple base gradient — consistent across full width */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 20%, #a78bfa 40%, #7dd3fc 60%, #c4b5fd 80%, #e9d5ff 100%)",
        }}
      />

      {/* Subtle MeshGradient glow — right side, soft and blurred */}
      <div className="absolute right-0 top-0 h-full w-[55%] opacity-40 blur-[40px]">
        <MeshGradient
          colors={["#c084fc", "#e879f9", "#7dd3fc", "#a78bfa", "#f0abfc"]}
          speed={0.2}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {/* Halftone dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)",
          backgroundSize: "7px 7px",
        }}
      />
    </>
  );
}
