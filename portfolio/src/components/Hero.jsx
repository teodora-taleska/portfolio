import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#1C2541] rounded-full blur-3xl opacity-40"></div>

      {/* Image */}
      <motion.img
        src="/profile.png"
        alt="profile"
        className="w-40 h-40 rounded-full object-cover border-4 border-[#D4AF37] shadow-lg z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Text */}
      <motion.h1
        className="text-4xl mt-6 font-light text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Hi, I'm Tea
      </motion.h1>

      <motion.p
        className="text-lg text-[#5BC0BE] mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        I build intelligent systems from data
      </motion.p>

    </section>
  );
}