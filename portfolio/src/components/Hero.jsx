import { motion, useScroll, useTransform } from "framer-motion";
import CursorLight from "./CursorLight";
import FloatingWords from "./FloatingWords";
import NeuralBackground from "./NeuralBackground.jsx";
import { useEffect, useState } from "react";

export default function Hero() {
  const { scrollY } = useScroll();
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
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

  /* ── MOBILE LAYOUT ─────────────────────────────────────────── */
  if (isMobile) {
    return (
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <CursorLight />
        <NeuralBackground open={true} />

        {/* Foreground content */}
        <div className="relative z-10 flex flex-col items-center text-center w-full pt-20 pb-24">

          {/* Keywords row — above the photo */}
          <div className="flex flex-wrap justify-center gap-2 px-4 mb-4">
            {[
              { text: "Data Science",     color: "#5BC0BE" },
              { text: "AI",               color: "#D4AF37" },
              { text: "Machine Learning", color: "#D4AF37" },
              { text: "Analytics",        color: "#FFD700" },
              { text: "Intelligence",     color: "#5BC0BE" },
              { text: "Vision",           color: "white"   },
              { text: "Systems",          color: "white"   },
              { text: "Optimization",     color: "#FFD700" },
            ].map((w, i) => (
              <span
                key={i}
                className="rounded-full border border-white/40 px-3 py-1 bg-white/5 backdrop-blur-sm text-xs font-medium"
                style={{ color: w.color }}
              >
                {w.text}
              </span>
            ))}
          </div>

          {/* Full-width photo */}
          <img
            src="/profile.png"
            className="w-full object-cover shadow-2xl border-y border-[#D4AF37]/40"
            style={{ maxHeight: "55vh", objectPosition: "top" }}
            alt="Teodora"
          />

          {/* Text below photo */}
          <div className="px-6 mt-6">
            <h1 className="text-3xl font-light">Hi, I'm Teodora</h1>
            <p className="text-[#5BC0BE] mt-4 leading-relaxed text-sm max-w-sm mx-auto">
              I design intelligent data pipelines and AI systems that transform complex
              datasets into actionable insights. From predictive models to automated
              decision tools, I help businesses leverage deep learning, transformers,
              and statistical methods to make smarter decisions.
            </p>
          </div>
        </div>

        <motion.a
          href="#projects"
          className="absolute bottom-8"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <div className="w-5 h-5 border-b-4 border-r-4 border-[#D4AF37] rotate-45" />
        </motion.a>
      </section>
    );
  }

  /* ── DESKTOP LAYOUT ────────────────────────────────────────── */
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
          <p className="text-[#5BC0BE] mt-4 leading-relaxed">
            I design intelligent data pipelines and AI systems that transform complex datasets into actionable
            insights. From predictive models to automated decision tools, I help businesses
            leverage deep learning, transformers, and statistical methods to make smarter decisions. I also
            document my research and experiments in a blog, sharing my journey in AI and data science.
          </p>
        </motion.div>

        <motion.a
          href="#projects"
          className="absolute bottom-10 text-gray-400 text-5xl"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <div className="w-6 h-6 border-b-4 border-r-4 border-[#D4AF37] rotate-45" />
        </motion.a>
      </div>
    </section>
  );
}
