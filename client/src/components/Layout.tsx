import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";
import { sound } from "@/lib/sound";
import { useState } from "react";
import { AboutDialog } from "./AboutDialog";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showBack?: boolean;
}

export default function Layout({ children, className, showBack = true }: LayoutProps) {
  const [location] = useLocation();
  const isHome = location === "/";
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const toggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 背景纹理层 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-100" 
           style={{ 
             backgroundImage: "linear-gradient(rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.7)), url('/bg.jpg')",
             backgroundSize: "cover",
             backgroundPosition: "center",

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
                <img src="/logo_new.png" alt="Logo" className="w-20 h-20 object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" />
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <img src="/logo_new.png" alt="Logo" className="w-20 h-20 object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" />
              {/* 移除了文字 "西安隋唐天坛" */}
            </div>
          )}
        </div>

        {/* 右上角功能区 */}
        <div className="flex items-center gap-3">
          <AboutDialog />
          <button 
            onClick={toggleMute}
            className="p-3 rounded-full bg-black/50 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary transition-all duration-300 group"
            title={isMuted ? "开启音效" : "关闭音效"}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
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
