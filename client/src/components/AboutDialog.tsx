import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white/60 hover:text-primary hover:bg-white/10">
          <Info className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary mb-2">关于项目</DialogTitle>
          <DialogDescription className="text-white/60">
            西安隋唐天坛全息影像设计与交互实现
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">项目简介</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              本项目旨在通过数字化手段复原西安隋唐天坛（圜丘）的历史风貌。利用无人机倾斜摄影、UE5 虚幻引擎及 WebGL 技术，构建了一个集现状展示、历史溯源、虚拟漫游与仪式复现于一体的沉浸式交互平台。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">作者信息</h3>
              <ul className="text-sm text-white/80 space-y-1">
                <li><span className="text-primary/70">设计与开发：</span> [您的姓名]</li>
                <li><span className="text-primary/70">指导教师：</span> [导师姓名]</li>
                <li><span className="text-primary/70">所在院校：</span> [您的学校名称]</li>
                <li><span className="text-primary/70">完成时间：</span> 2026年5月</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">技术栈</h3>
              <div className="flex flex-wrap gap-2">
                {["React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "UE5 Pixel Streaming", "WebGL"].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-white/10 rounded text-xs text-white/70 border border-white/5">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">核心参考文献</h3>
            <ul className="text-xs text-white/60 space-y-1 list-disc pl-4">
              <li>《旧唐书·礼仪志》 - [后晋] 刘昫等撰</li>
              <li>《大唐开元礼》 - [唐] 萧嵩等撰</li>
              <li>《西安隋唐天坛遗址发掘简报》 - 中国社会科学院考古研究所 (1999)</li>
              <li>《唐代长安城圜丘遗址复原研究》 - 建筑史学刊</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 text-center text-xs text-white/40">
          © 2026 Xian Sui-Tang Altar of Heaven Holographic Exhibition. All rights reserved.
        </div>
      </DialogContent>
    </Dialog>
  );
}
