import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const { scrollY } = useScroll();

  // Animate image scale
  const scale = useTransform(scrollY, [0, 400], [1, 0.75]);

  // Animate image position (center → left)
  const x = useTransform(scrollY, [0, 400], [0, -200]);

  return (
    <section className="h-[200vh] relative">

      {/* STICKY CONTAINER */}
        <div className="sticky top-0 h-screen flex items-center justify-center">
            <div className="absolute w-[400px] h-[400px] bg-[#1C2541] rounded-full blur-3xl opacity-40"></div>
            {/* IMAGE */}
            <motion.img
                src="/profile.png"
                style={{scale, x}}
                className="w-64 h-80 object-cover rounded-2xl shadow-2xl border border-[#D4AF37] z-10"
            />
            <motion.div
                className="absolute text-sm text-[#5BC0BE]"
                style={{
                    top: "20%",
                    left: "40%",
                }}
                animate={{y: [0, -10, 0]}}
                transition={{repeat: Infinity, duration: 3}}
            >
                Data Science
            </motion.div>

            <motion.div
                className="absolute text-sm text-[#D4AF37]"
                style={{
                    top: "60%",
                    left: "70%",
                }}
                animate={{y: [0, 10, 0]}}
                transition={{repeat: Infinity, duration: 4}}
            >
                AI
            </motion.div>

            <motion.div
                className="absolute text-sm text-white/70"
                style={{
                    top: "50%",
                    left: "20%",
                }}
                animate={{y: [0, -8, 0]}}
                transition={{repeat: Infinity, duration: 5}}
            >
                Systems
            </motion.div>

            {/* TEXT (appears on scroll) */}
            <motion.div
                className="absolute right-20 max-w-md"
                style={{
                    opacity: useTransform(scrollY, [150, 400], [0, 1]),
                    x: useTransform(scrollY, [150, 400], [80, 0]),
                }}
            >
                <h1 className="text-4xl font-light">Hi, I'm Tea</h1>

                <p className="text-[#5BC0BE] mt-4 leading-relaxed">
                    I build intelligent systems from data,
                    focusing on transforming complex information into meaningful insights.
                </p>
            </motion.div>

            <motion.a
                href="#projects"
                className="absolute bottom-10 text-gray-400 text-5xl"
                animate={{y: [0, 15, 0]}}
                transition={{repeat: Infinity, duration: 1.2}}
            >
                ↓
            </motion.a>

        </div>
    </section>
  );
}