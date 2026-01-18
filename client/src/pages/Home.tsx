import Layout from "@/components/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { sound } from "@/lib/sound";
import { useEffect } from "react";

// 导航菜单配置
// 包含标题、英文、路由路径、屏幕位置及动画延迟时间
const navItems = [
  {
    title: "历史溯源",
    en: "History",
    href: "/history",
    position: "top-left",
    delay: 0.2
  },
  {
    title: "现状与测绘",
    en: "Survey",
    href: "/survey",
    position: "top-right",
    delay: 0.3
  },
  {
    title: "蓝图规划",
    en: "Blueprint",
    href: "/blueprint",
    position: "bottom-left",
    delay: 0.4
  },
  {
    title: "交互复原",
    en: "Interaction",
    href: "/interaction",
    position: "bottom-right",
    delay: 0.5
  }
];

export default function Home() {
  // 动态设置页面标题，确保符合 SEO 要求的长度（30-60字符）
  useEffect(() => {
    document.title = "西安隋唐天坛全息影像设计与交互实现 | 数字化文化遗产保护与沉浸式虚拟体验展示平台";
  }, []);

  return (
    // 主页布局：隐藏返回按钮，全屏居中显示
    <Layout showBack={false} className="flex items-center justify-center h-screen overflow-hidden">
      <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
        
        {/* 背景层：中央天坛轮廓动画 */}
        {/* 使用 motion.div 实现入场时的缩放和淡入效果 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
        >
          <div className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-30">
            {/* 核心轮廓：使用 Logo 图片作为背景，叠加模糊和脉冲动画 */}
            <div className="absolute inset-0 bg-[url('/logo.png')] bg-contain bg-center bg-no-repeat opacity-20 blur-sm animate-pulse-slow" />
            
            {/* 装饰性光环：多层旋转圆环增加科技感与神圣感 */}
            <div className="absolute inset-0 border border-primary/10 rounded-full scale-75 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-0 border border-primary/5 rounded-full scale-90 animate-[spin_40s_linear_infinite_reverse]" />
            <div className="absolute inset-0 border border-primary/20 rounded-full scale-50" />
          </div>
        </motion.div>

        {/* 前景层：中央标题 */}
        <div className="relative z-20 text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl font-bold text-primary mb-4 tracking-widest drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            西安隋唐天坛
          </motion.h1>
          {/* SEO优化：将副标题从 p 标签改为 h2 标签，提升页面结构语义化 */}
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-2xl text-white/60 font-light tracking-[0.5em]"
          >
            全息影像设计与交互实现
          </motion.h2>
        </div>

        {/* 交互层：四个角落的导航按钮 */}
        {/* 使用 Grid 布局确保按钮在不同屏幕尺寸下稳固分布，避免重叠 */}
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full container mx-auto grid grid-cols-2 grid-rows-2 gap-4 md:gap-12 p-4 md:p-12">
            {navItems.map((item, index) => {
              // 根据配置计算按钮在 Grid 中的对齐方式
              const isTop = item.position.includes("top");
              const isLeft = item.position.includes("left");
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50, y: isTop ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.8, delay: item.delay }}
                  className={`pointer-events-auto flex ${isTop ? 'items-end' : 'items-start'} ${isLeft ? 'justify-end md:justify-start' : 'justify-start md:justify-end'}`}
                >
                  <Link href={item.href}>
                    <div 
                      className="group relative w-40 h-28 md:w-64 md:h-40 cursor-pointer m-2 md:m-8"
                      // 绑定音效事件：悬停播放钟声，点击播放鼓声
                      onMouseEnter={() => sound.playBell()}
                      onClick={() => sound.playDrum()}
                    >
                      {/* 按钮背景：磨砂玻璃效果，悬停时发光 */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg transform transition-all duration-500 group-hover:scale-110 group-hover:bg-black/60 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]" />
                      
                      {/* 装饰角标：四个角落的L形边框，悬停时变色 */}
                      <div className={`absolute w-4 h-4 border-t-2 border-l-2 border-primary/30 transition-all duration-300 group-hover:border-primary top-0 left-0`} />
                      <div className={`absolute w-4 h-4 border-t-2 border-r-2 border-primary/30 transition-all duration-300 group-hover:border-primary top-0 right-0`} />
                      <div className={`absolute w-4 h-4 border-b-2 border-l-2 border-primary/30 transition-all duration-300 group-hover:border-primary bottom-0 left-0`} />
                      <div className={`absolute w-4 h-4 border-b-2 border-r-2 border-primary/30 transition-all duration-300 group-hover:border-primary bottom-0 right-0`} />
                      
                      {/* 按钮文字内容 */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-white group-hover:text-primary transition-colors duration-300 mb-1">
                          {item.title}
                        </h3>
                        <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/40 group-hover:text-primary/60 transition-colors duration-300">
                          {item.en}
                        </span>
                        
                        {/* 悬停时的底部光效线条 */}
                        <div className="absolute bottom-8 w-0 h-[1px] bg-primary transition-all duration-500 group-hover:w-1/2 opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
