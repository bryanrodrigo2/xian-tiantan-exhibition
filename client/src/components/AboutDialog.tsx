import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, GitBranch, BookOpen, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white/60 hover:text-primary hover:bg-white/10">
          <Info className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden">
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
            {/* 项目简介 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                项目背景与意义
              </h3>
              <p className="text-white/80 text-sm leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">
                本项目旨在通过数字化手段复原西安隋唐天坛（圜丘）的历史风貌。利用无人机倾斜摄影、UE5 虚幻引擎及 WebGL 技术，构建了一个集现状展示、历史溯源、虚拟漫游与仪式复现于一体的沉浸式交互平台。
                <br/><br/>
                <span className="text-primary/80 font-semibold">核心价值：</span>
                不仅是对遗址本体的数字化保护，更是对“场所精神”的数字重构。试图将一个被城市建筑包围的土遗址，转化为一个高科技的文化体验场，实现从“静态知识”到“动态体验”的认识论飞跃。
              </p>
            </div>

            {/* 技术路线 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-primary" />
                技术路线 (Technical Roadmap)
              </h3>
              <div className="relative pl-4 border-l-2 border-white/10 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-black"></div>
                  <h4 className="text-sm font-bold text-white mb-1">1. 数据采集与考据</h4>
                  <p className="text-xs text-white/60">无人机倾斜摄影 (现状) + 《大唐开元礼》/《旧唐书》 (文献) &rarr; 建立基础数据库</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary/80 ring-4 ring-black"></div>
                  <h4 className="text-sm font-bold text-white mb-1">2. 资产构建 (Digital Assets)</h4>
                  <p className="text-xs text-white/60">CAD 图纸绘制 &rarr; 3ds Max 高精度建模 (PBR材质) &rarr; 资产优化</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary/60 ring-4 ring-black"></div>
                  <h4 className="text-sm font-bold text-white mb-1">3. 交互开发 (Interaction)</h4>
                  <p className="text-xs text-white/60">UE5 场景搭建 (Lumen光照) &rarr; 蓝图逻辑 (六步祭天) &rarr; Niagara 粒子特效</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary/40 ring-4 ring-black"></div>
                  <h4 className="text-sm font-bold text-white mb-1">4. Web 端集成 (Presentation)</h4>
                  <p className="text-xs text-white/60">React + TypeScript 搭建前端 &rarr; 视频流/全景集成 &rarr; 沉浸式 UI 设计</p>
                </div>
              </div>
            </div>

            {/* 作者与技术栈 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  项目信息
                </h3>
                <ul className="text-sm text-white/80 space-y-2 bg-white/5 p-4 rounded-lg border border-white/5">
                  <li className="flex justify-between"><span className="text-white/50">汇报人：</span> 郭宇飞</li>
                  <li className="flex justify-between"><span className="text-white/50">导师：</span> 康凯</li>
                  <li className="flex justify-between"><span className="text-white/50">辅导员：</span> 王霞</li>
                  <li className="flex justify-between"><span className="text-white/50">完成时间：</span> 2026年5月</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">技术栈</h3>
                <div className="flex flex-wrap gap-2 bg-white/5 p-4 rounded-lg border border-white/5 h-full content-start">
                  {["React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "UE5", "3ds Max", "CAD", "WebGL"].map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-white/10 rounded text-xs text-white/70 border border-white/5 hover:bg-primary/20 transition-colors cursor-default">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 参考文献 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">核心参考文献</h3>
              <ul className="text-xs text-white/60 space-y-1 list-disc pl-4 bg-white/5 p-4 rounded-lg border border-white/5">
                <li>单霁翔．《从“功能城市”走向“文化城市”》[M]．天津大学出版社，2019．</li>
                <li>王南．《中国古建筑的人文密码》[M]．清华大学出版社，2022．</li>
                <li>西安市文物局．《西安天坛遗址考古发掘报告》[R]．2020．</li>
                <li>《大唐开元礼》 - [唐] 萧嵩等撰</li>
                <li>Epic Games. Unreal Engine for Architectural Visualization: Case Studies[R]. 2024.</li>
              </ul>
            </div>
          </div>
        </ScrollArea>

        <div className="border-t border-white/10 p-4 bg-black/50 backdrop-blur-xl text-center text-xs text-white/40 z-10">
          © 2026 Xian Sui-Tang Altar of Heaven Holographic Exhibition. All rights reserved.
        </div>
      </DialogContent>
    </Dialog>
  );
}
