import { motion } from "framer-motion";

export default function Robot({ open }) {
  return (
    <div className="absolute bottom-10 right-10">
      {/* Head */}
      <motion.div
        className="w-16 h-16 bg-[#D4AF37] rounded-lg"
        animate={{
          y: open ? -50 : 0,
          opacity: 1,
        }}
      />

      {/* Body */}
      <motion.div
        className="w-20 h-24 bg-white mt-2 rounded-lg"
        animate={{
          scale: open ? 0.8 : 1,
        }}
      />

      {/* Arms */}
      <motion.div
        className="w-6 h-20 bg-[#D4AF37] absolute left-[-20px] top-[40px]"
        animate={{
          rotate: open ? -30 : 0,
        }}
      />
      <motion.div
        className="w-6 h-20 bg-[#D4AF37] absolute right-[-20px] top-[40px]"
        animate={{
          rotate: open ? 30 : 0,
        }}
      />
    </div>
  );
}