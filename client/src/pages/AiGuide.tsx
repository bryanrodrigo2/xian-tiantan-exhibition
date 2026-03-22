import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Maximize, MousePointer2, Keyboard, X } from "lucide-react";

// UE5 像素流送服务地址（AI 导览员专用）
const PIXEL_STREAMING_URL = "http://127.0.0.1:9000/s?loadType=auto&group=5d82m5320644&runType=box";

export default function AiGuide() {
  const [, navigate] = useLocation();

  // ── 与 Interaction.tsx 完全相同的状态管理 ──
  const [showGuide, setShowGuide] = useState(false);
  const [streamingActive, setStreamingActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 启动交互：与 Interaction.tsx handleStartInteraction 完全一致
  const handleStartInteraction = () => {
    setStreamingActive(true);
    setShowGuide(true);
    setTimeout(() => setShowGuide(false), 5000);
    setTimeout(() => {
      iframeRef.current?.focus();
    }, 500);
  };

  // 停止流送
  const handleStopStreaming = () => {
    setStreamingActive(false);
    setShowGuide(false);
    setIsFullscreen(false);
  };

  // 切换全屏
  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      iframeContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // 监听全屏退出事件
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // 点击 iframe 容器时强制聚焦
  const handleIframeContainerClick = () => {
    if (streamingActive) {
      iframeRef.current?.focus();
    }
  };

  // 拦截浏览器默认行为，确保 UE 接收键盘指令
  useEffect(() => {
    if (!streamingActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const blockedKeys = [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"];
      if (blockedKeys.includes(e.key)) {
        if (document.activeElement === iframeRef.current || isFullscreen) {
          // e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [streamingActive, isFullscreen]);

  return (
    // 全屏容器：占满整个视口，无导航栏/页脚
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        background: "#000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 返回按钮 */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate("/interaction")}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(234,179,8,0.4)",
          borderRadius: 8,
          color: "#EAB308",
          fontSize: 14,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(234,179,8,0.15)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.6)")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        返回
      </motion.button>

      {/* 主流送区域：与 Interaction.tsx 完全相同的结构 */}
      <div
        className="bg-black/60 border border-primary/30 overflow-hidden relative"
        style={{ width: "100%", height: "100%", flex: 1 }}
      >
        {/* UE5 Pixel Streaming 嵌入区域 */}
        {streamingActive ? (
          /* 激活状态：嵌入像素流送 iframe —— 与 Interaction.tsx 完全一致 */
          <div
            ref={iframeContainerRef}
            className="absolute inset-0 bg-black cursor-pointer"
            onClick={handleIframeContainerClick}
          >
            <iframe
              ref={iframeRef}
              src={PIXEL_STREAMING_URL}
              className="w-full h-full border-0 outline-none"
              allow="camera; microphone; fullscreen; autoplay"
              title="UE5 像素流送 - AI 导览员"
              tabIndex={0}
            />
          </div>
        ) : (
          /* 未激活状态：显示启动按钮 —— 与 Interaction.tsx 完全一致 */
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <Button
              className="bg-primary text-black hover:bg-primary/80 rounded-full glow-effect"
              style={{ width: "80px", height: "80px", minWidth: "80px", padding: 0 }}
              onClick={handleStartInteraction}
            >
              <Play className="w-10 h-10 fill-current" />
            </Button>
          </div>
        )}

        {/* 新手引导动画层 —— 与 Interaction.tsx 完全一致 */}
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center pointer-events-none"
          >
            <div className="flex gap-12">
              {/* 键盘引导动画 */}
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
              {/* 鼠标引导动画 */}
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-16 h-16 flex items-center justify-center"
                >
                  <MousePointer2 className="w-10 h-10 text-primary" />
                </motion.div>
                <div className="flex items-center gap-2 text-white/80">
                  <MousePointer2 className="w-5 h-5" />
                  <span>旋转视角</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 底部交互控制栏 —— 与 Interaction.tsx 完全一致 */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          {streamingActive && (
            <Button
              variant="outline"
              size="icon"
              className="bg-black/40 border-red-500/40 hover:bg-red-500/20 text-red-400"
              onClick={handleStopStreaming}
              title="停止流送"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="bg-black/40 border-white/20 hover:bg-white/10"
            onClick={() => { setStreamingActive(false); setShowGuide(false); }}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-black/40 border-white/20 hover:bg-white/10"
            onClick={handleToggleFullscreen}
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
