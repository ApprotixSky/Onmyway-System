import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Terminal, 
  Key, 
  Settings, 
  LogOut,
  Activity
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/files", label: "File System", icon: FolderOpen },
  { href: "/terminal", label: "Terminal", icon: Terminal },
  { href: "/keys", label: "Access Keys", icon: Key },
];

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 md:hidden pb-safe">
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300",
                location === item.href 
                  ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" 
                  : "text-muted-foreground hover:text-foreground"
              )}>
                <item.icon size={24} strokeWidth={2} />
              </div>
            </Link>
          ))}
          <button 
            onClick={() => logout()}
            className="text-destructive p-2 opacity-70 hover:opacity-100"
          >
            <LogOut size={24} />
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 glass border-r border-white/10 z-50">
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-text">
            ONMYWAY
          </h1>
          <p className="text-xs font-mono text-muted-foreground mt-2 tracking-widest">
            PREMIUM SERVER CONSOLE
          </p>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="relative">
              <Activity className="text-primary animate-pulse" size={20} />
              <div className="absolute inset-0 bg-primary/40 blur-lg animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-primary font-bold tracking-wider">GOD MODE</p>
              <p className="text-[10px] text-muted-foreground">SYSTEM ACTIVE</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group cursor-pointer font-medium tracking-wide",
                location === item.href 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_-5px_rgba(6,182,212,0.4)]" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:pl-7"
              )}>
                <item.icon size={20} className={cn(
                  "transition-colors",
                  location === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 w-full px-6 py-4 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 border border-transparent hover:border-destructive/20"
          >
            <LogOut size={20} />
            <span className="font-medium">Disconnect</span>
          </button>
        </div>
      </aside>
    </>
  );
}
