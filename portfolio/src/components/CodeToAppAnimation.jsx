import { motion, useScroll, useTransform } from "framer-motion";

export default function CodeToAppAnimation({ scrollTarget }) {
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start start", "end end"], // animate along entire section
  });

  //  Code block animations (longer) 
  const codeOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const codeY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  //  Prototype image animations (longer) 
  const protoStart = 0.35;
  const protoEnd = 0.75;
  const protoOpacity = useTransform(scrollYProgress, [protoStart, protoEnd], [0, 1]);
  const protoX = useTransform(scrollYProgress, [protoStart, protoEnd], [-200, 0]);
  const protoScale = useTransform(scrollYProgress, [protoStart, protoEnd], [0.8, 1]);

  //  Web preview behind prototype 
  const webOpacity = useTransform(scrollYProgress, [protoStart + 0.05, protoEnd], [0, 0.6]);
  const webScale = useTransform(scrollYProgress, [protoStart + 0.05, protoEnd], [0.8, 1]);
  const webY = useTransform(scrollYProgress, [protoStart + 0.05, protoEnd], [30, 0]);

  // Background glow behind prototype
  const bgOpacity = useTransform(scrollYProgress, [protoStart, protoEnd], [0, 0.2]);
  const bgScale = useTransform(scrollYProgress, [protoStart, protoEnd], [0.8, 1.2]);

  // Floating particles from code → app (subtle)
  const particlesY = useTransform(scrollYProgress, [0.05, protoStart], [0, -50]);
  const particlesOpacity = useTransform(scrollYProgress, [0.05, protoStart], [0.8, 0]);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            y: particlesY,
            opacity: particlesOpacity,
            left: `${20 + i * 10}%`,
          }}
          className="absolute w-2 h-2 bg-[#FFD700] rounded-full"
        />
      ))}

      {/* Background glow */}
      <motion.div
        style={{ opacity: bgOpacity, scale: bgScale }}
        className="absolute w-[500px] h-[300px] bg-[#5BC0BE]/20 rounded-2xl"
      />

      {/* Code block */}
      <motion.div
        style={{ y: codeY, opacity: codeOpacity }}
        className="absolute w-64 h-32 bg-[#1C2541] border border-[#D4AF37] rounded-xl shadow-lg p-3 text-white text-xs font-mono flex flex-col justify-around"
      >
        <div>import React from "react";</div>
        <div>const App = () =&gt; &lt;View /&gt;;</div>
        <div>export default App;</div>
      </motion.div>

      {/* Arrow flow */}
      <motion.div
        style={{ opacity: codeOpacity }}
        className="absolute top-[35%] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#D4AF37]"
      />

      {/* Web preview behind prototype */}
      <motion.div
        style={{ opacity: webOpacity, scale: webScale, y: webY }}
        className="absolute w-[450px] h-[280px] rounded-2xl shadow-xl overflow-hidden border border-[#FFD700] flex items-center justify-center bg-[#1C2541]/80"
      >
        <img
          src="/web_prototype_example.png"
          alt="Web App Prototype"
          className="w-full h-full object-cover rounded-2xl"
        />
      </motion.div>

      {/* Prototype image */}
      <motion.div
        style={{ opacity: protoOpacity, x: protoX, scale: protoScale }}
        className="absolute w-[420px] h-[320px] rounded-2xl shadow-2xl overflow-hidden border border-[#5BC0BE] flex items-center justify-center"
      >
        <img
          src="/prototype_example.png"
          alt="App Prototype"
          className="w-full h-full object-cover rounded-2xl"
        />
      </motion.div>
    </div>
  );
}