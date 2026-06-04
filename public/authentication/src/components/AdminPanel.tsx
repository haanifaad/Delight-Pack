import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldAlert,
  History,
  Settings,
  Plus,
  Trash2,
  Check,
  X,
  Mail,
  Copy,
  Clock,
  RefreshCw,
  Search,
  Key,
} from "lucide-react";
import { AdminData, AccessRequest, AuditLog, User } from "../types";

interface AdminPanelProps {
  user: User;
  onBackToApp: () => void;
  adminEmail: string;
}

export default function AdminPanel({
  user,
  onBackToApp,
  adminEmail,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"whitelist" | "requests" | "logs" | "setup">("whitelist");
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [addUserRole, setAddUserRole] = useState<"Admin" | "User">("User");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/admin/data");
      if (!resp.ok) {
        throw new Error("Unable to retrieve security credentials/whitelist listings.");
      }
      const data = await resp.json();
      setAdminData(data);
    } catch (err: any) {
      setError(err.message || "Failed to download admin datasets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Add Email to Whitelist
  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setError(null);
    setSuccessMsg(null);
    try {
      // Admins are prohibited from granting high privilege on form add
      const finalizedRole = user.role === "Admin" ? "User" : addUserRole;
      const resp = await fetch("/api/admin/allowlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, role: finalizedRole }),
      });

      if (!resp.ok) {
        const d = await resp.json();
        throw new Error(d.error || "Failed to add email.");
      }

      setNewEmail("");
      setSuccessMsg(`"${newEmail}" authorized in list as ${finalizedRole}!`);
      fetchAdminData();
    } catch (err: any) {
      setError(err.message || "Could not whitelist this email.");
    }
  };

  // Remove Email from Whitelist
  const handleRemoveEmail = async (email: string) => {
    setError(null);
    setSuccessMsg(null);
    try {
      const resp = await fetch("/api/admin/allowlist/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!resp.ok) {
        const d = await resp.json();
        throw new Error(d.error || "Failed to revoke access.");
      }

      setSuccessMsg(`Revoked access for "${email}"!`);
      fetchAdminData();
    } catch (err: any) {
      setError(err.message || "Failed to revoke access.");
    }
  };

  // Direct Role Change and Access Control
  const handleSetRole = async (email: string, role: "Developer" | "Admin" | "User" | "Denied") => {
    setError(null);
    setSuccessMsg(null);
    try {
      const resp = await fetch("/api/admin/user/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (!resp.ok) {
         const d = await resp.json();
         throw new Error(d.error || "Failed to assign role.");
      }

      setSuccessMsg(`Successfully changed status for "${email}" to: ${role === "Denied" ? "Access Denied" : role}`);
      fetchAdminData();
    } catch (err: any) {
      setError(err.message || "Failed to update role level.");
    }
  };

  // Approve Pending Access Request
  const handleApproveRequest = async (email: string, role: "Admin" | "User" = "User") => {
    setError(null);
    setSuccessMsg(null);
    try {
      const resp = await fetch("/api/admin/requests/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (!resp.ok) {
        const d = await resp.json();
        throw new Error(d.error || "Approval processing failed.");
      }

      setSuccessMsg(`Approved and whitelisted "${email}" as ${role}!`);
      fetchAdminData();
    } catch (err: any) {
      setError(err.message || "Failed to approve request.");
    }
  };

  // Deny / Decline Pending Request
  const handleDenyRequest = async (email: string) => {
    setError(null);
    setSuccessMsg(null);
    try {
      const resp = await fetch("/api/admin/requests/deny", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!resp.ok) {
        throw new Error("Decline processing failed.");
      }

      setSuccessMsg(`Access denied and request archived for "${email}".`);
      fetchAdminData();
    } catch (err: any) {
      setError(err.message || "Failed to decline request.");
    }
  };

  // Clear Audit Logs
  const handleClearLogs = async () => {
    setError(null);
    try {
      const resp = await fetch("/api/admin/requests/clear-logs", { method: "POST" });
      if (resp.ok) {
        setSuccessMsg("Audit trails cleared.");
        fetchAdminData();
      }
    } catch (err) {
      setError("Failed to purge log records.");
    }
  };

  if (loading && !adminData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-slate-400 text-xs font-mono">Loading Identity Systems datasets...</p>
      </div>
    );
  }

  const allowedEmails = adminData?.allowedEmails || [];
  const accessRequests = adminData?.accessRequests || [];
  const logs = adminData?.logs || [];
  const config = adminData?.config;

  // Filter lists based on search
  const filteredAllowed = allowedEmails.filter((e) =>
    e.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const pendingRequests = accessRequests.filter((r) => r.status === "pending");

  // Dynamic values based on deployment vs sandbox
  const devRedirectUri = config?.APP_URL ? `${config.APP_URL}/auth/callback` : `${window.location.origin}/auth/callback`;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded">
              SECURITY CONTROL TOWER
            </span>
            <h1 className="text-2xl font-bold font-display text-white mt-1.5 flex items-center gap-2">
              Identity Management Console
            </h1>
            <p className="text-xs text-slate-400">
              Logged in: <span className="font-mono text-slate-300 font-medium">{adminEmail}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
              title="Reload Status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onBackToApp}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs rounded-lg shadow transition"
            >
              Enter Core Software Workspace
            </button>
          </div>
        </div>

        {/* Status Messaging Panels */}
        {error && (
          <div className="p-3 bg-red-950/30 border border-red-900/40 text-red-200 text-xs rounded-xl">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 text-emerald-200 text-xs rounded-xl flex items-center justify-between">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="text-[10px] uppercase hover:underline">Dismiss</button>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 scrollbar-none overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("whitelist")}
            className={`flex items-center gap-2 py-3 px-4 font-medium text-xs border-b-2 transition ${
              activeTab === "whitelist"
                ? "border-cyan-500 text-cyan-400 bg-cyan-950/10"
                : "border-transparent text-slate-450 hover:text-slate-300"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Allowlist ({allowedEmails.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-2 py-3 px-4 font-medium text-xs border-b-2 transition relative ${
              activeTab === "requests"
                ? "border-cyan-500 text-cyan-400 bg-cyan-950/10"
                : "border-transparent text-slate-450 hover:text-slate-300"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Approval Queue</span>
            {pendingRequests.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-[9px] font-bold rounded-full flex items-center justify-center text-white">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-2 py-3 px-4 font-medium text-xs border-b-2 transition ${
              activeTab === "logs"
                ? "border-cyan-500 text-cyan-400 bg-cyan-950/10"
                : "border-transparent text-slate-450 hover:text-slate-300"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit TrailLogs ({logs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("setup")}
            className={`flex items-center gap-2 py-3 px-4 font-medium text-xs border-b-2 transition ${
              activeTab === "setup"
                ? "border-cyan-500 text-cyan-400 bg-cyan-950/10"
                : "border-transparent text-slate-450 hover:text-slate-300"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Google API Setup Guide</span>
          </button>
        </div>

        {/* Custom Tab Panel Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl min-h-[300px]">
          
          {/* TAB 1: WHitelist LISTINGS */}
          {activeTab === "whitelist" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Add Email Form */}
                <form onSubmit={handleAddEmail} className="flex gap-2 w-full md:max-w-xl items-center">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="Add user email..."
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                  
                  {/* Role picker if Developer logged-in */}
                  {user.role === "Developer" && (
                    <select
                      value={addUserRole}
                      onChange={(e) => setAddUserRole(e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 text-[11px] h-[34px] rounded-xl px-2 text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="User">Assign User</option>
                      <option value="Admin">Assign Admin</option>
                    </select>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs rounded-xl flex items-center gap-1.5 shrink-0 h-[34px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Authorize</span>
                  </button>
                </form>

                {/* Search field */}
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search whitelist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Whitelist Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-450 text-left">
                      <th className="pb-3 text-slate-500">Authorized Google Email</th>
                      <th className="pb-3 text-slate-500">Privilege Class</th>
                      <th className="pb-3 text-slate-500 text-right">Revocation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredAllowed.map((emailLower, i) => {
                      const isMainDev = emailLower.toLowerCase() === adminEmail.toLowerCase();
                      const targetRole = adminData?.userRoles?.[emailLower.toLowerCase()] || (isMainDev ? "Developer" : "User");
                      const canModify = !isMainDev && (
                        user.role === "Developer" || 
                        (user.role === "Admin" && targetRole !== "Developer" && targetRole !== "Admin")
                      );

                      return (
                        <tr key={emailLower + "_" + i} className="text-xs hover:bg-slate-950/40">
                          <td className="py-3 font-mono font-medium text-slate-200">
                            {emailLower}
                          </td>
                          <td className="py-3">
                            {canModify ? (
                              <select
                                value={targetRole}
                                onChange={(e) => handleSetRole(emailLower, e.target.value as any)}
                                className="bg-slate-900/80 border border-slate-800 text-[11px] rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500 transition cursor-pointer font-medium font-sans"
                              >
                                {user.role === "Developer" && (
                                  <>
                                    <option value="Developer">Developer</option>
                                    <option value="Admin">Admin</option>
                                  </>
                                )}
                                {user.role === "Admin" && targetRole === "Admin" && (
                                  <option value="Admin">Admin</option>
                                )}
                                <option value="User">User</option>
                                <option value="Denied">🔴 Deny Access</option>
                              </select>
                            ) : (
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-mono font-medium border uppercase tracking-tight ${
                                targetRole === "Developer"
                                  ? "bg-cyan-950/80 text-cyan-400 border-cyan-500/20"
                                  : targetRole === "Admin"
                                  ? "bg-purple-950/80 text-purple-400 border-purple-500/20"
                                  : "bg-slate-900 text-slate-400 border-slate-800"
                              }`}>
                                {targetRole}
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right font-mono">
                            <button
                              onClick={() => handleRemoveEmail(emailLower)}
                              disabled={!canModify}
                              className={`p-1.5 rounded-lg border transition ${
                                !canModify
                                  ? "opacity-30 cursor-not-allowed border-transparent text-slate-600"
                                  : "border-slate-800 text-slate-450 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/30"
                              }`}
                              title={!canModify ? "Cannot modify this account level" : "Revoke Access Completely"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredAllowed.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-xs text-slate-500 italic">
                          No matching whitelisted accounts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ACCESS APPROVAL QUEUE */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">Incoming Access Registrations</h3>
                <p className="text-xs text-slate-400">
                  Users who logged in via Google but weren&apos;t allowed. They can submit an appeal reason to trigger live allowlisting.
                </p>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="py-12 border border-dashed border-slate-800 rounded-xl text-center space-y-2">
                  <div className="inline-flex w-10 h-10 rounded-full bg-slate-800 text-slate-500 items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400 italic">No pending requests are currently in the security queue!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((req, i) => (
                    <div
                      key={req.email + "_" + i}
                      className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={req.picture}
                          alt={req.name}
                          className="w-9 h-9 rounded-full bg-slate-850 shrink-0 border border-slate-800"
                        />
                        <div className="space-y-1.5">
                          <div>
                            <h4 className="text-xs font-semibold text-white">{req.name}</h4>
                            <p className="text-[10px] font-mono text-cyan-400">{req.email}</p>
                          </div>
                          {req.reason && (
                            <div className="bg-slate-900 border border-slate-800/60 p-2.5 rounded text-[11px] text-slate-300 leading-relaxed italic max-w-md">
                              &ldquo;{req.reason}&rdquo;
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>Requested {new Date(req.requestedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                        {user.role === "Developer" ? (
                          <>
                            <button
                              onClick={() => handleApproveRequest(req.email, "User")}
                              className="px-2.5 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800 text-emerald-200 text-xs rounded-lg transition flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve as User</span>
                            </button>
                            <button
                              onClick={() => handleApproveRequest(req.email, "Admin")}
                              className="px-2.5 py-1.5 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800 text-purple-200 text-xs rounded-lg transition flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve as Admin</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleApproveRequest(req.email, "User")}
                            className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800 text-emerald-200 text-xs rounded-lg transition flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Access</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDenyRequest(req.email)}
                          className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-200 text-xs rounded-lg transition flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AUDIT TRAILS LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">Live Operations & Access Logs</h3>
                  <p className="text-xs text-slate-450">Chronological list of all authentication actions and attempts.</p>
                </div>
                {logs.length > 0 && (
                  <button
                    onClick={handleClearLogs}
                    className="px-2.5 py-1 text-[10px] font-mono tracking-wider border border-red-900 text-red-400 bg-red-950/20 hover:bg-red-900/10 rounded-lg transition uppercase"
                  >
                    Clear Logs
                  </button>
                )}
              </div>

              {logs.length === 0 ? (
                <p className="text-center py-12 text-xs text-slate-500 italic">No access logs have been recorded yet.</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {logs.map((log) => {
                    const isGrant = log.status === "granted";
                    return (
                      <div
                        key={log.id}
                        className="bg-slate-950 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                isGrant ? "bg-emerald-950 text-emerald-400" : "bg-red-950/90 text-red-400"
                              }`}
                            >
                              {isGrant ? "GRANTED" : "BLOCKED"}
                            </span>
                            <span className="text-slate-300 font-semibold">{log.email}</span>
                            <span className="text-slate-500 text-[10px]">({log.name})</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Reason: <span className="text-slate-300">{log.reason}</span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-start sm:items-end gap-1.5 sm:gap-0.5 text-[9px] text-slate-500 shrink-0 select-none">
                          <div>Type: <span className="text-cyan-400">{log.authType}</span></div>
                          <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: API CREDENTIALS SETUP GUIDE */}
          {activeTab === "setup" && (
            <div className="space-y-6 text-slate-300 leading-relaxed text-xs">
              <div className="space-y-1 pb-4 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-400" />
                  Google API & OAuth Configuration Guide
                </h3>
                <p className="text-xs text-slate-400">
                  Follow these instructions step-by-step to wire up production Google Sign-In with this applet.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Steps */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="font-bold text-cyan-400 font-mono">STEP 1: Register Google application</span>
                    <p className="text-slate-400">
                      Open the Google Cloud Console credential manager at: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">console.cloud.google.com</a>. Create or select a Google Cloud Project.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-cyan-400 font-mono">STEP 2: Add authorized redirect URLs</span>
                    <p className="text-slate-400">
                      Under OAuth client credentials, add these callback URLs to your Google project settings.
                    </p>
                    
                    <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] leading-tight">
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold mb-1 uppercase uppercase flex justify-between items-center">
                          <span>Callback URL (Development)</span>
                          <button
                            onClick={() => handleCopy(devRedirectUri, "devUrl")}
                            className="text-cyan-400 text-[10px] uppercase hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            {copiedText === "devUrl" ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <p className="text-slate-300 break-all select-all select-all">{devRedirectUri}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-cyan-400 font-mono">STEP 3: Configure environment secrets</span>
                    <p className="text-slate-400">
                      Inside your Google Cloud Developer pane, copy your <strong>Client ID</strong> and <strong>Client Secret</strong>. 
                      Then, add them inside the AI Studio Secrets panel from the left sidebar Settings:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>Name: <code className="text-cyan-400 bg-slate-950 px-1 py-0.5 rounded font-mono text-[10px]">GOOGLE_CLIENT_ID</code></li>
                      <li>Name: <code className="text-cyan-400 bg-slate-950 px-1 py-0.5 rounded font-mono text-[10px]">GOOGLE_CLIENT_SECRET</code></li>
                    </ul>
                  </div>
                </div>

                {/* API Status */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4 self-start">
                  <h4 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">Credentials Verification</h4>
                  
                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex justify-between py-1.5 border-b border-slate-900">
                      <span className="text-slate-500">CLIENT_ID STATE:</span>
                      {config?.GOOGLE_CLIENT_ID === "configured" ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <Check className="w-3.5 h-3.5" /> FOUND
                        </span>
                      ) : (
                        <span className="text-amber-500 uppercase">MISSING (SIMULATED ACTIVED)</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between py-1.5 border-b border-slate-900">
                      <span className="text-slate-500">CLIENT_SECRET STATE:</span>
                      {config?.GOOGLE_CLIENT_SECRET === "configured" ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <Check className="w-3.5 h-3.5" /> FOUND
                        </span>
                      ) : (
                        <span className="text-amber-500 uppercase">MISSING (SIMULATED ACTIVED)</span>
                      )}
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-900">
                      <span className="text-slate-500">OWNER DEFAULT EMAIL:</span>
                      <span className="text-slate-300">{adminEmail}</span>
                    </div>

                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">GATEWAY ENGINE:</span>
                      <span className="text-cyan-400 font-bold bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">READY</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-900">
                    *Once credentials are input into the Secrets panel, the server automatically boots fully real Google Connection protocols upon page refresh.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
