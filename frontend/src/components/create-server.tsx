import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { useCreateServer } from "@/query/useServerActions";
import {toast} from "sonner";

// Updated schema to make iconUrl optional
const serverSchema = z.object({
  name: z.string()
    .min(3, "Server name must be at least 3 characters")
    .max(50, "Server name must be less than 50 characters")
});

type ServerFormValues = z.infer<typeof serverSchema>;

interface CreateServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateServerDialog({ open, onOpenChange }: CreateServerDialogProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: ""
    }
  });

  const createServerMutation = useCreateServer();

  async function onSubmit(data: ServerFormValues) {
    // Pass the file to the mutation
    createServerMutation.mutate({
      ...data,
      iconFile: iconFile || undefined
    }, {
      onSuccess: () => {
        form.reset();
        setPreviewUrl(null);
        setIconFile(null);
        onOpenChange(false);
      }
    });
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Image size should be less than 5MB",
      });
      return;
    }
    
    // Store the file for submission
    setIconFile(file);
    
    // Create URL for preview only
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  function clearPreview() {
    setPreviewUrl(null);
    setIconFile(null);
    // Reset the file input
    const fileInput = document.getElementById("serverIcon") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border border-muted/20 text-headline">
        <DialogHeader>
          <DialogTitle className="font-ogg text-headline text-2xl">Create a Server</DialogTitle>
          <DialogDescription className="text-paragraph">
            Give your server a name and an optional icon.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-2 border-muted/20">
                  {previewUrl ? (
                    <AvatarImage src={previewUrl} alt="Server icon" />
                  ) : (
                    <AvatarFallback className="bg-button text-headline text-xl">
                      {form.watch("name") ? form.watch("name").charAt(0).toUpperCase() : "S"}
                    </AvatarFallback>
                  )}
                </Avatar>
                {previewUrl && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white"
                    onClick={clearPreview}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input
                id="serverIcon"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById("serverIcon")?.click()}
              >
                {previewUrl ? "Change Icon" : "Upload Icon"}
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-pitch-sans-medium text-headline">Server Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a server name"
                      {...field}
                      className="font-pitch-sans-medium text-paragraph focus:bg-white focus:text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="font-pitch-sans-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-button hover:bg-button/80 text-headline font-pitch-sans-medium"
                disabled={createServerMutation.isPending}
              >
                {createServerMutation.isPending ? "Creating..." : "Create Server"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}