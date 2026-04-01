import { motion } from "framer-motion";

const projects = [
  {
    title: "Health Analytics System",
    desc: "End-to-end ML system with API and database",
  },
  {
    title: "Dataset Analyzer",
    desc: "Automatic data insights tool",
  },
  {
    title: "Neural Network Experiment",
    desc: "Brain-inspired model exploration",
  },
];


export default function Projects() {
  return (
    <section id="projects" className="py-20 px-6">
      <h2 className="text-3xl text-center mb-10">Projects</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <motion.div
            key={i}
            className="bg-[#1C2541]/40 p-6 rounded-2xl border border-[#D4AF37]/20 backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl">{p.title}</h3>
            <p className="text-gray-300 text-sm mt-2">
              {p.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

