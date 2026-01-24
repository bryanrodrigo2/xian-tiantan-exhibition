import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

interface ParticleSceneProps {
  modelUrl: string;
  mtlUrl?: string; // 可选的MTL材质文件URL（用于OBJ格式）
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
  const size = new THREE.Vector3();
  boundingBox.getSize(size);
  
  const relX = vertex.x - modelCenter.x;
  const relY = vertex.y - boundingBox.min.y;
  const relZ = vertex.z - modelCenter.z;
  
  const horizontalDist = Math.sqrt(relX * relX + relZ * relZ);
  const maxHorizontalDist = Math.max(size.x, size.z) / 2;
  const normalizedDist = horizontalDist / maxHorizontalDist;
  const normalizedHeight = relY / size.y;
  
  // 添加多层噪声以增强细节
  const noise = (Math.sin(vertex.x * 15) * Math.cos(vertex.z * 15) + 1) * 0.5;
  const noise2 = (Math.sin(vertex.x * 8 + vertex.z * 8) + 1) * 0.5;
  const noise3 = (Math.sin(vertex.x * 25 + vertex.z * 25) + 1) * 0.5;
  
  // 优化的颜色定义 - 更鲜艳的绿色和更真实的石头纹理
  const grassGreen = new THREE.Color(0.38, 0.60, 0.18);      // 超鲜艳的绿色（增强鲜艳度）
  const grassDark = new THREE.Color(0.20, 0.35, 0.10);       // 深绿色（增强深度）
  const stoneGray = new THREE.Color(0.58, 0.56, 0.50);       // 温暖的灰色（增强温暖感）
  const stoneBrown = new THREE.Color(0.52, 0.48, 0.42);      // 温暖棕色（增强温暖感）
  const dirtBrown = new THREE.Color(0.48, 0.40, 0.32);       // 温暖土棕色（增强温暖感）
  const lightStone = new THREE.Color(0.65, 0.63, 0.58);      // 浅石头色（增强亮度）
  const darkStone = new THREE.Color(0.38, 0.36, 0.32);       // 深石头色（增强深度）
  
  let color: THREE.Color;
  
  // 优化的分层逻辑 - 更好地呈现圆形阶梯结构
  if (normalizedDist > 0.75) {
    // 外围草地区域 - 增加绿色比例，更鲜艳的效果
    const grassBlend = noise * 0.6 + noise3 * 0.4;
    color = grassGreen.clone().lerp(grassDark, grassBlend * 0.5);
    color.r += (noise2 - 0.5) * 0.10;
    color.g += (noise2 - 0.5) * 0.15;
    color.b += (noise2 - 0.5) * 0.05;
  } else if (normalizedDist > 0.20) {
    // 台阶区域 - 根据高度分为 4 层，从土棕色到浅石头色
    if (normalizedHeight < 0.15) {
      // 底部 - 温暖土棕色
      color = dirtBrown.clone().lerp(stoneBrown, noise * 0.5);
      color.r += (noise2 - 0.5) * 0.08;
      color.g += (noise2 - 0.5) * 0.06;
      color.b += (noise2 - 0.5) * 0.04;
    } else if (normalizedHeight < 0.35) {
      // 中下层 - 温暖棕色石头
      color = stoneBrown.clone().lerp(stoneGray, noise * 0.4);
      color.r += (noise2 - 0.5) * 0.07;
      color.g += (noise2 - 0.5) * 0.07;
      color.b += (noise2 - 0.5) * 0.06;
    } else if (normalizedHeight < 0.65) {
      // 中层 - 温暖灰色石头
      color = stoneGray.clone().lerp(lightStone, noise * 0.3);
      color.r += (noise2 - 0.5) * 0.07;
      color.g += (noise2 - 0.5) * 0.07;
      color.b += (noise2 - 0.5) * 0.07;
    } else {
      // 上层 - 浅温暖石头色
      color = lightStone.clone().lerp(stoneGray, noise * 0.25);
      color.r += (noise2 - 0.5) * 0.08;
      color.g += (noise2 - 0.5) * 0.08;
      color.b += (noise2 - 0.5) * 0.08;
    }
  } else {
    // 中心圆形顶部 - 增加细节，更丰富的颜色变化
    const centerBlend = normalizedHeight > 0.5 ? lightStone : stoneGray;
    color = centerBlend.clone().lerp(darkStone, noise * 0.40);
    color.r += (noise2 - 0.5) * 0.08;
    color.g += (noise2 - 0.5) * 0.08;
    color.b += (noise2 - 0.5) * 0.08;
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
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    
    ctx.drawImage(image, 0, 0);
    
    const x = Math.floor(Math.abs(uv.x % 1) * width);
    const y = Math.floor((1 - Math.abs(uv.y % 1)) * height);
    
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    
    if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 0) {
      return null;
    }
    
