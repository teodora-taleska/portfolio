export default function ExperienceSection() {
  const experiences = [
    {
      role: "Mobile Application Developer",
      company: "Digitalni razvoj in programerske rešitve Tadej Hiti s.p.",
      location: "Ljubljana, Slovenia",
      duration: "Dec 2023 - Sep 2024",
      details: [
        "Developed cross-platform mobile applications in JavaScript (React Native)",
        "Implemented backend logic and CRUD operations on a relational database",
        "Queried and validated data using SQL and PostgreSQL",
      ],
    },
  ];

  return (
    <section id="experience" className="py-20 px-10 bg-[#1C2541] text-white">
      <h3 className="text-4xl font-bold mb-10 text-[#D4AF37]">EXPERIENCE</h3>
      <div className="space-y-6">
        {experiences.map((exp, i) => (
          <div key={i} className="bg-[#121826] p-6 rounded-xl shadow-lg">
            <h4 className="text-xl font-semibold">{exp.role}</h4>
            <p className="text-white/80">{exp.company} · {exp.location}</p>
            <p className="text-white/70 mb-2">{exp.duration}</p>
            <ul className="list-disc list-inside text-white/70">
              {exp.details.map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}