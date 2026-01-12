import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function Blueprint() {
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">蓝图规划</h1>
          <p className="text-white/60 tracking-widest">BLUEPRINT & RESTORATION</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 左侧：复原依据 */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-serif text-white border-l-4 border-primary pl-4">复原依据</h2>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-4">古籍考证</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  依据《旧唐书》、《大唐开元礼》等文献记载，结合考古发掘报告，确定天坛的四层圆坛结构、十二陛级、内壝外壝的尺度关系。
                </p>
                <div className="p-4 bg-black/30 rounded border border-white/5">
                  <p className="text-red-500 font-mono text-sm">[此处插入古籍复原推导图]</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-4">考古数据</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  参考1999年中国社会科学院考古研究所的实地发掘数据，精确还原坛体直径、高度及材质（白灰抹面）。
                </p>
                <div className="p-4 bg-black/30 rounded border border-white/5">
                  <p className="text-red-500 font-mono text-sm">[此处插入考古发掘平面图]</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 右侧：复原模型展示 */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-serif text-white border-l-4 border-secondary pl-4">复原模型</h2>
            
            <div className="aspect-square bg-black/40 border border-white/10 rounded-xl overflow-hidden relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-red-500 font-bold text-xl animate-pulse">[此处展示唐代天坛复原三维渲染图]</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-2xl font-bold text-white mb-2">唐代圜丘复原图</h3>
                <p className="text-white/60">
                  完整复原了坛体、内壝、外壝、御道及周边附属建筑，重现盛唐祭天场所的宏大规制。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-black/40 border border-white/10 rounded-lg flex items-center justify-center">
                <p className="text-red-500 text-xs">[细节渲染图1]</p>
              </div>
              <div className="aspect-video bg-black/40 border border-white/10 rounded-lg flex items-center justify-center">
                <p className="text-red-500 text-xs">[细节渲染图2]</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
