import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { WorkersPage } from './pages/WorkersPage';
import { WorkerDetailPage } from './pages/WorkerDetailPage';
import { ModulesPage } from './pages/ModulesPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { CompliancePage } from './pages/CompliancePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { PublicVerificationPage } from './pages/PublicVerificationPage';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen bg-[#F5F8F7]">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Verification Page (No Auth / No Sidebar required) */}
          <Route path="/verify/:id" element={<PublicVerificationPage />} />

          {/* Admin Dashboard Protected Layout */}
          <Route
            path="/"
            element={
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            }
          />
          <Route
            path="/workers"
            element={
              <AdminLayout>
                <WorkersPage />
              </AdminLayout>
            }
          />
          <Route
            path="/workers/:id"
            element={
              <AdminLayout>
                <WorkerDetailPage />
              </AdminLayout>
            }
          />
          <Route
            path="/modules"
            element={
              <AdminLayout>
                <ModulesPage />
              </AdminLayout>
            }
          />
          <Route
            path="/certificates"
            element={
              <AdminLayout>
                <CertificatesPage />
              </AdminLayout>
            }
          />
          <Route
            path="/compliance"
            element={
              <AdminLayout>
                <CompliancePage />
              </AdminLayout>
            }
          />
          <Route
            path="/analytics"
            element={
              <AdminLayout>
                <AnalyticsPage />
              </AdminLayout>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <AdminLayout>
                <AuditLogsPage />
              </AdminLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
