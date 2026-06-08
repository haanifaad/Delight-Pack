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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/careers" element={<PlaceholderPage title="Careers Hub" description="Join the Team. Explore Factory Floor, Logistics, & Internships" />} />
      <Route path="/contact" element={<PlaceholderPage title="Contact & Inquiries" description="Direct Dubai Workspace Location & WhatsApp Integration" />} />

      <Route path="/" element={<HomePage />} />
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
