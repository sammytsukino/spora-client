import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../views/home";
import Garden from "../views/Garden";
import Greenhouse from "../views/Greenhouse";
import Laboratory from "../views/Laboratory";
import Team from "../views/Team";
import Research from "../views/Research";
import Contact from "../views/Contact";
import SignIn from "../views/SignIn";
import SignUp from "../views/SignUp";
import Background from "../views/Background";
import ScrollToTop from "../components/scroll-to-top";

export default function Router() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/garden" element={<Garden />} />
        <Route path="/greenhouse" element={<Greenhouse />} />
        <Route path="/laboratory" element={<Laboratory />} />
        <Route path="/team" element={<Team />} />
        <Route path="/research" element={<Research />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/background" element={<Background />} />
      </Routes>
    </BrowserRouter>
  );
}

