import { motion, useScroll, useTransform } from "framer-motion";

export default function CodeToAppAnimation({ scrollTarget }) {
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start start", "end end"],
  });

  // TIMELINE
  // 0 → 0.4   : code visible
  // 0.4 → 0.5 : code fades out
  // 0.5 → 0.75 : code hidden (pause)
  // 0.75 → 0.9 : prototype visible
  // 0.9 → 1 : code fades back in (optional)

  // CODE
  const codeOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.5, 0.75, 0.9, 1],
    [1, 1, 0, 0, 0.6, 1]
  );

  const codeY = useTransform(
    scrollYProgress,
    [0, 0.4, 0.5, 0.75, 1],
    [0, 0, -40, -40, 0]
  );

  // PROTOTYPE (front)
  const protoOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.7, 0.9],
    [0, 0, 1]
  );

  const protoX = useTransform(
    scrollYProgress,
    [0.55, 0.9],
    [-150, 0]
  );

  const protoScale = useTransform(
    scrollYProgress,
    [0.55, 0.9],
    [0.95, 1]
  );

  // WEB (behind)
  const webOpacity = useTransform(
    scrollYProgress,
    [0.6, 0.7, 0.9],
    [0, 0, 0.6]
  );

  const webScale = useTransform(
    scrollYProgress,
    [0.6, 0.9],
    [0.95, 1]
  );

  const webY = useTransform(
    scrollYProgress,
    [0.6, 0.9],
    [20, 0]
  );

  // BACKGROUND
  const bgOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.9],
    [0, 0.2]
  );

  const bgScale = useTransform(
    scrollYProgress,
    [0.55, 0.9],
    [0.9, 1.2]
  );

  // PARTICLES
  const particlesY = useTransform(
    scrollYProgress,
    [0.1, 0.4],
    [0, -50]
  );

  const particlesOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.4],
    [0.8, 0]
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">

      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            y: particlesY,
            opacity: particlesOpacity,
            left: `${20 + i * 10}%`,
          }}
          className="absolute w-2 h-2 bg-[#FFD700] rounded-full z-10"
        />
      ))}

      {/* Background glow */}
      <motion.div
        style={{ opacity: bgOpacity, scale: bgScale }}
        className="absolute w-[500px] h-[300px] bg-[#5BC0BE]/20 rounded-2xl z-10 will-change-transform transform-gpu"
      />

      {/* CODE BLOCK */}
      <motion.div
        style={{ y: codeY, opacity: codeOpacity }}
        className="absolute w-64 h-32 bg-[#1C2541] border border-[#D4AF37] rounded-xl shadow-lg p-3 text-white text-xs font-mono flex flex-col justify-around z-30 will-change-transform transform-gpu"
      >
        <div>import React from "react";</div>
        <div>const App = () =&gt; &lt;View /&gt;;</div>
        <div>export default App;</div>
      </motion.div>

      {/* Arrow */}
      <motion.div
        style={{ opacity: codeOpacity }}
        className="absolute top-[35%] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#D4AF37] z-20"
      />

      {/* WEB PREVIEW */}
      <motion.div
        style={{ opacity: webOpacity, scale: webScale, y: webY }}
        className="absolute left-[10%] -translate-x-1/2 w-[450px] h-[280px] rounded-2xl shadow-xl overflow-hidden border border-[#FFD700] bg-[#1C2541]/80 z-20 will-change-transform transform-gpu"
      >
        <img
          src="/web_prototype_example.png"
          alt="Web App Prototype"
          className="w-full h-full object-cover pointer-events-none select-none"
        />
      </motion.div>

      {/* PROTOTYPE */}
      <motion.div
        style={{ opacity: protoOpacity, x: protoX, scale: protoScale }}
        className="absolute left-[10%] -translate-x-1/2 w-[420px] h-[320px] rounded-2xl shadow-2xl overflow-hidden border border-[#5BC0BE] z-30 will-change-transform transform-gpu"
      >
        <img
          src="/prototype_example.png"
          alt="App Prototype"
          className="w-full h-full object-cover pointer-events-none select-none"
        />
      </motion.div>
    </div>
  );
}