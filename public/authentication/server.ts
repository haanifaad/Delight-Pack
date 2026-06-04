import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { dpAuthRouter } from "./server/dp-auth/routes";

dotenv.config();

const app = express();
const PORT = 3000;

// Path to file-based JSON database
const DB_FILE = path.join(process.cwd(), "data.json");

interface DbState {
  allowedEmails: string[];
  userRoles?: Record<string, "Developer" | "Admin" | "User">;
  accessRequests: Array<{
    email: string;
    name: string;
    picture: string;
    status: "pending" | "approved" | "denied";
    requestedAt: string;
    reason?: string;
  }>;
  logs: Array<{
    id: string;
    email: string;
    name: string;
    status: "granted" | "denied";
    timestamp: string;
    authType: "Demo" | "Google OAuth";
    reason: string;
  }>;
}

const ADMIN_EMAIL = "haanifaad123@gmail.com";

const DEFAULT_STATE: DbState = {
  allowedEmails: [ADMIN_EMAIL],
  userRoles: {
    "haanifaad123@gmail.com": "Developer"
  },
  accessRequests: [],
  logs: []
};

// Robust helper to get/save DB state
function getDb(): DbState {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_STATE, null, 2));
      return DEFAULT_STATE;
    }
    const content = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(content);
    // Ensure lists exist
    if (!parsed.allowedEmails) parsed.allowedEmails = [ADMIN_EMAIL];
    if (!parsed.accessRequests) parsed.accessRequests = [];
    if (!parsed.logs) parsed.logs = [];
    if (!parsed.userRoles) parsed.userRoles = {};

    const adminEmailLower = ADMIN_EMAIL.toLowerCase();
    
    // Ensure all allowedEmails are also present in userRoles
    parsed.allowedEmails.forEach((email: string) => {
      const eLower = email.toLowerCase();
      if (!parsed.userRoles[eLower]) {
        if (eLower === adminEmailLower) {
          parsed.userRoles[eLower] = "Developer";
        } else {
          parsed.userRoles[eLower] = "User";
        }
      }
    });

    // Ensure ADMIN_EMAIL has Developer role
    parsed.userRoles[adminEmailLower] = "Developer";

    // Ensure admin is always in authorized list
    if (!parsed.allowedEmails.map((e: string) => e.toLowerCase()).includes(adminEmailLower)) {
      parsed.allowedEmails.push(ADMIN_EMAIL);
    }
    return parsed;
  } catch (error) {
    console.error("Error reading db file, using default", error);
    return DEFAULT_STATE;
  }
}

function getUserRole(email: string): "Developer" | "Admin" | "User" | "None" {
  const emailLower = email.toLowerCase();
  
  // Primary Developer check
  if (emailLower === ADMIN_EMAIL.toLowerCase()) {
    return "Developer";
  }

  const db = getDb();
  if (db.userRoles && db.userRoles[emailLower]) {
    return db.userRoles[emailLower];
  }

  // Back-compat if in allowedEmails list but no role assigned yet
  const allowedLowerList = db.allowedEmails.map(e => e.toLowerCase());
  if (allowedLowerList.includes(emailLower)) {
    return "User";
  }

  return "None";
}

function saveDb(state: DbState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error("Error writing db file", error);
  }
}

// In-memory Session stores
const activeSessions: Record<string, {
  email: string;
  name: string;
  picture: string;
  isAdmin: boolean;
  isAllowed: boolean;
  authType: "Demo" | "Google OAuth";
  loggedInAt: string;
  role: "Developer" | "Admin" | "User";
}> = {};

// Helper to parse cookies from request headers
const getSession = (req: express.Request) => {
  const cookies = req.headers.cookie
    ? Object.fromEntries(
        req.headers.cookie.split("; ").map((c) => {
          const idx = c.indexOf("=");
          return [c.substring(0, idx).trim(), c.substring(idx + 1).trim()];
        })
      )
    : {};
  const sid = cookies.session_id;
  if (!sid) return null;
  return activeSessions[sid] || null;
};

