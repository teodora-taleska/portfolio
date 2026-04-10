import { useRef } from "react";
import CodeToAppAnimation from "./CodeToAppAnimation.jsx";

export default function ExperienceSection() {
  const sectionRef = useRef(null);

  const experiences = [
    {
      role: "Full Stack JavaScript Developer",
      company: "Digitalni razvoj in programerske rešitve Tadej Hiti s.p.",
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
 {/* my-32: margin top and margin bottom 8 rem each; py-> top bottom, px; padding left right...*/}
   return (
    <section
      ref={sectionRef}
      id="experience"
      className="flex gap-12 py-20 px-10 bg-[#1C2541] text-white"
    >
      {/* Left side: Experience text */}
      <div className="flex-1">
        <h3 className="text-4xl font-bold mb-10 text-[#D4AF37]">EXPERIENCE</h3>
        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <div key={i} className="bg-[#121826] p-6 rounded-xl shadow-lg">
              <h4 className="text-xl font-semibold">{exp.role}</h4>
              <p className="text-white/80">
                {exp.company} · {exp.location}
              </p>
              <p className="text-white/70 mb-2">{exp.duration}</p>
              <ul className="list-disc list-inside text-white/70">
                {exp.details.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </div>
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