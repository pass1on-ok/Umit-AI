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
import ProtectedRoute from "./pages/ProtectedRoute";
import RoleGuard from "./pages/RoleGuard";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard allowedRoles={['PATIENT', 'DOCTOR', 'ADMIN']} />}>
              <Route path="/dashboard" element={<PatientDashboard />} />
              <Route path="/profile" element={<PatientProfile />} />
              <Route path="/test" element={<TestInterface />} />
              <Route path="/test/results" element={<TestResults />} />
              <Route path="/diary" element={<SymptomDiary />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/recommendations" element={<Recommendations />} />
            </Route>
            </Route>
            <Route element={<RoleGuard allowedRoles={['DOCTOR', 'ADMIN']} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/analytics" element={<PatientAnalytics />} />
            </Route>
            <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;