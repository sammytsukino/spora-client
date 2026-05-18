import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "../views/Home";
import Installation from "../views/Installation";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import GuestRoute from "../components/shared/GuestRoute";
import LabFullRoute from "../components/shared/LabFullRoute";
import Garden from "../views/Garden";
import Greenhouse from "../views/Greenhouse";
import Team from "../views/Team";
import TermsConditions from "../views/TermsConditions";
import Contact from "../views/Contact";
import SignIn from "../views/SignIn";
import SignUp from "../views/SignUp";
import Profile from "../views/Profile";
import PublicProfile from "../views/PublicProfile";
import ProfileFollowers from "../views/ProfileFollowers";
import ProfileFollowing from "../views/ProfileFollowing";
import Licensing from "../views/Licensing";
import AdminPanel from "../views/AdminPanel";
import Background from "../views/Background";
import FloraDetail from "../views/FloraDetail";
import FloraView from "../views/FloraView";
import LabFullUnlock from "../views/LabFullUnlock";
import ScrollToTop from "../components/layout/ScrollToTop";
import AccentColorOnRouteChange from "../components/shared/AccentColorOnRouteChange";
import ConsentModal, { getConsentGiven } from "../components/shared/ConsentModal";
import DesktopExperienceBanner from "../components/shared/DesktopExperienceBanner";
import SmoothScroll from "../components/shared/SmoothScroll";
import { ROUTES } from "../constants/routes";

const LAB_FULL_SESSION_KEY = "spora_lab_full_session";
const DEFAULT_TITLE = "S P 0 R A";

function getRouteTitle(pathname) {
  if (pathname === ROUTES.HOME || pathname === ROUTES.HOME_LEGACY) return "S P 0 R A";
  if (pathname === ROUTES.GARDEN) return "S P 0 R A - Garden";
  if (pathname.startsWith(ROUTES.GREENHOUSE)) return "S P 0 R A - Greenhouse";
  if (pathname.startsWith(ROUTES.FLORA)) return "S P 0 R A - Flora";
  if (pathname === ROUTES.LABORATORY || pathname === ROUTES.INSTALLATION) return "S P 0 R A - Laboratory";
  if (pathname === ROUTES.LABORATORY_FULL || pathname === ROUTES.SHW) return "S P 0 R A - Full Laboratory";
  if (pathname === ROUTES.TEAM) return "S P 0 R A - Team";
  if (pathname === ROUTES.TERMS || pathname === ROUTES.RESEARCH) return "S P 0 R A - Terms & Conditions";
  if (pathname === ROUTES.CONTACT) return "S P 0 R A - Contact";
  if (pathname === ROUTES.SIGN_IN) return "S P 0 R A - Sign In";
  if (pathname === ROUTES.SIGN_UP) return "S P 0 R A - Sign Up";
  if (pathname === ROUTES.PROFILE) return "S P 0 R A - My Profile";
  if (pathname.startsWith(`${ROUTES.PROFILE}/`) && pathname.endsWith("/followers")) {
    return "S P 0 R A - Followers";
  }
  if (pathname.startsWith(`${ROUTES.PROFILE}/`) && pathname.endsWith("/following")) {
    return "S P 0 R A - Following";
  }
  if (pathname.startsWith(`${ROUTES.PROFILE}/`)) return "S P 0 R A - Profile";
  if (pathname === ROUTES.LICENSING) return "S P 0 R A - Licensing";
  if (pathname === ROUTES.ADMIN) return "S P 0 R A - Admin";
  if (pathname === ROUTES.BACKGROUND) return "S P 0 R A - Background";
  return DEFAULT_TITLE;
}

function ClearLabFullSessionOnLeave() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== ROUTES.LABORATORY_FULL && typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(LAB_FULL_SESSION_KEY);
    }
  }, [location.pathname]);
  return null;
}

function RouterContent() {
  const [consentGiven, setConsentGiven] = useState(() => getConsentGiven());
  const location = useLocation();
  const isTermsPage = location.pathname === ROUTES.TERMS;

  useEffect(() => {
    document.title = getRouteTitle(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-spora-primary focus:px-4 focus:py-2 focus:text-spora-primary-light"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <SmoothScroll />
      <AccentColorOnRouteChange />
      <DesktopExperienceBanner />
      {!consentGiven && !isTermsPage && (
        <ConsentModal onAccept={() => setConsentGiven(true)} />
      )}
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.HOME_LEGACY} element={<Navigate to={ROUTES.HOME} replace />} />
        <Route path={ROUTES.GARDEN} element={<Garden />} />
        <Route path={ROUTES.GREENHOUSE} element={<Greenhouse />} />
        <Route path={`${ROUTES.FLORA}/:id`} element={<FloraView />} />
        <Route path={`${ROUTES.FLORA}/:id/details`} element={<FloraDetail />} />
        <Route path={ROUTES.SHW} element={<LabFullUnlock />} />
        <Route path={ROUTES.LABORATORY_FULL} element={<LabFullRoute><Installation fullLab /></LabFullRoute>} />
        <Route path={ROUTES.LABORATORY} element={<ProtectedRoute><Installation /></ProtectedRoute>} />
        <Route path={ROUTES.INSTALLATION} element={<Navigate to={ROUTES.LABORATORY} replace />} />
        <Route path={ROUTES.TEAM} element={<Team />} />
        <Route path={ROUTES.TERMS} element={<TermsConditions />} />
        <Route path={ROUTES.RESEARCH} element={<Navigate to={ROUTES.TERMS} replace />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.SIGN_IN} element={<GuestRoute><SignIn /></GuestRoute>} />
        <Route path={ROUTES.SIGN_UP} element={<GuestRoute><SignUp /></GuestRoute>} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={`${ROUTES.PROFILE}/:username/followers`} element={<ProfileFollowers />} />
        <Route path={`${ROUTES.PROFILE}/:username/following`} element={<ProfileFollowing />} />
        <Route path={`${ROUTES.PROFILE}/:username`} element={<PublicProfile />} />
        <Route path={ROUTES.LICENSING} element={<Licensing />} />
        <Route path={ROUTES.ADMIN} element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path={ROUTES.BACKGROUND} element={<Background />} />
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

