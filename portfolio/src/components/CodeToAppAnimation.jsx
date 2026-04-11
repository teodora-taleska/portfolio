import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export default function CodeToAppAnimation({ onAnimationComplete }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const codeControls = useAnimation();
  const protoControls = useAnimation();
  const webControls = useAnimation();
  const bgControls = useAnimation();
  const particleControls = useAnimation();

  useEffect(() => {
    if (!isInView) {
      // Reset to initial state so the animation replays next time
      codeControls.set({ opacity: 1, y: 0 });
      protoControls.set({ opacity: 0, x: -150, scale: 0.95 });
      webControls.set({ opacity: 0, scale: 0.95, y: 20 });
      bgControls.set({ opacity: 0, scale: 0.9 });
      particleControls.set({ y: 0, opacity: 0.8 });
      return;
    }

    async function sequence() {
      // Phase 1: particles float up while code is visible
      particleControls.start({ y: -50, opacity: 0, transition: { duration: 1 } });
      await new Promise((r) => setTimeout(r, 600));

      // Phase 2: code fades out
      await codeControls.start({ opacity: 0, y: -40, transition: { duration: 0.5 } });
      await new Promise((r) => setTimeout(r, 300));

      // Phase 3: prototypes appear
      bgControls.start({ opacity: 0.2, scale: 1.2, transition: { duration: 0.8 } });
      webControls.start({ opacity: 0.6, scale: 1, y: 0, transition: { duration: 0.8 } });
      await protoControls.start({ opacity: 1, x: 0, scale: 1, transition: { duration: 0.8 } });

      await new Promise((r) => setTimeout(r, 600));

      // Phase 4: code fades back in
      await codeControls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });

      if (onAnimationComplete) onAnimationComplete();
    }

    sequence();
  }, [isInView, bgControls, codeControls, particleControls, protoControls, webControls, onAnimationComplete]);

  return (
    <div ref={ref} className="relative w-full h-full flex items-center justify-center pointer-events-none">
      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={particleControls}
          initial={{ y: 0, opacity: 0.8 }}
          style={{ left: `${20 + i * 10}%` }}
          className="absolute w-2 h-2 bg-[#FFD700] rounded-full z-10"
        />
      ))}

      {/* Background glow */}
      <motion.div
        animate={bgControls}
        initial={{ opacity: 0, scale: 0.9 }}
        className="absolute w-full max-w-[500px] h-[300px] bg-[#5BC0BE]/20 rounded-2xl z-10 will-change-transform transform-gpu"
      />

      {/* CODE BLOCK */}
      <motion.div
        animate={codeControls}
        initial={{ opacity: 1, y: 0 }}
        className="absolute w-[min(256px,70vw)] h-32 bg-[#1C2541] border border-[#D4AF37] rounded-xl shadow-lg p-3 text-white text-xs font-mono flex flex-col justify-around z-30 will-change-transform transform-gpu"
      >
        <div>import React from "react";</div>
        <div>const App = () =&gt; &lt;View /&gt;;</div>
        <div>export default App;</div>
      </motion.div>

      {/* WEB PREVIEW — shifted right so it peeks behind the mobile prototype */}
      <motion.div
        animate={webControls}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        className="absolute w-[min(450px,95vw)] h-[min(280px,50vw)] rounded-2xl shadow-xl overflow-hidden border border-[#FFD700] bg-[#1C2541]/80 z-20 will-change-transform transform-gpu"
        style={{ right: "2%" }}
      >
        <img
          src="/web_prototype_example.png"
          alt="Web App Prototype"
          className="w-full h-full object-cover pointer-events-none select-none"
        />
      </motion.div>

      {/* PROTOTYPE — centered-left */}
      <motion.div
        animate={protoControls}
        initial={{ opacity: 0, x: -150, scale: 0.95 }}
        className="absolute w-[min(420px,90vw)] h-[min(320px,55vw)] rounded-2xl shadow-2xl overflow-hidden border border-[#5BC0BE] z-30 will-change-transform transform-gpu"
        style={{ left: "2%" }}
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
