import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Conversations from "./pages/Conversations";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import styles from "./styles/loading.module.css";

function ProtectedRoute({ children }) {
  const { session } = useAuth();
  if (session === undefined) {
    return (
      <div className={styles.center}>
        <span className={styles.spin} />
      </div>
    );
  }
  return session ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { session } = useAuth();
  if (session === undefined) return null;
  return session ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />

          {/* Protected */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"     element={<Dashboard />} />
            <Route path="leads"         element={<Leads />} />
            <Route path="conversations" element={<Conversations />} />
            <Route path="orders"        element={<Orders />} />
            <Route path="settings"      element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
