import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, User, Code2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// 技术栈数据结构
interface Technology {
  name: string;
  category: string;
  description: string;
  details: string;
  icon?: string;
}

// 完整技术栈列表
const technologies: Technology[] = [
  // 数据采集与处理
  {
    name: "大疆倾斜摄影",
    category: "数据采集与建模",
    description: "无人机实景三维重建",
    details: "使用大疆无人机对西安隋唐天坛遗址进行倾斜摄影数据采集，将采集的多角度影像导入【大疆制图（DJI Terra）】进行自动化三维重建，生成高精度实景三维模型（OBJ/PLY格式）。随后将重建成果导入【大疆智模（DJI Modify）】进行模型修复，包括补洞、去噪、优化网格拓扑结构，最终输出可供后续建模软件使用的干净底模。",
    icon: "🚁"
  },

  // 三维建模
  {
    name: "3ds Max",
    category: "三维建模",
    description: "专业建模软件",
    details: "以大疆智模修复完成的OBJ模型作为底图，在3ds Max中进行精细翻模，还原天坛圆形祭坛、台阶、栏杆、壝墙等建筑构件的精确几何形态。在此基础上，进一步创建配套的展厅空间、主题公园景观及游客休息区模型，完善整体场景的建筑与环境层次，为后续导入UE5进行实时渲染提供完整的三维资产。",
    icon: "🏗️"
  },
  {
    name: "CAD",
    category: "工程制图",
    description: "计算机辅助设计",
    details: "基于点云数据与考古测绘资料，在AutoCAD中绘制精确的二维工程图纸，包括遗址平面图、建筑立面图、剖面图及场地规划图。CAD图纸作为三维建模的精度参考，确保复原尺寸与历史文献记载相符，同时为蓝图规划板块提供可视化的测绘成果展示。",
    icon: "📐"
  },

  // 游戏引擎与渲染
  {
    name: "Unreal Engine 5",
    category: "游戏引擎",
    description: "实时渲染与交互系统",
    details: `UE5 作为本项目的核心交互引擎，承载了以下四大博物馆功能系统：

【Ⅰ 智能讲解员系统】
调用 DeepSeek API，通过 UE5 蓝图（Blueprint）实现 HTTP 请求节点，将用户语音/文字输入发送至 DeepSeek 大模型，获取关于天坛历史、建筑、祭祀文化的智能解说内容，并通过 TTS 语音合成实时播报，打造沉浸式 AI 导览体验。

【Ⅱ 物品交互系统】
工作流程：玩家靠近可交互文物或展品 → 触发 Trigger Box 检测 → 屏幕弹出提示 UI（按 E 键查看）→ 玩家按 E → 调用 Widget Blueprint 展示详情 UI 面板（含文物图片、文字说明）→ 同步在场景中生成/展示对应的三维模型特写 → 再次按 E 或点击关闭按钮退出交互状态。

【Ⅲ 视频播放系统】
工作流程：玩家靠近视频播放区域（如投影屏幕、展示墙）→ 触发 Trigger Box → 屏幕弹出提示 UI（按 E 键播放）→ 玩家按 E → 调用 Media Player 组件加载并全屏播放预设视频（祭天仪式复原动画、历史纪录片等）→ 视频播放中再次按 E 或点击关闭按钮停止播放并退出。

【Ⅳ 登录系统】
工作流程：游戏启动后显示登录界面 Widget → 玩家输入用户名与密码 → 蓝图通过 HTTP 节点向后端 API 发送登录请求 → 验证成功后服务器返回 Token → UE5 将 Token 存储至 Game Instance（全局变量）→ 解锁主场景并记录玩家身份，用于后续答题成绩绑定与进度保存；验证失败则弹出错误提示并要求重新输入。

【Ⅴ 答题系统】
工作流程：玩家进入答题区域触发 Trigger Box → 弹出答题 Widget UI，展示题目（单选/多选/判断题，内容涵盖天坛历史与祭祀文化）→ 玩家选择答案后点击提交 → 蓝图逻辑判断答案正误并即时反馈（正确高亮绿色/错误高亮红色）→ 累计得分记录于 Game Instance → 全部题目完成后展示成绩总结界面，并通过 HTTP 请求将成绩与玩家 Token 一同上传至后端数据库存档。`,
    icon: "🎮"
  },
  {
    name: "WebGL",
    category: "Web渲染",
    description: "浏览器3D图形API",
    details: "基于WebGL的Three.js库实现网页端的三维渲染。通过GPU加速在浏览器中实时渲染粒子系统和三维模型，支持跨平台访问和交互。",
    icon: "🌐"
  },

  // 前端技术栈
  {
    name: "React 19",
    category: "前端框架",
    description: "用户界面库",
    details: "使用React 19的最新特性构建响应式用户界面。采用函数组件和Hooks实现状态管理，支持服务端渲染和并发渲染，提升应用性能和用户体验。",
    icon: "⚛️"
  },
  {
    name: "TypeScript",
    category: "编程语言",
    description: "类型安全的JavaScript",
    details: "使用TypeScript进行类型安全的开发，提供完整的类型检查和智能提示。减少运行时错误，提高代码质量和可维护性。",
    icon: "📘"
  },
  {
    name: "Tailwind CSS",
    category: "样式框架",
    description: "实用优先的CSS框架",
    details: "使用Tailwind CSS快速构建响应式界面。通过原子化CSS类实现灵活的样式定制，支持暗色主题和自定义设计系统。",
    icon: "🎨"
  },
  {
    name: "Framer Motion",
    category: "动画库",
    description: "React动画库",
    details: "使用Framer Motion实现流畅的页面过渡和交互动画。支持手势识别、物理动画和复杂的动画编排，提升用户体验的流畅度和沉浸感。",
    icon: "🎬"
  },

  // 交互技术
  {
    name: "MediaPipe",
    category: "手势识别",
    description: "机器学习框架",
    details: "使用Google MediaPipe实现实时手势识别。通过摄像头捕捉手部动作，识别握拳、张开等手势，实现自然的人机交互。支持多平台部署和低延迟处理。",
    icon: "🤚"
  },
  {
    name: "Three.js",
    category: "3D库",
    description: "JavaScript 3D库",
    details: "基于WebGL的Three.js库实现粒子系统和三维场景渲染。支持多种模型格式加载、材质系统、光照系统和后处理效果。",
    icon: "🔺"
  },

  // 网页开发技术
  {
    name: "Vite",
    category: "构建工具",
    description: "下一代前端构建工具",
    details: "使用Vite作为项目构建工具，提供极速的开发服务器启动和热模块替换（HMR）。基于原生ES模块，无需打包即可在开发环境运行，显著提升开发效率。生产环境使用Rollup打包，优化输出体积。",
    icon: "⚡"
  },
  {
    name: "Wouter",
    category: "路由管理",
    description: "轻量级React路由",
    details: "使用Wouter实现单页应用的路由管理。相比React Router体积更小（仅1.5KB），API简洁直观，支持路径匹配、导航守卫和动态路由。完美适配本项目的多页面导航需求。",
    icon: "🧭"
  },
  {
    name: "Vercel",
    category: "部署平台",
    description: "现代化Web部署",
    details: "使用Vercel进行项目部署和托管。支持Git集成，自动构建和部署，提供全球CDN加速。零配置部署React应用，支持自定义域名、HTTPS和边缘函数。确保网站的高可用性和访问速度。",
    icon: "▲"
  },
  {
    name: "Lucide Icons",
    category: "图标库",
    description: "现代化图标集",
    details: "使用Lucide Icons作为项目图标库。提供1000+精美的开源图标，支持React组件化使用，可自定义尺寸、颜色和描边宽度。图标设计简洁现代，完美契合项目的视觉风格。",
    icon: "🎯"
  },
];

