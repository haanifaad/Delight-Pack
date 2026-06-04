import React, { useState } from "react";
import { Shield, Lock, AlertTriangle, UserCheck, Eye, Compass, Layout } from "lucide-react";
import { User } from "../types";

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  isGoogleConfigured: boolean;
  adminEmail: string;
}

export default function LoginScreen({
  onLoginSuccess,
  isGoogleConfigured,
  adminEmail,
}: LoginScreenProps) {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trigger Google OAuth Connection Popup (For Real Login)
  const handleGoogleRealLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/auth/google/url?origin=${encodeURIComponent(window.location.origin)}`);
      if (!resp.ok) {
        throw new Error("Unable to retrieve google authorization redirect details.");
      }
      const data = await resp.json();
      if (!data.isConfigured || !data.url) {
        throw new Error(data.error || "Google client configuration missing on the server.");
      }

      // Open Google Auth directly in standard popup
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const popup = window.open(
        data.url,
        "google_oauth_popup",
        `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes`
      );

      if (!popup) {
        throw new Error("Popup blocker active. Please allow popups to sign in with Google.");
      }

      // Safe cross-origin postMessage listener
      const catchAuthMessage = async (e: MessageEvent) => {
        const origin = e.origin;
        if (!origin.endsWith(".run.app") && !origin.includes("localhost")) {
          return;
        }

        if (e.data?.type === "OAUTH_AUTH_SUCCESS") {
          window.removeEventListener("message", catchAuthMessage);
          // Query session status and log in
          const statusResp = await fetch("/api/auth/status");
          if (statusResp.ok) {
            const statusData = await statusResp.json();
            if (statusData.loggedIn) {
              onLoginSuccess(statusData.user);
            } else {
              setError("Authentication succeeded but failed to retrieve active session.");
            }
          }
          setLoading(false);
        }
      };

      window.addEventListener("message", catchAuthMessage);
    } catch (err: any) {
      setError(err.message || "Something went wrong during signing in.");
      setLoading(false);
    }
  };

  // Trigger Local Simulated Account selection (For quick preview testing)
  const handleSimulatedLogin = async (email: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
        }),
      });

      if (!resp.ok) {
        throw new Error("Simulated sign-in failed.");
      }

      const data = await resp.json();
      if (data.success) {
        onLoginSuccess(data.user);
      } else {
        throw new Error("Demo login returned unsuccessful response.");
      }
    } catch (err: any) {
      setError(err.message || "Simulated sign-in failed.");
    } finally {
      setLoading(false);
      setShowDemoModal(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-900/10 blur-[120px] mix-blend-screen animate-glow" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-950/20 blur-[120px] mix-blend-screen animate-glow" />

      <div className="w-full max-w-md p-8 relative z-10">
        {/* Logo and Greeting */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-900/30 p-3.5 mb-5 border border-cyan-400/20">
            <Shield className="w-8 h-8 text-white animate-pulse" id="shield-logo" />
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            DP AUTHENTICATION
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-sans">
            Secure Google Accounts Gateway & Identity Verifier
          </p>
        </div>

        {/* Form panel */}
        <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl relative">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <span className="flex items-center gap-2 text-xs font-mono font-medium tracking-wide text-cyan-400">
              <Lock className="w-3.5 h-3.5" />
              AUTHENTICATION SUITE
            </span>
            <span className="text-xs text-slate-500 font-mono">v1.1.0</span>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-950/40 border border-red-800/50 text-red-200 text-xs flex gap-2.5 items-start">
              <span className="bg-red-900 text-red-100 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">FAIL</span>
              <p className="mt-0.5">{error}</p>
            </div>
          )}

          {/* Sandbox Demo Notification Banner */}
          {!isGoogleConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200/95 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Running in Simulation Mode</span>
              </div>
              <p className="leading-relaxed text-slate-400 text-[11px]">
                Google API keys are not detected in settings. We created a fully interactive 
                simulated environment so you can test whitelist authorization and request queues immediately!
              </p>
            </div>
          )}

          {/* Real Google Login Action */}
          {isGoogleConfigured ? (
            <button
              id="google-real-btn"
              onClick={handleGoogleRealLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-medium py-3 px-4 rounded-xl transition duration-200 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51y"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.41-4.91 3.41-8.55z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.24 14.45A7.16 7.16 0 0 1 4.8 12c0-.85.15-1.68.44-2.45L1.39 6.56C.5 8.2.01 10.05.01 12c0 1.95.49 3.8 1.38 5.44l3.85-2.99z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.34 0-5.86-2.25-6.76-5.26L1.39 16.05C3.37 19.96 7.35 23 12 23z"
                  />
                </svg>
              )}
              <span>Sign in with Google Account</span>
            </button>
          ) : (
            <div className="space-y-3">
              <button
                id="google-demo-btn"
                onClick={() => setShowDemoModal(true)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-xl transition duration-200 shadow-md disabled:opacity-50"
              >
                <Compass className="w-5 h-5 mr-1" />
                Launch Google Login Simulation
              </button>
              
              <p className="text-center text-[10px] text-slate-500">
                You can configure your real OAuth keys in Settings at any time.
              </p>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-800 text-[11px] text-slate-400 space-y-1 text-center">
            <p>Access policies are enforced strictly in real-time.</p>
            <p>Admin Email: <span className="text-cyan-400 font-mono text-[10px]">{adminEmail}</span></p>
          </div>
        </div>
      </div>

      {/* Account Selector Simulation Overlay modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold font-display text-white mb-2 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              Simulated Google Accounts
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select any persona to test the Access Gatekeeper. You can experience the administrator workspace, whitelisted access, or the deny queue.
            </p>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {/* Persona 1: Admin */}
              <button
                onClick={() => handleSimulatedLogin(adminEmail, "Hanif Aad (Admin)")}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition flex items-center gap-3"
              >
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(adminEmail)}`}
                  alt="Admin Profile"
                  className="w-9 h-9 rounded-full bg-cyan-900"
                />
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    Hanif Aad
                    <span className="text-[9px] px-1.5 py-0.2 bg-cyan-950 text-cyan-400 rounded-full font-mono border border-cyan-500/20 font-medium">ADMIN</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{adminEmail}</div>
                </div>
              </button>

              {/* Persona 2: Whitelisted Partner */}
              <button
                onClick={() => handleSimulatedLogin("partner@company.com", "Alex Whitelisted")}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition flex items-center gap-3"
              >
                <img
                  src="https://api.dicebear.com/7.x/initials/svg?seed=partner@company.com"
                  alt="Partner Profile"
                  className="w-9 h-9 rounded-full bg-slate-700"
                />
                <div>
                  <div className="text-xs font-semibold text-white">Alex Whitelisted (Member)</div>
                  <div className="text-[10px] text-slate-400">partner@company.com</div>
                </div>
              </button>

              {/* Persona 3: New Guest (Denied Entry) */}
              <button
                onClick={() => handleSimulatedLogin("guest@gmail.com", "Sarah Stranger")}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition flex items-center gap-3"
              >
                <img
                  src="https://api.dicebear.com/7.x/initials/svg?seed=guest@gmail.com"
                  alt="Guest Profile"
                  className="w-9 h-9 rounded-full bg-amber-900"
                />
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    Sarah Stranger
                    <span className="text-[9px] px-1.5 py-0.2 bg-red-950 text-red-400 rounded-full font-mono border border-red-500/20 font-medium">NEW GUEST</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">guest@gmail.com</div>
                </div>
              </button>
            </div>

            {/* Custom Input Field to test ANY email */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2.5">
              <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                Or Type Any Custom Google Identity
              </label>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="test-email@example.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Name (Optional)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => {
                    if (customEmail) {
                      handleSimulatedLogin(customEmail, customName || customEmail.split("@")[0]);
                    }
                  }}
                  disabled={!customEmail}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium text-xs rounded-lg transition"
                >
                  Verify Custom Account
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowDemoModal(false)}
              className="mt-4 w-full text-center py-2 text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
