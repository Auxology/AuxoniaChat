import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { useEffect } from "react";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerClassName?: string;
}

export function MobileSidebar({ 
  open, 
  onOpenChange,
  triggerClassName = "md:hidden mr-2"
}: MobileSidebarProps) {
  // Debug logging
  useEffect(() => {
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={true}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={triggerClassName}>
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="p-0 w-[100px] bg-sidebar fixed inset-y-0 left-0 z-[9999] border-r border-border flex flex-col"
        forceMount
      >
        <SheetTitle className="sr-only">Navigation Sidebar</SheetTitle>
        <SheetDescription className="sr-only">
          Sidebar navigation for accessing servers and direct messages
        </SheetDescription>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="absolute right-2 top-2 z-10 h-7 w-7 bg-sidebar/80 rounded-full"
        >
          <X className="h-4 w-4 text-white" />
        </Button>
        
        <div className="pt-9 flex-1">
          <ScrollArea className="h-full">
            <Sidebar />
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}