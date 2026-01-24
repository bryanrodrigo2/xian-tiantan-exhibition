import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ParticleSceneProps {
  modelUrl: string;
  gestureState: 'open' | 'closed' | 'neutral';
  handPosition?: { x: number; y: number } | null;
  className?: string;
  onLoadComplete?: () => void;
  onLoadError?: (error: string) => void;
}

// 使用 fetch 预加载模型文件，支持重试
async function fetchModelWithRetry(url: string, maxRetries = 3, onProgress?: (progress: number) => void): Promise<ArrayBuffer> {
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
      
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      if (!response.body) {
        const buffer = await response.arrayBuffer();
        console.log(`Model fetched successfully, size: ${buffer.byteLength} bytes`);
        return buffer;
      }
      
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        if (total > 0 && onProgress) {
          onProgress(Math.round((receivedLength / total) * 100));
        }
      }
      
      const buffer = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        buffer.set(chunk, position);
        position += chunk.length;
      }
      
      console.log(`Model fetched successfully, size: ${buffer.byteLength} bytes`);
      return buffer.buffer;
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

// 根据顶点位置计算颜色（模拟天坛的真实外观）
function getColorByPosition(
  vertex: THREE.Vector3,
  boundingBox: THREE.Box3,
  modelCenter: THREE.Vector3
): THREE.Color {
  // 计算归一化的位置
  const size = new THREE.Vector3();
  boundingBox.getSize(size);
  
  // 计算相对于中心的位置
  const relX = vertex.x - modelCenter.x;
  const relY = vertex.y - boundingBox.min.y; // 相对于底部的高度
  const relZ = vertex.z - modelCenter.z;
  
  // 计算水平距离（到中心的距离）
  const horizontalDist = Math.sqrt(relX * relX + relZ * relZ);
  const maxHorizontalDist = Math.max(size.x, size.z) / 2;
  const normalizedDist = horizontalDist / maxHorizontalDist;
  
  // 计算归一化高度
  const normalizedHeight = relY / size.y;
  
  // 添加一些随机变化
  const noise = (Math.sin(vertex.x * 10) * Math.cos(vertex.z * 10) + 1) * 0.5;
  
  // 颜色定义
  const grassGreen = new THREE.Color(0.35, 0.55, 0.25);      // 草地绿色
  const grassDark = new THREE.Color(0.25, 0.45, 0.18);       // 深草绿
  const stoneGray = new THREE.Color(0.55, 0.52, 0.48);       // 石头灰色
  const stoneBrown = new THREE.Color(0.50, 0.45, 0.38);      // 石头棕色
  const dirtBrown = new THREE.Color(0.45, 0.38, 0.30);       // 泥土棕色
  const lightStone = new THREE.Color(0.65, 0.62, 0.58);      // 浅石色
  
  let color: THREE.Color;
  
  // 根据位置分配颜色
  if (normalizedDist > 0.75) {
    // 外围区域 - 草地
    color = grassGreen.clone().lerp(grassDark, noise * 0.5);
    // 添加一些黄绿色变化
    color.r += (Math.random() - 0.5) * 0.08;
    color.g += (Math.random() - 0.5) * 0.08;
  } else if (normalizedDist > 0.3) {
    // 中间区域 - 台阶/石头
    if (normalizedHeight < 0.3) {
      // 底部台阶
      color = stoneBrown.clone().lerp(dirtBrown, noise * 0.4);
    } else if (normalizedHeight < 0.6) {
      // 中部台阶
      color = stoneGray.clone().lerp(stoneBrown, noise * 0.3);
    } else {
      // 上部台阶
      color = lightStone.clone().lerp(stoneGray, noise * 0.3);
    }
    // 添加石头纹理变化
    color.r += (Math.random() - 0.5) * 0.06;
    color.g += (Math.random() - 0.5) * 0.06;
    color.b += (Math.random() - 0.5) * 0.06;
  } else {
    // 中心区域 - 顶部平台
    color = lightStone.clone().lerp(stoneGray, noise * 0.2);
    color.r += (Math.random() - 0.5) * 0.04;
    color.g += (Math.random() - 0.5) * 0.04;
    color.b += (Math.random() - 0.5) * 0.04;
  }
  
  return color;
}

// 尝试从纹理采样颜色
function tryGetTextureColor(
  texture: THREE.Texture,
  uv: THREE.Vector2
): THREE.Color | null {
  try {
    const image = texture.image;
    if (!image) return null;
    
    // 检查是否是 ImageBitmap 或 HTMLImageElement
    let width: number, height: number;
    if (image instanceof ImageBitmap) {
      width = image.width;
      height = image.height;
    } else if (image instanceof HTMLImageElement) {
      width = image.naturalWidth || image.width;
      height = image.naturalHeight || image.height;
    } else if (image.width && image.height) {
      width = image.width;
      height = image.height;
    } else {
      return null;
    }
    
    if (width === 0 || height === 0) return null;
    
    // 创建 canvas 来读取像素
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    
    // 绘制图像到 canvas
    ctx.drawImage(image, 0, 0);
    
    // 计算像素坐标
    const x = Math.floor(Math.abs(uv.x % 1) * width);
    const y = Math.floor((1 - Math.abs(uv.y % 1)) * height);
    
    // 读取像素
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    
    // 检查是否成功读取（非全黑）
    if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 0) {
      return null;
    }
    
    return new THREE.Color(pixel[0] / 255, pixel[1] / 255, pixel[2] / 255);
  } catch (error) {
    console.warn('Texture sampling failed:', error);
    return null;
  }
}

