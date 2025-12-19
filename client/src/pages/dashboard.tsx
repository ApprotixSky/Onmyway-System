import { useStats } from "@/hooks/use-stats";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { Cpu, HardDrive, Wifi, Activity, Clock, Server } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "framer-motion";

function Gauge({ value, label, color = "#06b6d4" }: { value: number; label: string; color?: string }) {
  const data = [
    { name: "Value", value: value },
    { name: "Remaining", value: 100 - value },
  ];

  return (
    <div className="relative h-48 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="rgba(255,255,255,0.05)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-2 text-center">
        <div className="text-3xl font-display font-bold text-foreground">{value}%</div>
        <div className="text-xs font-mono text-muted-foreground uppercase">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { current, history, isLoading } = useStats();

  if (isLoading || !current) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <Activity className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-72 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <header className="mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-display font-bold text-foreground">SYSTEM OVERVIEW</h2>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              SERVER STATUS: <span className="text-green-500 font-bold glow">ONLINE</span>
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="CPU Load"
            value={`${current.cpu}%`}
            icon={Cpu}
            trend="Stable"
            trendUp={true}
            color="primary"
            delay={0.1}
          />
          <StatCard
            title="Memory Usage"
            value={`${current.memory}%`}
            icon={HardDrive}
            trend="High Load"
            trendUp={false}
            color="secondary"
            delay={0.2}
          />
          <StatCard
            title="Network Traffic"
            value={`${(current.networkDown / 1024).toFixed(1)} Mb/s`}
            icon={Wifi}
            color="accent"
            delay={0.3}
          />
          <StatCard
            title="Uptime"
            value={formatUptime(current.uptime)}
            icon={Clock}
            color="primary"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Gauges Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6 border border-white/5"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Server size={18} className="text-primary" />
              Resource Allocation
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Gauge value={current.cpu} label="CPU Core" color="#06b6d4" />
              <Gauge value={current.memory} label="RAM" color="#8b5cf6" />
            </div>
          </motion.div>

          {/* Main Chart Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 glass rounded-2xl p-6 border border-white/5"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              Performance History
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history || []}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                  <Area type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorMem)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-6 border border-white/5"
          >
             <h3 className="text-lg font-bold mb-4">Network Activity</h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="font-mono text-sm">INBOUND</span>
                 </div>
                 <span className="font-display text-primary">{current.networkDown} Kbps</span>
               </div>
               <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                   <span className="font-mono text-sm">OUTBOUND</span>
                 </div>
                 <span className="font-display text-secondary">{current.networkUp} Kbps</span>
               </div>
             </div>
           </motion.div>
        </div>
      </main>
    </div>
  );
}
