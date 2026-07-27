import type { PersonaId } from "@/types";
import {
  BarChart3,
  Briefcase,
  ClipboardList,
  FileText,
  FolderOpen,
  Home,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  type LucideIcon,
  MessagesSquare,
  Search,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

export type Capability =
  | "view_client_360"
  | "view_audit_tab"
  | "reveal_sensitive"
  | "create_case"
  | "start_claim"
  | "bulk_reassign"
  | "view_analytics"
  | "view_admin"
  | "view_planning"
  | "use_copilot"
  | "approve_work";

export const CAPABILITIES: Record<PersonaId, Capability[]> = {
  service_rep: ["view_client_360", "reveal_sensitive", "create_case", "start_claim", "use_copilot", "view_planning"],
  advisor: ["view_client_360", "reveal_sensitive", "create_case", "view_planning", "use_copilot", "view_analytics"],
  back_office: ["view_client_360", "reveal_sensitive", "create_case", "start_claim", "use_copilot", "approve_work"],
  manager: ["view_client_360", "create_case", "bulk_reassign", "view_analytics", "use_copilot", "approve_work", "view_audit_tab"],
  admin: ["view_client_360", "view_audit_tab", "view_admin", "view_analytics", "reveal_sensitive"],
  customer: [],
};

export const can = (persona: PersonaId, capability: Capability) => CAPABILITIES[persona].includes(capability);

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badgeKey?: "myWork" | "cases" | "claims" | "exceptions" | "approvals";
}

export const NAV_BY_PERSONA: Record<PersonaId, NavItem[]> = {
  service_rep: [
    { label: "Home", to: "/home", icon: Home },
    { label: "Client Search", to: "/search", icon: Search },
    { label: "My Work", to: "/work", icon: ListChecks, badgeKey: "myWork" },
    { label: "Cases", to: "/work?tab=cases", icon: Briefcase, badgeKey: "cases" },
    { label: "Claims", to: "/work?tab=claims", icon: LifeBuoy, badgeKey: "claims" },
    { label: "Knowledge", to: "/knowledge", icon: MessagesSquare },
    { label: "Documents", to: "/documents", icon: FolderOpen },
  ],
  advisor: [
    { label: "Advisor Home", to: "/home", icon: Home },
    { label: "Clients & Households", to: "/search", icon: Users },
    { label: "Opportunities & Referrals", to: "/work?tab=referrals", icon: Sparkles },
    { label: "Financial Planning", to: "/work?tab=planning", icon: ClipboardList },
    { label: "Policies & Portfolio", to: "/search?scope=policies", icon: FileText },
    { label: "Tasks", to: "/work?tab=tasks", icon: ListChecks, badgeKey: "myWork" },
    { label: "Insights", to: "/analytics", icon: BarChart3 },
  ],
  back_office: [
    { label: "Work Queue", to: "/work", icon: ListChecks, badgeKey: "myWork" },
    { label: "Applications", to: "/work?tab=applications", icon: FileText },
    { label: "Exceptions", to: "/work?tab=exceptions", icon: Shield, badgeKey: "exceptions" },
    { label: "Documents", to: "/documents", icon: FolderOpen },
    { label: "Policies", to: "/search?scope=policies", icon: Briefcase },
    { label: "Collaboration", to: "/knowledge", icon: MessagesSquare },
  ],
  manager: [
    { label: "Command Center", to: "/home", icon: LayoutDashboard },
    { label: "Operations", to: "/work?tab=team", icon: ListChecks, badgeKey: "myWork" },
    { label: "Team Performance", to: "/analytics?dash=service", icon: BarChart3 },
    { label: "Customer Experience", to: "/analytics?dash=cx", icon: Users },
    { label: "Risk & Compliance", to: "/analytics?dash=ai", icon: Shield },
  ],
  admin: [
    { label: "Home", to: "/home", icon: Home },
    { label: "Administration", to: "/admin", icon: Shield },
    { label: "Analytics", to: "/analytics", icon: BarChart3 },
    { label: "Search", to: "/search", icon: Search },
    { label: "Documents", to: "/documents", icon: FolderOpen },
  ],
  customer: [
    { label: "Overview", to: "/self-service", icon: Home },
    { label: "My Policies", to: "/self-service?view=policies", icon: FileText },
    { label: "My Accounts", to: "/self-service?view=accounts", icon: Briefcase },
    { label: "Claims", to: "/self-service?view=claims", icon: LifeBuoy },
    { label: "Documents", to: "/self-service?view=documents", icon: FolderOpen },
    { label: "Messages", to: "/self-service?view=messages", icon: MessagesSquare },
    { label: "Profile & Preferences", to: "/self-service?view=profile", icon: Users },
  ],
};

export const HOME_TITLE: Record<PersonaId, string> = {
  service_rep: "Service Representative Home",
  advisor: "Advisor Home",
  back_office: "Back-Office Work Home",
  manager: "Operations Command Center",
  admin: "Governance Home",
  customer: "My Overview",
};
