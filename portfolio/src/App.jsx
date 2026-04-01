import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Certificates from "./components/Certificates";

function App() {
  return (
    <div className="bg-[#0B132B] text-[#EAEAEA] min-h-screen">
      <Navbar />
      <Hero />
      <Projects />
      <Certificates />
    </div>
  );
}

export default App;