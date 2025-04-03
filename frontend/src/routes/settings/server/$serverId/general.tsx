import { createFileRoute } from '@tanstack/react-router';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { requireAuth } from "@/utils/routeGuards";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, Upload, ServerCog } from "lucide-react";
import { motion } from "motion/react";
import { useServerDetails } from '@/queries/ServerQueries';
import { useUpdateServerName, useUpdateServerIcon } from '@/actions/useServerActions';

// Define the server details schema for the form
const serverDetailsSchema = z.object({
  name: z.string()
    .min(3, { message: "Server name must be at least 3 characters" })
    .max(30, { message: "Server name must be less than 30 characters" })
});

export const Route = createFileRoute('/settings/server/$serverId/general')({
  beforeLoad: async ({ params }) => {
    await requireAuth();
    return { serverId: params.serverId };
  },
  component: ServerGeneralSettings,
});

function ServerGeneralSettings() {
  const { serverId } = Route.useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const {data: server} = useServerDetails(serverId);
  const updateServerName = useUpdateServerName();
  const updateServerIcon = useUpdateServerIcon();
  
  // Initialize form with schema
  const serverDetailsForm = useForm<z.infer<typeof serverDetailsSchema>>({
    resolver: zodResolver(serverDetailsSchema),
    defaultValues: {
      name: "",
    },
  });
  
  // Update form default values when server data is loaded
  if (server && !serverDetailsForm.formState.isDirty) {
    serverDetailsForm.setValue("name", server.name);
  }
  
  // Handle server details form submission
  function onSubmitServerDetails(values: z.infer<typeof serverDetailsSchema>) {
    updateServerName.mutate({ 
      serverId, 
      name: values.name 
    });
  }
  
  // Get server initial for avatar fallback
  const getServerInitial = () => {
    if (!server?.name) return "S";
    return server.name.charAt(0).toUpperCase();
  };
  
  // Handle icon upload
  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setIconPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle icon submission
  const handleIconSubmit = async () => {
    if (!fileInputRef.current?.files?.[0]) return;
    
    setIsUploading(true);
    
    try {
      // Use the action hook instead of direct API call
      await updateServerIcon.mutateAsync({ 
        serverId, 
        iconFile: fileInputRef.current.files[0] 
      });
      
      setIconPreview(null);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      // Error is handled in the mutation
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle avatar click (to trigger file input)
  const handleIconClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-10"
    >
      <div className="flex items-center gap-2 border-b border-border/40 pb-4">
        <ServerCog className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">General Settings</h2>
      </div>
      
      {/* Server Icon Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">Server Icon</h3>
          <div className="h-px flex-grow ml-4 bg-border/40"></div>
        </div>
        
        <div className="bg-card/50 p-6 rounded-lg border border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Icon Upload UI */}
            <div className="relative group cursor-pointer" onClick={handleIconClick}>
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/60 to-primary/30 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <Avatar className="h-24 w-24 border-2 border-background relative">
                {iconPreview ? (
                  <AvatarImage src={iconPreview} alt="Icon preview" className="object-cover" />
                ) : server?.iconUrl ? (
                  <AvatarImage src={server.iconUrl} alt={server.name} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-bold">
                    {getServerInitial()}
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
                onChange={handleIconUpload}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Click on the icon to upload a new server image
              </p>
              <p className="text-xs text-muted-foreground/70">
                Supported formats: JPG, PNG, GIF (Max size: 5MB)
              </p>
              
              {iconPreview && (
                <Button 
                  onClick={handleIconSubmit} 
                  disabled={isUploading || updateServerIcon.isPending}
                  size="sm"
                  className="mt-2"
                >
                  {isUploading || updateServerIcon.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Save Icon
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Server Details Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">Server Details</h3>
          <div className="h-px flex-grow ml-4 bg-border/40"></div>
        </div>
        
        <div className="bg-card/50 p-6 rounded-lg border border-border/40">
          <Form {...serverDetailsForm}>
            <form onSubmit={serverDetailsForm.handleSubmit(onSubmitServerDetails)} className="space-y-6">
              <FormField
                control={serverDetailsForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Server Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="My Awesome Server"
                        className="bg-background/50 border-border/50 focus:border-primary"
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed to all members
                    </FormDescription>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  disabled={updateServerName.isPending || !serverDetailsForm.formState.isDirty}
                >
                  {updateServerName.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </motion.div>
  );
}