app.use(express.json());

// ----------------------------------------------------
// New PostgreSQL DP-Auth Router
// ----------------------------------------------------
app.use("/api/dp-auth", dpAuthRouter);

// ----------------------------------------------------
// Authentication API Routes
// ----------------------------------------------------

// Check login status and active authorization details
app.get("/api/auth/status", (req, res) => {
  const session = getSession(req);
  if (!session) {
    return res.json({ loggedIn: false });
  }

  // Live allowlist verification check (in case user was removed/added since login)
  const emailLower = session.email.toLowerCase();
  const currentRole = getUserRole(emailLower);
  const isAllowed = currentRole !== "None";
  const isAdminCheck = currentRole === "Developer" || currentRole === "Admin";

  // Keep session in sync
  session.isAllowed = isAllowed;
  session.isAdmin = isAdminCheck;
  session.role = isAllowed ? currentRole : "User";

  res.json({
    loggedIn: true,
    user: {
      email: session.email,
      name: session.name,
      picture: session.picture,
      isAdmin: session.isAdmin,
      isAllowed: session.isAllowed,
      authType: session.authType,
      loggedInAt: session.loggedInAt,
      role: session.role
    }
  });
});

// Logs out user
app.post("/api/auth/logout", (req, res) => {
  const cookies = req.headers.cookie
    ? Object.fromEntries(
        req.headers.cookie.split("; ").map((c) => {
          const idx = c.indexOf("=");
          return [c.substring(0, idx).trim(), c.substring(idx + 1).trim()];
        })
      )
    : {};
  const sid = cookies.session_id;
  if (sid && activeSessions[sid]) {
    delete activeSessions[sid];
  }
  res.setHeader(
    "Set-Cookie",
    "session_id=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0"
  );
  res.json({ success: true });
});

// Generate dynamic Google OAuth authorization link
app.get("/api/auth/google/url", (req, res) => {
  const clientOrigin = req.query.origin as string || process.env.APP_URL || "http://localhost:3000";
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return res.json({
      error: "Google Client ID is not configured in environment variables.",
      isConfigured: false
    });
  }

  // Use state parameter to cleanly pass back the origin workspace url
  const redirectUri = `${clientOrigin}/auth/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    state: clientOrigin,
    prompt: "select_account"
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({ url: authUrl, isConfigured: true });
});

// Handle simulated login in demo modes
app.post("/api/auth/demo-login", (req, res) => {
  const { email, name, picture } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const emailLower = email.trim().toLowerCase();
  const db = getDb();
  const currentRole = getUserRole(emailLower);
  const isAllowed = currentRole !== "None";

  const sessionId = "demo_" + Math.random().toString(36).substring(2, 15);
  
  // Create or retrieve access request automatically if denied to capture user intent
  if (!isAllowed) {
    const existingReq = db.accessRequests.find(r => r.email.toLowerCase() === emailLower);
    if (!existingReq) {
      db.accessRequests.push({
        email: emailLower,
        name: name || emailLower.split("@")[0],
        picture: picture || `https://api.dicebear.com/7.x/initials/svg?seed=${emailLower}`,
        status: "pending",
        requestedAt: new Date().toISOString(),
        reason: "Auto-requested during Demo Sign-in"
      });
    }
  }

  // Create audit log entry
  db.logs.unshift({
    id: "log_" + Math.random().toString(36).substring(2, 9),
    email: emailLower,
    name: name || emailLower.split("@")[0],
    status: isAllowed ? "granted" : "denied",
    timestamp: new Date().toISOString(),
    authType: "Demo",
    reason: isAllowed ? `Email authorized in allowlist as ${currentRole}` : "Email not found in allowlist"
  });
  saveDb(db);

  activeSessions[sessionId] = {
    email: emailLower,
    name: name || emailLower.split("@")[0],
    picture: picture || `https://api.dicebear.com/7.x/initials/svg?seed=${emailLower}`,
    isAdmin: currentRole === "Developer" || currentRole === "Admin",
    isAllowed: isAllowed,
    authType: "Demo",
    loggedInAt: new Date().toISOString(),
    role: isAllowed ? currentRole : "User"
  };

  res.setHeader(
    "Set-Cookie",
    `session_id=${sessionId}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=2592000`
  );

  res.json({
    success: true,
    user: activeSessions[sessionId]
  });
});

