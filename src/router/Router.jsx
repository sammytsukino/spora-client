import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "../views/Home";
import Installation from "../views/Installation";
import ProtectedRoute from "../components/common/ProtectedRoute";
import GuestRoute from "../components/common/GuestRoute";
import LabFullRoute from "../components/common/LabFullRoute";
import Garden from "../views/Garden";
import Greenhouse from "../views/Greenhouse";
import Laboratory from "../views/Laboratory";
import Team from "../views/Team";
import TermsConditions from "../views/TermsConditions";
import Contact from "../views/Contact";
import SignIn from "../views/SignIn";
import SignUp from "../views/SignUp";
import Profile from "../views/Profile";
import Licensing from "../views/Licensing";
import AdminPanel from "../views/AdminPanel";
import Background from "../views/Background";
import FloraDetail from "../views/FloraDetail";
import LabFullUnlock from "../views/LabFullUnlock";
import ScrollToTop from "../components/ScrollToTop";

const LAB_FULL_SESSION_KEY = "spora_lab_full_session";

function ClearLabFullSessionOnLeave() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== "/laboratory/full" && typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(LAB_FULL_SESSION_KEY);
    }
  }, [location.pathname]);
  return null;
}

export default function Router() {
  return (
    <BrowserRouter>
      <ClearLabFullSessionOnLeave />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/garden" element={<Garden />} />
        <Route path="/greenhouse" element={<Greenhouse />} />
        <Route path="/flora/:id" element={<FloraDetail />} />
        <Route path="/grow" element={<LabFullUnlock />} />
        <Route path="/laboratory/full" element={<LabFullRoute><Installation fullLab /></LabFullRoute>} />
        <Route path="/laboratory" element={<ProtectedRoute><Installation /></ProtectedRoute>} />
        <Route path="/installation" element={<ProtectedRoute><Installation /></ProtectedRoute>} />
        <Route path="/team" element={<Team />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/research" element={<Navigate to="/terms" replace />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<GuestRoute><SignIn /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/licensing" element={<Licensing />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="/background" element={<Background />} />
      </Routes>
    </BrowserRouter>
  );
}

