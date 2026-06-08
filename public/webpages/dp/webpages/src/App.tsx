import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';
import { GuestRoute } from '@/src/components/GuestRoute';
import { LoginPage } from '@/src/pages/LoginPage';
import { RegisterPage } from '@/src/pages/RegisterPage';
import { ResetPasswordPage } from '@/src/pages/ResetPasswordPage';
import { VerifyEmailPage } from '@/src/pages/VerifyEmailPage';
import { DashboardPage } from '@/src/pages/DashboardPage';
import { PlaceholderPage } from '@/src/pages/PlaceholderPage';
import { HomePage } from '@/src/pages/HomePage';
import { CustomerPortalPage } from '@/src/pages/CustomerPortalPage';
import { CareersPage } from '@/src/pages/CareersPage';

import ContactApp from './App(2)';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/portal" element={<CustomerPortalPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/contact" element={<ContactApp />} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <PlaceholderPage
              title="Active Orders"
              description="Your active order list will appear here."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <PlaceholderPage
              title="Invoice History"
              description="Past and current invoices will appear here."
            />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