// User manually request access with specialized message
app.post("/api/auth/request-access", (req, res) => {
  const { email, name, picture, reason } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const emailLower = email.trim().toLowerCase();
  const db = getDb();

  const existingIdx = db.accessRequests.findIndex(r => r.email.toLowerCase() === emailLower);
  const reqObj = {
    email: emailLower,
    name: name || emailLower.split("@")[0],
    picture: picture || `https://api.dicebear.com/7.x/initials/svg?seed=${emailLower}`,
    status: "pending" as const,
    requestedAt: new Date().toISOString(),
    reason: reason || "User requested access from interface"
  };

  if (existingIdx >= 0) {
    db.accessRequests[existingIdx] = reqObj;
  } else {
    db.accessRequests.push(reqObj);
  }

  saveDb(db);
  res.json({ success: true, request: reqObj });
});


// ----------------------------------------------------
// Admin Management API Routes (Restricted)
// ----------------------------------------------------

// ----------------------------------------------------
// Admin Management API Routes (Restricted)
// ----------------------------------------------------

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const session = getSession(req);
  if (!session) {
    return res.status(403).json({ error: "Unauthorized. Session required." });
  }
  const role = getUserRole(session.email);
  if (role !== "Developer" && role !== "Admin") {
    return res.status(403).json({ error: "Unauthorized. Developer/Admin privileges required." });
  }
  next();
};

// Access entire control data
app.get("/api/admin/data", requireAdmin, (req, res) => {
  const db = getDb();
  const userRoles: Record<string, "Developer" | "Admin" | "User"> = {};
  
  db.allowedEmails.forEach(email => {
    const eLower = email.toLowerCase();
    userRoles[eLower] = getUserRole(eLower) as any;
  });

  res.json({
    allowedEmails: db.allowedEmails,
    userRoles: userRoles,
    accessRequests: db.accessRequests,
    logs: db.logs,
    config: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "configured" : "NOT_CONFIGURED",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "configured" : "NOT_CONFIGURED",
      ADMIN_EMAIL: ADMIN_EMAIL,
      APP_URL: process.env.APP_URL
    }
  });
});

