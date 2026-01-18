import React, { useEffect, useState, useRef } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  PieChart,
  Activity,
  X,
  Send,
  Globe,
  Zap,
  Shield,
  Layout,
  Star,
  Play,
  Box
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

interface LandingPageProps {
  onStart: () => void;
}

// --- Constants & Config ---
const TRANSITION_MS = 400;
const SPRING_CONFIG = { stiffness: 100, damping: 20, restDelta: 0.001 };

// --- Sub-components ---

const SectionTitle = ({ children, level = 2, className = "" }: { children: React.ReactNode, level?: number, className?: string }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizes = [
    'text-5xl md:text-7xl font-black leading-[1.1]', // h1
    'text-4xl md:text-5xl font-black leading-tight', // h2
    'text-3xl md:text-4xl font-bold leading-snug',   // h3
    'text-2xl md:text-3xl font-bold',              // h4
    'text-xl md:text-2xl font-bold',               // h5
    'text-lg md:text-xl font-bold',                // h6
  ];
  return (
    <Tag className={`${sizes[level - 1]} text-slate-900 tracking-tight ${className}`}>
      {children}
    </Tag>
  );
};

const BodyText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-lg md:text-xl text-slate-500 leading-[1.8] font-medium ${className}`}>
    {children}
  </p>
);

const GlassCard = ({ children, className = "", hover = true }: { children: React.ReactNode, className?: string, hover?: boolean }) => (
  <motion.div 
    whileHover={hover ? { y: -8, transition: { duration: TRANSITION_MS / 1000 } } : {}}
    className={`backdrop-blur-2xl bg-white/40 border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[32px] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const InteractiveButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = "",
  icon: Icon
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'ghost',
  className?: string,
  icon?: any
}) => {
  const baseStyles = "relative px-8 py-4 rounded-2xl text-lg font-black transition-all flex items-center justify-center gap-2 group overflow-hidden";
  const variants = {
    primary: "bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white shadow-2xl shadow-violet-200/50",
    secondary: "bg-white/40 backdrop-blur-xl border border-white/50 text-slate-700 hover:bg-white/60",
    ghost: "text-slate-500 hover:text-indigo-600 px-4 py-2 text-base"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      aria-label={typeof children === 'string' ? children : 'button'}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
      {children}
      {Icon && <Icon size={20} className="group-hover:translate-x-1 transition-transform duration-300" />}
    </motion.button>
  );
};

