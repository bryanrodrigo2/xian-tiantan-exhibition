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
      
      // 等待一段时间后重试
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
  const progressRef = useRef(0); // 0 = 聚合, 1 = 消散
  const targetProgressRef = useRef(0);
  const clockRef = useRef<THREE.Clock | null>(null);

  // 根据手势状态更新目标进度
  useEffect(() => {
    if (gestureState === 'open') {
      targetProgressRef.current = 1; // 消散
    } else if (gestureState === 'closed') {
      targetProgressRef.current = 0; // 聚合
    }
  }, [gestureState]);

  // 动画循环函数 - 独立出来以便在模型加载后启动
  const startAnimationLoop = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !controlsRef.current) {
      console.error('Cannot start animation: missing required refs');
      return;
    }

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    // 初始化时钟
    if (!clockRef.current) {
      clockRef.current = new THREE.Clock();
    }
    const clock = clockRef.current;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();
      
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
          
          // 原始位置
          const ox = original[i3];
          const oy = original[i3 + 1];
          const oz = original[i3 + 2];
          
          // 消散方向（从中心向外）
          const length = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
          const nx = ox / length;
          const ny = oy / length;
          const nz = oz / length;
          
          // 消散距离
          const disperseDistance = 8 + Math.sin(time * 2 + i * 0.01) * 0.5;
          
          // 轻微漂浮效果
          const floatX = Math.sin(time * 1.5 + i * 0.1) * 0.02;
          const floatY = Math.cos(time * 1.2 + i * 0.15) * 0.02;
          const floatZ = Math.sin(time * 1.8 + i * 0.12) * 0.02;
          
          // 插值计算最终位置
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
        
        // 更新透明度
        const material = pointsRef.current.material as THREE.PointsMaterial;
        material.opacity = 0.9 - progress * 0.4;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    console.log('Starting animation loop');
    animate();
  }, []);

  const initScene = useCallback(async () => {
    if (!containerRef.current) return;

    // 清理旧场景
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

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

    // 使用 fetch 预加载模型
    try {
      setLoadingStatus('正在下载模型文件...');
      setLoadingProgress(10);
      
      const modelBuffer = await fetchModelWithRetry(modelUrl, 3);
      
      setLoadingStatus('正在解析模型...');
      setLoadingProgress(50);
      
      // 使用 GLTFLoader 解析已下载的数据
      const loader = new GLTFLoader();
      
      loader.parse(
        modelBuffer,
        '',
        (gltf) => {
          setLoadingStatus('正在生成粒子...');
          setLoadingProgress(70);
          
          const model = gltf.scene;
          
          // 收集所有顶点和颜色
          const positions: number[] = [];
          const colors: number[] = [];
          
          model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.geometry) {
              const geometry = child.geometry;
              const positionAttribute = geometry.getAttribute('position');
              
              // 获取材质颜色
              let materialColor = new THREE.Color(0xffffff);
              if (child.material) {
                if (Array.isArray(child.material)) {
                  if (child.material[0] && 'color' in child.material[0]) {
                    materialColor = (child.material[0] as THREE.MeshStandardMaterial).color || new THREE.Color(0xffffff);
                  }
                } else if ('color' in child.material) {
                  materialColor = (child.material as THREE.MeshStandardMaterial).color || new THREE.Color(0xffffff);
                }
              }
              
              // 应用模型的世界矩阵
              child.updateWorldMatrix(true, false);
              const matrix = child.matrixWorld;
              
              // 检查是否有顶点颜色
              const colorAttribute = geometry.getAttribute('color');
              
              for (let i = 0; i < positionAttribute.count; i++) {
                const vertex = new THREE.Vector3(
                  positionAttribute.getX(i),
                  positionAttribute.getY(i),
                  positionAttribute.getZ(i)
                );
                vertex.applyMatrix4(matrix);
                positions.push(vertex.x, vertex.y, vertex.z);
                
                // 使用顶点颜色或材质颜色
                if (colorAttribute) {
                  colors.push(
                    colorAttribute.getX(i),
                    colorAttribute.getY(i),
                    colorAttribute.getZ(i)
                  );
                } else {
                  colors.push(materialColor.r, materialColor.g, materialColor.b);
                }
              }
            }
          });

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

          // 创建粒子几何体
          const particleGeometry = new THREE.BufferGeometry();
          const positionArray = new Float32Array(sampledPositions);
          const colorArray = new Float32Array(sampledColors);
          
          particleGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
          particleGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
          
          // 保存原始位置
          originalPositionsRef.current = positionArray.slice();

          // 创建粒子材质 - 使用顶点颜色，发光软圆点
          const particleMaterial = new THREE.PointsMaterial({
            size: 0.06,
            vertexColors: true, // 使用顶点颜色保持原始颜色
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
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
            
            // 调整相机位置以适应模型大小
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            camera.position.set(0, maxDim * 0.5, maxDim * 1.5);
            controls.target.set(0, 0, 0);
            controls.update();
          }
          
          scene.add(points);
          pointsRef.current = points;

          console.log(`Loaded ${sampledPositions.length / 3} particles with original colors`);
          
          // 关键修复：在模型解析完成后才启动动画循环
          setLoadingProgress(100);
          setIsLoaded(true);
          
          // 启动动画循环
          startAnimationLoop();
          
          // 通知父组件加载完成
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
    };
  }, [modelUrl, onLoadComplete, onLoadError, startAnimationLoop]);

  useEffect(() => {
    initScene();
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
