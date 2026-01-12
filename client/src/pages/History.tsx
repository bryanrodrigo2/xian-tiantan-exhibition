import Layout from "@/components/Layout";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// 历代皇帝祭祀时间轴数据
const timelineData = [
  {
    id: 1,
    year: "589年",
    dynasty: "隋朝",
    emperor: "隋文帝",
    event: "初建天坛",
    description: "隋文帝杨坚在长安城南建立圜丘，作为祭天的场所，确立了隋唐天坛的规制。",
    details: "隋文帝开皇九年（589年），隋朝统一天下，杨坚下诏在长安城南圜丘祭天，以告上苍。这是隋唐天坛历史的开端，其形制参考了《周礼》中的记载，采用四层圆坛结构，象征天圆地方。"
  },
  {
    id: 2,
    year: "618年",
    dynasty: "唐朝",
    emperor: "唐高祖",
    event: "受禅祭天",
    description: "唐高祖李渊在天坛举行受禅仪式，正式建立唐朝。",
    details: "武德元年（618年），李渊在长安南郊圜丘举行隆重的受禅大典，正式登基称帝，改国号为唐。天坛见证了唐王朝的诞生。"
  },
  {
    id: 3,
    year: "627年",
    dynasty: "唐朝",
    emperor: "唐太宗",
    event: "贞观祭天",
    description: "唐太宗李世民多次在天坛祭天，祈求国泰民安。",
    details: "贞观元年（627年）及随后的多年中，唐太宗多次亲临天坛举行冬至祭天大典。他强调'王者以民为天'，祭天不仅是礼仪，更是安民的象征。"
  },
  {
    id: 4,
    year: "666年",
    dynasty: "唐朝",
    emperor: "唐高宗",
    event: "封禅大典",
    description: "唐高宗与武则天共同祭天，开创了帝后同祭的先河。",
    details: "麟德二年（666年），唐高宗与武则天在泰山封禅后，回到长安亦在天坛举行隆重祭祀。武则天作为亚献参与祭祀，打破了传统礼制，显示了其政治地位的提升。"
  },
  {
    id: 5,
    year: "712年",
    dynasty: "唐朝",
    emperor: "唐玄宗",
    event: "开元盛世",
    description: "唐玄宗在位期间多次修缮天坛，祭祀规格达到顶峰。",
    details: "开元期间，唐玄宗对天坛进行了大规模修缮，并制定了详细的《大唐开元礼》，规范了祭天仪式的每一个细节，使其成为国家最高等级的礼仪活动。"
  },
  {
    id: 6,
    year: "904年",
    dynasty: "唐朝",
    emperor: "唐昭宗",
    event: "最后祭祀",
    description: "唐朝末年，随着迁都洛阳，西安天坛逐渐废弃。",
    details: "天祐元年（904年），朱温逼迫唐昭宗迁都洛阳，长安城被毁，天坛也随之荒废。这座见证了隋唐三百多年兴衰的皇家祭坛，从此沉寂在历史的尘埃中。"
  }
];

// 书籍记载数据
const bookRecords = [
  {
    id: 1,
    book: "《周礼·春官·大宗伯》",
    quote: "以玉作六器，以礼天地四方：以苍璧礼天，以黄琮礼地。",
    translation: "用玉石制作六种礼器，用来祭祀天地和四方神灵：用青色的璧祭祀天，用黄色的琮祭祀地。",
    significance: "确立了'苍璧礼天'的核心祭祀礼制，是天坛祭祀玉器使用的理论基础。"
  },
  {
    id: 2,
    book: "《旧唐书·礼仪志》",
    quote: "圜丘，在明德门外二里，高二丈三尺，四面为陛，三成。",
    translation: "圜丘（天坛）位于长安城明德门外二里处，高二丈三尺，四面有台阶，分为三层。",
    significance: "详细记载了唐代天坛的地理位置和建筑形制，是现代考古发掘和复原的重要依据。"
  },
  {
    id: 3,
    book: "《大唐开元礼》",
    quote: "冬至祀昊天上帝于圜丘，以大明、夜明、五星、内官、中官、外官、众星从祀。",
    translation: "冬至这一天在圜丘祭祀昊天上帝，并以太阳、月亮、五星以及各星官作为陪祀。",
    significance: "规范了祭祀的对象和等级，反映了唐代人对宇宙星空的认知和敬畏。"
  }
];

