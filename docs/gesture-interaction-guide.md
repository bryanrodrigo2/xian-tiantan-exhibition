# 天坛模型手势交互功能讲解文档

## 1. 功能概述

本项目在“西安隋唐天坛全息影像设计与交互实现”网站的“交互与复原”页面下，新增了“手势交互”功能。该功能利用 **Three.js** 和 **MediaPipe Hands** 技术，实现了通过手势控制天坛模型的粒子效果，为用户提供沉浸式的交互体验。

**核心交互逻辑：**

- **张开手掌**：天坛模型的粒子向外扩散、消散。
- **握紧拳头**：消散的粒子重新聚合成完整的天坛模型。

## 2. 技术实现

### 2.1. 核心技术栈

| 技术栈 | 用途 | 备注 |
| :--- | :--- | :--- |
| **React** | 构建用户界面的 JavaScript 库 | 项目基础框架 |
| **Three.js** | 创建和显示三维计算机图形的 JavaScript 库 | 用于加载 GLB 模型、创建粒子系统、实现动画效果 |
| **MediaPipe Hands** | Google 开发的实时手部跟踪解决方案 | 用于检测用户手势（张开/握拳） |
| **Vite** | 新一代前端构建工具 | 提供快速的开发服务器和优化的构建流程 |
| **Tailwind CSS** | 功能类优先的 CSS 框架 | 用于快速构建美观的 UI 界面 |
| **Vercel** | 自动化部署和托管平台 | 用于部署和托管网站 |

### 2.2. 代码结构

为了实现手势交互功能，我们新增和修改了以下文件：

| 文件路径 | 用途 |
| :--- | :--- |
| `client/src/pages/GestureInteraction.tsx` | **手势交互主页面**：整合了 `ParticleScene` 和 `useHandGesture`，负责 UI 渲染和交互逻辑。 |
| `client/src/components/ParticleScene.tsx` | **粒子场景组件**：使用 Three.js 加载 `tiantan123.glb` 模型，将其顶点转换为粒子，并根据手势状态控制粒子的动画（聚合/扩散）。 |
| `client/src/hooks/useHandGesture.ts` | **手势检测 Hook**：使用 MediaPipe Hands 实时检测用户手势，并将手势状态（`GestureState.Open` / `GestureState.Closed`）传递给 `GestureInteraction` 页面。 |
| `client/src/App.tsx` | **路由配置**：添加了 `/gesture` 路由，指向 `GestureInteraction` 页面。 |
| `client/src/pages/Interaction.tsx` | **交互复原页面**：添加了“手势交互”功能的入口卡片，引导用户进入新功能。 |
| `client/public/models/tiantan123.glb` | **天坛 3D 模型**：手势交互功能的核心视觉元素。 |
| `vercel.json` | **Vercel 部署配置**：确保静态资源（特别是模型文件）能够被正确部署和访问。 |

### 2.3. 关键代码解析

#### 2.3.1. 粒子化模型 - `ParticleScene.tsx`

```typescript
// ...
const loader = new GLTFLoader();
loader.load(modelUrl, (gltf) => {
  const model = gltf.scene;
  const positions = [];
  const colors = [];

  model.traverse((child) => {
    if (child.isMesh) {
      const pos = child.geometry.attributes.position.array;
      const col = child.material.color;
      for (let i = 0; i < pos.length; i += 3) {
        positions.push(pos[i], pos[i + 1], pos[i + 2]);
        colors.push(col.r, col.g, col.b);
      }
    }
  });

  // 创建粒子几何体和材质
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
  // ...
});
```

**解析：**

1. 使用 `GLTFLoader` 加载 `tiantan123.glb` 模型。
2. 遍历模型的所有 `Mesh`（网格），提取其顶点位置（`position`）和材质颜色（`color`）。
3. 创建一个新的 `BufferGeometry`，将提取的位置和颜色信息作为 `Attribute` 添加进去。
4. 使用 `PointsMaterial` 创建粒子材质，并启用 `vertexColors` 以显示模型的原始颜色。
5. 最后，创建一个 `THREE.Points` 对象（粒子系统）并将其添加到场景中。

#### 2.3.2. 手势检测 - `useHandGesture.ts`

```typescript
// ...
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

hands.onResults((results) => {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const isFist = isFistGesture(landmarks);
    const newGesture = isFist ? GestureState.Closed : GestureState.Open;
    // ... 更新手势状态
  }
});

// ...
```

**解析：**

1. 初始化 `MediaPipe Hands`，并从 CDN 加载所需的模型文件。
2. 设置 `maxNumHands: 1`，只检测一只手，以提高性能。
3. 在 `onResults` 回调中，获取手部关键点（`landmarks`）。
4. 通过 `isFistGesture` 函数判断当前手势是“握拳”还是“张开”。
5. 将检测到的手势状态（`GestureState.Open` / `GestureState.Closed`）传递给 `GestureInteraction` 页面，用于控制粒子动画。

## 3. 部署与配置

### 3.1. Vercel 部署配置 - `vercel.json`

为了确保模型文件（`.glb`）能被正确部署和访问，我们创建了 `vercel.json` 配置文件：

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/public",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/((?!models/).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/models/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Content-Type",
          "value": "model/gltf-binary"
        }
      ]
    }
  ]
}
```

**解析：**

- **`rewrites`**：将所有非 `/models/` 路径的请求都重定向到 `index.html`，这是单页面应用（SPA）的典型配置。
- **`headers`**：为 `/models/` 路径下的所有文件设置了正确的 `Content-Type`（`model/gltf-binary`）和 `Access-Control-Allow-Origin`（`*`），以解决跨域问题和浏览器解析问题。

### 3.2. Vite 构建配置 - `vite.config.ts`

```typescript
// ...
export default defineConfig({
  // ...
  base: "/",
  // ...
});
```

**解析：**

- 将 `base` 设置为 `/`（根路径），确保构建后的静态资源（如 CSS、JS、模型文件）能从网站根目录正确加载。

## 4. 问题排查与解决方案

在开发过程中，我们遇到并解决了一些问题：

| 问题描述 | 解决方案 |
| :--- | :--- |
| **模型文件加载失败（404）** | 最初模型文件较大，被添加到了 `.gitignore` 中，导致没有被推送到 GitHub。后来改为使用本地路径，并配置 Vercel 正确部署静态文件。 |
| **CORS 跨域问题** | 当尝试使用外部 CDN 托管模型文件时，遇到了 CORS 问题。最终通过将仓库设为公开，并使用支持 CORS 的 jsDelivr CDN 解决了问题。但为了更稳定的部署，最终方案改回了使用本地路径 + Vercel 配置。 |
| **SSL 协议错误** | `bryanfinal.xyz` 域名出现了 `ERR_SSL_PROTOCOL_ERROR`。这通常是域名或 Vercel 的 SSL 配置问题。**解决方案**：在 Vercel 控制台中检查该域名的 SSL 证书状态，如果证书无效或过期，需要重新生成或续期。 |

## 5. 总结

通过本次开发，我们成功地为“西安隋唐天坛”项目添加了富有创意和互动性的手势交互功能。这不仅提升了用户体验，也为文化遗产的数字化展示提供了新的思路。

---

**作者：Manus AI**

**日期：2026年1月23日**
