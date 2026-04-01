export default function EducationSection() {
  const education = [
    {
      degree: "Master's degree, Data Science",
      school: "University of Ljubljana, Faculty of Computer and Information Science",
      duration: "Oct 2024 – Oct 2026",
    },
    {
      degree: "Master's degree, Artificial Intelligence",
      school: "KU Leuven",
      duration: "Sep 2025 – Jan 2026",
    },
    {
      degree: "Bachelor's degree, Computer Science",
      school: "UP FAMNIT",
      duration: "2020 – 2024",
    },
  ];

  return (
    <section id="education" className="py-20 px-10 bg-[#121826] text-white">
      <h3 className="text-4xl font-bold mb-10 text-[#D4AF37]">EDUCATION</h3>
      <div className="space-y-6">
        {education.map((edu, i) => (
          <div key={i} className="bg-[#1C2541] p-6 rounded-xl shadow-lg">
            <h4 className="text-xl font-semibold">{edu.degree}</h4>
            <p className="text-white/80">{edu.school}</p>
            <p className="text-white/70">{edu.duration}</p>
          </div>
        ))}
      </div>
    </section>
  );
}