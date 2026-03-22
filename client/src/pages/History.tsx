import Layout from "@/components/Layout";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// 历代皇帝祭祀时间轴数据
// 包含年份、朝代、皇帝、事件名称、简述及详细历史背景
const timelineData = [
  {
    id: 1,
    year: "582年",
    dynasty: "隋朝",
    emperor: "隋文帝 杨坚",
    event: "初建圆丘",
    description: "开皇二年，隋文帝令辛彦之为圆丘于国之南太阳门外道东一里。",
    details: "《大唐郊祀录》详细记录了隋文帝初建天坛与祭祀的规制：'至隋文帝令辛彦之为圆丘于国之南太阳门外道东一里，其五四成各高八尺... 冬至日祀昊天上帝于其上也'。"
  },
  {
    id: 2,
    year: "614年",
    dynasty: "隋朝",
    emperor: "隋炀帝 杨广",
    event: "大业祀圆丘",
    description: "大业十年，冬至祀圆丘。帝不斋于次，至便行礼。",
    details: "《大唐郊祀录》中记载了其时营建明堂与祭坛的沿革：'隋炀帝即位恺又造明堂议及样奏因圈都舆役事误不及就终于隋氏故恒于云坛上设祀台'。旧唐书等文献亦载其'大业十年，冬至祀圆丘。帝不斋于次，诘朝备法驾，至便行礼'。"
  },
  {
    id: 3,
    year: "621年",
    dynasty: "唐朝",
    emperor: "唐高祖 李渊",
    event: "亲祀南郊",
    description: "武德四年，确立唐初祭祀配享制度。",
    details: "《大唐郊祀录》载明了唐初确立的配享制度：'武德以来礼令皆用十月... 高祖神尧大圣大光孝皇帝配座'。旧唐书载：'武德四年十一月甲申，有事于南郊'。"
  },
  {
    id: 4,
    year: "628-643年",
    dynasty: "唐朝",
    emperor: "唐太宗 李世民",
    event: "贞观改制",
    description: "太宗多次亲临，修订礼典，确立恒式。",
    details: "唐太宗多次亲临，《大唐郊祀录》中多处留下太宗时期修订礼典的记录，如'太宗贞观一年正月亲行其闰至今谁典将为恒式'，并在论及礼乐时称'皇朝贞观中'为重要改制期。旧唐书载：'贞观二年十一月辛酉，有事于南郊'。"
  },
  {
    id: 5,
    year: "651-668年",
    dynasty: "唐朝",
    emperor: "唐高宗 李治",
    event: "永徽配祀",
    description: "高宗亲享南郊，奉太宗配祀於明堂。",
    details: "《旧唐书》礼仪志中详载了高宗南郊祭天的服饰与配享之制的变更：'永徽二年，高宗亲享南郊用之（指大裘之冕）。永徽二年，又奉太宗配祀於明堂，有司遂以高祖配五天帝，太宗配五人帝'。"
  },
  {
    id: 6,
    year: "695-702年",
    dynasty: "唐朝",
    emperor: "武则天",
    event: "合祭天地",
    description: "天册金轮大圣皇帝，亲享南郊，合祭天地。",
    details: "《旧唐书》礼仪志明确记载：'及则天革命，天册万岁元年，加号为天册金轮大圣皇帝，亲享南郊，合祭天地'。并且'长安二年又亲享南郊，合祭天地及诸郊丘，并以配焉'。《大唐郊祀录》亦载其对祭祀名称的改动：'则天太后摄位，又改为先农'。"
  },
  {
    id: 7,
    year: "709年",
    dynasty: "唐朝",
    emperor: "唐中宗 李显",
    event: "景龙调整",
    description: "神龙元年，祝钦明上表恢复神祇和坛位。",
    details: "《大唐郊祀录》详细记载了中宗时期对神祇和坛位的恢复与调整：'至神龙元年祝钦明上表孟春吉亥祀后土以句龙氏配改先农为帝社... 又于社晦西立帝稷礼同大社大稷其坛随不备五色与大社有殊'。"
  },
  {
    id: 8,
    year: "712年",
    dynasty: "唐朝",
    emperor: "唐睿宗 李旦",
    event: "景云祭天",
    description: "正月辛巳，祀昊天上帝于南郊，大赦天下。",
    details: "《旧唐书》载睿宗'正月辛巳，祀昊天上帝于南郊，大赦天下'。《大唐郊祀录》中则记有其在位期间追赠前代太子的礼仪记录：'中宗长予本名重照... 中宗追赠皇太予谥懿德... 睿示（睿宗）迫赠谥节愍以举兵诛乐安公主也'。"
  },
  {
    id: 9,
    year: "723-754年",
    dynasty: "唐朝",
    emperor: "唐玄宗 李隆基",
    event: "开元盛世",
    description: "玄宗是盛唐来此最频繁的帝王，规范神位，颁为恒典。",
    details: "玄宗是盛唐来此最频繁的帝王。《旧唐书》舆服志记载其出行仪仗的变更：'开元十一年冬，将有事于南郊，乘辂而往，礼毕，骑而还'。《大唐郊祀录》则详载其在开元十一年规范神位之事：'开元十一年十月二十一日，参定南郊... 诏令礼官详定... 颁于有司至今以为恒典'。且'天宝六载始讵诸列武举八上省先讹太公旗拜将出师亦先告之'。"
  },
  {
    id: 10,
    year: "758-761年",
    dynasty: "唐朝",
    emperor: "唐肃宗 李亨",
    event: "乾元恢复",
    description: "平叛期间依然亲祀，力主恢复古代理念。",
    details: "肃宗在平叛期间依然亲祀。《大唐郊祀录》记录了他力主恢复古代理念的细节：'肃宗乾元一年将耕，阅耒耜有雕刻文饰者，上谓左右曰：‘农人执之在于朴素，岂须文饰乎？’乃撤之'。"
  },
  {
    id: 11,
    year: "764年",
    dynasty: "唐朝",
    emperor: "唐代宗 李豫",
    event: "广德祭天",
    description: "冬至，祀昊天上帝于南郊，奏保大之舞。",
    details: "旧唐书载其'冬至，祀昊天上帝于南郊'。《大唐郊祀录》记录了其后世的酌献乐章及庙制：'代宗庙酌献奏保大之舞... 肃勺韦慝含弘还方万物茂遂非策宾王惜惜云韶德音不忘'。"
  },
  {
    id: 12,
    year: "780-793年",
    dynasty: "唐朝",
    emperor: "唐德宗 李适",
    event: "建中升格",
    description: "亲郊时对星辰神位进行升格，诏令名将形于壁。",
    details: "《大唐郊祀录》极其详尽地记载了建中元年他亲郊时对星辰神位的升格：'至建中元年正月，圣上亲郊，司天台郭... 奏弓星经及大实中敕并合升在耶一等'。并载'建中四年又诏令睡范钟绳名将六卞回刚形于壁每囚释奠皆从祭焉'。"
  },
  {
    id: 13,
    year: "805-874年",
    dynasty: "唐朝",
    emperor: "宪宗至僖宗",
    event: "中晚唐维系",
    description: "共8位皇帝均曾亲祀南郊，维系正统核心。",
    details: "大唐中晚期，南郊祭天依然是维系正统的核心。《大唐郊祀录》虽未逐一列举所有祭典，但详细记录了此时期诸帝的宗庙乐章与祭祀祝文：如'武宗烂奏受天明命敷布下士夏化滞似验卫戍以武气消夷夏裕臻往阶亿万斯年'；'宣宗庙秦夏候孩于砾令主圣神重目池起教义申明典章俗尚素桃'；'懿（懿宗）深烂哭圣祚无疆庆传乐章金减绣茂区叶延长'。"
  },
  {
    id: 14,
    year: "889年",
    dynasty: "唐朝",
    emperor: "唐昭宗 李晔",
    event: "最后祭典",
    description: "长安圜丘见证的最后一次大唐皇家祭天大典。",
    details: "《旧唐书》载：'龙纪元年正月... 亲祀南郊，大赦天下，改元龙纪'。此为长安圜丘见证的最后一次大唐皇家祭天大典，此后唐朝风雨飘摇，再无皇帝亲祀南郊。这是大唐王朝在长安圜丘进行的最后一次皇家祭天大典。"
  }
];

