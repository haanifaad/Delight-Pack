import React, { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import LoginScreen from "./components/LoginScreen";
import AccessDeniedScreen from "./components/AccessDeniedScreen";
import AdminPanel from "./components/AdminPanel";
import AeroWorkspace from "./components/AeroWorkspace";
import { User } from "./types";

const RECENTLY_BUILT_SOFTWARE_OWNER = "haanifaad123@gmail.com";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const checkSessionAndSecrets = async () => {
    try {
      // 1. Check current login status
      const statusResp = await fetch("/api/auth/status");
      if (statusResp.ok) {
        const statusData = await statusResp.json();
        if (statusData.loggedIn) {
          setUser(statusData.user);
        } else {
          setUser(null);
        }
      }

      // 2. Check if Google OAuth credentials are set up dynamically on the server
      const oAuthResp = await fetch("/api/auth/google/url");
      if (oAuthResp.ok) {
        const oAuthData = await oAuthResp.json();
        setIsGoogleConfigured(oAuthData.isConfigured === true);
      }
    } catch (e) {
      console.error("Session integrity checks failed on setup", e);
    } finally {
      setCheckingSession(false);
    }
  };

  useEffect(() => {
    checkSessionAndSecrets();

    // Setup an interval to check user allowlist status while logged in
    // (This ensures if the admin approves the request, the user's dashboard refreshes as soon as they are allowed)
    const checkInterval = setInterval(async () => {
      // Only poll when checked value is unauthorized to let approved requests in automatically
      if (user && !user.isAllowed) {
        try {
          const statusResp = await fetch("/api/auth/status");
          if (statusResp.ok) {
            const statusData = await statusResp.json();
            if (statusData.loggedIn && statusData.user.isAllowed) {
              setUser(statusData.user);
            }
          }
        } catch (err) {
          // Silent catch
        }
      }
    }, 4000);

    return () => clearInterval(checkInterval);
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setIsAdminPanelOpen(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // 1. Checking progress state on initial pageload
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-cyan-950/10 to-transparent blur-[100px]" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center animate-bounce">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white tracking-widest font-mono uppercase">Gatekeeper Active</h3>
            <p className="text-[10px] text-slate-500 font-mono">Verifying credentials and security allowlists...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. User is NOT logged in: show landing login gateway
  if (!user) {
    return (
      <LoginScreen
        onLoginSuccess={(userData) => setUser(userData)}
        isGoogleConfigured={isGoogleConfigured}
        adminEmail={RECENTLY_BUILT_SOFTWARE_OWNER}
      />
    );
  }

  // 3. User is logged in but NOT on the allowlist
  if (!user.isAllowed) {
    return (
      <AccessDeniedScreen
        user={user}
        onLogout={handleLogout}
        adminEmail={RECENTLY_BUILT_SOFTWARE_OWNER}
      />
    );
  }

  // 4. User is allowed and admin wants to see the control console
  if (user.isAdmin && isAdminPanelOpen) {
    return (
      <AdminPanel
        user={user}
        onBackToApp={() => setIsAdminPanelOpen(false)}
        adminEmail={RECENTLY_BUILT_SOFTWARE_OWNER}
      />
    );
  }

  // 5. User is allowed: show core secure application workspace
  return (
    <AeroWorkspace
      user={user}
      onLogout={handleLogout}
      onOpenAdmin={() => setIsAdminPanelOpen(true)}
    />
  );
}
