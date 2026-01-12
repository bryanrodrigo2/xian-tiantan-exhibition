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

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white/60 hover:text-primary hover:bg-white/10">
          <Info className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 border-white/10 text-white max-w-2xl flex flex-col p-0 overflow-hidden">
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

            {/* 技术栈 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                技术栈
              </h3>
              <div className="flex flex-wrap gap-2 bg-white/5 p-4 rounded-lg border border-white/5">
                {["React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "UE5", "3ds Max", "CAD", "WebGL"].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-white/10 rounded text-xs text-white/70 border border-white/5 hover:bg-primary/20 transition-colors cursor-default">
                    {tech}
                  </span>
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
                <li>单霁翔．《从“功能城市”走向“文化城市”》[M]．天津大学出版社，2019．</li>
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
  );
}
