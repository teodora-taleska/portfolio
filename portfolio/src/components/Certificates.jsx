import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal.jsx";

const certificates = [
  { img: "/certificates/claude_code.jpg" },
  { img: "/certificates/soft_skills.jpeg" },
  { img: "/certificates/python_lib.png" },
  { img: "/certificates/advanced_python.jpeg" },
  { img: "/certificates/digital_marketing.png" },
  { img: "/certificates/stat3.jpeg" },
  { img: "/certificates/applied_ml.jpeg" },
  { img: "/certificates/python_dsa.jpeg" },
  { img: "/certificates/python_trees.jpeg" },
  { img: "/certificates/AI_intro.jpeg" },
  { img: "/certificates/chatbots.jpeg" },
];

export default function Certificates() {
  const [current, setCurrent] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    const handleKey = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > 10) {
        if (e.deltaX > 0) handleNext();
        else handlePrev();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleNext = () => setCurrent((p) => (p < certificates.length - 1 ? p + 1 : p));
  const handlePrev = () => setCurrent((p) => (p > 0 ? p - 1 : 0));

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 40) handlePrev();
    else if (dx < -40) handleNext();
    touchStartX.current = null;
  };

  const isMobile = windowWidth > 0 && windowWidth < 768;
  const mainWidth = windowWidth > 1024 ? 700 : windowWidth > 768 ? 420 : Math.min(windowWidth - 32, 340);
  const mainHeight = Math.round((mainWidth * 9) / 16);
  const sideScale = 0.7;
  const sideOffset = isMobile ? mainWidth * 0.85 : mainWidth * 0.6;

  return (
    <section id="certificates" className="py-10 md:py-16 px-4 bg-th-bg relative">
      <ScrollReveal className="flex flex-col items-center">
        <h2 className="text-4xl text-[#D4AF37] font-bold text-center mb-2">
          CERTIFICATES
        </h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          style={{ originX: 0.5 }}
          className="h-[2px] w-12 bg-[#D4AF37] mt-2 mb-4"
        />
      </ScrollReveal>

      <div
        className="relative flex justify-center items-center overflow-hidden"
        style={{ height: mainHeight + 32 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {certificates.map((cert, i) => {
          const offset = i - current;
          const isVisible = isMobile ? Math.abs(offset) <= 1 : true;
          const opacity = offset === 0 ? 1 : isMobile ? 0 : 0.4;
          const scale = offset === 0 ? 1 : sideScale;
          const x = offset * sideOffset;

          return (
            <motion.div
              key={i}
              className="absolute rounded-2xl cursor-pointer shadow-2xl border border-[#D4AF37]/20 bg-th-card/20 backdrop-blur-md overflow-hidden"
              style={{
                zIndex: offset === 0 ? 20 : 10,
                width: mainWidth,
                height: mainHeight,
                pointerEvents: isVisible ? "auto" : "none",
              }}
              animate={{ x, scale, opacity }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => setCurrent(i)}
            >
              <img
                src={cert.img}
                alt={`Certificate ${i + 1}`}
                className="w-full h-full object-contain bg-th-card/10"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-center gap-4">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-th-fg/20 text-th-fg/60 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-20 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-2">
          {certificates.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? "w-7 h-3 bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.7)]"
                  : "w-3 h-3 bg-[#D4AF37]/20 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/45"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={current === certificates.length - 1}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-th-fg/20 text-th-fg/60 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-20 disabled:cursor-not-allowed transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <p className="text-center text-th-fg/30 text-xs mt-2">
        {current + 1} / {certificates.length}
      </p>
    </section>
  );
}