export default function History() {
  const [selectedEvent, setSelectedEvent] = useState(timelineData[0]);

  return (
    <Layout>
      <div className="container mx-auto py-12 h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">历史溯源</h1>
          <p className="text-white/60 tracking-widest">HISTORY & ORIGINS</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* 左侧：时间轴 (4列) */}
          <div className="lg:col-span-4 flex flex-col h-[600px]">
            <h2 className="text-2xl font-serif text-white mb-6 border-l-4 border-primary pl-4">历代祭祀时间轴</h2>
            <ScrollArea className="flex-1 pr-4">
              <div className="relative border-l border-white/10 ml-4 space-y-8 py-4">
                {timelineData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-8 cursor-pointer group"
                    onClick={() => setSelectedEvent(item)}
                  >
                    {/* 时间节点 */}
                    <div className={`absolute left-[-5px] top-1 w-3 h-3 rounded-full transition-all duration-300 ${selectedEvent.id === item.id ? 'bg-primary scale-125 shadow-[0_0_10px_var(--primary)]' : 'bg-white/30 group-hover:bg-primary/70'}`} />
                    
                    <div className={`transition-all duration-300 ${selectedEvent.id === item.id ? 'opacity-100 translate-x-2' : 'opacity-60 group-hover:opacity-90'}`}>
                      <span className="text-primary font-mono text-sm">{item.year}</span>
                      <h3 className="text-xl font-serif text-white">{item.dynasty} · {item.emperor}</h3>
                      <p className="text-sm text-white/50">{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* 中间：详细信息展示 (4列) */}
          <div className="lg:col-span-4 flex flex-col h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedEvent.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Card className="h-full bg-black/40 border-white/10 backdrop-blur-md overflow-hidden flex flex-col">
                  <div className="h-48 bg-gradient-to-b from-primary/20 to-transparent p-6 flex items-end relative">
                    <div className="absolute top-4 right-4 text-6xl font-serif text-white/5 font-bold select-none">
                      {selectedEvent.year}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1">{selectedEvent.event}</h2>
                      <p className="text-primary/80">{selectedEvent.emperor}</p>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 overflow-y-auto">
                    <p className="text-lg text-white/90 mb-6 leading-relaxed font-serif">
                      {selectedEvent.description}
                    </p>
                    <Separator className="bg-white/10 my-4" />
                    <h4 className="text-sm uppercase text-white/40 mb-2 tracking-widest">详细记载</h4>
                    <p className="text-white/70 leading-relaxed text-justify placeholder-text">
                      {/* 这里是红色占位符，提示用户后续可以替换更详细的历史资料 */}
                      [此处需替换为更详细的历史考证资料：{selectedEvent.details}]
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 右侧：书籍记载 (4列) */}
          <div className="lg:col-span-4 flex flex-col h-[600px]">
            <h2 className="text-2xl font-serif text-white mb-6 border-l-4 border-secondary pl-4">典籍记载</h2>
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-2">
                {bookRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                      <CardContent className="p-5">
                        <h3 className="text-primary font-serif text-lg mb-3">{record.book}</h3>
                        <div className="relative pl-4 border-l-2 border-white/20 mb-3">
                          <p className="font-kai text-xl text-white/90 italic leading-relaxed">
                            "{record.quote}"
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-white/60">
                            <span className="text-secondary font-bold mr-2">译文:</span>
                            {record.translation}
                          </p>
                          <p className="text-sm text-white/60 placeholder-text">
                            <span className="text-blue-400 font-bold mr-2">释义:</span>
                            [需核对] {record.significance}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </Layout>
  );
}
