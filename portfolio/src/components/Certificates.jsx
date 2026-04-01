import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const certificates = [
  { img: "/certificates/digital_marketing.png", title: "Digital Marketing" },
  { img: "/certificates/deep_learning.png", title: "Deep Learning Specialization" },
  { img: "/certificates/ai_healthcare.png", title: "AI in Healthcare" },
];

export default function Certificates() {
  const [current, setCurrent] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Keyboard navigation
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);

    // Trackpad horizontal swipe (wheel event, horizontal)
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

  const handlePrev = () =>
    setCurrent((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrent((prev) => (prev === certificates.length - 1 ? 0 : prev + 1));

  // Dynamic sizing
  const mainWidth = windowWidth > 1024 ? 700 : windowWidth > 768 ? 400 : 300;
  const mainHeight = (mainWidth * 9) / 16;
  const sideScale = 0.7;
  const sideOffset = mainWidth * 0.6;

  return (
    <section id="certificates" className="py-16 px-6 bg-[#1C2541] relative">
      <h2 className="text-4xl text-[#D4AF37] font-bold text-center mb-4">
        CERTIFICATES
      </h2>

      <div className="relative flex justify-center items-center overflow-hidden h-[600px] md:h-[500px] lg:h-[600px]">
        {certificates.map((cert, i) => {
          const offset = i - current;
          const zIndex = offset === 0 ? 20 : 10;
          const opacity = offset === 0 ? 1 : 0.4;
          const scale = offset === 0 ? 1 : sideScale;
          const x = offset * sideOffset;

          return (
            <motion.div
              key={i}
              className="absolute rounded-2xl cursor-pointer shadow-2xl border border-[#D4AF37]/20 bg-[#1C2541]/20 backdrop-blur-md overflow-hidden flex flex-col"
              style={{ zIndex, opacity, width: mainWidth, height: mainHeight }}
              animate={{ x, scale }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => setCurrent(i)}
            >
              <img
                src={cert.img}
                alt={cert.title}
                className="w-full h-full object-contain bg-[#1C2541]/10"
              />
              <div className="absolute bottom-0 w-full bg-black/40 text-white text-center py-1 text-sm">
                {cert.title}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination dots */}
      <div className="mt-6 flex justify-center gap-4">
        {certificates.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              i === current ? "bg-[#D4AF37]" : "bg-gray-500/50"
            }`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  );
}