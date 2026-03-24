import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./store/appContext";
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

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/track" element={<TrackingResults />} />
        <Route path="/auth/verify" element={<AuthVerify />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/no-subscription" element={<NoSubscription />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/pitch" element={<PitchDeck />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
