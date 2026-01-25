import { useState, useCallback, useMemo } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Loader2, Camera, CameraOff, HelpCircle, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleScene from '@/components/ParticleScene';
import { useHandGesture, GestureState, HandPosition } from '@/hooks/useHandGesture';


// 检测设备类型：'desktop' | 'tablet' | 'mobile'
const getDeviceType = (): 'desktop' | 'tablet' | 'mobile' => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const width = window.innerWidth;
  
  // 检测平板设备
  const isTablet = /ipad|android(?!.*mobile)|tablet|kindle|silk|playbook/i.test(userAgent.toLowerCase()) ||
                  (width > 768 && width <= 1024);
  
  // 检测手机设备
  const isMobile = /android.*mobile|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()) ||
                   width <= 768;
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
};

// 模型 URL 列表 - 统一使用阿里云 OSS 托管的模型文件
const getModelUrls = () => {
  // 所有设备统一使用阿里云 OSS 的模型文件，确保稳定性和加载速度
  return [
    'https://tiantan-model.oss-cn-beijing.aliyuncs.com/tiantan.obj',
  ];
};

// MTL 材质文件 URL - 统一使用阿里云 OSS 托管的材质文件
const getMtlUrl = () => {
  // 所有设备统一使用阿里云 OSS 的材质文件
  return 'https://tiantan-model.oss-cn-beijing.aliyuncs.com/tiantan.mtl';
};

