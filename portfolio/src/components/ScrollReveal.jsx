import { motion } from "framer-motion";

const variants = {
  up:    { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 },  visible: { opacity: 1, x: 0 } },
};

export default function ScrollReveal({ children, delay = 0, direction = "up", className = "" }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      variants={variants[direction]}
      className={className}
    >
      {children}
    </motion.div>
  );
}
