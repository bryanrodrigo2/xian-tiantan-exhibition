import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, User, Code2, BookOpen, X } from "lucide-react";
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
    name: "Agisoft Metashape",
    category: "点云转换",
    description: "摄影测量软件",
    details: "将视频上传到Agisoft Metashape软件进行点云转换处理。通过多视角影像重建三维点云模型，为后续建模提供高精度数据基础。支持自动特征点匹配、密集点云生成和纹理映射。",
    icon: "📷"
  },
  {
    name: "高斯泼溅",
    category: "渲染技术",
    description: "点云渲染方法",
    details: "转换后的点云导入UE（Unreal Engine）。高斯泼溅（Gaussian Splatting）是一种先进的点云渲染技术，能够将离散的点云数据转换为连续的表面，实现高质量的实时渲染效果。",
    icon: "✨"
  },
  
  // 三维建模
  {
    name: "3ds Max",
    category: "三维建模",
    description: "专业建模软件",
    details: "导入点云数据进行建模。使用3ds Max的点云工具将采集的数据转换为精确的三维模型，包括天坛的圆形祭坛、台阶、栏杆等建筑元素。支持高精度建模和材质编辑。",
    icon: "🏗️"
  },
  {
    name: "CAD",
    category: "工程制图",
    description: "计算机辅助设计",
    details: "导入点云数据进行CAD图绘制。基于点云数据生成精确的二维工程图纸，包括平面图、立面图、剖面图等，为建筑复原和规划提供技术支撑。",
    icon: "📐"
  },
  
  // 游戏引擎与渲染
  {
    name: "Unreal Engine 5",
    category: "游戏引擎",
    description: "实时渲染引擎",
    details: "使用UE5的Nanite虚拟几何体技术和Lumen全局光照系统，实现高质量的实时渲染。支持大规模场景渲染、动态光照和物理模拟，为全息影像提供逼真的视觉效果。",
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
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-4xl flex flex-col p-0 overflow-hidden max-h-[90vh]">
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
          
          <ScrollArea className="flex-1 p-6 pt-2">
            <div className="space-y-8 pb-8">
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

              {/* 参考文献 (精简版) */}
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

          <div className="border-t border-white/10 p-4 bg-black/50 backdrop-blur-xl text-center text-xs text-white/40 z-10">
            © 2026 Xian Sui-Tang Altar of Heaven Holographic Exhibition. All rights reserved.
          </div>
        </DialogContent>
      </Dialog>

      {/* 技术详情弹窗 */}
      {selectedTech && (
        <Dialog open={!!selectedTech} onOpenChange={() => setSelectedTech(null)}>
          <DialogContent className="bg-black/95 border-primary/30 text-white max-w-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                  {selectedTech.icon && <span className="text-3xl">{selectedTech.icon}</span>}
                  {selectedTech.name}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedTech(null)}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <DialogDescription className="text-primary/60 text-base">
                {selectedTech.category} · {selectedTech.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6 space-y-4">
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full"></span>
                  技术详情
                </h4>
                <p className="text-white/70 leading-relaxed text-sm">
                  {selectedTech.details}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs text-white/40">
                  点击外部区域关闭
                </span>
                <Button
                  onClick={() => setSelectedTech(null)}
                  className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
                >
                  关闭
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
