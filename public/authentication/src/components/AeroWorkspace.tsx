import React, { useState } from "react";
import {
  Layout,
  Play,
  Share2,
  Trash2,
  Cpu,
  Server,
  Terminal,
  LogOut,
  Shield,
  MessageSquare,
  Sparkles,
  BarChart3,
  Calendar,
  Activity,
  Send,
  Workflow,
  Plus,
  RefreshCw,
} from "lucide-react";
import { User } from "../types";

interface AeroWorkspaceProps {
  user: User;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

interface PipelineNode {
  id: string;
  name: string;
  type: "trigger" | "action" | "condition";
  status: "idle" | "running" | "success" | "error";
}

interface TeamMessage {
  id: string;
  sender: string;
  senderEmail: string;
  senderPicture: string;
  text: string;
  timestamp: string;
}

export default function AeroWorkspace({
  user,
  onLogout,
  onOpenAdmin,
}: AeroWorkspaceProps) {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"analytics" | "automations" | "team">("analytics");
  const [pipelineNodes, setPipelineNodes] = useState<PipelineNode[]>([
    { id: "node-1", name: "Watch Github Push", type: "trigger", status: "idle" },
    { id: "node-2", name: "Run Linters & Types", type: "action", status: "idle" },
    { id: "node-3", name: "Verify Whitelist Tokens", type: "condition", status: "idle" },
    { id: "node-4", name: "Deploy to Cloud Server", type: "action", status: "idle" },
  ]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "System Initialized. Access Tokens Verified.",
    "Gatekeeper listening on port 3000... Session active.",
    "Ready to execute pipeline automation flows."
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [teamMessages, setTeamMessages] = useState<TeamMessage[]>([
    {
      id: "msg-1",
      sender: "Hanif Aad",
      senderEmail: "haanifaad123@gmail.com",
      senderPicture: `https://api.dicebear.com/7.x/initials/svg?seed=haanifaad123@gmail.com`,
      text: "Welcome everyone! This is our protected software suite. Only authorized accounts can see our data. Let me know if you need help.",
      timestamp: "Today at 10:15 AM",
    },
    {
      id: "msg-2",
      sender: "Alex Whitelisted",
      senderEmail: "partner@company.com",
      senderPicture: `https://api.dicebear.com/7.x/initials/svg?seed=partner@company.com`,
      text: "Awesome setup. The Google sign-in works in the sandbox perfectly. I can review the development pipeline metrics now.",
      timestamp: "Today at 10:24 AM",
    },
  ]);
  const [runningPipeline, setRunningPipeline] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeType, setNewNodeType] = useState<"trigger" | "action" | "condition">("action");

  // Post notes/messages inside the Decentralized workspace forum
  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg: TeamMessage = {
      id: "msg_" + Math.random().toString(36).substring(2, 9),
      sender: user.name,
      senderEmail: user.email,
      senderPicture: user.picture,
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setTeamMessages((prev) => [...prev, newMsg]);
    setNewMessage("");

    // Simulate AI / collaborator typing responses sometimes to make the workspace feel alive
    setTimeout(() => {
      const responses = [
        "DP Pipeline verified! The action logged perfectly.",
        "Security layers updated. All active nodes are authorized.",
        "Checking database nodes... Latency is sitting under 14ms.",
        "Thanks! I see the request logs inside the system admin panel as well."
      ];
      const randomReply: TeamMessage = {
        id: "msg_reply_" + Math.random().toString(36).substring(2, 9),
        sender: "DP System Helper",
        senderEmail: "ai-helper@dp.local",
        senderPicture: "https://api.dicebear.com/7.x/bottts/svg?seed=dp-system",
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: "Just now"
      };
      setTeamMessages((prev) => [...prev, randomReply]);
    }, 1200);
  };

  // Add a Pipeline Node
  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;
    const node: PipelineNode = {
      id: "node_" + Math.random().toString(36).substring(2, 9),
      name: newNodeName.trim(),
      type: newNodeType,
      status: "idle",
    };
    setPipelineNodes((prev) => [...prev, node]);
    setNewNodeName("");
    setTerminalLogs((prev) => [...prev, `[CONFIG] Added custom node: [${newNodeType.toUpperCase()}] ${node.name}`]);
  };