// 书籍记载数据
// 包含书名、原文引用、白话翻译及历史意义
const bookRecords = [
  {
    id: 1,
    book: "《大唐郊祀录》",
    quote: "至隋文帝令辛彦之为圆丘于国之南太阳门外道东一里，其五四成各高八尺... 冬至日祀昊天上帝于其上也。",
    translation: "隋文帝命令辛彦之在国都南面的太阳门外道东一里处建造圆丘，分为五层和四层，各高八尺... 冬至那天在上面祭祀昊天上帝。",
    significance: "详细记录了隋代天坛的初建位置、形制规格及祭祀时间。"
  },
  {
    id: 2,
    book: "《旧唐书·礼仪志》",
    quote: "及则天革命，天册万岁元年，加号为天册金轮大圣皇帝，亲享南郊，合祭天地。",
    translation: "等到武则天革命称帝，天册万岁元年，加封号为天册金轮大圣皇帝，亲自在南郊举行祭祀，合祭天地。",
    significance: "记载了武则天时期打破传统、合祭天地的重大礼制变革。"
  },
  {
    id: 3,
    book: "《大唐郊祀录》",
    quote: "开元十一年十月二十一日，参定南郊... 诏令礼官详定... 颁于有司至今以为恒典。",
    translation: "开元十一年十月二十一日，重新审定南郊祭祀礼仪... 下诏命令礼官详细制定... 颁布给有关部门，至今作为永久的典章。",
    significance: "反映了唐玄宗时期对祭天礼仪的标准化和制度化建设。"
  },
  {
    id: 4,
    book: "《旧唐书·舆服志》",
    quote: "开元十一年冬，将有事于南郊，乘辂而往，礼毕，骑而还。",
    translation: "开元十一年冬天，准备在南郊举行祭祀，乘坐大辂车前往，礼仪结束后，骑马返回。",
    significance: "记录了盛唐时期皇帝参加祭天大典的出行仪仗和礼仪细节。"
  },
  {
    id: 5,
    book: "《大唐郊祀录》",
    quote: "肃宗乾元一年将耕，阅耒耜有雕刻文饰者，上谓左右曰：‘农人执之在于朴素，岂须文饰乎？’乃撤之。",
    translation: "唐肃宗乾元一年准备亲耕时，看到农具上有雕刻花纹，对左右说：‘农民用的东西在于朴素，哪里需要装饰呢？’于是下令撤掉装饰。",
    significance: "体现了唐代帝王在祭祀礼仪中崇尚朴素、重视农桑的思想。"
  }
];

