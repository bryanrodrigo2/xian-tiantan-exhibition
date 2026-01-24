# 西安隋唐天坛网站更新指南

本文档说明如何更新网站中的图片和内容，特别是古今对比功能中的现状遗址和复原遗址图片。

## 目录结构

```
client/
├── public/                    # 静态资源目录
│   ├── xianzhuangyizhi.png  # 现状遗址图片
│   ├── logo_new.png          # 网站Logo
│   └── bg.jpg                # 背景图片
├── src/
│   └── pages/
│       ├── Interaction.tsx           # 交互复原页面（包含古今对比）
│       └── ComparisonFullscreen.tsx  # 全屏古今对比页面
```

## 一、替换现状遗址图片

### 方法1：直接替换文件

1. 准备新的现状遗址图片
2. 将图片重命名为 `xianzhuangyizhi.png`
3. 替换文件：
   ```bash
   cp 你的图片路径.png client/public/xianzhuangyizhi.png
   ```

### 方法2：修改代码引用

如果想使用不同的文件名，需要修改以下文件：

#### 文件1：`client/src/pages/Interaction.tsx`

**位置**：第269行
```typescript
<img 
  src="/xianzhuangyizhi.png"  // 修改这里的文件名
  alt="现状模型" 
  className="w-full h-full object-cover"
/>
```

#### 文件2：`client/src/pages/ComparisonFullscreen.tsx`

**位置**：第93行
```typescript
<img 
  src="/xianzhuangyizhi.png"  // 修改这里的文件名
  alt="现状遗址" 
  className="w-full h-full object-contain"
/>
```

## 二、替换复原遗址图片

### 当前状态

复原遗址图片目前使用的是占位图（placehold.co），需要替换为实际图片。

### 替换步骤

1. 准备复原遗址图片（建议命名为 `fuyuanyizhi.png`）
2. 将图片放到 `client/public/` 目录：
   ```bash
   cp 你的图片路径.png client/public/fuyuanyizhi.png
   ```

3. 修改以下文件中的图片引用：

#### 文件1：`client/src/pages/Interaction.tsx`

**位置**：第283行
```typescript
<img 
  src="https://placehold.co/600x800/5d4037/FFF?text=Restored+Tang+Model"  // 替换这一行
  alt="复原模型" 
  className="w-full h-full object-cover"
/>
```

**修改为**：
```typescript
<img 
  src="/fuyuanyizhi.png"  // 使用本地图片
  alt="复原模型" 
  className="w-full h-full object-cover"
/>
```

#### 文件2：`client/src/pages/ComparisonFullscreen.tsx`

**位置**：第108行
```typescript
<img 
  src="https://placehold.co/1920x1080/5d4037/FFF?text=Restored+Tang+Model"  // 替换这一行
  alt="唐代复原" 
  className="w-full h-full object-contain"
/>
```

**修改为**：
```typescript
<img 
  src="/fuyuanyizhi.png"  // 使用本地图片
  alt="唐代复原" 
  className="w-full h-full object-contain"
/>
```

## 三、修改图片标签文字

### 现状遗址标签

#### 在Interaction.tsx中（第273行）：
```typescript
<div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded text-white/80 text-sm font-bold">
  现状遗址  // 修改这里的文字
</div>
```

#### 在ComparisonFullscreen.tsx中（第96-99行）：
```typescript
<div className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
  <p className="text-white/90 text-lg md:text-2xl font-bold">现状遗址</p>  // 修改这里
  <p className="text-white/60 text-xs md:text-sm mt-1">Current Site</p>  // 修改英文
</div>
```

### 复原遗址标签

#### 在Interaction.tsx中（第286行）：
```typescript
<div className="absolute top-4 left-4 bg-primary/80 px-3 py-1 rounded text-black text-sm font-bold">
  唐代复原  // 修改这里的文字
</div>
```

#### 在ComparisonFullscreen.tsx中（第111-114行）：
```typescript
<div className="absolute top-6 left-6 bg-primary/90 backdrop-blur-sm px-6 py-3 rounded-lg border border-black/20">
  <p className="text-black text-lg md:text-2xl font-bold">唐代复原</p>  // 修改这里
  <p className="text-black/70 text-xs md:text-sm mt-1">Tang Dynasty Restoration</p>  // 修改英文
</div>
```

## 四、修改古今对比说明文字

### 在Interaction.tsx中（第306-310行）：
```typescript
<div className="mt-4 bg-white/5 p-4 rounded-lg border border-white/10">
  <h3 className="text-primary font-bold mb-2">建筑形制对比</h3>
  <p className="text-sm text-white/70 leading-relaxed">
    拖动滑块对比现状遗址与唐代复原模型。可见唐代圜丘为四层圆坛，而现状仅存土芯。复原模型依据《大唐开元礼》及考古数据重建了白灰抹面与朱红栏杆。
  </p>
</div>
```

## 五、替换Logo图片

### 方法1：直接替换文件

```bash
cp 你的logo.png client/public/logo_new.png
```

### 方法2：修改引用

Logo在全屏对比页面中使用，位置在 `ComparisonFullscreen.tsx` 第77行：

```typescript
<img 
  src="/logo_new.png"  // 修改这里的文件名
  alt="Logo" 
  className="w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all duration-300"
/>
```

## 六、图片规格建议

### 现状遗址图片（xianzhuangyizhi.png）
- **推荐尺寸**：600x800 像素（3:4比例）
- **格式**：PNG或JPG
- **大小**：建议小于500KB

### 复原遗址图片（fuyuanyizhi.png）
- **推荐尺寸**：600x800 像素（3:4比例）或 1920x1080 像素（16:9比例）
- **格式**：PNG或JPG
- **大小**：建议小于1MB

### Logo图片（logo_new.png）
- **推荐尺寸**：512x512 像素（正方形）
- **格式**：PNG（支持透明背景）
- **大小**：建议小于100KB

## 七、部署更新

### 本地测试
```bash
cd client
pnpm install  # 首次运行需要安装依赖
pnpm dev      # 启动开发服务器
```

### 提交到GitHub
```bash
git add .
git commit -m "Update site images and comparison feature"
git push origin main
```

### Vercel自动部署
推送到GitHub后，Vercel会自动检测更新并部署到生产环境。

## 八、常见问题

### Q1：图片不显示怎么办？
- 检查图片是否放在 `client/public/` 目录
- 检查文件名是否正确（区分大小写）
- 检查图片格式是否支持（PNG、JPG、JPEG）
- 清除浏览器缓存后重新加载

### Q2：图片显示模糊怎么办？
- 使用更高分辨率的图片
- 确保图片比例与容器比例匹配
- 检查图片压缩质量

### Q3：移动端图片加载慢怎么办？
- 压缩图片大小
- 使用WebP格式
- 考虑使用CDN加速

### Q4：如何批量替换多张图片？
```bash
# 示例：批量复制图片
cp 现状遗址.png client/public/xianzhuangyizhi.png
cp 复原遗址.png client/public/fuyuanyizhi.png
cp logo.png client/public/logo_new.png
```

## 九、技术支持

如有问题，请联系开发团队或查看项目README文档。

---

**最后更新**：2026年1月24日  
**版本**：v1.0
