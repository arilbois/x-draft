import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PasswordProtect({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("is_authenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_PAGE_PASSWORD || "rahasia";

    if (password === correctPassword) {
      toast.success("Akses diberikan. Selamat datang!");
      // Kasih sedikit jeda sebelum masuk untuk efek smooth
      setTimeout(() => {
        setIsAuthenticated(true);
        localStorage.setItem("is_authenticated", "true");
      }, 600);
    } else {
      toast.error("Password tidak valid.");
      setPassword("");
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin text-primary">
          <Lock size={32} />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <div className="animate-in fade-in duration-700">{children}</div>;
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-8">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-10 transition-all duration-500 hover:bg-white/[0.07]">
          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Icon Header */}
            <div 
              className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg",
                isHovered ? "bg-primary text-primary-foreground rotate-12 scale-110 shadow-primary/25" : "bg-white/10 text-white/80"
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <ShieldCheck className="w-10 h-10" />
            </div>

            {/* Texts */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Akses Eksklusif
              </h1>
              <p className="text-sm sm:text-base text-slate-400 font-medium">
                Sistem mendeteksi bahwa halaman ini sedang dikunci. Verifikasi hak akses Anda.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4 pt-4">
              <div className="relative group">
                <Input
                  type="password"
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-5 pr-12 text-lg text-center bg-black/40 border-white/10 text-white placeholder:text-white/30 rounded-2xl focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors duration-300">
                  <Lock size={20} />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 bg-primary/90 hover:bg-primary"
              >
                <span>Buka Kunci</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            <p className="text-xs text-slate-500 mt-6 font-medium tracking-wider uppercase">
              Secure Project Sandbox
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
