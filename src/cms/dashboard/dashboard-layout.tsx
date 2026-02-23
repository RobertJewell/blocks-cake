import { Button } from "@/cms/ui/button";
import { cn } from "@/lib/utils";
import { IconFiles, IconWorld } from "@tabler/icons-react";
import { useState } from "react";

type DashboardView = "pages" | "globals";

interface DashboardLayoutProps {
  children: (view: DashboardView) => React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // TODO - we should probably move this to nuqs
  const [currentView, setCurrentView] = useState<DashboardView>("pages");

  const navItems = [
    { id: "pages" as const, label: "Pages", icon: IconFiles },
    { id: "globals" as const, label: "Globals", icon: IconWorld },
  ];

  return (
    <div className="flex h-screen font-editor">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-background flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-accent text-accent-foreground",
                    )}
                    onClick={() => setCurrentView(item.id)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children(currentView)}</main>
    </div>
  );
}
