import {createFileRoute} from '@tanstack/react-router'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar.tsx";
import { requireAuth } from '@/utils/routeGuards';

export const Route = createFileRoute('/chat/')({
    beforeLoad: async () => {
        return await requireAuth();
    },
    component: RouteComponent,
})

function RouteComponent() {
    const [open, setOpen] = useState(false)

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
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden mr-2">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[72px] bg-sidebar">
                            <Sidebar />
                        </SheetContent>
                    </Sheet>
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