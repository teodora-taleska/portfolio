export default function LanguagesSection() {
  const languages = [
    { name: "English", level: "C1" },
    { name: "Slovenian", level: "B1/A2" },
  ];

  return (
    <section id="languages" className="py-20 px-10 bg-[#1C2541] text-white">
      <h3 className="text-4xl font-bold mb-6 text-[#D4AF37]">LANGUAGES</h3>
      <ul className="space-y-4">
        {languages.map((l, i) => (
          <li key={i}>
            <span className="font-semibold">{l.name}</span> – {l.level}
          </li>
        ))}
      </ul>
    </section>
  );
}