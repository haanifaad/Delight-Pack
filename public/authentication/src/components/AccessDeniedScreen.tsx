import React, { useState } from "react";
import { AlertCircle, LogOut, ArrowRight, ShieldCheck, Mail, Send } from "lucide-react";
import { User } from "../types";

interface AccessDeniedScreenProps {
  user: User;
  onLogout: () => void;
  adminEmail: string;
}

export default function AccessDeniedScreen({
  user,
  onLogout,
  adminEmail,
}: AccessDeniedScreenProps) {
  const [requestReason, setRequestReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const resp = await fetch("/api/auth/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          picture: user.picture,
          reason: requestReason || "Please approve my access to the software suite.",
        }),
      });

      if (!resp.ok) {
        throw new Error("Unable to submit request.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to deliver access request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 text-slate-100 p-4 font-sans">
      {/* Glow */}
      <div className="absolute top-[30%] left-[30%] w-[50%] h-[50%] rounded-full bg-red-950/10 blur-[120px] mix-blend-screen animate-glow" />

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative z-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-red-950/40 via-red-900/10 to-transparent p-6 border-b border-red-900/20 flex gap-4 items-center">
          <div className="w-12 h-12 rounded-xl bg-red-900/30 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-white">ACCESS BLOCKED</h2>
            <p className="text-slate-400 text-xs">Security Identity Verification Failed</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">
              Your Google Account is not authorized to edit or access the protected software workspace. 
              Only emails pre-approved by the software owner can enter this system.
            </p>
          </div>

          {/* User Badge */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.picture}
                alt={user.name}
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700"
              />
              <div>
                <h4 className="text-xs font-semibold text-white">{user.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
              </div>
            </div>
            <span className="text-[9px] px-2 py-0.5 bg-red-950 text-red-400 rounded-full font-mono border border-red-500/20">
              UNAUTHORIZED
            </span>
          </div>

          {submitted ? (
            <div className="p-5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
                <span>Access Request Logged Live</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Your request has been placed in the administrator&apos;s active approval list. 
                Keep this window open or come back later — access is updated instantly upon approval by the owner!
              </p>
              <div className="pt-2 text-[10px] text-cyan-500">
                Target Admin: {adminEmail}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitRequest} className="space-y-4 pt-2 border-t border-slate-800/60">
              <div className="space-y-2">
                <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                  Submit access request to owner
                </label>
                <textarea
                  placeholder="Hello! I need access to review your software. Please approve my Google account..."
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="w-full h-24 bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-cyan-500/50 resize-none placeholder:text-slate-600"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs rounded-xl transition flex items-center justify-center gap-2 border border-slate-750"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Approval Request</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-800 flex gap-3 items-center justify-between">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition group"
            >
              <LogOut className="w-4 h-4 group-hover:translate-x-[-2px] transition" />
              <span>Sign Out Account</span>
            </button>

            <span className="text-[10px] font-mono text-slate-500">
              Admin: {adminEmail}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
