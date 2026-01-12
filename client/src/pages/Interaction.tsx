import Layout from "@/components/Layout";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Maximize, MousePointer2, Keyboard, Flame, Footprints, ScrollText, Utensils, Crown, LayoutDashboard, MessageSquareQuote } from "lucide-react";

// 祭天大典六步流程数据
const ritualSteps = [
  {
    id: 1,
    title: "陈设与省牲",
    enTitle: "Preparation",
    icon: <LayoutDashboard className="w-6 h-6" />,
    description: "在内壝内拖拽布置昊天上帝神座（北侧南向），并检查祭品（牺牲）。",
    detail: "通过 UI 弹窗解释'内壝'与'外壝'的等级区别及神位摆放的方位学意义。",
    npcScript: "吉时已到，请陛下查验祭品，确认神位安放无误。",
    image: "https://placehold.co/600x400/1a1a1a/FFF?text=Preparation"
  },
  {
    id: 2,
    title: "銮驾出宫",
    enTitle: "Arrival",
    icon: <Crown className="w-6 h-6" />,
    description: "皇帝仪仗从明德门方向沿御道进入，文武百官按品级在壝墙外列队。",
    detail: "镜头拉高展示 CAD 规划中清理出的'视觉通廊'，强调遗址与长安城中轴线的关系。",
    npcScript: "圣驾至——百官跪迎！启奏陛下，文武百官已按品级于壝墙外列队恭候。",
    image: "https://placehold.co/600x400/1a1a1a/FFF?text=Arrival"
  },
  {
    id: 3,
    title: "奠玉帛",
    enTitle: "Offering Jade & Silk",
    icon: <ScrollText className="w-6 h-6" />,
    description: "用户控制角色从正南方的午陛登上坛顶，完成跪拜并献上玉币。",
    detail: "镜头特写脚下的白灰抹面材质，触发步履声与雅乐音效。",
    npcScript: "请陛下登坛，行初献之礼，奠玉帛以告苍天。",
    image: "https://placehold.co/600x400/1a1a1a/FFF?text=Offering"
  },
  {
    id: 4,
    title: "进熟",
    enTitle: "Offering Food",
    icon: <Utensils className="w-6 h-6" />,
    description: "敬献煮熟的肉食，展示唐代祭天不同于后世的'尚气'传统。",
    detail: "解释这一环节保留了上古'分享食物'的遗风，体现人神共食的理念。",
    npcScript: "进熟——献牲肉于昊天上帝座前，愿神悦纳。",
    image: "https://placehold.co/600x400/1a1a1a/FFF?text=Food"
  },
  {
    id: 5,
    title: "燎柴",
    enTitle: "Burning",
    icon: <Flame className="w-6 h-6" />,
    description: "用户移动至东南侧的燎炉，触发点火交互。",
    detail: "利用 UE5 Niagara 粒子系统生成逼真的火焰与烟雾，象征将祭品香气送达天庭。",
    npcScript: "礼成——燎柴！愿烟火直达天庭，赐福大唐万世基业。",
    image: "https://placehold.co/600x400/1a1a1a/FFF?text=Burning"
  },
  {
    id: 6,
    title: "銮驾回宫",
    enTitle: "Return",
    icon: <Footprints className="w-6 h-6" />,
    description: "仪式结束，系统生成'祭天成就报告'。",
    detail: "对比唐代与现代的遗址现状，完成一次跨越千年的历史对话。",
    npcScript: "大礼告成，起驾回宫——",
    image: "https://placehold.co/600x400/1a1a1a/FFF?text=Return"
  }
];

export default function Interaction() {
  // 状态管理
  const [sliderValue, setSliderValue] = useState(50); // 对比滑动条的位置 (0-100)
  const containerRef = useRef<HTMLDivElement>(null); // 对比容器的引用
  const [isResizing, setIsResizing] = useState(false); // 是否正在拖动滑动条
  const [showGuide, setShowGuide] = useState(false); // 是否显示新手引导动画

  // 启动交互时显示引导
  const handleStartInteraction = () => {
    setShowGuide(true);
    // 5秒后自动隐藏引导，以免干扰用户操作
    setTimeout(() => setShowGuide(false), 5000);
  };

  // 处理滑动条拖动逻辑
  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);
  
  // 计算鼠标位置对应的百分比
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // 限制滑动范围在容器宽度内
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderValue(percentage);
  };

  // 注册全局鼠标事件监听，确保拖动体验流畅
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
      <div className="container mx-auto py-8 flex flex-col gap-12">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">交互复原</h1>
          <p className="text-white/60 tracking-widest">INTERACTIVE RESTORATION</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧：UE交互区域 (8列) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-black/60 border border-primary/30 rounded-xl overflow-hidden relative aspect-video shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {/* UE5 Pixel Streaming 嵌入区域占位符 */}
              {/* 实际项目中应在此处嵌入 Pixel Streaming 的 Video 标签 */}
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
              
              {/* 新手引导动画层：半透明覆盖层，展示操作指引 */}
              {showGuide && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center pointer-events-none"
                >
                  <div className="flex gap-12">
                    {/* 键盘引导动画：WASD按键模拟 */}
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

                    {/* 鼠标引导动画：左右晃动模拟视角旋转 */}
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

              {/* 底部交互控制栏 */}
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
            
            {/* 对比容器：包含两张重叠的图片 */}
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

              {/* 顶层：复原模型 (左侧) - 通过 clip-path 动态裁剪实现遮罩效果 */}
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

              {/* 滑动条控制杆：跟随 sliderValue 移动 */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                style={{ left: `${sliderValue}%` }}
                onMouseDown={handleMouseDown}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8L22 12L18 16" />
                      <path d="M6 8L2 12L6 16" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-white/5 p-4 rounded-lg border border-white/10">
              <h3 className="text-primary font-bold mb-2">建筑形制对比</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                拖动滑块对比现状遗址与唐代复原模型。可见唐代圜丘为四层圆坛，而现状仅存土芯。复原模型依据《大唐开元礼》及考古数据重建了白灰抹面与朱红栏杆。
              </p>
            </div>
          </div>
        </div>

        {/* 祭天大典流程详解 - 增加 AI 礼官解说 */}
        <div className="mt-12">
          <h2 className="text-3xl font-serif text-white mb-8 text-center border-b border-white/10 pb-4">
            六步祭天大典流程详解
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ritualSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* 图片区域 */}
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    <span className="text-primary">{step.icon}</span>
                    <span className="text-white text-xs font-bold">STEP 0{step.id}</span>
                  </div>
                </div>

                {/* 内容区域 */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 flex items-center justify-between">
                      {step.title}
                      <span className="text-xs font-normal text-white/40 font-sans">{step.enTitle}</span>
                    </h3>
                    <div className="w-12 h-1 bg-primary/50 rounded-full mt-2 group-hover:w-full transition-all duration-500"></div>
                  </div>

                  {/* AI 礼官解说词 - 新增 */}
                  <div className="bg-primary/10 border-l-2 border-primary p-3 rounded-r relative">
                    <MessageSquareQuote className="absolute top-2 right-2 w-4 h-4 text-primary/40" />
                    <p className="text-primary text-sm font-serif italic">
                      "{step.npcScript}"
                    </p>
                    <p className="text-[10px] text-primary/60 mt-1 text-right">— AI 礼官</p>
                  </div>
                  
                  <p className="text-white/70 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-white/40 font-mono">
                      <span className="text-primary/60 mr-2">[技术实现]</span>
                      {step.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
