import { useScroll, useTransform, motion } from "framer-motion";

export default function FloatingWords() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 150], [1, 0]);

  // keywords with new offsets to reduce overlap
  const words = [
    { text: "Data Science", color: "#5BC0BE", top: "-100px", left: "120px", delay: 0 },
    { text: "AI", color: "#D4AF37", top: "-50px", left: "-100px", delay: 0.2 },
    { text: "Systems", color: "white", top: "-150px", left: "0px", delay: 0.4 },
    { text: "Analytics", color: "#FFD700", top: "-70px", left: "180px", delay: 0.6 },
    { text: "Intelligence", color: "#5BC0BE", top: "-120px", left: "-60px", delay: 0.8 },
    { text: "Machine Learning", color: "#D4AF37", top: "-60px", left: "20px", delay: 1 },
    { text: "Optimization", color: "#FFD700", top: "-160px", left: "90px", delay: 1.2 },
    { text: "Vision", color: "white", top: "-80px", left: "-170px", delay: 1.4 },
  ];

  return (
    <>
      {words.map((w, i) => (
        <motion.div
          key={i}
          className="absolute flex items-center justify-center"
          style={{
            top: "30%", // image center
            left: "47%",
            opacity,
            width: "auto",
            height: "auto",
            pointerEvents: "none",
          }}
          initial={{ y: 0, x: 0, scale: 0 }}
          animate={{
            x: [0, w.left],
            y: [0, w.top],
            scale: [0, 1],
          }}
          transition={{
            duration: 1.5,
            delay: w.delay,
            ease: "easeOut",
          }}
        >
          <div className="flex items-center justify-center rounded-full border border-white/40 px-3 py-1 bg-white/5 backdrop-blur-sm shadow-lg">
            <span style={{ color: w.color, fontWeight: 500, whiteSpace: "nowrap" }}>
              {w.text}
            </span>
          </div>
        </motion.div>
      ))}
    </>
  );
}