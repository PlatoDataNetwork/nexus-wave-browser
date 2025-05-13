
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/Auth/LoginForm";
import SignupForm from "@/components/Auth/SignupForm";
import { motion } from "framer-motion";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<string>("signup");

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-gradient-to-b from-nexus-header-blue to-nexus-purple/30">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/90 backdrop-blur-sm border border-border/40 rounded-xl shadow-xl p-6 md:p-8"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Join Nexus Wave</h1>
            <p className="text-muted-foreground">
              {activeTab === "signup" 
                ? "Create an account to access all features" 
                : "Welcome back to Nexus Wave"}
            </p>
          </div>

          <Tabs 
            defaultValue="signup" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="signup">Create account</TabsTrigger>
              <TabsTrigger value="login">Sign in</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signup" className="mt-0">
              <SignupForm />
            </TabsContent>
            
            <TabsContent value="login" className="mt-0">
              <LoginForm />
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{" "}
              <a href="#" className="underline text-primary hover:text-primary/80">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline text-primary hover:text-primary/80">
                Privacy Policy
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
