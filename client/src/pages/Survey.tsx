import Layout from "@/components/Layout";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZoomIn, Quote, Lightbulb, Users } from "lucide-react";
import { Lightbox } from "@/components/ui/lightbox";

// 模拟CAD图纸数据
const cadDrawings = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: `天坛测绘图纸 ${i + 1}`,
  type: i < 3 ? "平面图" : i < 6 ? "立面图" : "剖面图",
  description: "基于GIS技术截取卫星图及实地测绘绘制的CAD工程图。",
  // 使用占位图片
  src: `https://placehold.co/1920x1080/1a1a1a/FFF?text=CAD+Drawing+${i + 1}`
}));

// 模拟现状模型截图
const currentModels = [
  {
    id: 1,
    title: "天坛遗址全景",
    src: "https://placehold.co/800x600/2a2a2a/FFF?text=Site+Panorama"
  },
  {
    id: 2,
    title: "圜丘遗址细节",
    src: "https://placehold.co/800x600/2a2a2a/FFF?text=Detail+View"
  },
  {
    id: 3,
    title: "周边环境现状",
    src: "https://placehold.co/800x600/2a2a2a/FFF?text=Surroundings"
  }
];

export default function Survey() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState({ src: "", alt: "" });

  const openLightbox = (src: string, alt: string) => {
    setCurrentImage({ src, alt });
    setLightboxOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">现状与测绘</h1>
          <p className="text-white/60 tracking-widest">SURVEY & MAPPING</p>
        </motion.div>

        {/* 设计理念板块 - 新增 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Quote className="w-24 h-24 text-primary" />
            </div>
            <h3 className="text-2xl font-serif text-primary mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6" />
              场所精神的数字重构
            </h3>
            <p className="text-white/80 leading-relaxed mb-4">
              天坛不仅仅是一堆黄土，它是隋唐时期国家最高礼仪的发生地，承载着“天人合一”的哲学思想。本方案通过数字化手段，试图在不破坏遗址本体的前提下，重建遗址与城市的“精神连接”。
            </p>
            <div className="text-sm text-white/50 italic border-l-2 border-primary/50 pl-4">
              —— 摘自《毕业设计开题报告》 P9
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-24 h-24 text-primary" />
            </div>
            <h3 className="text-2xl font-serif text-primary mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              从“君权神授”到“全民共享”
            </h3>
            <p className="text-white/80 leading-relaxed mb-4">
              借鉴卢浮宫玻璃金字塔“严肃与开放并存”的手法，让天坛从帝王的政治工具转变为市民的客厅。通过 Web3D 沉浸式平台，任何人都可以近距离接触曾经只有贵族阶级专享的权力工具。
            </p>
            <div className="text-sm text-white/50 italic border-l-2 border-primary/50 pl-4">
              —— 摘自《毕业设计开题报告》 P9
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="cad" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="cad" className="data-[state=active]:bg-primary data-[state=active]:text-black">CAD测绘图纸</TabsTrigger>
              <TabsTrigger value="model" className="data-[state=active]:bg-primary data-[state=active]:text-black">现状模型</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="cad">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cadDrawings.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div 
                    className="group relative aspect-video bg-black/40 border border-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300"
                    onClick={() => openLightbox(item.src, item.title)}
                  >
                    {/* 图片占位符 - 红色文字提示替换 */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <img src={item.src} alt={item.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                      <h3 className="text-white font-bold truncate">{item.title}</h3>
                      <p className="text-xs text-white/60">{item.type}</p>
                      <p className="text-xs text-red-500 mt-1 font-mono">[待替换为真实CAD图]</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="model">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-[21/9] bg-black/40 border border-white/10 rounded-xl overflow-hidden relative flex items-center justify-center">
                  <p className="text-red-500 font-bold text-xl animate-pulse">[此处嵌入无人机扫描点云模型展示视频或WebGL查看器]</p>
                  <div className="absolute bottom-4 right-4 bg-black/60 px-4 py-2 rounded text-sm text-white/80">
                    无人机倾斜摄影建模成果
                  </div>
                </div>
              </div>
              {currentModels.map((item) => (
                <div 
                  key={item.id} 
                  className="aspect-video bg-black/40 border border-white/10 rounded-lg overflow-hidden relative group cursor-pointer"
                  onClick={() => openLightbox(item.src, item.title)}
                >
                  <img src={item.src} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white font-bold">{item.title}</h3>
                    <p className="text-xs text-red-500">[待替换为实景照片]</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Lightbox 
          isOpen={lightboxOpen}
          imageSrc={currentImage.src}
          altText={currentImage.alt}
          onClose={() => setLightboxOpen(false)}
        />
      </div>
    </Layout>
  );
}
