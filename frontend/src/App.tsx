import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { CandidateProfile } from './pages/CandidateProfile';
import { CandidateNotifications } from './pages/CandidateNotifications';
import { PanelDashboard } from './pages/PanelDashboard';
import { PanelCandidates } from './pages/PanelCandidates';
import { PanelSchedule } from './pages/PanelSchedule';
import { PanelNotifications } from './pages/PanelNotifications';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminCandidates } from './pages/AdminCandidates';
import { AdminPanels } from './pages/AdminPanels';
import { AdminRoles } from './pages/AdminRoles';
import { AdminSchedule } from './pages/AdminSchedule';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { AdminSettings } from './pages/AdminSettings';
import { Landing } from './pages/Landing';
export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate" element={<Navigate to="/candidate/dashboard" replace />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route
            path="/candidate/notifications"
            element={<CandidateNotifications />} />
          

          <Route path="/panel/dashboard" element={<PanelDashboard />} />
          <Route path="/panel" element={<Navigate to="/panel/dashboard" replace />} />
          <Route path="/panel/candidates" element={<PanelCandidates />} />
          <Route path="/panel/schedule" element={<PanelSchedule />} />
          <Route path="/panel/notifications" element={<PanelNotifications />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/candidates" element={<AdminCandidates />} />
          <Route path="/admin/panels" element={<AdminPanels />} />
          <Route path="/admin/roles" element={<AdminRoles />} />
          <Route path="/admin/schedule" element={<AdminSchedule />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>);

}