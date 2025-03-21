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
import { Textarea } from "@/components/ui/textarea";
import { useCreateChannel } from "@/query/useChannel";
import { Hash } from "lucide-react";

const channelSchema = z.object({
  name: z.string()
    .min(3, "Channel name must be at least 3 characters")
    .max(50, "Channel name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9-_]+$/, "Channel name can only contain letters, numbers, hyphens, and underscores"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

type ChannelFormValues = z.infer<typeof channelSchema>;

interface CreateChannelDialogProps {
  serverId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateChannelDialog({ serverId, open, onOpenChange }: CreateChannelDialogProps) {
  const form = useForm<ChannelFormValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const createChannelMutation = useCreateChannel();

  async function onSubmit(data: ChannelFormValues) {
    createChannelMutation.mutate(
      { 
        serverId, 
        name: data.name, 
        description: data.description 
      }, 
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        }
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border border-muted/20 text-headline">
        <DialogHeader>
          <DialogTitle className="font-ogg text-headline text-2xl">Create a Channel</DialogTitle>
          <DialogDescription className="text-paragraph">
            Channels are where conversations happen. Only server owners can create channels.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-pitch-sans-medium text-headline">Channel Name</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2 relative">
                      <Hash className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="general"
                        {...field}
                        className="font-pitch-sans-medium text-paragraph focus:bg-white focus:text-black pl-8"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-pitch-sans-medium text-headline">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's this channel about?"
                      {...field}
                      className="font-pitch-sans-medium text-paragraph focus:bg-white focus:text-black resize-none"
                      maxLength={200}
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
                disabled={createChannelMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-button hover:bg-button/80 text-headline font-pitch-sans-medium"
                disabled={createChannelMutation.isPending}
              >
                {createChannelMutation.isPending ? "Creating..." : "Create Channel"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}