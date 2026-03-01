import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "../views/Home";
import Installation from "../views/Installation";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import GuestRoute from "../components/shared/GuestRoute";
import LabFullRoute from "../components/shared/LabFullRoute";
import Garden from "../views/Garden";
import Greenhouse from "../views/Greenhouse";
import Laboratory from "../views/Laboratory";
import Team from "../views/Team";
import TermsConditions from "../views/TermsConditions";
import Contact from "../views/Contact";
import SignIn from "../views/SignIn";
import SignUp from "../views/SignUp";
import VerifyEmail from "../views/VerifyEmail";
import Profile from "../views/Profile";
import Licensing from "../views/Licensing";
import AdminPanel from "../views/AdminPanel";
import Background from "../views/Background";
import FloraDetail from "../views/FloraDetail";
import FloraView from "../views/FloraView";
import LabFullUnlock from "../views/LabFullUnlock";
import ScrollToTop from "../components/layout/ScrollToTop";
import AccentColorOnRouteChange from "../components/shared/AccentColorOnRouteChange";
import ConsentModal, { getConsentGiven } from "../components/shared/ConsentModal";

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

function RouterContent() {
  const [consentGiven, setConsentGiven] = useState(() => getConsentGiven());
  const location = useLocation();
  const isTermsPage = location.pathname === "/terms";

  return (
    <>
      <ScrollToTop />
      <AccentColorOnRouteChange />
      {!consentGiven && !isTermsPage && (
        <ConsentModal onAccept={() => setConsentGiven(true)} />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/garden" element={<Garden />} />
        <Route path="/greenhouse" element={<Greenhouse />} />
        <Route path="/flora/:id" element={<FloraView />} />
        <Route path="/flora/:id/details" element={<FloraDetail />} />
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
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/licensing" element={<Licensing />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="/background" element={<Background />} />
      </Routes>
    </>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <ClearLabFullSessionOnLeave />
      <RouterContent />
    </BrowserRouter>
  );
}

