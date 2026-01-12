import Layout from "@/components/Layout";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Maximize, MousePointer2, Keyboard } from "lucide-react";

export default function Interaction() {
  const [sliderValue, setSliderValue] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // 启动交互时显示引导
  const handleStartInteraction = () => {
    setShowGuide(true);
    // 5秒后自动隐藏引导
    setTimeout(() => setShowGuide(false), 5000);
  };

  // 处理滑动条拖动
  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderValue(percentage);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <Layout>
      <div className="container mx-auto py-8 h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">交互复原</h1>
          <p className="text-white/60 tracking-widest">INTERACTIVE RESTORATION</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* 左侧：UE交互区域 (8列) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-black/60 border border-primary/30 rounded-xl overflow-hidden relative aspect-video shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {/* UE5 Pixel Streaming 嵌入区域 */}
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center p-8">
                  <p className="text-blue-400 font-mono text-lg mb-4 code-text">
                    // UE5 Pixel Streaming Integration Code<br/>
                    // const pixelStreaming = new PixelStreaming(config);<br/>
                    // pixelStreaming.connect();
                  </p>
                  <p className="text-white/50 mb-6">点击下方按钮启动交互体验</p>
                  <Button 
                    size="lg" 
                    className="bg-primary text-black hover:bg-primary/80 font-bold px-8 py-6 text-lg glow-effect"
                    onClick={handleStartInteraction}
                  >
                    <Play className="mr-2 w-6 h-6" /> 启动祭祀大典交互
                  </Button>
                </div>
              </div>
              
              {/* 新手引导动画层 */}
              {showGuide && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center pointer-events-none"
                >
                  <div className="flex gap-12">
                    {/* 键盘引导 */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-32 h-24">
                        <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 border-2 border-primary rounded flex items-center justify-center text-primary font-bold bg-white/10"
                        >W</motion.div>
                        <div className="absolute bottom-0 left-0 w-10 h-10 border-2 border-white/50 rounded flex items-center justify-center text-white/50 font-bold">A</div>
                        <motion.div 
                          animate={{ y: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 border-2 border-white/50 rounded flex items-center justify-center text-white/50 font-bold"
                        >S</motion.div>
                        <div className="absolute bottom-0 right-0 w-10 h-10 border-2 border-white/50 rounded flex items-center justify-center text-white/50 font-bold">D</div>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Keyboard className="w-5 h-5" />
                        <span>移动位置</span>
                      </div>
                    </div>

                    {/* 鼠标引导 */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-32 h-24 flex items-center justify-center">
                        <motion.div
                          animate={{ x: [-15, 15, -15] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                          <MousePointer2 className="w-12 h-12 text-primary fill-primary/20" />
                        </motion.div>
                        <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full scale-75" />
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <MousePointer2 className="w-5 h-5" />
                        <span>旋转视角</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 交互控制栏 */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur p-4 flex items-center justify-between border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold mr-2">当前环节:</span>
                  <span className="text-white">步骤一：陈设与省牲</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10"><RotateCcw className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10"><Maximize className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-2">交互说明</h3>
              <p className="text-white/70 mb-4">
                您将扮演"赞礼官"，通过键盘(WASD)和鼠标控制视角，体验从"銮驾出宫"到"燎柴"的完整祭天流程。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/50">
                <div className="flex items-center gap-2"><span className="border border-white/20 px-2 py-1 rounded">W</span> 前进</div>
                <div className="flex items-center gap-2"><span className="border border-white/20 px-2 py-1 rounded">S</span> 后退</div>
                <div className="flex items-center gap-2"><span className="border border-white/20 px-2 py-1 rounded">A</span> 左移</div>
                <div className="flex items-center gap-2"><span className="border border-white/20 px-2 py-1 rounded">D</span> 右移</div>
              </div>
            </div>
          </div>

          {/* 右侧：古今对比 (4列) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <h2 className="text-2xl font-serif text-white mb-4 border-l-4 border-secondary pl-4">古今对比</h2>
            
            <div 
              ref={containerRef}
              className="relative w-full aspect-[3/4] rounded-xl overflow-hidden cursor-ew-resize select-none border border-white/20 shadow-2xl"
            >
              {/* 底层：现状模型 (右侧) */}
              <div className="absolute inset-0 bg-gray-800">
                <img 
                  src="https://placehold.co/600x800/333/FFF?text=Current+Site+Model" 
                  alt="现状模型" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded text-white/80 text-sm font-bold">现状遗址</div>
              </div>

              {/* 顶层：复原模型 (左侧) - 通过clip-path裁剪 */}
              <div 
                className="absolute inset-0 bg-amber-900"
                style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
              >
                <img 
                  src="https://placehold.co/600x800/5d4037/FFF?text=Restored+Tang+Model" 
                  alt="复原模型" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary/80 px-3 py-1 rounded text-black text-sm font-bold">唐代复原</div>
              </div>

              {/* 滑动条控制杆 */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                style={{ left: `${sliderValue}%` }}
                onMouseDown={handleMouseDown}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-black">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                    <path d="m15 18-6-6 6-6" transform="rotate(180 12 12)"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-white/80 leading-relaxed text-sm">
                拖动滑块对比唐代天坛复原模型与今日遗址现状。可以看到，虽然地面建筑已不复存在，但圜丘的夯土台基依然清晰可见，见证了千年的沧桑变迁。
              </p>
              <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                <p className="text-blue-400 font-mono text-xs mb-1">技术实现说明:</p>
                <p className="text-white/60 text-xs">
                  左侧复原模型基于严谨的考古数据与古籍记载重建；右侧现状模型由无人机倾斜摄影生成的高精度点云数据渲染而来。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
