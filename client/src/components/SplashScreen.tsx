import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // 等待退出动画完成后回调
    }, 3000); // 展示3秒

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative"
          >
            {/* Logo 呼吸动画 */}
            <motion.div
              animate={{ 
                boxShadow: ["0 0 20px rgba(212, 175, 55, 0.2)", "0 0 60px rgba(212, 175, 55, 0.6)", "0 0 20px rgba(212, 175, 55, 0.2)"] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center mb-8 bg-black"
            >
              <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-4xl font-serif text-primary">天</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wider font-serif">
              <span className="text-primary">西安</span> · 隋唐天坛
            </h1>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            <p className="text-white/60 tracking-[0.5em] text-sm uppercase">
              Holographic Exhibition
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 text-white/30 text-xs tracking-widest"
          >
            正在加载全息数据资源...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
