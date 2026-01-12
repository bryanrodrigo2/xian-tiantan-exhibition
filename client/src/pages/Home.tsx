import Layout from "@/components/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";

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
  return (
    <Layout showBack={false} className="flex items-center justify-center h-screen overflow-hidden">
      <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
        
        {/* 中央天坛轮廓背景 - 隐隐的轮廓 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
        >
          <div className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-30">
            {/* 使用Logo作为中央轮廓，或者使用CSS绘制天坛层级结构 */}
            <div className="absolute inset-0 bg-[url('/logo.png')] bg-contain bg-center bg-no-repeat opacity-20 blur-sm animate-pulse-slow" />
            
            {/* 装饰性光环 */}
            <div className="absolute inset-0 border border-primary/10 rounded-full scale-75 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-0 border border-primary/5 rounded-full scale-90 animate-[spin_40s_linear_infinite_reverse]" />
            <div className="absolute inset-0 border border-primary/20 rounded-full scale-50" />
          </div>
        </motion.div>

        {/* 中央标题 */}
        <div className="relative z-20 text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl font-bold text-primary mb-4 tracking-widest drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            西安隋唐天坛
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-2xl text-white/60 font-light tracking-[0.5em]"
          >
            全息影像设计与交互实现
          </motion.p>
        </div>

        {/* 四个导航按钮 - 使用Grid布局避免重叠 */}
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full container mx-auto grid grid-cols-2 grid-rows-2 gap-4 md:gap-12 p-4 md:p-12">
            {navItems.map((item, index) => {
              // 计算位置样式
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
                    <div className="group relative w-40 h-28 md:w-64 md:h-40 cursor-pointer m-2 md:m-8">
                      {/* 按钮背景 */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg transform transition-all duration-500 group-hover:scale-110 group-hover:bg-black/60 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]" />
                      
                      {/* 装饰角标 */}
                      <div className={`absolute w-4 h-4 border-t-2 border-l-2 border-primary/30 transition-all duration-300 group-hover:border-primary top-0 left-0`} />
                      <div className={`absolute w-4 h-4 border-t-2 border-r-2 border-primary/30 transition-all duration-300 group-hover:border-primary top-0 right-0`} />
                      <div className={`absolute w-4 h-4 border-b-2 border-l-2 border-primary/30 transition-all duration-300 group-hover:border-primary bottom-0 left-0`} />
                      <div className={`absolute w-4 h-4 border-b-2 border-r-2 border-primary/30 transition-all duration-300 group-hover:border-primary bottom-0 right-0`} />
                      
                      {/* 内容 */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-white group-hover:text-primary transition-colors duration-300 mb-1">
                          {item.title}
                        </h3>
                        <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/40 group-hover:text-primary/60 transition-colors duration-300">
                          {item.en}
                        </span>
                        
                        {/* 悬停时的光效线条 */}
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
