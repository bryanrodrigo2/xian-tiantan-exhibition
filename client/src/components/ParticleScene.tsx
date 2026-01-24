import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ParticleSceneProps {
  modelUrl: string;
  gestureState: 'open' | 'closed' | 'neutral';
  className?: string;
  onLoadComplete?: () => void;
  onLoadError?: (error: string) => void;
}

// 使用 fetch 预加载模型文件，支持重试
async function fetchModelWithRetry(url: string, maxRetries = 3): Promise<ArrayBuffer> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Fetching model (attempt ${attempt + 1}/${maxRetries}):`, url);
      
      const response = await fetch(url, {
        method: 'GET',
        cache: 'default',
        credentials: 'same-origin',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const buffer = await response.arrayBuffer();
      console.log(`Model fetched successfully, size: ${buffer.byteLength} bytes`);
      return buffer;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Fetch attempt ${attempt + 1} failed:`, lastError.message);
      
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  throw lastError || new Error('Failed to fetch model');
}

export default function ParticleScene({ modelUrl, gestureState, className, onLoadComplete, onLoadError }: ParticleSceneProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('正在加载模型...');
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const clockRef = useRef<THREE.Clock | null>(null);
  const isInitializedRef = useRef(false);

  // 根据手势状态更新目标进度
  useEffect(() => {
    if (gestureState === 'open') {
      targetProgressRef.current = 1;
    } else if (gestureState === 'closed') {
      targetProgressRef.current = 0;
    }
  }, [gestureState]);

  const initScene = useCallback(async () => {
    if (!containerRef.current || isInitializedRef.current) return;
    isInitializedRef.current = true;

    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    console.log('Initializing scene with dimensions:', width, height);

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // 创建相机
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 15);
    cameraRef.current = camera;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 创建控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // 初始化时钟
    clockRef.current = new THREE.Clock();

    // 处理窗口大小变化
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // 动画循环函数
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (!clockRef.current) return;
      const time = clockRef.current.getElapsedTime();
      
      // 平滑过渡进度
      const lerpSpeed = 0.02;
      progressRef.current += (targetProgressRef.current - progressRef.current) * lerpSpeed;
      
      // 更新粒子位置
      if (pointsRef.current && originalPositionsRef.current) {
        const positions = pointsRef.current.geometry.getAttribute('position');
        const original = originalPositionsRef.current;
        const progress = progressRef.current;
        
        for (let i = 0; i < positions.count; i++) {
          const i3 = i * 3;
          
          const ox = original[i3];
          const oy = original[i3 + 1];
          const oz = original[i3 + 2];
          
          const length = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
          const nx = ox / length;
          const ny = oy / length;
          const nz = oz / length;
          
          const disperseDistance = 8 + Math.sin(time * 2 + i * 0.01) * 0.5;
          
          const floatX = Math.sin(time * 1.5 + i * 0.1) * 0.015;
          const floatY = Math.cos(time * 1.2 + i * 0.15) * 0.015;
          const floatZ = Math.sin(time * 1.8 + i * 0.12) * 0.015;
          
          const targetX = ox + nx * disperseDistance * progress;
          const targetY = oy + ny * disperseDistance * progress;
          const targetZ = oz + nz * disperseDistance * progress;
          
          positions.setXYZ(
            i,
            targetX + floatX * (1 - progress * 0.5),
            targetY + floatY * (1 - progress * 0.5),
            targetZ + floatZ * (1 - progress * 0.5)
          );
        }
        positions.needsUpdate = true;
        
        const material = pointsRef.current.material as THREE.PointsMaterial;
        material.opacity = 0.9 - progress * 0.3;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };

    // 使用 fetch 预加载模型
    try {
      setLoadingStatus('正在下载模型文件...');
      setLoadingProgress(10);
      
      const modelBuffer = await fetchModelWithRetry(modelUrl, 3);
      
      setLoadingStatus('正在解析模型...');
      setLoadingProgress(50);
      
      const loader = new GLTFLoader();
      
      loader.parse(
        modelBuffer,
        '',
        (gltf) => {
          setLoadingStatus('正在生成粒子...');
          setLoadingProgress(70);
          
          const model = gltf.scene;
          
          // 收集所有顶点
          const positions: number[] = [];
          const colors: number[] = [];
          
          // 首先计算模型的边界框
          const boundingBox = new THREE.Box3().setFromObject(model);
          const modelSize = new THREE.Vector3();
          boundingBox.getSize(modelSize);
          const modelCenter = new THREE.Vector3();
          boundingBox.getCenter(modelCenter);
          
          console.log('Model bounding box:', boundingBox);
          console.log('Model size:', modelSize);
          console.log('Model center:', modelCenter);
          
          // 遍历所有网格
          model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.geometry) {
              const geometry = child.geometry;
              const positionAttribute = geometry.getAttribute('position');
              
              // 应用模型的世界矩阵
              child.updateWorldMatrix(true, false);
              const matrix = child.matrixWorld;
              
              for (let i = 0; i < positionAttribute.count; i++) {
                const vertex = new THREE.Vector3(
                  positionAttribute.getX(i),
                  positionAttribute.getY(i),
                  positionAttribute.getZ(i)
                );
                vertex.applyMatrix4(matrix);
                positions.push(vertex.x, vertex.y, vertex.z);
                
                // 基于位置计算颜色
                // 归一化坐标到 0-1 范围
                const normalizedY = (vertex.y - boundingBox.min.y) / modelSize.y;
                const normalizedRadius = Math.sqrt(
                  Math.pow(vertex.x - modelCenter.x, 2) + 
                  Math.pow(vertex.z - modelCenter.z, 2)
                ) / (Math.max(modelSize.x, modelSize.z) / 2);
                
                let color: THREE.Color;
                
                // 根据高度和半径分配颜色
                if (normalizedY < 0.15 && normalizedRadius > 0.7) {
                  // 外围底部 - 草地绿色
                  color = new THREE.Color(0x5a7a3a); // 暗绿色
                } else if (normalizedY < 0.25 && normalizedRadius > 0.5) {
                  // 外围中下部 - 草地绿色
                  color = new THREE.Color(0x6b8b4a); // 草绿色
                } else if (normalizedY < 0.4) {
                  // 下层台阶 - 灰褐色
                  color = new THREE.Color(0x8a7b6a); // 灰褐色
                } else if (normalizedY < 0.6) {
                  // 中层台阶 - 浅灰褐色
                  color = new THREE.Color(0x9a8b7a); // 浅灰褐色
                } else if (normalizedY < 0.8) {
                  // 上层台阶 - 更浅的灰褐色
                  color = new THREE.Color(0xa89b8a); // 更浅灰褐色
                } else {
                  // 顶部 - 最浅的颜色
                  color = new THREE.Color(0xb8a898); // 米色
                }
                
                // 添加一些随机变化增加真实感
                const variation = 0.08;
                color.r = Math.min(1, Math.max(0, color.r + (Math.random() - 0.5) * variation));
                color.g = Math.min(1, Math.max(0, color.g + (Math.random() - 0.5) * variation));
                color.b = Math.min(1, Math.max(0, color.b + (Math.random() - 0.5) * variation));
                
                colors.push(color.r, color.g, color.b);
              }
            }
          });

          console.log('Collected vertices:', positions.length / 3);

          setLoadingProgress(85);

          // 如果顶点太多，进行采样
          const maxParticles = 80000;
          let sampledPositions = positions;
          let sampledColors = colors;
          
          if (positions.length / 3 > maxParticles) {
            sampledPositions = [];
            sampledColors = [];
            const step = Math.ceil(positions.length / 3 / maxParticles);
            for (let i = 0; i < positions.length / 3; i += step) {
              sampledPositions.push(
                positions[i * 3],
                positions[i * 3 + 1],
                positions[i * 3 + 2]
              );
              sampledColors.push(
                colors[i * 3],
                colors[i * 3 + 1],
                colors[i * 3 + 2]
              );
            }
          }

          console.log('Final particle count:', sampledPositions.length / 3);

          // 创建粒子几何体
          const particleGeometry = new THREE.BufferGeometry();
          const positionArray = new Float32Array(sampledPositions);
          const colorArray = new Float32Array(sampledColors);
          
          particleGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
          particleGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
          
          // 保存原始位置
          originalPositionsRef.current = positionArray.slice();

          // 创建粒子材质 - 使用普通混合保持原色
          const particleMaterial = new THREE.PointsMaterial({
            size: 0.02, // 小粒子
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.NormalBlending,
            depthWrite: true,
            sizeAttenuation: true,
          });

          // 创建粒子系统
          const points = new THREE.Points(particleGeometry, particleMaterial);
          
          // 居中模型
          particleGeometry.computeBoundingBox();
          const box = particleGeometry.boundingBox;
          if (box) {
            const center = new THREE.Vector3();
            box.getCenter(center);
            points.position.sub(center);
            
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            console.log('Particle system size:', size, 'Max dimension:', maxDim);
            camera.position.set(0, maxDim * 0.5, maxDim * 1.5);
            controls.target.set(0, 0, 0);
            controls.update();
          }
          
          scene.add(points);
          pointsRef.current = points;

          console.log(`Loaded ${sampledPositions.length / 3} particles`);
          
          // 启动动画循环
          console.log('Starting animation loop');
          animate();
          
          // 更新状态
          setLoadingProgress(100);
          setIsLoaded(true);
          
          // 通知父组件加载完成
          console.log('Calling onLoadComplete');
          onLoadComplete?.();
        },
        (error) => {
          console.error('Error parsing model:', error);
          const errorMsg = error instanceof Error ? error.message : 'Failed to parse model';
          setLoadError(errorMsg);
          onLoadError?.(errorMsg);
        }
      );
    } catch (error) {
      console.error('Error fetching model:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch model';
      setLoadError(errorMsg);
      onLoadError?.(errorMsg);
      return;
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      isInitializedRef.current = false;
    };
  }, [modelUrl, onLoadComplete, onLoadError]);

  useEffect(() => {
    initScene();
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current.contains(rendererRef.current.domElement)) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      isInitializedRef.current = false;
    };
  }, [initScene]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full relative ${className || ''}`}
      style={{ minHeight: '400px' }}
    >
      {/* 加载指示器 */}
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-10">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-white/80 text-sm">{loadingStatus}</p>
          <p className="text-white/60 text-xs mt-1">{loadingProgress}%</p>
        </div>
      )}
      {/* 错误提示 */}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-10">
          <p className="text-red-400 text-sm mb-2">模型加载失败</p>
          <p className="text-white/60 text-xs max-w-md text-center px-4">{loadError}</p>
        </div>
      )}
    </div>
  );
}
