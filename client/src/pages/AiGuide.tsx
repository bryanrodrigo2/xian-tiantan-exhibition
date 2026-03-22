import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

// UE5 像素流送服务地址
const PIXEL_STREAMING_URL = "http://127.0.0.1:9000/s?loadType=auto&group=2adkoq140509&runType=box";

export default function AiGuide() {
  const [, navigate] = useLocation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  // 自动聚焦 iframe，确保键盘输入直接传递给 UE
  useEffect(() => {
    const timer = setTimeout(() => {
      iframeRef.current?.focus();
    }, 800);
    return () => clearTimeout(timer);
  }, [loaded]);

  // 拦截浏览器默认键盘行为，防止干扰 UE 控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const blockedKeys = [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"];
      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    // 外层容器：占满整个视口，无任何导航栏/页脚
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        background: "#000",
      }}
    >
      {/* 加载中遮罩 */}
      {!loaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            gap: "16px",
          }}
        >
          {/* 旋转加载动画 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "3px solid rgba(234,179,8,0.2)",
              borderTop: "3px solid #EAB308",
            }}
          />
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, letterSpacing: "0.1em" }}>
            正在连接 AI 导览员...
          </p>
        </motion.div>
      )}

      {/* 返回按钮 */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate("/interaction")}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 20,
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
        {/* 返回箭头图标 */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        返回
      </motion.button>

      {/* 全屏 UE 像素流送 iframe */}
      {/* ⚠️ 请将 src 中的地址替换为您实际的像素流送服务地址 */}
      <iframe
        ref={iframeRef}
        src={PIXEL_STREAMING_URL}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          overflow: "hidden",
          display: "block",
          outline: "none",
        }}
        allow="autoplay; fullscreen; microphone"
        scrolling="no"
        tabIndex={0}
        onLoad={() => {
          setLoaded(true);
          setTimeout(() => iframeRef.current?.focus(), 300);
        }}
        onClick={() => iframeRef.current?.focus()}
        title="AI导览员 - UE5像素流送"
      />
    </div>
  );
}
