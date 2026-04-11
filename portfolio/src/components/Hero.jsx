import { motion, useScroll, useTransform } from "framer-motion";
import CursorLight from "./CursorLight";
import FloatingWords from "./FloatingWords";
import NeuralBackground from "./NeuralBackground.jsx";
import { useEffect, useState } from "react";

const bio = `I work at the intersection of data science and software engineering,
building ML models, exploring predictive systems, and turning complex
datasets into insights worth acting on. Curious by nature, I tend to ask
one more "why" when evaluating results. I document what I learn and build along the way.`;

function ScrollArrow({ className }) {
  return (
    <motion.a
      href="#projects"
      className={`absolute ${className}`}
      animate={{ y: [0, 12, 0] }}
      transition={{ repeat: Infinity, duration: 1 }}
    >
      <div className="w-5 h-5 border-b-4 border-r-4 border-[#D4AF37] rotate-45" />
    </motion.a>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Desktop scroll animations
  const scale = useTransform(scrollY, [0, 400], [1, 0.75]);
  const x = useTransform(scrollY, [0, 400], [0, -200]);
  const textOpacity = useTransform(scrollY, [150, 400], [0, 1]);
  const textX = useTransform(scrollY, [150, 400], [80, 0]);

  useEffect(() => {
    return scrollY.on("change", (y) => setOpen(y < 150));
  }, [scrollY]);

  /* ── MOBILE ─────────────────────────────────────────────────── */
  if (isMobile) {
    return (
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "100svh" }}>
        <CursorLight />
        <NeuralBackground open={true} />

        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-24">
          <img
            src="/profile.png"
            className="w-24 h-32 object-cover rounded-xl mb-6 border border-[#D4AF37] shadow-2xl"
            alt="Teodora"
          />
          <h1 className="text-3xl font-light mt-4">Hi, I'm Teodora</h1>
          <p className="text-[#5BC0BE] mt-4 leading-relaxed text-sm max-w-sm">{bio}</p>
        </div>

        <FloatingWords open={true} isMobile={true} />
        <ScrollArrow className="bottom-14" />
      </section>
    );
  }

  /* ── DESKTOP (scroll-animated) ──────────────────────────────── */
  return (
    <section className="h-[200vh] relative">
      <CursorLight />

      <div className="sticky top-0 h-screen flex items-center justify-center">
        <NeuralBackground open={open} />
        <div className="absolute w-[400px] h-[400px] bg-[#1C2541] rounded-full blur-3xl opacity-40" />

        <motion.img
          src="/profile.png"
          style={{ scale, x }}
          className="w-64 h-80 object-cover rounded-2xl shadow-2xl border border-[#D4AF37] z-10"
          alt="Teodora"
        />

        <FloatingWords open={open} isMobile={false} />

        <motion.div
          className="absolute right-20 max-w-md"
          style={{ opacity: textOpacity, x: textX }}
        >
          <h1 className="text-4xl font-light">Hi, I'm Teodora</h1>
          <p className="text-[#5BC0BE] mt-4 leading-relaxed">{bio}</p>
        </motion.div>

        <ScrollArrow className="bottom-10" />
      </div>
    </section>
  );
}
