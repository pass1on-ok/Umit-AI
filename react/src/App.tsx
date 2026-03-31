import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

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
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />

          {/* Patient */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['PATIENT']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute roles={['PATIENT', 'ADMIN']}>
              <PatientProfile />
            </ProtectedRoute>
          } />
          <Route path="/test" element={
            <ProtectedRoute roles={['PATIENT', 'DOCTOR', 'PSYCHOLOGIST', 'ADMIN']}>
              <TestInterface />
            </ProtectedRoute>
          } />
          <Route path="/test/results" element={
            <ProtectedRoute roles={['PATIENT', 'DOCTOR', 'PSYCHOLOGIST', 'ADMIN']}>
              <TestResults />
            </ProtectedRoute>
          } />
          <Route path="/diary" element={
            <ProtectedRoute roles={['PATIENT', 'DOCTOR', 'PSYCHOLOGIST', 'ADMIN']}>
              <SymptomDiary />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/recommendations" element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          } />

          {/* Doctor / Psychologist */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute roles={['DOCTOR', 'PSYCHOLOGIST', 'ADMIN']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor/analytics" element={
            <ProtectedRoute roles={['DOCTOR', 'PSYCHOLOGIST', 'ADMIN']}>
              <PatientAnalytics />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