    return new THREE.Color(pixel[0] / 255, pixel[1] / 255, pixel[2] / 255);
  } catch {
    return null;
  }
}

// 从三角形面生成更多的粒子点
function generatePointsFromTriangle(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  v3: THREE.Vector3,
  c1: THREE.Color,
  c2: THREE.Color,
  c3: THREE.Color,
  density: number
): { positions: number[], colors: number[] } {
  const positions: number[] = [];
  const colors: number[] = [];
  
  // 计算三角形面积
  const edge1 = new THREE.Vector3().subVectors(v2, v1);
  const edge2 = new THREE.Vector3().subVectors(v3, v1);
  const cross = new THREE.Vector3().crossVectors(edge1, edge2);
  const area = cross.length() / 2;
  
  // 根据面积和密度计算需要生成的点数
  const numPoints = Math.max(1, Math.floor(area * density));
  
  for (let i = 0; i < numPoints; i++) {
    // 使用重心坐标生成随机点
    let r1 = Math.random();
    let r2 = Math.random();
    if (r1 + r2 > 1) {
      r1 = 1 - r1;
      r2 = 1 - r2;
    }
    const r3 = 1 - r1 - r2;
    
    // 插值位置
    const x = v1.x * r1 + v2.x * r2 + v3.x * r3;
    const y = v1.y * r1 + v2.y * r2 + v3.y * r3;
    const z = v1.z * r1 + v2.z * r2 + v3.z * r3;
    
    // 插值颜色
    const r = c1.r * r1 + c2.r * r2 + c3.r * r3;
    const g = c1.g * r1 + c2.g * r2 + c3.g * r3;
    const b = c1.b * r1 + c2.b * r2 + c3.b * r3;
    
    positions.push(x, y, z);
    colors.push(r, g, b);
  }
  
  return { positions, colors };
}

