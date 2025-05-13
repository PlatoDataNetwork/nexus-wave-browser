
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Edit2, UserRound, ShieldCheck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import PageLayout from "@/components/Layout/PageLayout";

interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  email: string | null;
  created_at: string | null;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Please sign in to view your profile");
          return;
        }

        // Get user profile from the profiles table
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Could not load profile data");
          return;
        }

        if (data) {
          setProfile({
            id: data.id,
            username: data.username,
            avatar_url: data.avatar_url,
            email: session.user.email,
            created_at: session.user.created_at
          });
          setUsername(data.username || "");
        } else {
          // Handle case where profile doesn't exist
          setProfile({
            id: session.user.id,
            username: session.user.email?.split('@')[0] || null,
            avatar_url: null,
            email: session.user.email,
            created_at: session.user.created_at
          });
          setUsername(session.user.email?.split('@')[0] || "");
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({ 
          id: profile.id, 
          username: username,
          updated_at: new Date().toISOString() 
        });

      if (error) {
        throw error;
      }

      setProfile({ ...profile, username });
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <PageLayout>
      <ScrollArea className="h-full w-full">
        <div className="container mx-auto py-8 px-4">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="flex flex-col items-center space-y-2">
              <Avatar className="h-24 w-24">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile?.username || "User"} />
                ) : (
                  <AvatarFallback className="bg-nexus-purple text-white text-2xl">
                    <UserRound className="h-12 w-12" />
                  </AvatarFallback>
                )}
              </Avatar>
              <CardTitle className="text-2xl">My Profile</CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal">Personal Information</TabsTrigger>
                  <TabsTrigger value="security">Security & Privacy</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Personal Details</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setEditing(!editing)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        {editing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      {editing ? (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input 
                              id="username" 
                              value={username} 
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                          <Button 
                            onClick={handleUpdateProfile}
                            className="bg-nexus-purple hover:bg-nexus-purple/90"
                          >
                            Save Changes
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="font-medium text-muted-foreground">Username</div>
                            <div className="col-span-2">{profile?.username || "Not set"}</div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="font-medium text-muted-foreground">Email</div>
                            <div className="col-span-2">{profile?.email || "Not set"}</div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="font-medium text-muted-foreground">Member Since</div>
                            <div className="col-span-2">{formatDate(profile?.created_at)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-nexus-purple" />
                      <h3 className="text-lg font-medium">Security Settings</h3>
                    </div>
                    
                    <Separator />
                    
                    <p className="text-muted-foreground text-sm">
                      Security settings will be available in a future update. For now, 
                      you can manage your password and account security through your 
                      profile settings.
                    </p>
                    
                    <Button variant="outline" disabled>
                      Change Password
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-4">
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardFooter>
          </Card>
        </div>
      </ScrollArea>
    </PageLayout>
  );
};

export default Profile;