  // Delete a Pipeline Node
  const handleDeleteNode = (id: string) => {
    setPipelineNodes((prev) => prev.filter((n) => n.id !== id));
    setTerminalLogs((prev) => [...prev, `[CONFIG] Removed automation node index: ${id}`]);
  };

  // Run build-pipeline simulations
  const handleRunPipeline = async () => {
    if (runningPipeline) return;
    setRunningPipeline(true);
    setTerminalLogs((prev) => [...prev, `[ACTION] Initiating global pipeline run at ${new Date().toLocaleTimeString()}...`]);

    for (let i = 0; i < pipelineNodes.length; i++) {
      const node = pipelineNodes[i];
      
      // Mark current executing node
      setPipelineNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: "running" } : n))
      );
      setTerminalLogs((prev) => [...prev, `[RUN] Executing: ${node.name}...`]);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const isSuccess = Math.random() > 0.08; // 92% success rate
      setPipelineNodes((prev) =>
        prev.map((n) =>
          n.id === node.id ? { ...n, status: isSuccess ? "success" : "error" } : n
        )
      );

      if (isSuccess) {
        setTerminalLogs((prev) => [...prev, `[OK] Finished: ${node.name} successfully.`]);
      } else {
        setTerminalLogs((prev) => [...prev, `[ERROR] Blocked at: ${node.name}. Build halted.`]);
        setRunningPipeline(false);
        return;
      }
    }

    setTerminalLogs((prev) => [...prev, `[OK] All pipeline nodes validated and deployed. Build lifecycle complete.`]);
    setRunningPipeline(false);
  };

  // Reset Pipeline Node States
  const handleResetNodes = () => {
    setPipelineNodes((prev) => prev.map((n) => ({ ...n, status: "idle" })));
    setTerminalLogs((prev) => [...prev, `[RESET] Pipeline node statuses restored to idle.`]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative overflow-hidden">
      
      {/* Glows */}
      <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-cyan-950/20 blur-[130px] mix-blend-screen animate-glow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-950/20 blur-[130px] mix-blend-screen animate-glow" />

      {/* Side Control Dock */}
      <div className="w-full md:w-64 shrink-0 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-5 flex flex-col justify-between relative z-10">
        <div className="space-y-6">
          {/* Workspace Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 items-center justify-center flex bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl shadow border border-cyan-400/20">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-display text-white tracking-wide">DP Workspace</h2>
              <span className="text-[10px] font-mono text-cyan-400">SECURE SHELL v1.1</span>
            </div>
          </div>

          {/* Current Authorized Profile Badge */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/85">
            <div className="flex items-center gap-2.5">
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                <div className="text-[9px] text-slate-400 font-mono truncate">{user.email}</div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-900/80 flex justify-between items-center text-[9px] font-mono">
              <span className="text-slate-500">Privilege:</span>
              <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${
                user.role === "Developer"
                  ? "bg-cyan-950/80 text-cyan-400 border border-cyan-500/20"
                  : user.role === "Admin"
                  ? "bg-purple-950/80 text-purple-400 border border-purple-500/20"
                  : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Tab lists */}
          <div className="space-y-1.5 pt-2">
            <button
              id="analytics-tab-btn"
              onClick={() => setActiveWorkspaceTab("analytics")}
              className={`w-full text-left py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                activeWorkspaceTab === "analytics"
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/40"
              }`}
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Analytics Terminal</span>
              </span>
              <Activity className="w-3 h-3 text-cyan-400/50" />
            </button>

            <button
              id="automations-tab-btn"
              onClick={() => setActiveWorkspaceTab("automations")}
              className={`w-full text-left py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                activeWorkspaceTab === "automations"
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/40"
              }`}
            >
              <span className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-cyan-400" />
                <span>Flow Orchestrator</span>
              </span>
              <span className="font-mono text-[9px] text-slate-500">[{pipelineNodes.length}]</span>
            </button>

            <button
              id="team-tab-btn"
              onClick={() => setActiveWorkspaceTab("team")}
              className={`w-full text-left py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                activeWorkspaceTab === "team"
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/40"
              }`}
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Members Room</span>
              </span>
              <span className="font-mono text-[9px] text-slate-500">[{teamMessages.length}]</span>
            </button>
          </div>

          {user.isAdmin && (
            <button
              id="security-panel-btn"
              onClick={onOpenAdmin}
              className="w-full mt-4 py-2 px-3 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              <Shield className="w-4 h-4" />
              <span>Gatekeeper Console</span>
            </button>
          )}
        </div>

        {/* Log Out */}
        <div className="pt-6 mt-6 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full py-1.5 px-3 hover:bg-slate-850 rounded-lg text-xs text-slate-400 hover:text-white flex items-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Google</span>
          </button>
        </div>
      </div>

      {/* Main Panel Content Workspace */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 relative z-10">
        
        {/* Workspace TAB 1: Analytics widgets */}
        {activeWorkspaceTab === "analytics" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-display text-white">Analytics Terminal</h2>
              <p className="text-xs text-slate-400">Overview metrics, deployment outputs, and access logs statistics of your running setup.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/80 transition">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-550 font-mono tracking-wider uppercase">Active Gatekeeper Status</span>
                  <div className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE & ENFORCED
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/80 transition">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-550 font-mono tracking-wider uppercase">Pipeline Node Integrity</span>
                  <div className="text-lg font-bold text-white font-display">
                    4 Core Nodes Active
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center">
                  <Workflow className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/80 transition">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-550 font-mono tracking-wider uppercase">Connection Authorization</span>
                  <div className="text-lg font-bold text-cyan-400 font-mono">
                    {user.authType === "Google OAuth" ? "VERIFIED OAUTH2" : "SANDBOX_SIM"}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 text-cyan-400 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Core analytics illustration & deployment output */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <h3 className="text-sm font-semibold text-white">System Node Health Visualization</h3>
                
                {/* Visual health lines */}
                <div className="space-y-3.5 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-slate-400">Database Connection Stability</span>
                      <span className="font-mono text-emerald-400 font-semibold">99.8%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[99.8%]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-slate-400">Authorization Identity Filter Delay</span>
                      <span className="font-mono text-cyan-400 font-semibold">12ms (Target Under 30ms)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full w-[85%]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-slate-400">Automation Build Pipeline Latency</span>
                      <span className="font-mono text-blue-400 font-semibold">Stable (No active queuing)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[70%]" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono leading-relaxed">
                  *DP systems verify Google accounts automatically during page reloads or API queries. Removed users are block-shielded instantaneously.
                </div>
              </div>

              {/* Status board */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Live Active Software Configuration</h3>
                  <div className="space-y-3 font-mono text-[10px]">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-850 flex justify-between items-center">
                      <span className="text-slate-500">Access Restricted:</span>
                      <span className="text-emerald-400 font-bold">YES</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-850 flex justify-between items-center">
                      <span className="text-slate-500">Identity Mode:</span>
                      <span className="text-cyan-400 font-bold">GOOGLE OAUTH2</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-850 flex justify-between items-center bg-cyan-950/20">
                      <span className="text-cyan-400 font-bold">Owner:</span>
                      <span className="text-slate-300">haanifaad...</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4">
                  {user.isAdmin ? (
                    <button
                      onClick={onOpenAdmin}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold font-mono tracking-wider transition border border-slate-700 shadow"
                    >
                      EDIT ALLOWLISTS DB
                    </button>
                  ) : (
                    <p className="text-[10px] text-slate-550 leading-relaxed text-center italic">
                      Admin editing functions are securely closed for non-owners.
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Workspace TAB 2: Flow Orchestrator Automation builder */}
        {activeWorkspaceTab === "automations" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-display text-white">Flow Orchestrator</h2>
                <p className="text-xs text-slate-400">Construct custom automation pipelines in your workspace. Test trigger conditions in real-time.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunPipeline}
                  disabled={runningPipeline}
                  className="px-4.5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 ${runningPipeline ? "animate-spin" : ""}`} />
                  <span>{runningPipeline ? "Running Pipeline..." : "Trigger Build Pipeline"}</span>
                </button>
                <button
                  onClick={handleResetNodes}
                  className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 transition"
                  title="Reset Pipeline Status"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Automation flow creator grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Node Listings */}
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-3">
                  {pipelineNodes.map((node, index) => (
                    <div
                      key={node.id}
                      className="bg-slate-900 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-600 select-none font-bold">0{index + 1}</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          node.status === "running" ? "bg-amber-500 animate-pulse" :
                          node.status === "success" ? "bg-emerald-500" :
                          node.status === "error" ? "bg-red-500" :
                          "bg-slate-700"
                        }`} />
                        <div>
                          <div className="text-xs font-semibold text-white">{node.name}</div>
                          <span className="text-[9px] font-mono text-cyan-400/80 uppercase">{node.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">
                          {node.status === "running" && <span className="text-amber-400 animate-pulse">Running</span>}
                          {node.status === "success" && <span className="text-emerald-400">Success</span>}
                          {node.status === "error" && <span className="text-red-400">Failed</span>}
                          {node.status === "idle" && <span className="text-slate-500">Idle</span>}
                        </span>

                        <button
                          onClick={() => handleDeleteNode(node.id)}
                          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-800 text-slate-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new node inline form */}
                <form onSubmit={handleAddNode} className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    placeholder="New Node Name..."
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 text-xs rounded-lg p-2 focus:outline-none"
                    required
                  />
                  <select
                    value={newNodeType}
                    onChange={(e) => setNewNodeType(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg p-2 focus:outline-none"
                  >
                    <option value="action">Action Node</option>
                    <option value="trigger">Trigger Event</option>
                    <option value="condition">Condition Filter</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-bold transition flex items-center gap-1 border border-slate-750"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* Terminal Logs monitor mockup */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col h-[320px]">
                <div className="bg-slate-950 p-3 border-b border-slate-850 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">DP Terminal Logs</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500/80" />
                    <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <span className="w-2 h-2 rounded-full bg-green-500/80" />
                  </div>
                </div>

                <div className="flex-1 bg-black p-4 font-mono text-[10px] text-slate-400 overflow-y-auto space-y-1.5 leading-normal">
                  {terminalLogs.map((log, i) => (
                    <p key={i}>
                      <span className="text-cyan-500 select-none mr-1.5">&gt;</span>
                      {log}
                    </p>
                  ))}
                  <div className="w-1.5 h-3 bg-cyan-400 animate-pulse inline-block" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Workspace TAB 3: Team Chats room */}
        {activeWorkspaceTab === "team" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-display text-white">Whitelisted Collaboration Room</h2>
              <p className="text-xs text-slate-400">Privileged communication space. View comments, feedback, or logs written by active whitelist operators.</p>
            </div>

            {/* Message history */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Message board */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-lg h-[450px]">
                {/* Messages Box */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {teamMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <img
                        src={msg.senderPicture}
                        alt={msg.sender}
                        className="w-8 h-8 rounded-full bg-slate-800 shrink-0 border border-slate-700 mt-0.5"
                      />
                      <div className="space-y-1 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 max-w-xl">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="font-semibold text-white">{msg.sender}</span>
                          <span className="text-[9px] font-mono text-slate-500">{msg.senderEmail}</span>
                          <span className="text-[9px] text-slate-500 font-mono ml-auto">{msg.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-350 leading-relaxed pt-1 select-all">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit text bar */}
                <form
                  onSubmit={handlePostMessage}
                  className="bg-slate-950 p-3.5 border-t border-slate-850 flex gap-2 rounded-b-2xl"
                >
                  <input
                    type="text"
                    placeholder="Enter team message notes..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                    required
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white transition flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Members Listing column */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 self-start">
                <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-cyan-400">Whitelisted Members online</h3>
                
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=haanifaad123@gmail.com`}
                      alt="Hanif Aad"
                      className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">Hanif Aad (Owner)</div>
                      <div className="text-[9px] text-slate-500 font-mono">haanifaad123@gmail.com</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=partner@company.com`}
                      alt="Alex Partner"
                      className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">Alex Whitelisted</div>
                      <div className="text-[9px] text-slate-500 font-mono">partner@company.com</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    <div className="w-7 h-7 rounded-full bg-slate-850 flex items-center justify-center text-[10px] text-slate-400 border border-slate-850 font-bold">
                      A
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400">DP Helper BOT</div>
                      <div className="text-[9px] text-slate-500 font-mono">ai-helper@dp.local</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 leading-normal font-mono">
                  Only users validated by Google Auth are permitted to see dynamic members&apos; comments.
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