const FlippableCard = ({ item }: { item: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-[320px] h-[420px] cursor-pointer perspective-1000 group flex-shrink-0"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full h-full preserve-3d relative"
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full rounded-[32px] overflow-hidden border border-white/30 shadow-xl relative group-hover:scale-[1.02] transition-transform duration-300">
            <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
              <h4 className="text-2xl font-black mb-2">{item.title}</h4>
              <p className="text-sm opacity-80 line-clamp-2">{item.desc}</p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full rounded-[32px] bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white flex flex-col justify-center items-center text-center border border-white/20 shadow-2xl">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles size={32} />
            </div>
            <h4 className="text-2xl font-black mb-4">{item.title} 详情</h4>
            <p className="text-base leading-relaxed opacity-90">
              {item.details || "探索 Collector + 的深度赋能，开启全新的阅读维度。点击再次翻转回到封面。"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Carousel = () => {
  const [isPaused, setIsPaused] = useState(false);
  const items = [
    { 
      title: "智能收录", 
      desc: "一键抓取全网深度好文，自动去噪，还你纯净阅读空间。", 
      details: "支持 100+ 平台内容解析，自动提取正文，过滤广告，智能分类存档。",
      img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      title: "AI 播客生成", 
      desc: "将枯燥的长文转化为生动的对话流，通勤路上也能高效吸收。", 
      details: "多音色可选，智能脚本编排，支持倍速播放与章节标记，让阅读变倾听。",
      img: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      title: "知识卡片", 
      desc: "精美的卡片皮肤库，让每一份思考都值得被收藏和分享。", 
      details: "内置 20+ 动态皮肤，一键生成精美海报，支持 Notion/Obsidian 同步。",
      img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      title: "思维导图", 
      desc: "自动梳理文章逻辑，结构化呈现核心观点。", 
      details: "AI 自动提取关键节点，支持导出多种格式，助力快速构建知识体系。",
      img: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800" 
    }
  ];

  // Continuous auto-scroll logic
  const [x, setX] = useState(0);
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setX(prev => prev - 335); // Card width + gap
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Loop back logic
  useEffect(() => {
    const threshold = -335 * items.length;
    if (x <= threshold) {
      setX(0);
    }
  }, [x, items.length]);

  return (
    <div 
      className="w-full overflow-hidden p-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div 
        animate={{ x }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="flex gap-[15px]"
      >
        {/* Render items twice for simple infinite loop simulation */}
        {[...items, ...items].map((item, idx) => (
          <FlippableCard key={idx} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

const CrystalCube = () => {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center perspective-1000">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full" />

      {/* Main Rotating Scene */}
      <motion.div
        className="relative w-64 h-64 preserve-3d"
        animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Core Cube Faces */}
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face, i) => {
          const transforms = {
            front: 'translateZ(128px)',
            back: 'rotateY(180deg) translateZ(128px)',
            right: 'rotateY(90deg) translateZ(128px)',
            left: 'rotateY(-90deg) translateZ(128px)',
            top: 'rotateX(90deg) translateZ(128px)',
            bottom: 'rotateX(-90deg) translateZ(128px)',
          };
          return (
            <div
              key={face}
              className="absolute inset-0 border border-white/40 bg-gradient-to-br from-blue-400/30 to-purple-600/30 backdrop-blur-sm shadow-[inset_0_0_40px_rgba(255,255,255,0.2)]"
              style={{ 
                transform: transforms[face as keyof typeof transforms],
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(3, 1fr)',
              }}
            >
              {/* 3x3 Grid Segments */}
              {[...Array(9)].map((_, j) => (
                <div key={j} className="border border-white/20 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]" />
              ))}
            </div>
          );
        })}

        {/* Internal Glowing Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white blur-[60px] rounded-full animate-pulse opacity-80" />
      </motion.div>

      {/* Orbiting Golden Rings */}
      <motion.div 
        className="absolute w-[450px] h-[450px] rounded-full border border-amber-300/60 shadow-[0_0_15px_rgba(251,191,36,0.4)]"
        animate={{ rotateX: [70, 70], rotateY: [0, 360], rotateZ: [-20, -20] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-300 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
      </motion.div>

      <motion.div 
        className="absolute w-[380px] h-[380px] rounded-full border border-amber-200/40"
        animate={{ rotateX: [110, 110], rotateY: [360, 0], rotateZ: [10, 10] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: 'preserve-3d' }}
      />

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-12 h-12 bg-gradient-to-br from-blue-300/40 to-purple-400/40 backdrop-blur-md border border-white/40 rounded-lg shadow-lg"
          initial={{ 
            x: Math.random() * 400 - 200, 
            y: Math.random() * 400 - 200, 
            z: Math.random() * 200 - 100,
            rotate: Math.random() * 360 
          }}
          animate={{ 
            y: [null, Math.random() * -50],
            rotate: [null, Math.random() * 360]
          }}
          transition={{ 
            duration: 5 + Math.random() * 5, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
      ))}
      
      {/* Crescent Moon Decoration */}
      <motion.div 
        className="absolute top-20 right-20 text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]"
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </motion.div>
    </div>
  );
};

const HeroGraphic = () => {
  return <CrystalCube />;
};

const SimpleChart = () => {
  return (
    <div className="flex items-end justify-between h-48 gap-3 px-4">
      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          transition={{ delay: i * 0.1, duration: 0.8, ease: "backOut" }}
          className="w-full bg-gradient-to-t from-indigo-500 to-violet-400 rounded-t-lg relative group"
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded">
            {h}%
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Modal = ({ isOpen, onClose, onStart }: { isOpen: boolean, onClose: () => void, onStart: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          
          <div className="mb-8">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
              <Send size={24} />
            </div>
            <h3 className="text-2xl font-black mb-2">申请加入“智阅计划”</h3>
            <p className="text-slate-500">填写基本信息，开启你的 14 天专业版体验。</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onStart(); }}>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5">邮箱地址</label>
              <input type="email" required placeholder="your@email.com" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5">主要阅读领域</label>
              <select className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none">
                <option>科技互联网</option>
                <option>人文社科</option>
                <option>商业财经</option>
                <option>个人成长</option>
              </select>
            </div>
            <InteractiveButton className="w-full py-4">
              立即开启
            </InteractiveButton>
          </form>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Multimedia / 3D Viewer Simulation ---
const MultimediaSection = () => {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <SectionTitle className="mb-8">沉浸式多维感知</SectionTitle>
            <BodyText className="mb-10">
              打破传统阅读的边界。通过内置的 3D 知识图谱与互动视频解析，让每一个知识点都触手可及，构建属于你的可视化思维宇宙。
            </BodyText>
            <div className="space-y-6">
              {[
                { icon: <Box size={20} />, title: "3D 知识建模", desc: "自动提取文章实体，构建三维交互图谱。" },
                { icon: <Play size={20} />, title: "智能视频摘要", desc: "AI 自动定位核心片段，节省 80% 的观看时间。" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative aspect-video rounded-[40px] overflow-hidden group shadow-2xl reveal">
            <img 
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              alt="Multimedia preview"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-indigo-600 shadow-2xl"
            >
              <Play size={32} fill="currentColor" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Main Page ---

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll tracking for navbar
  useEffect(() => {
    const main = document.querySelector('main');
    const handleScroll = () => {
      if (main) setIsScrolled(main.scrollTop > 50);
    };
    if (main) main.addEventListener('scroll', handleScroll);
    return () => main?.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effects
  const { scrollYProgress } = useScroll({
    container: scrollRef as any,
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Intersection Observer for Reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scrollRef} className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-600 smooth-scroll">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onStart={onStart} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'bg-white/70 backdrop-blur-xl border-b border-white/20 py-4 shadow-sm' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-11 h-11 bg-gradient-to-br from-[#a855f7] to-[#6366f1] rounded-[14px] flex items-center justify-center shadow-lg shadow-indigo-100 ring-4 ring-white">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Collector +</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-10">
            {['核心功能', '智阅计划', '数据中心'].map((item) => (
              <a key={item} href={`#${item}`} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
              </a>
            ))}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-7 py-3 bg-slate-900 text-white rounded-full text-sm font-black hover:shadow-xl hover:shadow-slate-200 transition-all"
            >
              申请加入
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-56 md:pb-40 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 text-left reveal -translate-x-2 lg:-translate-x-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 80 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50/50 backdrop-blur-md border border-indigo-100 rounded-full text-indigo-600 text-xs font-black mb-8 shadow-sm"
            >
              <Sparkles size={14} className="animate-spin-slow" />
              <span>Collector + 计划</span>
            </motion.div>
            
            <SectionTitle level={1} className="mb-10">
               <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] via-[#6366f1] to-[#3b82f6]">
                智阅AI助手
              </span>
            </SectionTitle>
            
            <div className="space-y-6 mb-12">
              {[
                '打破“收藏即遗忘”的知识数字坟墓',
                'AI对话/答题/播客等多元操作，高效重构内容，沉浸感拉满',
                '热力矩阵、认知雷达，量化学习成就'
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <Check size={14} strokeWidth={4} />
                  </div>
                  <BodyText className="text-lg">{text}</BodyText>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <InteractiveButton onClick={onStart} icon={ArrowRight}>
                立即体验
              </InteractiveButton>
              <InteractiveButton variant="secondary" onClick={() => setIsModalOpen(true)}>
                申请加入
              </InteractiveButton>
            </div>
          </div>

          <div className="flex-1 relative reveal">
            <HeroGraphic />
          </div>
        </div>
      </section>

      {/* Features Carousel Section - Image 1 Refactor */}
      <section id="核心功能" className="py-32 bg-slate-50/30 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal">
              <SectionTitle className="mb-6">极致体验，从未如此简单</SectionTitle>
              <BodyText>基于最前沿的 AI 模型，为您打造的全链路知识管理方案</BodyText>
            </div>
            <div className="reveal">
              <Carousel />
            </div>
          </div>
        </div>
      </section>

      {/* Visual Gallery Section - Image 2 Area Refactor / Expansion */}
      {/* <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 reveal">
            <SectionTitle className="mb-6">视觉宇宙 · 灵感碰撞</SectionTitle>
            <BodyText>每一份记录都是一次艺术创作，通过瀑布流布局探索你的知识图谱</BodyText>
          </div>
          <div className="reveal">
            <WaterfallGallery />
          </div>
        </div>
      </section> */}

      {/* Multimedia Showcase */}
      <MultimediaSection />

      {/* Statistics Section */}
      <section id="数据中心" className="py-32 relative overflow-hidden bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10 reveal">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-50 rounded-full text-indigo-600 font-bold text-sm">
                <Activity size={18} />
                实时成长引擎
              </div>
              <SectionTitle className="leading-tight">
                看见你的 <br />
                <span className="text-indigo-600">认知进化</span>
              </SectionTitle>
              <BodyText>
                不仅仅是阅读，Collector + 记录你的每一个深度思考瞬间。通过多维认知雷达图，量化你的成长轨迹。
              </BodyText>
              <div className="grid grid-cols-2 gap-12">
                {[
                  { label: '活跃用户', val: '10K+' },
                  { label: '笔记产出', val: '2.5M+' },
                  { label: '知识卡片', val: '500K+' },
                  { label: '阅读时长', val: '1.2M h' },
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="text-4xl font-black text-slate-900">{stat.val}</div>
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, rotate: 5 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              className="relative reveal"
            >
              <GlassCard className="p-12">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                      <BarChart2 size={24} />
                    </div>
                    <span className="font-black text-xl">阅读心流监控</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  </div>
                </div>
                <SimpleChart />
                <div className="mt-12 pt-10 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-slate-100 border-4 border-white shadow-sm" />
                    <div>
                      <div className="font-black text-slate-900">本周增长</div>
                      <div className="text-sm text-emerald-500 font-black">+24.5%</div>
                    </div>
                  </div>
                  <InteractiveButton variant="ghost">查看详情</InteractiveButton>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Features Grid */}
      <section className="py-32 bg-slate-50 text-slate-900 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24 reveal">
            <SectionTitle className="text-slate-900 mb-8">安全、极速、无处不在</SectionTitle>
            <div className="flex flex-wrap justify-center gap-12 opacity-60">
              {['Chrome', 'Safari', 'Edge', 'Firefox', 'Mobile'].map(b => (
                <div key={b} className="flex items-center gap-3 font-bold text-xl text-slate-500">
                  <Globe size={24} />
                  {b}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Shield />, title: "隐私优先", desc: "端到端加密，您的阅读数据仅存于本地与私有云。" },
              { icon: <Zap />, title: "极致性能", desc: "自研渲染引擎，万字长文毫秒级加载，流畅如丝。" },
              { icon: <Layout />, title: "跨端同步", desc: "手机、平板、电脑，您的知识库随手可得。" }
            ].map((f, i) => (
              <div key={i} className="group p-10 rounded-[40px] bg-white border border-slate-100 hover:border-indigo-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-16 h-16 bg-indigo-600 rounded-[22px] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-xl shadow-indigo-200">
                  {React.cloneElement(f.icon as React.ReactElement, { size: 28, className: "text-white" })}
                </div>
                <h3 className="text-2xl font-black mb-6 text-slate-900">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative overflow-hidden bg-white">
        <div className="container mx-auto px-6 text-center relative z-10 reveal">
          <div className="max-w-4xl mx-auto space-y-12">
            <SectionTitle level={1} className="leading-tight">
              现在，就开始你的 <br />
              <span className="text-indigo-600">智阅之旅</span>
            </SectionTitle>
            <BodyText className="text-2xl max-w-2xl mx-auto">
              加入 智阅计划，与万千思想者同行，重塑你的认知边界。
            </BodyText>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <InteractiveButton onClick={onStart} className="px-14 py-6 text-2xl shadow-violet-300">
                免费开启 
              </InteractiveButton>
              <InteractiveButton variant="ghost" onClick={() => setIsModalOpen(true)} className="text-xl">
                了解更多详情
              </InteractiveButton>
            </div>
          </div>
        </div>
        
        {/* Background Decorative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-slate-100 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-24">
            <div className="space-y-8 max-w-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <BrainCircuit size={28} />
                </div>
                <span className="text-3xl font-black tracking-tight">Collector +</span>
              </div>
              <BodyText className="text-base">
                重塑阅读体验，AI 赋能认知。我们致力于打造人类第二大脑，让知识内化变得科学且愉悦。
              </BodyText>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-24">
              <div>
                <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs">产品</h4>
                <ul className="space-y-5 text-slate-400 font-bold">
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">核心功能</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">价格方案</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">更新日志</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs">资源</h4>
                <ul className="space-y-5 text-slate-400 font-bold">
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">使用指南</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">API 文档</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">社区交流</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs">法律</h4>
                <ul className="space-y-5 text-slate-400 font-bold">
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">隐私政策</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">服务条款</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">安全合规</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-24 pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-slate-400 font-bold text-sm">© 2026 Collector +. All rights reserved.</div>
            <div className="flex gap-10 text-slate-300">
              <a href="#" className="hover:text-indigo-600 transition-colors" aria-label="Globe"><Globe size={22} /></a>
              <a href="#" className="hover:text-indigo-600 transition-colors" aria-label="Activity"><Activity size={22} /></a>
              <a href="#" className="hover:text-indigo-600 transition-colors" aria-label="Shield"><Shield size={22} /></a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal-active {
          opacity: 1;
          transform: translateY(0);
        }
        .smooth-scroll {
          scroll-behavior: smooth;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        ::selection {
          background: #e0e7ff;
          color: #4338ca;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
