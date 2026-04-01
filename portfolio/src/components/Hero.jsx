import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const { scrollY } = useScroll();

  // Animate image scale
  const scale = useTransform(scrollY, [0, 300], [1, 0.7]);

  // Animate image position (center → left)
  const x = useTransform(scrollY, [0, 300], [0, -250]);

  return (
    <section className="h-[200vh] relative">

      {/* STICKY CONTAINER */}
        <div className="sticky top-0 h-screen flex items-center justify-center">

            {/* IMAGE */}
            <motion.img
                src="/profile.png"
                style={{scale, x}}
                className="w-64 h-80 object-cover rounded-2xl shadow-2xl border border-[#D4AF37] z-10"
            />

            {/* TEXT (appears on scroll) */}
            <motion.div
                className="absolute right-20 max-w-md"
                style={{
                    opacity: useTransform(scrollY, [100, 300], [0, 1]),
                    x: useTransform(scrollY, [100, 300], [50, 0]),
                }}
            >
                <h1 className="text-4xl font-light">Hi, I'm Tea</h1>
                <p className="text-[#5BC0BE] mt-2">
                    I build intelligent systems from data
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