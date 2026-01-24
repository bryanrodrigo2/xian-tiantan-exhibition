# 项目可替换参数详细指南

本文档详细列出项目中所有可以替换的参数、配置项和数据，用于快速定制项目内容。

---

## 1. 粒子系统参数 (ParticleScene.tsx)

### 位置：`client/src/components/ParticleScene.tsx`

#### 1.1 粒子密度配置
```typescript
// 第 329 行
const baseDensity = 1200000; // ❌ 可替换：每单位体积的粒子数
// 建议范围：500,000 - 2,000,000
// 更高的值 = 更细致的粒子效果，但性能消耗更大
```

#### 1.2 最大粒子数限制
```typescript
// 第 449 行
const maxParticles = 4000000; // ❌ 可替换：最大粒子数
// 建议范围：1,000,000 - 5,000,000
// 限制粒子总数以保持性能
```

#### 1.3 颜色定义 - 外围草地
```typescript
// 第 108-109 行
const grassGreen = new THREE.Color(0.35, 0.55, 0.20);    // ❌ 可替换：鲜艳绿色 RGB
const grassDark = new THREE.Color(0.22, 0.38, 0.12);     // ❌ 可替换：深绿色 RGB
// RGB 范围：0-1，例如：
// - 更亮的绿：(0.4, 0.6, 0.25)
// - 更暗的绿：(0.15, 0.3, 0.08)
```

#### 1.4 颜色定义 - 石头纹理
```typescript
// 第 110-114 行
const stoneGray = new THREE.Color(0.55, 0.53, 0.48);     // ❌ 可替换：温暖灰色
const stoneBrown = new THREE.Color(0.50, 0.46, 0.40);    // ❌ 可替换：棕色
const dirtBrown = new THREE.Color(0.45, 0.38, 0.30);     // ❌ 可替换：土棕色
const lightStone = new THREE.Color(0.62, 0.60, 0.55);    // ❌ 可替换：浅石头色
const darkStone = new THREE.Color(0.40, 0.38, 0.34);     // ❌ 可替换：深石头色
// 调整这些颜色以改变建筑的整体色调
```

#### 1.5 分层距离阈值
```typescript
// 第 119 行
if (normalizedDist > 0.75) {  // ❌ 可替换：外围草地范围
// 第 126 行
} else if (normalizedDist > 0.20) {  // ❌ 可替换：台阶区域范围
// 第 144 行
} else {  // ❌ 可替换：中心圆形范围
// 调整这些值以改变颜色分布的边界
// 范围：0-1，其中 0 是中心，1 是边缘
```

#### 1.6 分层高度阈值
```typescript
// 第 128-140 行
if (normalizedHeight < 0.15) {      // ❌ 可替换：底部阈值
} else if (normalizedHeight < 0.35) {  // ❌ 可替换：中下层阈值
} else if (normalizedHeight < 0.65) {  // ❌ 可替换：中层阈值
} else {  // ❌ 可替换：上层
// 调整这些值以改变不同高度的颜色分布
// 范围：0-1，其中 0 是底部，1 是顶部
```

#### 1.7 噪声参数
```typescript
// 第 103-105 行
const noise = (Math.sin(vertex.x * 15) * Math.cos(vertex.z * 15) + 1) * 0.5;  // ❌ 可替换：频率 15
const noise2 = (Math.sin(vertex.x * 8 + vertex.z * 8) + 1) * 0.5;            // ❌ 可替换：频率 8
const noise3 = (Math.sin(vertex.x * 25 + vertex.z * 25) + 1) * 0.5;          // ❌ 可替换：频率 25
// 更高的频率 = 更细致的纹理，更低的频率 = 更粗糙的纹理
```

#### 1.8 颜色混合强度
```typescript
// 第 122 行
const grassBlend = noise * 0.7 + noise3 * 0.3;  // ❌ 可替换：0.7 和 0.3 的混合比例
// 第 130, 133, 136, 139, 147 行
color = stoneBrown.clone().lerp(dirtBrown, noise * 0.6);  // ❌ 可替换：0.6 的混合强度
// 调整这些值以改变颜色的混合效果
```

---

## 2. 模型和资源 URL (GestureInteraction.tsx)

### 位置：`client/src/pages/GestureInteraction.tsx`