// Allowlist manager: Add
app.post("/api/admin/allowlist/add", requireAdmin, (req, res) => {
  const { email, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const session = getSession(req)!;
  const actorEmail = session.email.toLowerCase();
  const actorRole = getUserRole(actorEmail);

  let targetRole: "Developer" | "Admin" | "User" = role || "User";
  if (actorRole === "Admin") {
    // Admin can only authorize search of user privilege
    if (targetRole === "Developer" || targetRole === "Admin") {
      return res.status(403).json({ error: "Admins can only authorize users with standard User level." });
    }
  }

  const emailLower = email.trim().toLowerCase();
  const db = getDb();

  if (!db.allowedEmails.map(e => e.toLowerCase()).includes(emailLower)) {
    db.allowedEmails.push(emailLower);
  }

  if (!db.userRoles) db.userRoles = {};
  db.userRoles[emailLower] = targetRole;

  // Auto approve matching access request if any
  const reqIdx = db.accessRequests.findIndex(r => r.email.toLowerCase() === emailLower);
  if (reqIdx >= 0) {
    db.accessRequests[reqIdx].status = "approved";
  }

  // Add Audit Log
  db.logs.unshift({
    id: "log_" + Math.random().toString(36).substring(2, 9),
    email: emailLower,
    name: emailLower.split("@")[0],
    status: "granted",
    timestamp: new Date().toISOString(),
    authType: "Demo",
    reason: `Added other node with role ${targetRole} manually by ${actorRole} (${actorEmail})`
  });

  saveDb(db);
  res.json({ success: true, allowedEmails: db.allowedEmails, userRoles: db.userRoles });
});

// Allowlist manager: Remove
app.post("/api/admin/allowlist/remove", requireAdmin, (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const emailLower = email.trim().toLowerCase();
  const targetCurrentRole = getUserRole(emailLower);

  const session = getSession(req)!;
  const actorEmail = session.email.toLowerCase();
  const actorRole = getUserRole(actorEmail);

  if (emailLower === ADMIN_EMAIL.toLowerCase() || targetCurrentRole === "Developer") {
    return res.status(400).json({ error: "Cannot remove a Developer account." });
  }

  if (actorRole === "Admin") {
    if (targetCurrentRole === "Admin") {
      return res.status(403).json({ error: "Admins cannot modify other Admins or Developers." });
    }
  }

  const db = getDb();
  db.allowedEmails = db.allowedEmails.filter(e => e.toLowerCase() !== emailLower);
  if (db.userRoles) {
    delete db.userRoles[emailLower];
  }

  // Mark matching request back as denied
  const reqIdx = db.accessRequests.findIndex(r => r.email.toLowerCase() === emailLower);
  if (reqIdx >= 0) {
    db.accessRequests[reqIdx].status = "denied";
  }

  // Add Action Log
  db.logs.unshift({
    id: "log_" + Math.random().toString(36).substring(2, 9),
    email: emailLower,
    name: emailLower.split("@")[0],
    status: "denied",
    timestamp: new Date().toISOString(),
    authType: "Demo",
    reason: `Revoked access by ${actorRole} (${actorEmail})`
  });

  saveDb(db);
  res.json({ success: true, allowedEmails: db.allowedEmails, userRoles: db.userRoles });
});

// Access request approver
app.post("/api/admin/requests/approve", requireAdmin, (req, res) => {
  const { email, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const emailLower = email.trim().toLowerCase();
  const session = getSession(req)!;
  const actorEmail = session.email.toLowerCase();
  const actorRole = getUserRole(actorEmail);

  let targetRole: "Developer" | "Admin" | "User" = role || "User";
  if (actorRole === "Admin") {
    if (targetRole === "Developer" || targetRole === "Admin") {
      return res.status(403).json({ error: "Admins can only approve accounts with User privilege." });
    }
  }

  const db = getDb();

  const reqIdx = db.accessRequests.findIndex(r => r.email.toLowerCase() === emailLower);
  if (reqIdx >= 0) {
    db.accessRequests[reqIdx].status = "approved";
  }

  if (!db.allowedEmails.map(e => e.toLowerCase()).includes(emailLower)) {
    db.allowedEmails.push(emailLower);
  }

  if (!db.userRoles) db.userRoles = {};
  db.userRoles[emailLower] = targetRole;

  // Log Approve Action
  db.logs.unshift({
    id: "log_" + Math.random().toString(36).substring(2, 9),
    email: emailLower,
    name: reqIdx >= 0 ? db.accessRequests[reqIdx].name : emailLower.split("@")[0],
    status: "granted",
    timestamp: new Date().toISOString(),
    authType: "Demo",
    reason: `Access request approved as ${targetRole} by ${actorRole} (${actorEmail})`
  });

  saveDb(db);
  res.json({ success: true });
});

// Access request denier
app.post("/api/admin/requests/deny", requireAdmin, (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const emailLower = email.trim().toLowerCase();
  const targetCurrentRole = getUserRole(emailLower);

  const session = getSession(req)!;
  const actorEmail = session.email.toLowerCase();
  const actorRole = getUserRole(actorEmail);

  if (targetCurrentRole === "Developer") {
    return res.status(400).json({ error: "Cannot modify a Developer account." });
  }

  if (actorRole === "Admin") {
    if (targetCurrentRole === "Admin") {
      return res.status(403).json({ error: "Admins cannot deny access for other Admins or Developers." });
    }
  }

  const db = getDb();

  const reqIdx = db.accessRequests.findIndex(r => r.email.toLowerCase() === emailLower);
  if (reqIdx >= 0) {
    db.accessRequests[reqIdx].status = "denied";
  }

  db.allowedEmails = db.allowedEmails.filter(e => e.toLowerCase() !== emailLower);
  if (db.userRoles) {
    delete db.userRoles[emailLower];
  }

  // Log Deny Action
  db.logs.unshift({
    id: "log_" + Math.random().toString(36).substring(2, 9),
    email: emailLower,
    name: reqIdx >= 0 ? db.accessRequests[reqIdx].name : emailLower.split("@")[0],
    status: "denied",
    timestamp: new Date().toISOString(),
    authType: "Demo",
    reason: `Access request denied by ${actorRole} (${actorEmail})`
  });

  saveDb(db);
  res.json({ success: true });
});

// Dynamic Direct Role selector and Deny Action API Route
app.post("/api/admin/user/set-role", requireAdmin, (req, res) => {
  const { email, role } = req.body; // role: "Developer" | "Admin" | "User" | "Denied"
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const emailLower = email.trim().toLowerCase();
  const targetCurrentRole = getUserRole(emailLower);

  const session = getSession(req)!;
  const actorEmail = session.email.toLowerCase();
  const actorRole = getUserRole(actorEmail);

  if (emailLower === ADMIN_EMAIL.toLowerCase()) {
    return res.status(400).json({ error: "Cannot modify the primary Developer account." });
  }

  // Admin hierarchy rule check
  if (actorRole === "Admin") {
    if (targetCurrentRole === "Admin" || targetCurrentRole === "Developer") {
      return res.status(403).json({ error: "Admins cannot modify other Admins or Developers." });
    }
    if (role === "Developer" || role === "Admin") {
      return res.status(403).json({ error: "Admins can only assign the User role or Deny access." });
    }
  }

  const db = getDb();
  if (!db.userRoles) db.userRoles = {};

  if (role === "Denied") {
    // Revoke access completely
    db.allowedEmails = db.allowedEmails.filter(e => e.toLowerCase() !== emailLower);
    delete db.userRoles[emailLower];

    const reqIdx = db.accessRequests.findIndex(r => r.email.toLowerCase() === emailLower);
    if (reqIdx >= 0) {
      db.accessRequests[reqIdx].status = "denied";
    }

    db.logs.unshift({
      id: "log_" + Math.random().toString(36).substring(2, 9),
      email: emailLower,
      name: emailLower.split("@")[0],
      status: "denied",
      timestamp: new Date().toISOString(),
      authType: "Demo",
      reason: `Access denied completely by ${actorRole} (${actorEmail})`
    });
  } else {
    // Add/Update user role
    if (!db.allowedEmails.map(e => e.toLowerCase()).includes(emailLower)) {
      db.allowedEmails.push(emailLower);
    }
    db.userRoles[emailLower] = role;

    const reqIdx = db.accessRequests.findIndex(r => r.email.toLowerCase() === emailLower);
    if (reqIdx >= 0) {
      db.accessRequests[reqIdx].status = "approved";
    }

    db.logs.unshift({
      id: "log_" + Math.random().toString(36).substring(2, 9),
      email: emailLower,
      name: emailLower.split("@")[0],
      status: "granted",
      timestamp: new Date().toISOString(),
      authType: "Demo",
      reason: `Assigned role ${role} by ${actorRole} (${actorEmail})`
    });
  }

  saveDb(db);
  res.json({ success: true, allowedEmails: db.allowedEmails, userRoles: db.userRoles });
});

// Clear audit logs
app.post("/api/admin/requests/clear-logs", requireAdmin, (req, res) => {
  const db = getDb();
  db.logs = [];
  saveDb(db);
  res.json({ success: true });
});


// ----------------------------------------------------
// Google OAuth Redirect Handler Callback Endpoint
// ----------------------------------------------------
app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
  const { code, state } = req.query; // state contains clientOrigin (e.g., https://ais-dev...)
  
  if (!code) {
    return res.status(400).send("<h3>OAuth Error: Missing authorization code</h3>");
  }

  const clientOrigin = (state as string) || process.env.APP_URL || "http://localhost:3000";
  const redirectUri = `${clientOrigin}/auth/callback`;

  try {
    // 1. Exchange OAuth code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code as string,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Google token exchange failed: ${errorText}`);
    }

    const { access_token } = await tokenResponse.json();

    // 2. Fetch authenticated Google profile info
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch verified user profile from Google");
    }

    const profile = await profileResponse.json();
    const email = profile.email.toLowerCase();
    const name = profile.name || email.split("@")[0];
    const picture = profile.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${email}`;

    // 3. Verify access allowance status in gatekeeper database
    const db = getDb();
    const currentRole = getUserRole(email);
    const isAllowed = currentRole !== "None";

    const sessionId = "oauth_" + Math.random().toString(36).substring(2, 15);

    // Save access log and auto capture requests
    if (!isAllowed) {
      const existingReq = db.accessRequests.find(r => r.email.toLowerCase() === email);
      if (!existingReq) {
        db.accessRequests.push({
          email: email,
          name: name,
          picture: picture,
          status: "pending",
          requestedAt: new Date().toISOString(),
          reason: "Auto-requested during Google Sign-in"
        });
      }
    }

    db.logs.unshift({
      id: "log_" + Math.random().toString(36).substring(2, 9),
      email: email,
      name: name,
      status: isAllowed ? "granted" : "denied",
      timestamp: new Date().toISOString(),
      authType: "Google OAuth",
      reason: isAllowed ? `Email authorized in allowlist as ${currentRole}` : "Email not found in allowlist"
    });
    saveDb(db);

    // Set standard secure session map
    activeSessions[sessionId] = {
      email,
      name,
      picture,
      isAdmin: currentRole === "Developer" || currentRole === "Admin",
      isAllowed,
      authType: "Google OAuth",
      loggedInAt: new Date().toISOString(),
      role: isAllowed ? currentRole : "User"
    };

    // Write token inside a Secure HttpOnly SameSite=None cookie for seamless preview iframe authentication
    res.setHeader(
      "Set-Cookie",
      `session_id=${sessionId}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=2592000`
    );

    // Response snippet - sends postMessage of authorization success back to parent iframe window and closes itself
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Sign-In Successful</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #0f172a;
              color: #f8fafc;
            }
            .card {
              text-align: center;
              padding: 2.5rem;
              background-color: #1e293b;
              border-radius: 1rem;
              box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.5);
              max-width: 400px;
            }
            .spinner {
              border: 4px solid rgba(255, 255, 255, 0.1);
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border-left-color: #38bdf8;
              animation: spin 1s linear infinite;
              margin: 1.5rem auto;
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            h2 { margin-top: 0; color: #38bdf8; }
            p { color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Authorized Safely!</h2>
            <div class="spinner"></div>
            <p>Google connection verified successfully. Returning you to the software gatekeeper...</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: "OAUTH_AUTH_SUCCESS" }, "*");
              window.close();
            } else {
              window.location.href = "/";
            }
          </script>
        </body>
      </html>
    `);

  } catch (error: any) {
    console.error("Callback OAuth exchange error:", error);
    res.status(500).send(`
      <div style="font-family: sans-serif; padding: 2rem; background: #0f172a; color: #ef4444; height:100vh;">
        <h2>Google Authentication Failed</h3>
        <p>${error.message || error}</p>
        <p>Please close this tab and try clicking sign in again.</p>
      </div>
    `);
  }
});


// ----------------------------------------------------
// Front End Client / SPA Serve Mounting
// ----------------------------------------------------

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gatekeeper server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start Gatekeeper server", err);
});
