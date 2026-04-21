import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function NeuralBackground({ open }) {
  const { isDark } = useTheme();
  const secondaryColor = isDark ? "#ffffff" : "#94a3b8";

  const nodes = [
    { x: 12, y: 20 }, { x: 18, y: 35 }, { x: 25, y: 50 },
    { x: 35, y: 30 }, { x: 45, y: 60 }, { x: 60, y: 40 },
    { x: 70, y: 25 }, { x: 80, y: 55 }, { x: 65, y: 75 },
    { x: 40, y: 80 }, { x: 20, y: 70 }, { x: 85, y: 15 },
    { x: 55, y: 20 }, { x: 30, y: 60 }, { x: 75, y: 45 },
  ];

  const connections = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 35) {
        connections.push([nodes[i], nodes[j]]);
      }
    }
  }

  const robotNodes = [
    { x: 15, y: 30 },
    { x: 15, y: 45 },
    { x: 10, y: 55 },
    { x: 20, y: 55 },
    { x: 12, y: 70 },
    { x: 18, y: 70 },
  ];

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-0"
      animate={{ opacity: open ? 0.2 : 0.5 }}
      transition={{ duration: 0.8 }}
    >
      <svg className="w-full h-full">

        {connections.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={`${a.x}%`}
            y1={`${a.y}%`}
            x2={`${b.x}%`}
            y2={`${b.y}%`}
            stroke={i % 2 === 0 ? "#D4AF37" : secondaryColor}
            strokeWidth="0.8"
            strokeDasharray="4 6"
            animate={{
              strokeDashoffset: open ? 0 : -20,
              opacity: open ? 0.3 : 0.6,
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={`${n.x}%`}
            cy={`${n.y}%`}
            r="2.5"
            fill={i % 2 === 0 ? "#D4AF37" : secondaryColor}
            animate={{
              scale: open ? 1 : 1.5,
              opacity: open ? 0.6 : 1,
            }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}

        {robotNodes.map((n, i) => (
          <motion.circle
            key={`robot-${i}`}
            cx={`${n.x}%`}
            cy={`${n.y}%`}
            r="3"
            fill="#D4AF37"
            initial={{ opacity: 0 }}
            animate={{
              opacity: open ? 0 : 0.8,
              scale: open ? 0.5 : 1.2,
            }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
          />
        ))}

      </svg>
    </motion.div>
  );
}