#### 2.1 模型 URL 列表
```typescript
// 第 10-14 行
const MODEL_URLS = [
  'https://tiantan-model.oss-cn-beijing.aliyuncs.com/tiantan.obj',  // ❌ 可替换：阿里云 OSS 模型 URL
  '/models/tiantan_large.glb',  // ❌ 可替换：本地 GLB 模型路径
  '/models/tiantan123.glb',     // ❌ 可替换：备用本地 GLB 模型路径
];
// 支持的格式：.obj, .glb, .gltf
// 可以添加更多备用 URL 以提高加载可靠性
```

#### 2.2 MTL 材质文件 URL
```typescript
// 第 17 行
const MTL_URL = 'https://tiantan-model.oss-cn-beijing.aliyuncs.com/tiantan.mtl';  // ❌ 可替换：MTL 文件 URL
// 仅在使用 .obj 格式时需要
// 如果使用 .glb 或 .gltf，此参数可忽略
```

#### 2.3 手势状态文本和颜色
```typescript
// 第 82-90 行
case 'open':
  return { 
    text: '张开手掌 - 粒子消散',  // ❌ 可替换：张开手掌的显示文本
    color: 'text-red-400',          // ❌ 可替换：文本颜色
    bgColor: 'bg-red-500/20'        // ❌ 可替换：背景颜色
  };
case 'closed':
  return { 
    text: '握拳 - 粒子聚合',        // ❌ 可替换：握拳的显示文本
    color: 'text-green-400',        // ❌ 可替换：文本颜色
    bgColor: 'bg-green-500/20'      // ❌ 可替换：背景颜色
  };
default:
  return { 
    text: '移动手掌控制旋转',       // ❌ 可替换：中立状态文本
    color: 'text-white/60',         // ❌ 可替换：文本颜色
    bgColor: 'bg-white/10'          // ❌ 可替换：背景颜色
  };
```

---

## 3. 页面文本和标题

### 3.1 主页 (Home.tsx)

#### 位置：`client/src/pages/Home.tsx`

```typescript
// 第 43 行
document.title = "西安隋唐天坛全息影像设计与交互实现 | 数字化文化遗产保护与沉浸式虚拟体验展示平台";  // ❌ 可替换：页面标题

// 第 78 行
<h1 className="...">西安隋唐天坛</h1>  // ❌ 可替换：主标题

// 第 87 行
<h2 className="...">全息影像设计与交互实现</h2>  // ❌ 可替换：副标题

// 第 9-38 行：导航菜单配置
const navItems = [
  {
    title: "历史溯源",           // ❌ 可替换：菜单项标题
    en: "History",               // ❌ 可替换：英文标题
    href: "/history",            // ❌ 可替换：路由路径
    position: "top-left",        // ❌ 可替换：屏幕位置（top-left, top-right, bottom-left, bottom-right）
    delay: 0.2                   // ❌ 可替换：动画延迟（秒）
  },
  // ... 其他菜单项
];
```

### 3.2 交互页面 (Interaction.tsx)

#### 位置：`client/src/pages/Interaction.tsx`

```typescript
// 第 124 行
<h1 className="...">交互复原</h1>  // ❌ 可替换：页面标题

// 第 125 行
<p className="...">INTERACTIVE RESTORATION</p>  // ❌ 可替换：英文副标题

// 第 9-70 行：祭天大典六步流程数据
const ritualSteps = [
  {
    id: 1,
    title: "陈设与省牲",              // ❌ 可替换：步骤标题
    enTitle: "Preparation",           // ❌ 可替换：英文标题
    icon: <LayoutDashboard />,        // ❌ 可替换：图标
    description: "在内壝内拖拽布置...", // ❌ 可替换：描述文本
    detail: "通过 UI 弹窗解释...",     // ❌ 可替换：详细说明
    npcScript: "吉时已到，请陛下...",  // ❌ 可替换：NPC 对话
    image: "https://placehold.co/..."  // ❌ 可替换：图片 URL
  },
  // ... 其他步骤
];

// 第 141 行
<p className="...">点击下方按钮启动交互体验</p>  // ❌ 可替换：提示文本

// 第 147 行
<Play className="..." /> 启动祭祀大典交互  // ❌ 可替换：按钮文本

// 第 217 行
<h3 className="...">交互说明</h3>  // ❌ 可替换：说明标题

// 第 219 行
<p className="...">您将扮演"赞礼官"...</p>  // ❌ 可替换：说明文本

// 第 245 行
<p className="...">通过摄像头识别手势...</p>  // ❌ 可替换：手势交互说明
```

