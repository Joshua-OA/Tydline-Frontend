import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./store/appContext";
import LandingPage from "./pages/landingpage";
import TrackingResults from "./pages/TrackingResults";
import AuthVerify from "./pages/AuthVerify";
import Onboarding from "./pages/Onboarding";
import Pricing from "./pages/Pricing";
import Solutions from "./pages/Solutions";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/dashboard";
import NoSubscription from "./pages/NoSubscription";
import PitchDeck from "./pages/PitchDeck";
import type { ReactNode } from "react";

/** Redirect authenticated users away from public/onboarding pages → dashboard */
function PublicRoute({ children }: { children: ReactNode }) {
  const { userId, subscriptionStatus, trackingEmail } = useApp();
  const isAuthenticated = !!userId && subscriptionStatus === "active" && !!trackingEmail;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

/** Redirect unauthenticated users away from the dashboard → home */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { userId } = useApp();
  return userId ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/track" element={<PublicRoute><TrackingResults /></PublicRoute>} />
        <Route path="/auth/verify" element={<AuthVerify />} />
        <Route path="/pricing" element={<PublicRoute><Pricing /></PublicRoute>} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/no-subscription" element={<NoSubscription />} />
        <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/pitch" element={<PitchDeck />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
