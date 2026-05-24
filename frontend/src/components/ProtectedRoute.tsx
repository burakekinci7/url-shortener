import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../lib/auth-store";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  // Wait for the store to finish reading localStorage before deciding to
  // redirect. Without this, a logged-in user refreshing /dashboard could
  // momentarily be seen as unauthenticated and bounced to /login.
  if (!hasHydrated) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
