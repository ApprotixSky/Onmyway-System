import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useKeys, useCreateKey, useDeleteKey } from "@/hooks/use-keys";
import { Key, Trash2, Copy, Plus, Loader2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function KeysPage() {
  const { data: keys, isLoading } = useKeys();
  const createMutation = useCreateKey();
  const deleteMutation = useDeleteKey();
  const [newLabel, setNewLabel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    await createMutation.mutateAsync(newLabel);
    setNewLabel("");
    setIsOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Copied to clipboard" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-72 p-4 md:p-8 pb-24 md:pb-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">API ACCESS</h2>
            <p className="text-muted-foreground font-mono text-sm mt-1">Manage external access points</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                <Plus size={20} />
                Generate Key
              </button>
            </DialogTrigger>
            <DialogContent className="glass border-white/10 text-foreground sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">New API Key</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-muted-foreground">Key Label</label>
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-foreground focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="e.g. Mobile App Production"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-lg font-bold flex justify-center items-center gap-2"
                >
                  {createMutation.isPending ? <Loader2 className="animate-spin" /> : "Create Access Key"}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-black/20 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <div className="col-span-4">Label</div>
            <div className="col-span-5">API Key</div>
            <div className="col-span-2">Created</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          <div className="divide-y divide-white/5">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading keys...</div>
            ) : (
              <AnimatePresence>
                {keys?.map((key) => (
                  <motion.div
                    key={key.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group"
                  >
                    <div className="col-span-4 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Key size={16} />
                      </div>
                      {key.label}
                    </div>
                    <div className="col-span-5 font-mono text-xs text-muted-foreground flex items-center gap-2 bg-black/20 p-2 rounded w-fit">
                      <span className="truncate max-w-[200px] opacity-50 group-hover:opacity-100 transition-opacity">
                        {key.key}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(key.key)}
                        className="text-primary hover:text-white transition-colors"
                        title="Copy Key"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground">
                      {key.createdAt && format(new Date(key.createdAt), "MMM dd, yyyy")}
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => deleteMutation.mutate(key.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            {keys?.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                  <Key size={32} />
                </div>
                <h3 className="text-lg font-medium">No API Keys</h3>
                <p className="text-muted-foreground mt-1">Generate a key to grant external access</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
