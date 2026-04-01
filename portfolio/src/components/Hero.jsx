import { motion, useScroll, useTransform } from "framer-motion";
import CursorLight from "./CursorLight";
import FloatingWords from "./FloatingWords";

export default function Hero() {
  const { scrollY } = useScroll();

  const scale = useTransform(scrollY, [0, 400], [1, 0.75]);
  const x = useTransform(scrollY, [0, 400], [0, -200]);

  return (
    <section className="h-[200vh] relative">
        <CursorLight />

      {/* STICKY CONTAINER */}
        <div className="sticky top-0 h-screen flex items-center justify-center">
            <div className="absolute w-[400px] h-[400px] bg-[#1C2541] rounded-full blur-3xl opacity-40"></div>
            {/* IMAGE */}
            <motion.img
                src="/profile.png"
                style={{scale, x}}
                className="w-64 h-80 object-cover rounded-2xl shadow-2xl border border-[#D4AF37] z-10"
            />

            <FloatingWords/>


            {/* TEXT (appears on scroll) */}
            <motion.div
                className="absolute right-20 max-w-md"
                style={{
                    opacity: useTransform(scrollY, [150, 400], [0, 1]),
                    x: useTransform(scrollY, [150, 400], [80, 0]),
                }}
            >
                <h1 className="text-4xl font-light">Hi, I'm Teodora</h1>

                <p className="text-[#5BC0BE] mt-4 leading-relaxed">
                    I design intelligent data pipelines and AI systems that transform complex datasets into actionable
                    insights. From predictive models to automated decision tools, I help businesses and hospitals
                    leverage deep learning, transformers, and statistical methods to make smarter decisions. I also
                    document my research and experiments in a blog, sharing my journey in AI and data science.
                </p>
            </motion.div>

            {/*<motion.h2*/}
            {/*  className="text-2xl text-white/90 font-semibold mt-6 text-center max-w-lg"*/}
            {/*  style={{ opacity: useTransform(scrollY, [0, 200], [1, 0.8]) }}*/}
            {/*>*/}
            {/*  Data, AI, and pipelines — from raw numbers to actionable insights.*/}
            {/*</motion.h2>*/}


            <motion.a
                href="#projects"
                className="absolute bottom-10 text-gray-400 text-5xl"
                animate={{y: [0, 15, 0]}}
                transition={{repeat: Infinity, duration: 1}}
            >
                ↓
            </motion.a>

        </div>
    </section>
  );
}