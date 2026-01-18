# 西安隋唐天坛全息影像设计与交互实现 - 项目使用与开发指南

本文档旨在帮助您在脱离 Manus 环境后，使用 Cursor 或 VS Code 等编辑器进行后续的内容修改、功能开发及部署上线。

---

## 1. 项目结构概览

核心代码位于 `client/src` 目录下，主要文件结构如下：

```
client/src/
├── components/         # 公共组件（布局、UI组件等）
│   ├── Layout.tsx      # 全局布局组件（包含背景、Logo、静音开关）
│   └── ui/             # 基础UI组件（按钮、卡片、对话框等）
├── lib/                # 工具库
│   └── sound.ts        # 音效控制逻辑（钟声、鼓声）
├── pages/              # 页面文件（核心修改区域）
│   ├── Home.tsx        # 主页
│   ├── History.tsx     # 历史溯源（时间轴、典籍）
│   ├── Survey.tsx      # 现状与测绘（CAD图纸、模型）
│   ├── Blueprint.tsx   # 蓝图规划（复原依据、渲染图）
│   └── Interaction.tsx # 交互复原（UE嵌入、模型对比）
├── App.tsx             # 路由配置
└── index.css           # 全局样式（Tailwind CSS）
```

---

## 2. 内容修改指南

### 2.1 修改考古发掘平面图 / 现状模型图片

**目标页面**：现状与测绘 (`Survey.tsx`)

1.  **准备图片**：将您的 CAD 图纸或模型渲染图（推荐 JPG/PNG 格式）放入 `client/public/images/` 目录下（如没有 images 文件夹可新建）。
2.  **修改代码**：
    *   打开 `client/src/pages/Survey.tsx`。
    *   搜索 `const surveyData` 数据数组。
    *   找到对应的条目（例如"考古发掘平面图"），修改 `image` 字段的路径。

```typescript
// 示例：修改图片路径
const surveyData = [
  {
    id: 1,
    title: "考古发掘平面图",
    category: "CAD图纸",
    // 将下方的占位符链接替换为您的本地图片路径，例如 "/images/cad-plan.jpg"
    image: "https://placehold.co/800x600/2a2a2a/FFF?text=CAD+Drawing", 
    description: "..."
  },
  // ...
];
```

### 2.2 修改历史时间轴数据

**目标页面**：历史溯源 (`History.tsx`)

1.  打开 `client/src/pages/History.tsx`。
2.  搜索 `const timelineData` 数组。
3.  直接修改 `year`（年份）、`event`（事件名）、`description`（描述）等字段的内容。

### 2.3 修改交互复原的模型对比图

**目标页面**：交互复原 (`Interaction.tsx`)

1.  打开 `client/src/pages/Interaction.tsx`。
2.  搜索 `古今对比` 区域的代码。
3.  找到两个 `<img>` 标签，分别替换 `src` 属性：
    *   **现状模型**（底层图片）：搜索 `alt="现状模型"`。
    *   **复原模型**（顶层图片）：搜索 `alt="复原模型"`。

**注意**：两张图片的分辨率和比例必须完全一致，否则滑动对比效果会错位。

---

## 3. 本地开发指南 (使用 Cursor)

### 3.1 环境准备
确保您的电脑已安装以下软件：
*   **Node.js** (推荐 v18 或更高版本)：[下载地址](https://nodejs.org/)
*   **Cursor** (或 VS Code)：[下载地址](https://cursor.sh/)

### 3.2 安装依赖

1.  使用 Cursor 打开项目文件夹（`xian-tiantan-exhibition`）。
2.  打开终端（Terminal，快捷键 `Ctrl + ~`）。
3.  运行以下命令安装项目依赖：

```bash
npm install
# 或者如果您使用 pnpm (推荐)
pnpm install
```

### 3.3 启动本地开发服务器

在终端运行：

```bash
npm run dev
```

启动成功后，终端会显示访问地址（通常是 `http://localhost:5173`）。按住 `Ctrl` 点击链接即可在浏览器中预览网站。此时您修改代码，浏览器会自动刷新。

---

## 4. 部署上线指南

本项目已配置为纯静态导出模式，支持多种部署方式。

### 方式一：直接使用静态文件 (最简单)

1.  解压下载的 `xian-tiantan-static-site.zip` 文件。
2.  进入 `dist/public` 文件夹。
3.  直接双击 `index.html` 即可在浏览器中打开查看（注意：部分浏览器可能会限制本地文件访问，建议使用简单的 HTTP 服务器）。
4.  您可以将 `dist/public` 文件夹中的所有内容上传到任何静态网站托管服务（如 FTP 服务器、阿里云 OSS、腾讯云 COS 等）。

### 方式二：使用 Vercel 部署 (推荐)

1.  注册一个 [GitHub](https://github.com/) 账号。
2.  注册一个 [Vercel](https://vercel.com/) 账号（可以直接用 GitHub 登录）。
3.  在 GitHub 上新建一个仓库（Repository），例如命名为 `xian-tiantan`。
4.  在 Cursor 终端中执行以下命令，将本地代码推送到 GitHub：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/您的用户名/xian-tiantan.git
git push -u origin main
```

5.  登录 Vercel 控制台，点击 **"Add New..."** -> **"Project"**。
6.  导入刚才创建的 `xian-tiantan` 仓库。
7.  **配置项目**：
    *   **Framework Preset**: Vercel 通常会自动识别为 `Vite`。
    *   **Root Directory**: 选择 `client` 目录（**重要！因为代码在 client 文件夹下**）。
8.  点击 **"Deploy"** 按钮。
9.  部署完成后，在 **Settings** -> **Domains** 中绑定您的域名 `bryanfinal.xyz`。

---

## 5. 常见问题

*   **图片不显示？**
    *   请确保图片放在 `client/public` 目录下。
    *   引用路径应以 `/` 开头，例如 `/images/photo.jpg`（不要包含 `public`）。
*   **样式错乱？**
    *   检查是否误删了 `className` 中的 Tailwind 类名。
    *   Cursor 的 AI 修复功能（Cmd+K）可以很好地帮助您解决样式问题。
*   **部署失败？**
    *   检查 Vercel 的 **Root Directory** 设置是否正确指向了 `client` 目录。
    *   查看 Vercel 的 Build Logs 报错信息。

祝您的毕业设计圆满成功！
