import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function ComparisonFullscreen() {
  const [, setLocation] = useLocation();
  const [sliderValue, setSliderValue] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  // 处理滑动条拖动逻辑（鼠标）
  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderValue(percentage);
  };

  // 处理触摸事件（移动端）
  const handleTouchStart = () => setIsResizing(true);
  const handleTouchEnd = () => setIsResizing(false);
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!isResizing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderValue(percentage);
  };

  // 注册全局鼠标和触摸事件监听
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isResizing]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* 左上角Logo - 点击返回上一页 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-6 z-50 cursor-pointer"
        onClick={() => setLocation("/interaction")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img 
          src="/logo_new.png" 
          alt="Logo" 
          className="w-12 h-12 drop-shadow-2xl hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all duration-300"
        />
      </motion.div>

      {/* 全屏古今对比容器 */}
      <div 
        ref={containerRef}
        className="relative w-full h-full cursor-ew-resize select-none"
      >
        {/* 底层：现状遗址（右侧） */}
        <div className="absolute inset-0 bg-gray-900">
          <img 
            src="/xianzhuangyizhi.png" 
            alt="现状遗址" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
            <p className="text-white/90 text-lg md:text-2xl font-bold">现状遗址</p>
            <p className="text-white/60 text-xs md:text-sm mt-1">Current Site</p>
          </div>
        </div>

        {/* 顶层：复原模型（左侧） */}
        <div 
          className="absolute inset-0 bg-amber-900"
          style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
        >
          <img 
            src="https://placehold.co/1920x1080/5d4037/FFF?text=Restored+Tang+Model" 
            alt="唐代复原" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 bg-primary/90 backdrop-blur-sm px-6 py-3 rounded-lg border border-black/20">
            <p className="text-black text-lg md:text-2xl font-bold">唐代复原</p>
            <p className="text-black/70 text-xs md:text-sm mt-1">Tang Dynasty Restoration</p>
          </div>
        </div>

        {/* 滑动条控制杆 */}
        <div 
          className="absolute top-0 bottom-0 w-1 md:w-2 bg-white cursor-ew-resize z-10 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          style={{ left: `${sliderValue}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-primary rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8L22 12L18 16" />
                <path d="M6 8L2 12L6 16" />
              </svg>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
