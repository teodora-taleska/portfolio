import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CursorLight() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Generate small spark particles
      setParticles((prev) => [
        ...prev,
        {
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          id: Date.now() + Math.random(),
        },
      ]);
    };
    window.addEventListener("mousemove", move);

    // Remove old particles after 0.5s
    const interval = setInterval(() => {
      setParticles((prev) => prev.filter((p) => Date.now() - p.id < 500));
    }, 50);

    return () => {
      window.removeEventListener("mousemove", move);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Glow circle */}
      <motion.div
        style={{
          position: "fixed",
          top: pos.y - 50,
          left: pos.x - 50,
          width: 100,
          height: 100,
          pointerEvents: "none",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,200,0.25) 0%, rgba(0,0,0,0) 60%)",
          mixBlendMode: "screen",
          zIndex: 20,
          transition: "top 0.02s, left 0.02s", // faster movement
        }}
      />

      {/* Spark particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 0.5 }}
          animate={{ opacity: 0, scale: 1.2, x: p.x - pos.x, y: p.y - pos.y }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: pos.y,
            left: pos.x,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "radial-gradient(circle, #FFF 0%, #FFD700 80%)",
            pointerEvents: "none",
            zIndex: 25,
          }}
        />
      ))}
    </>
  );
}