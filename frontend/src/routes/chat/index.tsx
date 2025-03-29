import {createFileRoute} from '@tanstack/react-router'
import { useState } from "react"
import { Sidebar } from "@/components/sidebars/sidebar";
import { requireAuth } from '@/utils/routeGuards';
import { useSocket } from '@/hooks/useSocket'
import { MobileSidebar } from "@/components/sidebars/mobile-sidebar";

export const Route = createFileRoute('/chat/')({
    beforeLoad: async () => {
        return await requireAuth();
    },
    component: RouteComponent,
})

function RouteComponent() {
    useSocket()
    const [open, setOpen] = useState(false);
  
  const handleOpenChange = (newState: boolean) => {
    console.log("Mobile sidebar state changing to:", newState);
    setOpen(newState);
    };

    return (
        <div className="flex h-screen bg-chat text-headline">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-[72px] bg-sidebar border-r border-muted/20">
                <Sidebar />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="h-12 border-b border-muted/20 flex items-center px-4">
                    {/* Mobile Sidebar */}
                    <MobileSidebar open={open} onOpenChange={handleOpenChange} />
                    <span className="text-paragraph">No Server Selected</span>
                </div>

                {/* Empty content area */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-paragraph">
                        <p className="text-lg">No chat selected</p>
                        <p className="text-sm">Select a chat from the sidebar or start a new conversation</p>
                    </div>
                </div>
            </div>
        </div>
    )
}