### 3.3 手势交互页面 (GestureInteraction.tsx)

#### 位置：`client/src/pages/GestureInteraction.tsx`

```typescript
// 第 139 行
<h1 className="...">手势交互</h1>  // ❌ 可替换：页面标题

// 第 140 行
<p className="...">GESTURE INTERACTION</p>  // ❌ 可替换：英文副标题

// 第 132 行
<span className="...">返回交互复原</span>  // ❌ 可替换：返回按钮文本

// 第 176 行
<p className="...">模型文件加载失败，可能是网络问题。请检查网络连接后重试。</p>  // ❌ 可替换：错误提示文本

// 第 183 行
<RefreshCw className="..." /> 重新加载  // ❌ 可替换：重新加载按钮文本

// 第 245 线
<Camera className="..." /> 启动手势追踪  // ❌ 可替换：启动按钮文本

// 第 240 行
<CameraOff className="..." /> 停止追踪  // ❌ 可替换：停止按钮文本
```

---

## 4. 样式和主题配置

### 位置：`client/src/index.css`

#### 4.1 主色调定义
```css
/* 第 52 行 */
--primary: oklch(0.85 0.18 85);  /* ❌ 可替换：帝王黄 #FFD700 */
/* OKLCH 格式：(亮度 饱和度 色调) */
/* 示例：
   - 更亮的黄：oklch(0.90 0.18 85)
   - 更深的黄：oklch(0.75 0.18 85)
   - 红色：oklch(0.55 0.22 29)
   - 蓝色：oklch(0.50 0.20 260)
*/

/* 第 55 行 */
--secondary: oklch(0.55 0.22 29);  /* ❌ 可替换：朱砂红 */

/* 第 58 行 */
--background: oklch(0.15 0.02 260);  /* ❌ 可替换：玄黑 #1A1A1A */

/* 第 59 行 */
--foreground: oklch(0.92 0.02 85);  /* ❌ 可替换：暖白 */
```

#### 4.2 背景渐变
```css
/* 第 113 行 */
background-image: radial-gradient(circle at center, oklch(0.20 0.03 260) 0%, oklch(0.12 0.02 260) 100%);
/* ❌ 可替换：第一个颜色 oklch(0.20 0.03 260)
   ❌ 可替换：第二个颜色 oklch(0.12 0.02 260) */
```

#### 4.3 自定义字体
```css
/* 第 45-47 行 */
--font-serif: "Noto Serif SC", serif;  /* ❌ 可替换：衬线字体 */
--font-sans: "Noto Sans SC", sans-serif;  /* ❌ 可替换：无衬线字体 */
--font-kai: "KaiTi", "STKaiti", serif;  /* ❌ 可替换：楷体 */
```

---

## 5. 图片和资源文件

### 位置：`client/public/`

#### 5.1 Logo 图片
```
❌ 可替换：/client/public/logo.png
- 推荐尺寸：600x600px 或更大
- 格式：PNG（支持透明背景）
- 用途：主页背景装饰、网站 Logo
```

#### 5.2 3D 模型文件
```
❌ 可替换：/client/public/models/tiantan.obj
❌ 可替换：/client/public/models/tiantan.mtl
❌ 可替换：/client/public/models/tiantan_large.glb
❌ 可替换：/client/public/models/tiantan123.glb

支持格式：
- .obj + .mtl（需要配对）
- .glb（包含材质和纹理）
- .gltf + .bin（需要配对）

推荐：
- 使用 .glb 格式以简化加载流程
- 模型优化：面数 < 100,000 以保持性能
- 纹理分辨率：2048x2048 或以下
```

---

## 6. 环境变量和配置

### 位置：`.env` 或 `vercel.json`

```typescript
// ❌ 可替换：API 端点
VITE_API_URL=https://api.example.com

// ❌ 可替换：应用 ID
VITE_APP_ID=your-app-id

// ❌ 可替换：OAuth 门户 URL
VITE_OAUTH_PORTAL_URL=https://oauth.example.com

// ❌ 可替换：分析端点
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
```

---

## 7. 手势识别参数

### 位置：`client/src/hooks/useHandGesture.ts`

