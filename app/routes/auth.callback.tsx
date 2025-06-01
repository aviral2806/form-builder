import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { supabase } from "~/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          navigate("/auth?error=callback_error");
          return;
        }

        if (data.session) {
          navigate("/");
        } else {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Unexpected error in auth callback:", error);
        navigate("/auth?error=unexpected_error");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Processing authentication...
        </p>
      </div>
    </div>
  );
}
