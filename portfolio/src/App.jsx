import Home from "./pages/Home";

if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual"; // disable browser auto-scroll
  window.scrollTo(0, 0); // force scroll to top
}

function App() {
  return <Home />;
}

export default App;