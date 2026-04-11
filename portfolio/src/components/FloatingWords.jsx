import { useScroll, useTransform, motion } from "framer-motion";

const words = [
  { text: "Data Science",     color: "#5BC0BE", top: -100, left:  120, delay: 0   },
  { text: "AI",               color: "#D4AF37", top:  -50, left: -100, delay: 0.2 },
  { text: "Systems",          color: "white",   top: -150, left:    0, delay: 0.4 },
  { text: "Analytics",        color: "#FFD700", top:  -70, left:  180, delay: 0.6 },
  { text: "Intelligence",     color: "#5BC0BE", top: -120, left:  -60, delay: 0.8 },
  { text: "Machine Learning", color: "#D4AF37", top:  -60, left:   20, delay: 1   },
  { text: "Optimization",     color: "#FFD700", top: -160, left:   90, delay: 1.2 },
  { text: "Vision",           color: "white",   top:  -80, left: -170, delay: 1.4 },
];

export default function FloatingWords({ open, isMobile }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 150], [1, 0]);

  const s = isMobile ? 0.7 : 1;

  return (
    <>
      {words.map((w, i) => (
        <motion.div
          key={i}
          className="absolute flex items-center justify-center"
          style={{
            top:  isMobile ? "20%" : "30%",
            left: isMobile ? "42%" : "47%",
            opacity,
            pointerEvents: "none",
          }}
          initial={{ y: 0, x: 0, scale: 0 }}
          animate={
            open
              ? { x: w.left * s, y: w.top * s, scale: 1 }
              : { x: 0, y: 0, scale: 0.6 }
          }
          transition={{
            duration: 1.5,
            delay: open ? w.delay : 0,
            ease: "easeInOut",
          }}
        >
          <div className="flex items-center justify-center rounded-full border border-white/40 px-3 py-1 bg-white/5 backdrop-blur-sm shadow-lg">
            <span
              style={{
                color: w.color,
                fontWeight: 500,
                whiteSpace: "nowrap",
                fontSize: isMobile ? "0.65rem" : "1rem",
              }}
            >
              {w.text}
            </span>
          </div>
        </motion.div>
      ))}
    </>
  );
}
