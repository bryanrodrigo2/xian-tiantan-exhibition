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
              <div className="group flex items-center gap-3 cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105">
                {/* 仅保留放大的Logo，移除背景圆圈和文字 */}
                <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" />
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" />
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