export default function ParticleScene({ 
  modelUrl, 
  mtlUrl,
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
  
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const lastHandPositionRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (gestureState === 'open') {
      targetProgressRef.current = 1;
    } else if (gestureState === 'closed') {
      targetProgressRef.current = 0;
    }
  }, [gestureState]);

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

  // 处理模型并生成粒子
  const processModel = useCallback((
    model: THREE.Object3D,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    animate: () => void
  ) => {
    setLoadingStatus('正在生成粒子...');
    setLoadingProgress(60);
    
    const positions: number[] = [];
    const colors: number[] = [];
    
    const boundingBox = new THREE.Box3().setFromObject(model);
    const modelSize = new THREE.Vector3();
    boundingBox.getSize(modelSize);
    const modelCenter = new THREE.Vector3();
    boundingBox.getCenter(modelCenter);
    
    console.log('Model bounding box:', boundingBox);
    console.log('Model size:', modelSize);
    
    // 计算粒子密度 - 根据模型大小自适应
    const modelVolume = modelSize.x * modelSize.y * modelSize.z;
    const baseDensity = 1200000; // 方案 1: 增加粒子密度 (+26%)
    const particleDensity = baseDensity / Math.max(1, modelVolume);
    
    console.log('Particle density:', particleDensity);
    
    let totalVertices = 0;
    let generatedPoints = 0;
    
    // 遍历所有网格
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const geometry = child.geometry;
        const positionAttribute = geometry.getAttribute('position');
        const uvAttribute = geometry.getAttribute('uv');
        const colorAttribute = geometry.getAttribute('color');
        const indexAttribute = geometry.index;
        
        const material = Array.isArray(child.material) ? child.material[0] : child.material;
        let texture: THREE.Texture | null = null;
        
        if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
          if (material.map) {
            texture = material.map;
          }
        }
        
        child.updateWorldMatrix(true, false);
        const matrix = child.matrixWorld;
        
        // 获取所有顶点位置和颜色
        const vertices: THREE.Vector3[] = [];
        const vertexColors: THREE.Color[] = [];
        
        for (let i = 0; i < positionAttribute.count; i++) {
          const vertex = new THREE.Vector3(
            positionAttribute.getX(i),
            positionAttribute.getY(i),
            positionAttribute.getZ(i)
          );
          vertex.applyMatrix4(matrix);
          vertices.push(vertex);
          
          let color: THREE.Color | null = null;
          totalVertices++;
          
          // 尝试获取颜色
          if (texture && uvAttribute) {
            const uv = new THREE.Vector2(
              uvAttribute.getX(i),
              uvAttribute.getY(i)
            );
            color = tryGetTextureColor(texture, uv);
          }
          
          if (!color && colorAttribute) {
            const r = colorAttribute.getX(i);
            const g = colorAttribute.getY(i);
            const b = colorAttribute.getZ(i);
            if (!(r === 0 && g === 0 && b === 0) && !(r === 1 && g === 1 && b === 1)) {
              color = new THREE.Color(r, g, b);
            }
          }
          
          if (!color) {
            color = getColorByPosition(vertex, boundingBox, modelCenter);
          }
          
          vertexColors.push(color);
        }
        
        // 从三角形面生成粒子
        if (indexAttribute) {
          // 有索引的几何体
          for (let i = 0; i < indexAttribute.count; i += 3) {
            const i1 = indexAttribute.getX(i);
            const i2 = indexAttribute.getX(i + 1);
            const i3 = indexAttribute.getX(i + 2);
            
            const result = generatePointsFromTriangle(
              vertices[i1], vertices[i2], vertices[i3],
              vertexColors[i1], vertexColors[i2], vertexColors[i3],
              particleDensity
            );
            
            positions.push(...result.positions);
            colors.push(...result.colors);
            generatedPoints += result.positions.length / 3;
          }
        } else {
          // 无索引的几何体
          for (let i = 0; i < vertices.length; i += 3) {
            if (i + 2 < vertices.length) {
              const result = generatePointsFromTriangle(
                vertices[i], vertices[i + 1], vertices[i + 2],
                vertexColors[i], vertexColors[i + 1], vertexColors[i + 2],
                particleDensity
              );
              
              positions.push(...result.positions);
              colors.push(...result.colors);
              generatedPoints += result.positions.length / 3;
            }
          }
        }
        
        // 同时添加原始顶点
        for (let i = 0; i < vertices.length; i++) {
          positions.push(vertices[i].x, vertices[i].y, vertices[i].z);
          colors.push(vertexColors[i].r, vertexColors[i].g, vertexColors[i].b);
        }
      }
    });

    console.log('Total original vertices:', totalVertices);
    console.log('Generated points from triangles:', generatedPoints);
    console.log('Total particles:', positions.length / 3);

    setLoadingProgress(80);

    // 限制最大粒子数
    const maxParticles = 4500000; // 方案 1: 增加最大粒子数 (+29%)
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
      console.log('Sampled to:', sampledPositions.length / 3, 'particles');
    }

    setLoadingProgress(90);

    // 创建粒子几何体
    const particleGeometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(sampledPositions);
    const colorArray = new Float32Array(sampledColors);
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    originalPositionsRef.current = positionArray.slice();

    // 创建粒子材质 - 优化的粒子大小
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.002,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: true,
      depthTest: true,
      sizeAttenuation: true,
      fog: true,
    });

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

    console.log(`Final particle count: ${sampledPositions.length / 3}`);
    
    // 启动动画循环
    console.log('Starting animation loop');
    animate();
    
    setLoadingProgress(100);
    setIsLoaded(true);
    onLoadComplete?.();
  }, [onLoadComplete]);

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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 15);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controlsRef.current = controls;

    // 增强环境光以提供基础照明
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // 主方向光 - 从左上方照射，增强立体感
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(8, 12, 8);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);

    // 补光 - 从右下方照射，减少阴影过深
    const fillLight = new THREE.DirectionalLight(0x8899ff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // 背光 - 从后方照射，增强轮廓感
    const backLight = new THREE.DirectionalLight(0xffaa88, 0.2);
    backLight.position.set(0, 8, -10);
    scene.add(backLight);

    clockRef.current = new THREE.Clock();

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (!clockRef.current) return;
      const time = clockRef.current.getElapsedTime();
      
      const lerpSpeed = 0.08; // 增加聚合速度
      progressRef.current += (targetProgressRef.current - progressRef.current) * lerpSpeed;
      
      const rotationLerpSpeed = 0.05;
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * rotationLerpSpeed;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * rotationLerpSpeed;
      
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
          
          const floatX = Math.sin(time * 1.5 + i * 0.1) * 0.008;
          const floatY = Math.cos(time * 1.2 + i * 0.15) * 0.008;
          const floatZ = Math.sin(time * 1.8 + i * 0.12) * 0.008;
          
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
        
        pointsRef.current.rotation.x = currentRotationRef.current.x;
        pointsRef.current.rotation.y += currentRotationRef.current.y * 0.01;
        
        const material = pointsRef.current.material as THREE.PointsMaterial;
        material.opacity = 0.95 - progress * 0.3;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };

    // 判断模型格式
    const isOBJ = modelUrl.toLowerCase().endsWith('.obj');
    
    try {
      setLoadingStatus('正在下载模型文件...');
      setLoadingProgress(5);
      
      if (isOBJ) {
        // 加载OBJ格式
        const objLoader = new OBJLoader();
        
        if (mtlUrl) {
          // 如果有MTL材质文件
          const mtlLoader = new MTLLoader();
          const basePath = mtlUrl.substring(0, mtlUrl.lastIndexOf('/') + 1);
          mtlLoader.setPath(basePath);
          
          mtlLoader.load(
            mtlUrl.substring(mtlUrl.lastIndexOf('/') + 1),
            (materials) => {
              materials.preload();
              objLoader.setMaterials(materials);
              
              objLoader.load(
                modelUrl,
                (obj) => {
                  setLoadingProgress(55);
                  processModel(obj, scene, camera, controls, animate);
                },
                (xhr) => {
                  if (xhr.total > 0) {
                    setLoadingProgress(5 + Math.round((xhr.loaded / xhr.total) * 45));
                  }
                },
                (error) => {
                  console.error('Error loading OBJ:', error);
                  setLoadError('Failed to load OBJ model');
                  onLoadError?.('Failed to load OBJ model');
                }
              );
            },
            undefined,
            (error) => {
              console.warn('MTL load failed, loading OBJ without materials:', error);
              // MTL加载失败，尝试只加载OBJ
              objLoader.load(
                modelUrl,
                (obj) => {
                  setLoadingProgress(55);
                  processModel(obj, scene, camera, controls, animate);
                },
                (xhr) => {
                  if (xhr.total > 0) {
                    setLoadingProgress(5 + Math.round((xhr.loaded / xhr.total) * 45));
                  }
                },
                (error) => {
                  console.error('Error loading OBJ:', error);
                  setLoadError('Failed to load OBJ model');
                  onLoadError?.('Failed to load OBJ model');
                }
              );
            }
          );
        } else {
          // 没有MTL文件，直接加载OBJ
          objLoader.load(
            modelUrl,
            (obj) => {
              setLoadingProgress(55);
              processModel(obj, scene, camera, controls, animate);
            },
            (xhr) => {
              if (xhr.total > 0) {
                setLoadingProgress(5 + Math.round((xhr.loaded / xhr.total) * 45));
              }
            },
            (error) => {
              console.error('Error loading OBJ:', error);
              setLoadError('Failed to load OBJ model');
              onLoadError?.('Failed to load OBJ model');
            }
          );
        }
      } else {
        // 加载GLB/GLTF格式
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
            processModel(gltf.scene, scene, camera, controls, animate);
          },
          (error) => {
            console.error('Error parsing model:', error);
            const errorMsg = error instanceof Error ? error.message : 'Failed to parse model';
            setLoadError(errorMsg);
            onLoadError?.(errorMsg);
          }
        );
      }
    } catch (error) {
      console.error('Error loading model:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to load model';
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
  }, [modelUrl, mtlUrl, onLoadComplete, onLoadError, processModel]);

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
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-10">
          <p className="text-red-400 text-sm mb-2">模型加载失败</p>
          <p className="text-white/60 text-xs max-w-md text-center px-4">{loadError}</p>
        </div>
      )}
    </div>
  );
}
