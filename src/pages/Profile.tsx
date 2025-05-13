
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Edit2, UserRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/sonner";
import PageLayout from "@/components/Layout/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import AvatarUpload from "@/components/AvatarUpload";

const Profile: React.FC = () => {
  const { user, loading, session, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    // If there's no user after auth loading is done, redirect to login
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data);
          setUsername(data.username || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, loading, navigate]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      const { error } = await updateProfile({ 
        username,
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

  const handleAvatarUpload = async (url: string) => {
    if (!user) return;
    
    try {
      const { error } = await updateProfile({ 
        avatar_url: url,
        updated_at: new Date().toISOString() 
      });

      if (error) {
        throw error;
      }

      setProfile({ ...profile, avatar_url: url });
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar");
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

  if (loading || loadingProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null; // This should never happen because of the redirect in useEffect
  }

  return (
    <PageLayout>
      <ScrollArea className="h-full w-full">
        <div className="container mx-auto py-8 px-4">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="flex flex-col items-center space-y-4">
              <AvatarUpload 
                url={profile?.avatar_url || null}
                onUpload={handleAvatarUpload}
                size="xl"
                userId={user.id}
              />
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
                            <div className="col-span-2">{profile?.username || user.email?.split('@')[0] || "Not set"}</div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="font-medium text-muted-foreground">Email</div>
                            <div className="col-span-2">{user.email || "Not set"}</div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="font-medium text-muted-foreground">Member Since</div>
                            <div className="col-span-2">{formatDate(user.created_at)}</div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="font-medium text-muted-foreground">Last Sign In</div>
                            <div className="col-span-2">{formatDate(user.last_sign_in_at)}</div>
                          </div>
                          
                          {user.app_metadata?.provider && (
                            <div className="grid grid-cols-3 gap-4">
                              <div className="font-medium text-muted-foreground">Sign In Method</div>
                              <div className="col-span-2 capitalize">{user.app_metadata.provider}</div>
                            </div>
                          )}
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
