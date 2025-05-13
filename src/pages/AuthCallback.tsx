
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          // Successfully logged in, redirect to profile page
          navigate("/profile");
        } else {
          // No session found, redirect to login page
          navigate("/auth");
          toast({
            title: "Authentication failed",
            description: "Could not complete the authentication process",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error handling auth callback:", error);
        navigate("/auth");
        toast({
          title: "Authentication error",
          description: "There was an error processing your authentication",
          variant: "destructive"
        });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="text-center animate-pulse">
        <div className="rounded-md h-12 w-12 mx-auto mb-4 bg-nexus-purple"></div>
        <h2 className="text-lg font-medium">Finalizing authentication...</h2>
        <p className="text-sm text-muted-foreground mt-2">Please wait while we complete the process.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
