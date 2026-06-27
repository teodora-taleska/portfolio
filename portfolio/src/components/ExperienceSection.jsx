import { useRef } from "react";
import { motion } from "framer-motion";
import CodeToAppAnimation from "./CodeToAppAnimation.jsx";
import ScrollReveal from "./ScrollReveal.jsx";

export default function ExperienceSection() {
  const sectionRef = useRef(null);

  const experiences = [
    {
      role: "Full Stack JavaScript Developer (Student)",
      company: "MLS Invest d.o.o.",
      location: "Ljubljana, Slovenia",
      duration: "Dec 2023 - Sep 2024",
      details: [
        "Developed cross-platform mobile applications in JavaScript (React Native)",
        "Built web applications with React and Node.js",
        "Implemented backend logic and CRUD operations on a relational database",
        "Queried and validated data using SQL and PostgreSQL",
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="flex flex-col md:flex-row gap-12 py-20 px-5 md:px-10 bg-th-bg text-th-fg"
    >
      {/* Left side: Experience text */}
      <div className="flex-1">
        <ScrollReveal direction="left">
          <h3 className="text-4xl font-bold mb-2 text-[#D4AF37]">EXPERIENCE</h3>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            style={{ originX: 0 }}
            className="h-[2px] w-12 bg-[#D4AF37] mt-2 mb-10"
          />
        </ScrollReveal>
        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <motion.div
                className="bg-th-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 card-bordered"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <h4 className="text-xl font-semibold">{exp.role}</h4>
                <p className="text-th-fg/80">
                  {exp.company} · {exp.location}
                </p>
                <p className="text-th-fg/70 mb-2">{exp.duration}</p>
                <ul className="list-disc list-inside text-th-fg/70">
                  {exp.details.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Right side: Code → App animation */}
      <div className="flex-1 relative">
        <div className="sticky top-30 flex justify-center h-[300px]">
          <CodeToAppAnimation />
        </div>
      </div>
    </section>
  );
}
