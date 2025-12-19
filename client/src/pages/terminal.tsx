import { useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useLogs } from "@/hooks/use-logs";
import { Terminal as TerminalIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function TerminalPage() {
  const { data: logs, isLoading } = useLogs();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-72 p-4 md:p-8 pb-24 md:pb-8 flex flex-col h-screen overflow-hidden">
        <header className="mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
            <TerminalIcon className="text-primary" />
            LIVE TERMINAL
          </h2>
        </header>

        <div className="flex-1 glass rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
          {/* Terminal Header */}
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="text-xs font-mono text-muted-foreground">root@server:~</div>
            <div className="w-10"></div>
          </div>

          {/* Terminal Body */}
          <div className="flex-1 bg-black/80 p-6 font-mono text-sm overflow-y-auto font-medium">
            {isLoading ? (
              <div className="text-primary animate-pulse">Initializing connection stream...</div>
            ) : (
              <div className="space-y-2">
                <div className="text-muted-foreground pb-4">
                  Last login: {format(new Date(), "EEE MMM dd HH:mm:ss")} on ttys001
                  <br />
                  System uptime: 14 days, 23 hours
                </div>
                
                {logs?.map((log) => (
                  <div key={log.id} className="flex gap-4 group hover:bg-white/5 p-1 -mx-1 rounded">
                    <span className="text-muted-foreground shrink-0 w-36">
                      [{log.timestamp ? format(new Date(log.timestamp), "HH:mm:ss.SSS") : "--:--:--"}]
                    </span>
                    <span className={cn(
                      "shrink-0 w-24 uppercase font-bold",
                      log.action === "ERROR" ? "text-destructive" : 
                      log.action === "LOGIN" ? "text-primary" : 
                      "text-secondary"
                    )}>
                      {log.action}
                    </span>
                    <span className="text-foreground/80 break-all">{log.details}</span>
                  </div>
                ))}
                
                <div ref={bottomRef} className="flex gap-2 items-center pt-2">
                  <span className="text-green-500">➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="w-2.5 h-5 bg-foreground/50 animate-pulse block" />
                </div>
              </div>
            )}
          </div>
          
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
        </div>
      </main>
    </div>
  );
}
