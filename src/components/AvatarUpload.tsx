
import React, { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface AvatarUploadProps {
  url: string | null;
  onUpload: (url: string) => void;
  size?: "sm" | "md" | "lg" | "xl";
  userId: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  url, 
  onUpload,
  size = "lg",
  userId
}) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);

  // Define avatar size based on the prop
  const avatarSize = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-40 w-40"
  }[size];

  // Function to upload avatar
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${uuidv4()}.${fileExt}`;

      // Create a storage bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('avatars');
      if (bucketError && bucketError.message.includes('does not exist')) {
        await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024, // 1MB
        });
      }

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error("Failed to get public URL for the uploaded image.");
      }

      setAvatarUrl(data.publicUrl);
      onUpload(data.publicUrl);

      toast({
        title: "Success!",
        description: "Avatar uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setUploading(true);

      // If we have an avatar URL, extract the path
      if (avatarUrl) {
        const path = avatarUrl.split("/avatars/")[1];
        if (path) {
          // Remove the file from storage
          await supabase.storage.from("avatars").remove([path]);
        }
      }

      // Clear the avatar URL
      setAvatarUrl(null);
      onUpload("");

      toast({
        title: "Success!",
        description: "Avatar removed successfully.",
      });
    } catch (error: any) {
      console.error("Error removing avatar:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while removing the avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className={`${avatarSize} relative group`}>
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt="User avatar" className="object-cover" />
        ) : (
          <AvatarFallback className="bg-nexus-purple text-white flex items-center justify-center">
            <Camera className="w-1/2 h-1/2" />
          </AvatarFallback>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
          <label className="cursor-pointer flex items-center justify-center w-full h-full">
            <input
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={uploadAvatar}
            />
            <Upload className="text-white w-8 h-8" />
          </label>
        </div>
      </Avatar>

      <div className="flex gap-2">
        <label className="cursor-pointer">
          <input
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden"
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={uploadAvatar}
          />
          <Button 
            variant="outline" 
            size="sm"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Change Avatar"}
          </Button>
        </label>

        {avatarUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={removeAvatar}
            disabled={uploading}
            className="text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4 mr-1" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
