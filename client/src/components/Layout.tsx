import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showBack?: boolean;
}

export default function Layout({ children, className, showBack = true }: LayoutProps) {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 背景纹理层 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: "url('https://images.unsplash.com/photo-1625123627242-97ef1000c6d1?q=80&w=2070&auto=format&fit=crop')",
             backgroundSize: "cover",
             backgroundPosition: "center",
             mixBlendMode: "overlay"
           }} 
      />
      
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 w-full z-50 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo与返回键功能结合 */}
          {showBack && !isHome ? (
            <Link href="/">
              <div className="group flex items-center gap-3 cursor-pointer transition-all duration-300 hover:opacity-80">
                <div className="relative w-12 h-12 rounded-full bg-black/50 border border-primary/30 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                  <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex flex-col">
                  <span className="text-primary font-serif text-lg leading-none group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> 返回首页
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-black/50 border border-primary/30 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-primary font-serif text-xl font-bold tracking-widest">西安隋唐天坛</span>
            </div>
          )}
        </div>
      </header>

      {/* 主内容区域 */}
      <main className={cn("relative z-10 flex-1 w-full", className)}>
        {children}
      </main>
      
      {/* 底部版权 */}
      <footer className="fixed bottom-4 w-full text-center z-40 pointer-events-none">
        <p className="text-white/20 text-xs font-sans">西安隋唐天坛全息影像设计与交互实现 © 2026</p>
      </footer>
    </div>
  );
}