```typescript
// 第 46-47 行
const fingerTips = [4, 8, 12, 16, 20];  // ❌ 可替换：手指关键点索引
const fingerPips = [3, 6, 10, 14, 18];  // ❌ 可替换：手指第二关节索引

// 第 77-80 行
if (extendedFingers >= 4) {  // ❌ 可替换：张开手掌的阈值（伸展手指数）
  return 'open';
} else if (extendedFingers <= 1) {  // ❌ 可替换：握拳的阈值
  return 'closed';
}

// 第 52 行
for (let i = 1; i < 5; i++) {  // ❌ 可替换：检查手指的范围（1-4 = 四指，跳过拇指）
```

---

## 8. 动画和过渡参数

### 位置：`client/src/pages/Home.tsx`

```typescript
// 第 54-56 行
<motion.div 
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1.5, ease: "easeOut" }}  // ❌ 可替换：动画时长 1.5 秒，缓动函数 easeOut
>

// 第 64-66 行
<div className="... animate-[spin_60s_linear_infinite]" />  // ❌ 可替换：旋转速度 60 秒
<div className="... animate-[spin_40s_linear_infinite_reverse]" />  // ❌ 可替换：反向旋转 40 秒
```

---

## 9. 布局和尺寸参数

### 位置：`client/src/pages/Home.tsx`

```typescript
// 第 59 行
<div className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-30">
// ❌ 可替换：移动端尺寸 600x600px
// ❌ 可替换：桌面端尺寸 800x800px
// ❌ 可替换：不透明度 0.30

// 第 110 行
<div className="... w-40 h-28 md:w-64 md:h-40 ...">
// ❌ 可替换：移动端按钮尺寸 40x28
// ❌ 可替换：桌面端按钮尺寸 64x40
```

---

## 10. 文本内容替换示例

### 完整替换场景示例

**场景：将项目从"隋唐天坛"改为"秦始皇陵"**

需要替换的地方：

1. **页面标题**
   - `document.title` → "秦始皇陵全息影像..."
   - 主标题 → "秦始皇陵"
   - 副标题 → "兵马俑复原与交互实现"

2. **菜单项**
   - "历史溯源" → "陵墓历史"
   - "现状与测绘" → "遗址现状"
   - "蓝图规划" → "复原规划"
   - "交互复原" → "兵马俑交互"

3. **模型和资源**
   - MODEL_URLS → 秦陵模型 URL
   - logo.png → 秦陵 Logo

4. **粒子颜色**
   - 草地绿 → 土壤棕
   - 石头灰 → 陶土红

5. **文本内容**
   - 所有关于"祭天"的文本 → 关于"陵墓"的文本
   - 所有关于"天坛"的文本 → 关于"秦陵"的文本

---

## 11. 快速参考表

| 类别 | 文件 | 行号 | 参数 | 建议范围 |
|------|------|------|------|---------|
| 粒子密度 | ParticleScene.tsx | 329 | baseDensity | 500k-2M |
| 最大粒子 | ParticleScene.tsx | 449 | maxParticles | 1M-5M |
| 草地绿 | ParticleScene.tsx | 108 | grassGreen RGB | 0.3-0.4, 0.5-0.6, 0.15-0.25 |
| 模型 URL | GestureInteraction.tsx | 10-14 | MODEL_URLS | 任何有效 URL |
| 页面标题 | Home.tsx | 43 | document.title | 任何字符串 |
| 主色调 | index.css | 52 | --primary | oklch(0.7-0.9 0.15-0.25 0-360) |
| 背景色 | index.css | 58 | --background | oklch(0.1-0.2 0.01-0.05 0-360) |

---

## 12. 修改建议

### 最常见的修改

1. **改变建筑主题**：修改模型 URL、颜色参数、文本内容
2. **调整粒子效果**：修改粒子密度、颜色阈值、噪声参数
3. **更新文本内容**：修改页面标题、菜单项、描述文本
4. **改变配色**：修改 CSS 中的 OKLCH 颜色值
5. **替换 3D 模型**：上传新模型文件，更新 MODEL_URLS

### 性能优化建议

- 降低 `baseDensity` 以提高性能
- 使用 .glb 格式而非 .obj 以加快加载
- 减少模型面数（< 50,000 为最佳）
- 压缩纹理分辨率（1024x1024 或以下）

---

**最后更新：2026-01-24**
**项目版本：1.0.0**
