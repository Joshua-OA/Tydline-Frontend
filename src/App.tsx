import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./store/appContext";
import LandingPage from "./pages/landingpage";
import TrackingResults from "./pages/TrackingResults";
import AuthVerify from "./pages/AuthVerify";
import Onboarding from "./pages/Onboarding";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/track" element={<TrackingResults />} />
        <Route path="/auth/verify" element={<AuthVerify />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
