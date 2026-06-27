import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal.jsx";

export default function EducationSection() {
  const [modalFile, setModalFile] = useState(null);

  const education = [
    {
      degree: "Master's degree, Data Science",
      school: "University of Ljubljana, Faculty of Computer and Information Science",
      duration: "Oct 2024 – Oct 2026",
      type: "master",
      languages: [
        "/language/slovene.pdf",
      ],
    },
    {
      degree: "Erasmus+ Master Exchange, Artificial Intelligence",
      school: "KU Leuven",
      duration: "Sep 2025 – Jan 2026",
      type: "master",
      languages: ["/language/dutch.pdf"],
    },
    {
      degree: "Bachelor's degree, Computer Science",
      school: "UP FAMNIT",
      duration: "Sep 2020 – Oct 2024",
      type: "bachelor",
      thesis: "/language/thesis.pdf",
    },
  ];

  return (
    <section id="education" className="py-20 px-4 md:px-6 bg-th-sect section-gradient text-th-fg relative overflow-hidden">
      <ScrollReveal className="flex flex-col items-center">
        <h3 className="text-4xl font-bold mb-2 text-center text-[#D4AF37]">EDUCATION</h3>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          style={{ originX: 0.5 }}
          className="h-[2px] w-12 bg-[#D4AF37] mt-2 mb-14"
        />
      </ScrollReveal>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {education.map((edu, i) => {
          const isLeft = i % 2 === 0;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className={`flex flex-col md:flex-row items-center md:items-start gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              {/* Card */}
              <div className="bg-th-card p-6 md:p-6 rounded-2xl shadow-2xl card-bordered relative md:w-3/5 flex flex-col justify-center">
                <h4 className="text-xl font-bold">{edu.degree}</h4>
                <p className="text-th-fg/80 mt-1">{edu.school}</p>
                <p className="text-th-fg/70 mt-1">{edu.duration}</p>

                {edu.type === "master" && (
                  <div className="flex gap-4 mt-4">
                    {edu.languages.map((lang, idx) => (
                      <motion.div
                        key={idx}
                        className="w-10 h-10 bg-[#FFD700]/30 flex items-center justify-center rounded-full cursor-pointer"
                        initial={{ scale: 1.5 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.3, backgroundColor: "rgba(255,215,0,0.6)" }}
                        onClick={() => setModalFile(lang)}
                      >
                        <img
                          src="/icons/language.png"
                          alt="Language Certificate"
                          className="w-6 h-6"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {edu.type === "bachelor" && (
                  <div className="mt-4">
                    <motion.div
                      className="w-10 h-10 bg-[#FFD700]/30 flex items-center justify-center rounded-full cursor-pointer"
                      initial={{ scale: 1.5 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.3, backgroundColor: "rgba(255,215,0,0.6)" }}
                      onClick={() => setModalFile(edu.thesis)}
                    >
                      <img
                        src="/icons/thesis.png"
                        alt="Thesis Document"
                        className="w-6 h-6"
                      />
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* PDF Modal */}
      <AnimatePresence>
        {modalFile && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalFile(null)}
          >
            <div
              className="bg-th-card w-[96vw] md:w-[88vw] lg:w-[75vw] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col"
              style={{ height: "92vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end px-4 py-2 shrink-0">
                <button
                  className="text-th-fg text-2xl font-bold leading-none"
                  onClick={() => setModalFile(null)}
                >
                  ×
                </button>
              </div>
              <iframe
                src={modalFile}
                className="w-full rounded-b-2xl"
                style={{ flex: 1, minHeight: 0, height: "100%" }}
                title="Document"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
