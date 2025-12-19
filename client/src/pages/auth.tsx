import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { LogIn, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Animated Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-primary/20 rotate-3">
                <ShieldCheck className="text-white w-8 h-8" />
              </div>
              <h1 className="text-4xl font-display font-black tracking-widest text-foreground mb-2">ONMYWAY</h1>
              <p className="text-sm font-mono text-primary/80 uppercase tracking-[0.2em]">Restricted Access</p>
            </motion.div>
          </div>

          <div className="space-y-6">
            <p className="text-center text-sm text-muted-foreground">
              Log in with your Replit account to access ONMYWAY.
            </p>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-black font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> Loading...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" /> Log In with Replit
                </>
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-muted-foreground font-mono">
              SECURE CONNECTION ESTABLISHED • ENCRYPTED
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