export default function History() {
  // 状态管理：当前选中的时间轴事件，默认为第一项
  const [selectedEvent, setSelectedEvent] = useState(timelineData[0]);

  return (
    <Layout>
      <div className="container mx-auto py-12 h-full flex flex-col">
        {/* 页面标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">历史溯源</h1>
          <p className="text-white/60 tracking-widest">HISTORY & ORIGINS</p>
        </motion.div>

        {/* 统一布局：三栏结构（时间轴 | 详情 | 典籍） */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          
          {/* 左侧：时间轴列表 */}
          <div className="lg:col-span-4 flex flex-col h-[500px] lg:h-[600px]">
            <h2 className="text-2xl font-serif text-white mb-6 border-l-4 border-primary pl-4">历代祭祀时间轴</h2>
            <div className="flex-1 min-h-0 rounded-lg border border-white/5 bg-black/20 overflow-hidden">
              <ScrollArea className="h-full w-full">
                <div className="p-4 space-y-2">
                  {timelineData.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative pl-8 cursor-pointer group"
                      onClick={() => setSelectedEvent(item)}
                    >
                      {/* 时间轴左侧线条 */}
                      <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
                      {/* 时间节点圆点：选中时放大并发光 */}
                      <div className={`absolute left-[7px] top-3 w-2.5 h-2.5 rounded-full border-2 border-primary transition-all duration-300 ${selectedEvent.id === item.id ? 'bg-primary scale-150 shadow-[0_0_10px_#EAB308]' : 'bg-black/80 group-hover:scale-125'}`} />
                      {/* 时间轴项内容 */}
                      <div className={`py-3 px-2 rounded-lg transition-all duration-300 ${selectedEvent.id === item.id ? 'opacity-100 bg-primary/10 border border-primary/20' : 'opacity-60 group-hover:opacity-90 hover:bg-white/5'}`}>
                        <span className="text-primary font-mono text-sm">{item.year}</span>
                        <h3 className="text-base font-serif text-white leading-snug">{item.dynasty} · {item.emperor}</h3>
                        <p className="text-xs text-white/50 mt-0.5">{item.event}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* 中间：详细信息展示卡片 */}
          <div className="lg:col-span-4 flex flex-col h-[500px] lg:h-[600px]">
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
                  {/* 卡片头部：年份和事件标题 */}
                  <div className="h-40 bg-gradient-to-b from-primary/20 to-transparent p-6 flex items-end relative shrink-0">
                    <div className="absolute top-4 right-4 text-5xl font-serif text-white/5 font-bold select-none">
                      {selectedEvent.year}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{selectedEvent.event}</h2>
                      <p className="text-primary/80">{selectedEvent.emperor}</p>
                    </div>
                  </div>
                  
                  {/* 卡片内容区：使用 ScrollArea 确保长文本可滚动 */}
                  <CardContent className="p-0 flex-1 overflow-hidden min-h-0">
                    <ScrollArea className="h-full w-full">
                      <div className="p-6">
                        <p className="text-lg text-white/90 mb-6 leading-relaxed font-serif">
                          {selectedEvent.description}
                        </p>
                        <Separator className="bg-white/10 my-4" />
                        <h4 className="text-sm uppercase text-white/40 mb-2 tracking-widest">古籍详细记载</h4>
                        <div className="bg-primary/5 border-l-2 border-primary p-4 rounded-r">
                          <p className="text-white/80 leading-relaxed text-justify font-serif italic">
                            {selectedEvent.details}
                          </p>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 右侧：典籍记载列表 */}
          <div className="lg:col-span-4 flex flex-col h-[500px] lg:h-[600px]">
            <h2 className="text-2xl font-serif text-white mb-6 border-l-4 border-secondary pl-4">典籍记载</h2>
            <div className="flex-1 min-h-0 rounded-lg border border-white/5 bg-black/20 overflow-hidden">
              <ScrollArea className="h-full w-full">
                <div className="p-4 space-y-4">
                  {bookRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                        <CardContent className="p-5">
                          <h3 className="text-primary font-serif text-lg mb-3">{record.book}</h3>
                          <div className="relative pl-4 border-l-2 border-white/20 mb-3">
                            <p className="font-serif text-lg text-white/90 italic leading-relaxed">
                              "{record.quote}"
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-white/60">
                              <span className="text-secondary font-bold mr-2">译文:</span>
                              {record.translation}
                            </p>
                            <p className="text-sm text-white/60">
                              <span className="text-blue-400 font-bold mr-2">释义:</span>
                              {record.significance}
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
      </div>
    </Layout>
  );
}
