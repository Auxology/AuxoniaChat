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
import { useRequestJoinServer } from "@/actions/useServerActions";

// Schema for server join form
const joinServerSchema = z.object({
  serverId: z.string().uuid("Invalid server ID format")
});

type JoinServerFormValues = z.infer<typeof joinServerSchema>;

interface JoinServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinServerDialog({ open, onOpenChange }: JoinServerDialogProps) {
  const form = useForm<JoinServerFormValues>({
    resolver: zodResolver(joinServerSchema),
    defaultValues: {
      serverId: ""
    }
  });

  const requestJoinServerMutation = useRequestJoinServer();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: JoinServerFormValues) {
    setIsLoading(true);
    requestJoinServerMutation.mutate(data.serverId, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border border-muted/20 text-headline z-[9999]">
        <DialogHeader>
          <DialogTitle className="font-ogg text-headline text-2xl">Request to Join a Server</DialogTitle>
          <DialogDescription className="text-paragraph">
            Enter the server ID to request joining an existing server. Server owners will need to approve your request.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="serverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-pitch-sans-medium text-headline">Server ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
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
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-button hover:bg-button/80 text-headline font-pitch-sans-medium w-full sm:w-auto"
                disabled={isLoading}
              >
                {isLoading ? "Sending request..." : "Request to Join"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}