// 按类别分组技术
const groupedTechnologies = technologies.reduce((acc, tech) => {
  if (!acc[tech.category]) {
    acc[tech.category] = [];
  }
  acc[tech.category].push(tech);
  return acc;
}, {} as Record<string, Technology[]>);

export function AboutDialog() {
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-primary hover:bg-white/10">
            <Info className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-4xl flex flex-col p-0 overflow-hidden" style={{maxHeight: '90vh', height: '90vh'}}>
          <div className="p-6 pb-2 border-b border-white/10 bg-black/50 backdrop-blur-xl z-10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-primary mb-1 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full inline-block"></span>
                关于项目
              </DialogTitle>
              <DialogDescription className="text-white/60">
                西安隋唐天坛全息影像设计与交互实现 | 毕业设计成果展示
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* ScrollArea 确保内容可滚动 — 与 History.tsx 时间轴完全一致的三层结构 */}
          <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="p-6 pt-4 space-y-8 pb-8">
              {/* 项目信息 */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  作者信息
                </h3>
                <div className="bg-white/5 p-4 rounded-lg border border-white/5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/40 mb-1">汇报人</p>
                    <p className="text-white font-medium">郭宇飞</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">指导教师</p>
                    <p className="text-white font-medium">康凯</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">辅导员</p>
                    <p className="text-white font-medium">王霞</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">完成时间</p>
                    <p className="text-white font-medium">2026年5月</p>
                  </div>
                </div>
              </div>

              {/* 技术栈 - 按类别分组 */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  技术栈
                  <span className="text-xs text-white/40 font-normal ml-2">点击卡片查看详情</span>
                </h3>

                <div className="space-y-6">
                  {Object.entries(groupedTechnologies).map(([category, techs]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-semibold text-primary/80 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary/50 rounded-full"></span>
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {techs.map((tech) => (
                          <button
                            key={tech.name}
                            onClick={() => setSelectedTech(tech)}
                            className="group px-3 py-2 bg-white/5 rounded-lg text-sm text-white/70 border border-white/10 hover:bg-primary/20 hover:border-primary/50 hover:text-white transition-all duration-300 cursor-pointer flex items-center gap-2"
                          >
                            {tech.icon && <span className="text-base">{tech.icon}</span>}
                            <span className="font-medium">{tech.name}</span>
                            <span className="text-xs text-white/40 group-hover:text-white/60">→</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 参考文献 */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  核心参考文献
                </h3>
                <ul className="text-xs text-white/60 space-y-2 list-disc pl-4 bg-white/5 p-4 rounded-lg border border-white/5">
                  <li>单霁翔．《从"功能城市"走向"文化城市"》[M]．天津大学出版社，2019．</li>
                  <li>王南．《中国古建筑的人文密码》[M]．清华大学出版社，2022．</li>
                  <li>西安市文物局．《西安天坛遗址考古发掘报告》[R]．2020．</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
          </div>

          <div className="border-t border-white/10 p-4 bg-black/50 backdrop-blur-xl text-center text-xs text-white/40 z-10">
            © 2026 Xian Sui-Tang Altar of Heaven Holographic Exhibition. All rights reserved.
          </div>
        </DialogContent>
      </Dialog>

      {/* 技术详情弹窗 */}
      {selectedTech && (
        <Dialog open={!!selectedTech} onOpenChange={() => setSelectedTech(null)}>
          <DialogContent className="bg-black/95 border-primary/30 text-white max-w-2xl flex flex-col p-0 overflow-hidden" style={{maxHeight: '85vh', height: '85vh'}}>
            <div className="p-6 pb-3 border-b border-white/10">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                  {selectedTech.icon && <span className="text-3xl">{selectedTech.icon}</span>}
                  {selectedTech.name}
                </DialogTitle>
                <DialogDescription className="text-primary/60 text-base">
                  {selectedTech.category} · {selectedTech.description}
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* 详情内容也加滚动条，防止 UE5 等长文本溢出 */}
            <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div className="p-6 pt-4">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full"></span>
                    技术详情
                  </h4>
                  <p className="text-white/70 leading-relaxed text-sm whitespace-pre-line">
                    {selectedTech.details}
                  </p>
                </div>
              </div>
            </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
