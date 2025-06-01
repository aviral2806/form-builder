import { useAuth } from "~/hooks/useAuth";
import { Navigate } from "@remix-run/react";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/auth",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to access this page", {
        duration: 4000,
        position: "top-center",
      });
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
