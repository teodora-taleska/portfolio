import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EducationSection() {
  const [modalFile, setModalFile] = useState(null); // file to open in modal

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
    <section id="education" className="py-20 px-4 md:px-6 bg-[#121826] text-white relative overflow-hidden">
      <h3 className="text-4xl font-bold mb-16 text-center text-[#D4AF37]">EDUCATION</h3>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* space-y-20 5rem? 16->4rem, 13-> 3rem, 8->2rem...*/}
        {education.map((edu, i) => {
          const isLeft = i % 2 === 0; // zig-zag

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
              <div className="bg-[#1C2541] p-6 md:p-6 rounded-2xl shadow-2xl relative md:w-3/5 flex flex-col justify-center">
                <h4 className="text-xl font-bold">{edu.degree}</h4>
                <p className="text-white/80 mt-1">{edu.school}</p>
                <p className="text-white/70 mt-1">{edu.duration}</p>

                {/* Floating icons for masters */}
                {edu.type === "master" && (
                  <div className="flex gap-4 mt-4">
                    {edu.languages.map((lang, idx) => (
                      <motion.div
                        key={idx}
                        className="w-10 h-10 bg-[#FFD700]/30 flex items-center justify-center rounded-full cursor-pointer"
                        initial={{ scale: 1.5 }} // start bigger for attention
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

                {/* Bachelor thesis icon */}
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

              {/* Floating book icon */}
              {/*<motion.img*/}
              {/*  src="icons/book.png"*/}
              {/*  alt="Book"*/}
              {/*  className={`absolute w-12 h-12 opacity-90 ${isLeft ? "left-[-20px]" : "right-[-20px]"} top-0`}*/}
              {/*  animate={{ y: [0, -10, 0] }}*/}
              {/*  transition={{ repeat: Infinity, duration: 2 + i }}*/}
              {/*  style={{ filter: "invert(100%)" }} // make it white*/}
              {/*/>*/}
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
              className="bg-[#1C2541] w-[96vw] md:w-[88vw] lg:w-[75vw] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col"
              style={{ height: "92vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end px-4 py-2 shrink-0">
                <button
                  className="text-white text-2xl font-bold leading-none"
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