export default function GestureInteraction() {
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [modelUrlIndex, setModelUrlIndex] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentHandPosition, setCurrentHandPosition] = useState<HandPosition | null>(null);
  
  // 获取当前设备类型的模型 URL 列表
  const MODEL_URLS = useMemo(() => getModelUrls(), []);
  const MTL_URL = useMemo(() => getMtlUrl(), []);
  
  const handleGestureChange = useCallback((gesture: GestureState) => {
    console.log('Gesture changed:', gesture);
  }, []);

  const handleHandMove = useCallback((position: HandPosition) => {
    setCurrentHandPosition(position);
  }, []);

  // 只有在 trackingEnabled 为 true 时才启用手势识别
  const { gestureState, handPosition, isLoading: handLoading, error, cameraActive } = useHandGesture({
    enabled: trackingEnabled,
    onGestureChange: handleGestureChange,
    onHandMove: handleHandMove,
  });

  const toggleTracking = () => {
    console.log('Toggle tracking, current:', trackingEnabled, 'modelLoaded:', modelLoaded);
    const newTrackingState = !trackingEnabled;
    setTrackingEnabled(newTrackingState);
    // 关闭相机时立即清除手部位置，触发复原
    if (!newTrackingState) {
      setCurrentHandPosition(null);
    }
  };

  // 处理模型加载完成
  const handleModelLoadComplete = useCallback(() => {
    console.log('Model loaded successfully from:', MODEL_URLS[modelUrlIndex]);
    console.log('Device type:', getDeviceType());
    setModelLoaded(true);
    setModelError(null);
  }, [MODEL_URLS, modelUrlIndex]);

  // 处理模型加载错误 - 尝试备用源
  const handleModelLoadError = useCallback((errorMsg: string) => {
    console.error('Model load error:', errorMsg, 'Current URL index:', modelUrlIndex);
    console.error('Device type:', getDeviceType());
    
    // 如果还有备用源，尝试下一个
    if (modelUrlIndex < MODEL_URLS.length - 1) {
      console.log('Trying fallback URL...');
      setModelUrlIndex(prev => prev + 1);
    } else {
      // 所有源都失败了
      setModelError(`模型加载失败: ${errorMsg}`);
    }
  }, [MODEL_URLS, modelUrlIndex]);

  // 手动重试
  const handleRetry = useCallback(() => {
    setModelUrlIndex(0);
    setModelError(null);
    setModelLoaded(false);
    setRetryCount(prev => prev + 1);
  }, []);

  // 获取手势状态的显示文本和颜色
  const getGestureInfo = () => {
    switch (gestureState) {
      case 'open':
        return { text: '张开手掌 - 粒子消散', color: 'text-red-400', bgColor: 'bg-red-500/20' };
      case 'closed':
        return { text: '握拳 - 粒子聚合', color: 'text-green-400', bgColor: 'bg-green-500/20' };
      default:
        return { text: '移动手掌控制旋转', color: 'text-white/60', bgColor: 'bg-white/10' };
    }
  };

  // 获取状态文本
  const getStatusText = () => {
    if (!modelLoaded) {
      return '正在加载模型...';
    }
    if (trackingEnabled && handLoading) {
      return '正在初始化手势识别...';
    }
    if (cameraActive) {
      return '摄像头已启用';
    }
    return '摄像头未启用';
  };

  const gestureInfo = getGestureInfo();
  const currentModelUrl = MODEL_URLS[modelUrlIndex];

  // 按钮是否禁用：只有在模型未加载或手势识别正在初始化时禁用
  const isButtonDisabled = !modelLoaded || (trackingEnabled && handLoading);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent pointer-events-none" />
      
      {/* 顶部导航栏 */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6">
        <div className="flex items-center justify-between">
          {/* Logo 和返回按钮 */}
          <Link href="/interaction">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img src="/logo_new.png" alt="Logo" className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" />

            </motion.div>
          </Link>

          {/* 标题 */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-xl md:text-2xl font-bold text-primary">手势交互</h1>
            <p className="text-xs text-white/40 tracking-widest hidden md:block">GESTURE INTERACTION</p>
          </div>

          {/* 帮助按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-primary"
            onClick={() => setShowGuide(true)}

          >
            <HelpCircle className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="h-screen flex flex-col">
        {/* Three.js 粒子场景 */}
        <div className="flex-1 relative">
          <ParticleScene 
            key={`${currentModelUrl}-${retryCount}`}
            modelUrl={currentModelUrl}
            mtlUrl={currentModelUrl.endsWith('.obj') ? MTL_URL : undefined}
            gestureState={gestureState}
            handPosition={trackingEnabled && cameraActive ? currentHandPosition : null}
            className="absolute inset-0"
            onLoadComplete={handleModelLoadComplete}
            onLoadError={handleModelLoadError}
          />

          {/* 模型加载错误提示 */}
          {modelError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
              <div className="text-center p-6 max-w-md">
                <div className="text-red-400 text-lg mb-4">模型加载失败</div>
                <p className="text-white/60 text-sm mb-6">
                  模型文件加载失败，可能是网络问题。请检查网络连接后重试。
                </p>
                <Button
                  onClick={handleRetry}
                  className="bg-primary text-black hover:bg-primary/80"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重新加载
                </Button>
              </div>
            </div>
          )}

          {/* 手势状态指示器 - 只在摄像头启用时显示 */}
          {modelLoaded && cameraActive && (
            <motion.div 
              className={`absolute bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full ${gestureInfo.bgColor} backdrop-blur-md border border-white/10`}
              animate={{ scale: gestureState !== 'neutral' ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <Hand className={`w-5 h-5 ${gestureInfo.color}`} />
                <span className={`font-medium ${gestureInfo.color}`}>{gestureInfo.text}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* 底部控制栏 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 p-4 md:p-6">
              <div className="flex items-center justify-between gap-4">
                {/* 摄像头状态 */}
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${cameraActive ? 'bg-green-500 animate-pulse' : modelLoaded ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-white/60">
                    {getStatusText()}
                  </span>
                </div>

                {/* 控制按钮 */}
                <Button
                  onClick={toggleTracking}
                  disabled={isButtonDisabled}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    trackingEnabled 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
                      : 'bg-primary text-black hover:bg-primary/80'
                  } ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {!modelLoaded ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      加载模型中...
                    </>
                  ) : trackingEnabled && handLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      初始化中...
                    </>
                  ) : trackingEnabled ? (
                    <>
                      <CameraOff className="w-4 h-4 mr-2" />
                      停止追踪
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      启动手势追踪
                    </>
                  )}
                </Button>
              </div>

              {/* 错误提示 */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 操作指南弹窗 */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary">操作指南</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-white"
                  onClick={() => setShowGuide(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* 手势说明 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-4xl mb-3">✋</div>
                    <h3 className="font-bold text-white mb-1">张开手掌</h3>
                    <p className="text-sm text-white/60">粒子向外消散</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-4xl mb-3">✊</div>
                    <h3 className="font-bold text-white mb-1">握紧拳头</h3>
                    <p className="text-sm text-white/60">粒子聚合成模型</p>
                  </div>
                </div>

                {/* 新增：移动控制说明 */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">👋</div>
                    <h3 className="font-bold text-white">移动手掌</h3>
                  </div>
                  <p className="text-sm text-white/60">
                    左右移动手掌可以控制模型水平旋转，上下移动可以调整视角倾斜
                  </p>
                </div>

                {/* 使用步骤 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white">使用步骤</h3>
                  <ol className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs flex-shrink-0">1</span>
                      <span>点击「启动手势追踪」按钮</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs flex-shrink-0">2</span>
                      <span>允许浏览器访问摄像头</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs flex-shrink-0">3</span>
                      <span>将手放在摄像头前，尝试张开或握拳</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs flex-shrink-0">4</span>
                      <span>移动手掌可以控制模型旋转方向</span>
                    </li>
                  </ol>
                </div>

                {/* 提示 */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p className="text-sm text-primary">
                    💡 提示：确保光线充足，手部清晰可见，以获得最佳追踪效果。
                  </p>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-primary text-black hover:bg-primary/80"
                onClick={() => setShowGuide(false)}
              >
                开始体验
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
