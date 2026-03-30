import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

// Page Imports
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import PatientDashboard from "./pages/PatientDashboard";
import PatientProfile from "./pages/PatientProfile";
import TestInterface from "./pages/TestInterface";
import TestResults from "./pages/TestResults";
import SymptomDiary from "./pages/SymptomDiary";
import Chat from "./pages/Chat";
import Recommendations from "./pages/Recommendations";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientAnalytics from "./pages/PatientAnalytics";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/profile" element={<PatientProfile />} />
          <Route path="/test" element={<TestInterface />} />
          <Route path="/test/results" element={<TestResults />} />
          <Route path="/diary" element={<SymptomDiary />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/analytics" element={<PatientAnalytics />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;