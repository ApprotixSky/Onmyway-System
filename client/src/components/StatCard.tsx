import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "secondary" | "accent" | "destructive";
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  color = "primary",
  delay = 0 
}: StatCardProps) {
  const colors = {
    primary: "text-primary from-primary/20 to-primary/5 border-primary/20",
    secondary: "text-secondary from-secondary/20 to-secondary/5 border-secondary/20",
    accent: "text-accent from-accent/20 to-accent/5 border-accent/20",
    destructive: "text-destructive from-destructive/20 to-destructive/5 border-destructive/20",
  };

  const iconColors = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br",
        colors[color],
        "border-white/5 bg-card/40"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-display font-bold mt-2 text-foreground tracking-tight">{value}</h3>
          {trend && (
            <p className={cn(
              "text-xs mt-2 font-mono flex items-center gap-1",
              trendUp ? "text-green-400" : "text-red-400"
            )}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconColors[color])}>
          <Icon size={24} />
        </div>
      </div>
      
      {/* Decorative background glow */}
      <div className={cn(
        "absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-20 pointer-events-none",
        color === "primary" && "bg-primary",
        color === "secondary" && "bg-secondary",
        color === "accent" && "bg-accent",
        color === "destructive" && "bg-destructive"
      )} />
    </motion.div>
  );
}
