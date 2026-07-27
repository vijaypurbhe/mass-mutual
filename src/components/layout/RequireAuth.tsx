import { useWorkspace } from "@/context/WorkspaceContext";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

/** Mock persona gate: the demo requires a selected persona before entering the workspace. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { signedIn, personaId } = useWorkspace();
  const location = useLocation();

  if (!signedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (personaId === "customer") {
    return <Navigate to="/self-service" replace />;
  }

  return <>{children}</>;
}
