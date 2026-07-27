export const DEMO_AUTH_KEY = "demo_auth_email";
export const DEMO_LOGIN_LOG_KEY = "demo_login_audit_log";
export const TECH_MAHINDRA_DOMAIN = "@techmahindra.com";
export const LOGIN_REPORT_ADMIN_EMAIL = "vijay.purbhe@techmahindra.com";

export interface LoginAuditEntry {
  id: string;
  email: string;
  loggedInAt: string;
  userAgent: string;
}

const isBrowser = typeof window !== "undefined";

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const isAllowedDemoEmail = (email: string) =>
  normalizeEmail(email).endsWith(TECH_MAHINDRA_DOMAIN);

export const isLoginReportAdmin = (email: string | null | undefined) =>
  normalizeEmail(email ?? "") === LOGIN_REPORT_ADMIN_EMAIL;

export const getAuthenticatedEmail = () => {
  if (!isBrowser) return null;
  return sessionStorage.getItem(DEMO_AUTH_KEY);
};

export const setAuthenticatedEmail = (email: string) => {
  if (!isBrowser) return;
  sessionStorage.setItem(DEMO_AUTH_KEY, normalizeEmail(email));
};

export const clearAuthenticatedEmail = () => {
  if (!isBrowser) return;
  sessionStorage.removeItem(DEMO_AUTH_KEY);
};

export const getLoginAuditLog = (): LoginAuditEntry[] => {
  if (!isBrowser) return [];

  try {
    const raw = localStorage.getItem(DEMO_LOGIN_LOG_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const appendLoginAuditEntry = (email: string) => {
  if (!isBrowser) return;

  const entry: LoginAuditEntry = {
    id: crypto.randomUUID(),
    email: normalizeEmail(email),
    loggedInAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  const entries = [entry, ...getLoginAuditLog()];
  localStorage.setItem(DEMO_LOGIN_LOG_KEY, JSON.stringify(entries));
};
