export interface User {
  email: string;
  name: string;
  picture: string;
  isAdmin: boolean;
  isAllowed: boolean;
  authType: "Demo" | "Google OAuth";
  loggedInAt: string;
  role: "Developer" | "Admin" | "User";
}

export interface AccessRequest {
  email: string;
  name: string;
  picture: string;
  status: "pending" | "approved" | "denied";
  requestedAt: string;
  reason?: string;
}

export interface AuditLog {
  id: string;
  email: string;
  name: string;
  status: "granted" | "denied";
  timestamp: string;
  authType: "Demo" | "Google OAuth";
  reason: string;
}

export interface AdminData {
  allowedEmails: string[];
  userRoles: Record<string, "Developer" | "Admin" | "User">;
  accessRequests: AccessRequest[];
  logs: AuditLog[];
  config: {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    ADMIN_EMAIL: string;
    APP_URL?: string;
  };
}
