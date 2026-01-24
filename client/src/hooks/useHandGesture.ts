import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export type GestureState = 'open' | 'closed' | 'neutral';

interface UseHandGestureOptions {
  onGestureChange?: (gesture: GestureState) => void;
  enabled?: boolean;
}

export function useHandGesture(options: UseHandGestureOptions = {}) {
  const { onGestureChange, enabled = false } = options;
  
  const [gestureState, setGestureState] = useState<GestureState>('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const gestureHistoryRef = useRef<GestureState[]>([]);
  const isInitializingRef = useRef(false);
  const onGestureChangeRef = useRef(onGestureChange);

  // 更新回调引用
  useEffect(() => {
    onGestureChangeRef.current = onGestureChange;
  }, [onGestureChange]);

  // 分析手势
  const analyzeGesture = useCallback((landmarks: Results['multiHandLandmarks'][0]): GestureState => {
    if (!landmarks || landmarks.length < 21) return 'neutral';

    // 手指关键点索引
    const fingerTips = [4, 8, 12, 16, 20]; // 拇指、食指、中指、无名指、小指的指尖
    const fingerPips = [3, 6, 10, 14, 18]; // 各手指的第二关节

    let extendedFingers = 0;

    // 检查每个手指是否伸展
    for (let i = 1; i < 5; i++) { // 跳过拇指，检查其他四指
      const tip = landmarks[fingerTips[i]];
      const pip = landmarks[fingerPips[i]];
      
      // 如果指尖 y 坐标小于第二关节（在图像中更靠上），则手指伸展
      if (tip.y < pip.y) {
        extendedFingers++;
      }
    }

    // 检查拇指（使用 x 坐标判断）
    const thumbTip = landmarks[4];
    const thumbIp = landmarks[3];
    const wrist = landmarks[0];
    
    // 判断是左手还是右手（通过拇指和手腕的相对位置）
    const isRightHand = thumbTip.x < wrist.x;
    
    if (isRightHand) {
      if (thumbTip.x < thumbIp.x) extendedFingers++;
    } else {
      if (thumbTip.x > thumbIp.x) extendedFingers++;
    }

    // 根据伸展的手指数量判断手势
    if (extendedFingers >= 4) {
      return 'open'; // 张开手掌
    } else if (extendedFingers <= 1) {
      return 'closed'; // 握拳
    }
    
    return 'neutral';
  }, []);

  // 平滑手势状态
  const smoothGesture = useCallback((newGesture: GestureState): GestureState => {
    const history = gestureHistoryRef.current;
    history.push(newGesture);
    
    // 保持最近 5 帧的历史
    if (history.length > 5) {
      history.shift();
    }

    // 统计各手势出现次数
    const counts: Record<GestureState, number> = { open: 0, closed: 0, neutral: 0 };
    history.forEach(g => counts[g]++);

    // 返回出现次数最多的手势
    if (counts.open >= 3) return 'open';
    if (counts.closed >= 3) return 'closed';
    return 'neutral';
  }, []);

  // 停止手势检测
  const stopHands = useCallback(() => {
    console.log('Stopping hand tracking...');
    
    if (cameraRef.current) {
      try {
        cameraRef.current.stop();
      } catch (e) {
        console.warn('Error stopping camera:', e);
      }
      cameraRef.current = null;
    }
    
    if (handsRef.current) {
      try {
        handsRef.current.close();
      } catch (e) {
        console.warn('Error closing hands:', e);
      }
      handsRef.current = null;
    }
    
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
        videoRef.current.remove();
      } catch (e) {
        console.warn('Error removing video:', e);
      }
      videoRef.current = null;
    }
    
    setCameraActive(false);
    setGestureState('neutral');
    setIsLoading(false);
    gestureHistoryRef.current = [];
    isInitializingRef.current = false;
  }, []);

  // 初始化 MediaPipe Hands
  const initHands = useCallback(async () => {
    if (isInitializingRef.current || cameraRef.current) {
      console.log('Already initializing or initialized, skipping...');
      return;
    }

    isInitializingRef.current = true;
    console.log('Initializing hand tracking...');

    try {
      setIsLoading(true);
      setError(null);

      // 创建 Hands 实例
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      // 设置结果回调
      hands.onResults((results: Results) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          const rawGesture = analyzeGesture(landmarks);
          const smoothedGesture = smoothGesture(rawGesture);
          
          setGestureState(prev => {
            if (smoothedGesture !== prev) {
              onGestureChangeRef.current?.(smoothedGesture);
              return smoothedGesture;
            }
            return prev;
          });
        }
      });

      handsRef.current = hands;

      // 创建视频元素
      const video = document.createElement('video');
      video.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;';
      video.playsInline = true;
      video.muted = true;
      document.body.appendChild(video);
      videoRef.current = video;

      console.log('Requesting camera access...');

      // 启动摄像头
      const camera = new Camera(video, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current && videoRef.current.readyState >= 2) {
            try {
              await handsRef.current.send({ image: videoRef.current });
            } catch (e) {
              // 忽略发送错误
            }
          }
        },
        width: 640,
        height: 480,
      });

      await camera.start();
      cameraRef.current = camera;
      setCameraActive(true);
      setIsLoading(false);
      isInitializingRef.current = false;
      
      console.log('Hand tracking initialized successfully!');

    } catch (err) {
      console.error('Failed to initialize hand tracking:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize hand tracking';
      
      // 检查是否是权限错误
      if (errorMessage.includes('Permission') || errorMessage.includes('NotAllowed')) {
        setError('摄像头权限被拒绝，请在浏览器设置中允许访问摄像头');
      } else if (errorMessage.includes('NotFound') || errorMessage.includes('DevicesNotFound')) {
        setError('未找到摄像头设备');
      } else {
        setError(errorMessage);
      }
      
      setIsLoading(false);
      isInitializingRef.current = false;
      stopHands();
    }
  }, [analyzeGesture, smoothGesture, stopHands]);

  // 根据 enabled 状态启动/停止手势检测
  useEffect(() => {
    console.log('useHandGesture effect - enabled:', enabled);
    
    if (enabled) {
      initHands();
    } else {
      stopHands();
    }

    return () => {
      // 组件卸载时清理
      if (!enabled) {
        stopHands();
      }
    };
  }, [enabled]); // 只依赖 enabled

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopHands();
    };
  }, [stopHands]);

  return {
    gestureState,
    isLoading,
    error,
    cameraActive,
    startTracking: initHands,
    stopTracking: stopHands,
  };
}
