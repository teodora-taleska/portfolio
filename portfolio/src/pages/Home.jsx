import Hero from "../components/Hero";
import BlogSection from "../components/BlogSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import LanguagesSection from "../components/LanguagesSection";
import Navbar from "../components/Navbar.jsx";
import Projects from "../components/Projects.jsx";
import Certificates from "../components/Certificates.jsx";
import ContactForm from "../components/ContactForm.jsx";

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

export default function Home() {
  return (
      <div className="bg-[#0B132B] text-[#EAEAEA] min-h-screen">
          <Navbar/>
          <Hero/>
          <Projects/>
          <ExperienceSection/>
          {/*<LanguagesSection/>*/}
          <BlogSection blogs={blogs}/>
          <Certificates/>
          <EducationSection/>
          <ContactForm/>
      </div>
  );
}