export default function ParticleScene({ 
  modelUrl, 
  gestureState, 
  handPosition,
  className, 
  onLoadComplete, 
  onLoadError 
}: ParticleSceneProps) {
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
  
  // 手势控制的旋转
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const lastHandPositionRef = useRef<{ x: number; y: number } | null>(null);

  // 根据手势状态更新目标进度
  useEffect(() => {
    if (gestureState === 'open') {
      targetProgressRef.current = 1;
    } else if (gestureState === 'closed') {
      targetProgressRef.current = 0;
    }
  }, [gestureState]);

  // 根据手的位置更新模型旋转
  useEffect(() => {
    if (handPosition && lastHandPositionRef.current) {
      const deltaX = handPosition.x - lastHandPositionRef.current.x;
      const deltaY = handPosition.y - lastHandPositionRef.current.y;
      
      targetRotationRef.current.y += deltaX * 3;
      targetRotationRef.current.x += deltaY * 2;
      
      targetRotationRef.current.x = Math.max(-0.5, Math.min(0.5, targetRotationRef.current.x));
    }
    lastHandPositionRef.current = handPosition || null;
  }, [handPosition]);

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
    controls.autoRotateSpeed = 0.3;
    controlsRef.current = controls;

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
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
      
      // 平滑过渡旋转
      const rotationLerpSpeed = 0.05;
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * rotationLerpSpeed;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * rotationLerpSpeed;
      
      // 更新粒子位置和旋转
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
          
          const floatX = Math.sin(time * 1.5 + i * 0.1) * 0.01;
          const floatY = Math.cos(time * 1.2 + i * 0.15) * 0.01;
          const floatZ = Math.sin(time * 1.8 + i * 0.12) * 0.01;
          
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
        
        // 应用手势控制的旋转
        pointsRef.current.rotation.x = currentRotationRef.current.x;
        pointsRef.current.rotation.y += currentRotationRef.current.y * 0.01;
        
        const material = pointsRef.current.material as THREE.PointsMaterial;
        material.opacity = 0.9 - progress * 0.3;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };

    // 使用 fetch 预加载模型
    try {
      setLoadingStatus('正在下载模型文件...');
      setLoadingProgress(5);
      
      const modelBuffer = await fetchModelWithRetry(modelUrl, 3, (progress) => {
        setLoadingProgress(5 + Math.round(progress * 0.45));
      });
      
      setLoadingStatus('正在解析模型...');
      setLoadingProgress(55);
      
      const loader = new GLTFLoader();
      
      loader.parse(
        modelBuffer,
        '',
        (gltf) => {
          setLoadingStatus('正在生成粒子...');
          setLoadingProgress(60);
          
          const model = gltf.scene;
          
          // 收集所有顶点和颜色
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
          
          let totalVertices = 0;
          let texturedVertices = 0;
          let coloredByPosition = 0;
          
          // 遍历所有网格
          model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.geometry) {
              const geometry = child.geometry;
              const positionAttribute = geometry.getAttribute('position');
              const uvAttribute = geometry.getAttribute('uv');
              const colorAttribute = geometry.getAttribute('color');
              
              // 获取材质
              const material = Array.isArray(child.material) ? child.material[0] : child.material;
              let texture: THREE.Texture | null = null;
              
              if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
                if (material.map) {
                  texture = material.map;
                  console.log('Found texture:', texture.name || 'unnamed', 'Image:', texture.image);
                }
              }
              
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
                
                let color: THREE.Color | null = null;
                totalVertices++;
                
                // 1. 优先尝试从纹理采样颜色
                if (texture && uvAttribute) {
                  const uv = new THREE.Vector2(
                    uvAttribute.getX(i),
                    uvAttribute.getY(i)
                  );
                  color = tryGetTextureColor(texture, uv);
                  if (color) texturedVertices++;
                }
                
                // 2. 尝试使用顶点颜色
                if (!color && colorAttribute) {
                  const r = colorAttribute.getX(i);
                  const g = colorAttribute.getY(i);
                  const b = colorAttribute.getZ(i);
                  // 检查是否是有效颜色（不是全黑或全白）
                  if (!(r === 0 && g === 0 && b === 0) && !(r === 1 && g === 1 && b === 1)) {
                    color = new THREE.Color(r, g, b);
                  }
                }
                
                // 3. 根据位置分配颜色（模拟天坛外观）
                if (!color) {
                  color = getColorByPosition(vertex, boundingBox, modelCenter);
                  coloredByPosition++;
                }
                
                colors.push(color.r, color.g, color.b);
              }
            }
          });

          console.log('Total vertices:', totalVertices);
          console.log('Textured vertices:', texturedVertices);
          console.log('Colored by position:', coloredByPosition);

          setLoadingProgress(75);

          // 如果顶点太多，进行采样
          const maxParticles = 150000;
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

          setLoadingProgress(85);

          // 创建粒子几何体
          const particleGeometry = new THREE.BufferGeometry();
          const positionArray = new Float32Array(sampledPositions);
          const colorArray = new Float32Array(sampledColors);
          
          particleGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
          particleGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
          
          // 保存原始位置
          originalPositionsRef.current = positionArray.slice();

          // 创建粒子材质 - 小粒子，保持原色
          const particleMaterial = new THREE.PointsMaterial({
            size: 0.008, // 更小的粒子
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
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
            camera.position.set(0, maxDim * 0.4, maxDim * 1.2);
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
          <div className="w-48 h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-white/60 text-xs mt-2">{loadingProgress}%</p>
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
