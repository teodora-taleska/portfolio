import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";

if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
