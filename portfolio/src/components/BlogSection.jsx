
const blogs = [
  {
    title: "Understanding Transformers",
    body: "A deep dive into transformer architectures and how they process sequences efficiently...",
    date: "2026-03-25",
    keywords: ["AI", "Deep Learning", "Transformers"],
    link: "/blogs/transformers",
  },
  {
    title: "Data Pipeline Experiments",
    body: "Building automated pipelines for cleaning and analyzing complex datasets using Python...",
    date: "2026-03-20",
    keywords: ["Data", "Pipelines", "Python"],
    link: "/blogs/pipelines",
  },
];

export default function BlogSection({ blogs }) {
  return (
    <section id="blogs" className="py-20 px-10 bg-[#121826]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        <div className="md:w-1/3">
          <h3 className="text-4xl text-[#D4AF37] font-bold mb-4">BLOGS</h3>
          <p className="text-white/80">
            Sharing experiments, insights, and reports about AI, deep learning, data pipelines, and all concepts I study and implement.
          </p>
        </div>

        <div className="md:w-2/3 grid grid-cols-1 gap-6">
          {blogs.map((blog, index) => (
            <a
              key={index}
              href={blog.link}
              className="block p-6 bg-[#1C2541] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <h4 className="text-xl font-semibold text-[#5BC0BE]">{blog.title}</h4>
              <p className="text-gray-300 text-sm mb-2">{blog.date}</p>
              <p className="text-white/70 truncate">{blog.body}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {blog.keywords.map((k, i) => (
                  <span key={i} className="text-xs text-[#FFD700] bg-white/10 px-2 py-1 rounded-full">
                    {k}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}