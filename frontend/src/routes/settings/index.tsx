import { createFileRoute } from '@tanstack/react-router'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Camera, Upload, Loader2, UserCog, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { axiosInstance } from "@/lib/axios"
import { useRef, useState } from "react"
import { requireAuth } from "@/utils/routeGuards"

// Username validation schema
const usernameSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be less than 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" })
})

type UserData = {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
}

// API functions
const fetchUserProfile = async (): Promise<UserData> => {
  const response = await axiosInstance.get('/user/profile');
  return response.data;
};

const updateUsername = async (username: string): Promise<void> => {
  await axiosInstance.post('/user/profile/username', { username });
};

const updateAvatar = async (formData: FormData): Promise<void> => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };

  await axiosInstance.post('/user/profile/avatar', formData, config);
};

export const Route = createFileRoute('/settings/')({
  beforeLoad: async () => {
    return await requireAuth();
  },
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch user profile
  const { 
    data: userData, 
    isLoading: isLoadingUser 
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile
  });

  // Username update mutation
  const usernameMutation = useMutation({
    mutationFn: updateUsername,
    onSuccess: () => {
      toast.success("Username updated successfully");
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: () => {
      toast.error("Failed to update username", {
        description: "Please try again"
      });
    }
  });

  // Form for username update
  const usernameForm = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: ""
    }
  });

  // Update form default value when user data is loaded
  if (userData && !usernameForm.formState.isDirty) {
    usernameForm.setValue("username", userData.username);
  }

  // Handle username form submission
  function onSubmitUsername(values: z.infer<typeof usernameSchema>) {
    usernameMutation.mutate(values.username);
  }

  // Handle avatar upload
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // File validation
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please upload an image file"
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error("File too large", {
        description: "Please upload an image smaller than 5MB"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle avatar submission
  const handleAvatarSubmit = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    const formData = new FormData();
    formData.append("avatar", fileInputRef.current.files[0]);

    setIsUploading(true);
    
    try {
      await updateAvatar(formData);
      toast.success("Profile picture updated successfully");
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setAvatarPreview(null);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to update profile picture", {
        description: "Please try again"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (): string => {
    if (!userData?.username) return "U";
    return userData.username.charAt(0).toUpperCase();
  };

  // Handle avatar click (to trigger file input)
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="min-h-[92.8vh] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-3xl"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm" />

        {/* Card Content */}
        <Card className="relative bg-background rounded-2xl shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="font-ogg text-headline text-2xl sm:text-3xl flex items-center gap-3">
                <span className="bg-button/20 p-2 rounded-lg">
                  <UserCog className="h-6 w-6 text-button" />
                </span>
                Settings
              </CardTitle>
              <Link 
                to="/chat" 
                className="group flex items-center gap-2 font-pitch-sans-medium text-paragraph hover:text-headline transition-colors duration-200"
              >
                <span className="bg-button/10 p-2 rounded-lg group-hover:bg-button/20 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4 text-button" />
                </span>
                <span className="hidden sm:inline">Return to Chat</span>
              </Link>
            </div>
            <CardDescription className="font-freight-text-pro-black text-paragraph">
              Manage your profile settings
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-pitch-sans-medium text-headline text-lg">Profile Picture</h3>
                  <div className="h-1 flex-grow mx-4 bg-gradient-to-r from-button/5 to-button/20 rounded-full"></div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-card/30 p-6 rounded-xl border border-button/10">
                  {/* Avatar Display */}
                  <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-button to-headline rounded-full opacity-70 blur group-hover:opacity-100 transition-opacity"></div>
                    <Avatar className="h-24 w-24 border-2 border-background relative">
                      {avatarPreview ? (
                        <AvatarImage src={avatarPreview} alt="Avatar preview" />
                      ) : userData?.avatar_url ? (
                        <AvatarImage src={userData.avatar_url} alt={userData.username} />
                      ) : (
                        <AvatarFallback className="bg-card text-headline text-xl">
                          {isLoadingUser ? <User className="h-10 w-10" /> : getUserInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-paragraph font-freight-text-pro-black">
                      Click on the avatar to upload a new profile picture
                    </p>
                    <p className="text-xs text-paragraph/70">
                      Supported formats: JPG, PNG, GIF (Max size: 5MB)
                    </p>
                    
                    {avatarPreview && (
                      <Button 
                        onClick={handleAvatarSubmit} 
                        disabled={isUploading}
                        className="bg-gradient-to-r from-button to-button/80 hover:opacity-90 text-white font-pitch-sans-medium mt-2 shadow-md transition-all duration-300 ease-in-out"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Save New Avatar
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Username Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-pitch-sans-medium text-headline text-lg">Username</h3>
                  <div className="h-1 flex-grow mx-4 bg-gradient-to-r from-button/5 to-button/20 rounded-full"></div>
                </div>
                
                <div className="bg-card/30 p-6 rounded-xl border border-button/10">
                  <Form {...usernameForm}>
                    <form onSubmit={usernameForm.handleSubmit(onSubmitUsername)} className="space-y-4">
                      <FormField
                        control={usernameForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-pitch-sans-medium text-headline">Display Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                className="font-pitch-sans-medium text-paragraph bg-background border-button/20 focus-within:border-button focus:bg-background/80 transition-all duration-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit"
                        className={`
                          relative overflow-hidden group
                          bg-gradient-to-r from-button to-button/80 
                          hover:opacity-90 text-white font-pitch-sans-medium
                          shadow-md transition-all duration-300 ease-in-out
                          ${(!usernameMutation.isPending && usernameForm.formState.isDirty) ? 'animate-pulse-subtle' : ''}
                        `}
                        disabled={usernameMutation.isPending || !usernameForm.formState.isDirty}
                      >
                        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                        {usernameMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Update Username'
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}