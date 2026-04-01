/* eslint-disable-next-line no-unused-vars */
import { motion } from "framer-motion";

export default function Hero() {
  return (
      <section className="h-screen flex flex-col justify-center items-center relative">

          {/* IMAGE */}
          <motion.img
              src="/profile.png"
              className="w-64 h-80 object-cover rounded-2xl shadow-2xl border border-[#D4AF37]"
              initial={{scale: 0.8, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              transition={{duration: 1}}
          />

          {/* TEXT */}
          <motion.div
              className="text-center mt-6"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.5}}
          >
              <h1 className="text-4xl font-light">Hi, I'm Tea</h1>
              <p className="text-[#5BC0BE] mt-2">
                  I build intelligent systems from data
              </p>
          </motion.div>

          {/* SCROLL ARROW */}
          <motion.a
              href="#projects"
              className="absolute bottom-10 text-gray-400 text-5xl cursor-pointer"
              animate={{y: [0, 15, 0]}}
              transition={{repeat: Infinity, duration: 1.2}}
          >
              ↓
          </motion.a>

      </section>
  );
}