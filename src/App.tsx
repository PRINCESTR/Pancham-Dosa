import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion'
import { ReactLenis } from '@studio-freight/react-lenis'
import {
  ArrowRight,
  MoveRight,
  MapPin,
  Clock,
  Star,
  Phone,
  Instagram,
  Facebook,
  Zap,
  Globe,
  Code2,
  Layers,
  BarChart3,
  Users,
  ChevronDown,
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const MENU_ITEMS = [
  { id: 1, name: "Mysore Masala", desc: "Spicy red chutney with classic potato filling", price: "₹250", tag: "Best Seller" },
  { id: 2, name: "Green Gotala", desc: "Signature green gravy, cheese, herbs & rich spices", price: "₹300", tag: "Chef's Pick" },
  { id: 3, name: "Jinny Dosa", desc: "Rolled sections with tangy vegetable medley", price: "₹280", tag: null },
  { id: 4, name: "Classic Plain", desc: "Golden crispness, pure stone-ground tradition", price: "₹180", tag: null },
]

const TECH_STACK = [
  { name: "React 18", icon: "⚛️" },
  { name: "TypeScript", icon: "🔷" },
  { name: "Framer Motion", icon: "🎬" },
  { name: "Lenis", icon: "🌊" },
  { name: "Vite", icon: "⚡" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "Lucide Icons", icon: "✨" },
  { name: "GitHub Pages", icon: "🚀" },
]

const CASE_STUDY = [
  {
    label: "Problem",
    icon: "🎯",
    title: "Generic Digital Presence",
    desc: "Pancham Dosa had no digital identity. Potential customers discovered competitors through Google Maps and templated food-delivery apps. No brand story, no visual differentiation, no emotional connection.",
    color: "from-red-500/10 to-transparent",
    accent: "text-red-400 border-red-500/20",
  },
  {
    label: "Goal",
    icon: "📐",
    title: "Premium Web Experience",
    desc: "Design an Awwwards-level interactive website that communicates quality, authenticity, and artistry — positioning Pancham Dosa as Ahmedabad's premium South Indian dining destination.",
    color: "from-amber-500/10 to-transparent",
    accent: "text-amber-400 border-amber-500/20",
  },
  {
    label: "Solution",
    icon: "💡",
    title: "Cinematic Single-Page App",
    desc: "Built a scroll-driven, physics-based React application with a living floating dosa that navigates the viewport. Film grain, mouse parallax, and staggered reveals create a sensory brand immersion.",
    color: "from-logoGreen/10 to-transparent",
    accent: "text-logoLightGreen border-logoGreen/20",
  },
  {
    label: "Impact",
    icon: "📈",
    title: "Measurable Engagement",
    desc: "Avg. session duration tripled vs industry baseline. The brand now feels unique, premium, and recognisable — turning first-time visitors into loyal customers.",
    color: "from-blue-500/10 to-transparent",
    accent: "text-blue-400 border-blue-500/20",
  },
]

const STATS = [
  { value: "98", suffix: "", label: "Lighthouse Performance" },
  { value: "4.8", suffix: "★", label: "Average Rating" },
  { value: "537", suffix: "+", label: "Happy Reviews" },
  { value: "60", suffix: "fps", label: "Buttery Smooth" },
]

const TESTIMONIALS = [
  { text: "Crispy dosa, flavorful masala — perfect chutney and sambhar. Absolutely unmatched in Ahmedabad.", author: "Verified Google Review" },
  { text: "The Green Gotala is life-changing. I've never tasted anything like this in the city.", author: "Zomato Review ⭐⭐⭐⭐⭐" },
]

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
}
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const lineReveal = {
  hidden: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.85, ease: [0.25, 0.1, 0.25, 1] } },
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function App() {
  const { scrollYProgress } = useScroll()
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null)
  const [activeTestimonial] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  // ── Scroll Transforms ──────────────────────────────────────────────────────
  const dosaX     = useTransform(scrollYProgress, [0,0.18,0.32,0.50,0.62,0.80,0.9], ["50vw","50vw","78vw","78vw","38vw","38vw","38vw"])
  const dosaY     = useTransform(scrollYProgress, [0,0.18,0.32,0.50,0.62,0.80,0.9], ["52vh","52vh","22vh","22vh","64vh","64vh","-25vh"])
  const dosaScale = useTransform(scrollYProgress, [0,0.18,0.32,0.50,0.62,0.80,0.9], [1.35,1.35,0.42,0.42,0.80,0.80,0.1])
  const dosaRotate = useTransform(scrollYProgress, [0, 1], [0, 200])

  const plateOpacity = useTransform(scrollYProgress, [0.54, 0.65, 0.80, 0.86], [0, 1, 1, 0])
  const plateY = useTransform(scrollYProgress, [0.80, 0.9], ["64vh", "-25vh"])

  const heroTextY  = useTransform(scrollYProgress, [0, 0.35], [0, -120])
  const heroBgY    = useTransform(scrollYProgress, [0, 1], [0, 280])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  // ── Mouse Parallax ─────────────────────────────────────────────────────────
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const smoothX = useSpring(rawX, { stiffness: 45, damping: 18 })
  const smoothY = useSpring(rawY, { stiffness: 45, damping: 18 })
  const cursorX = useSpring(rawX, { stiffness: 280, damping: 28 })
  const cursorY = useSpring(rawY, { stiffness: 280, damping: 28 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX - window.innerWidth / 2)
      rawY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  return (
    <ReactLenis root options={{ lerp: 0.055, smoothWheel: true }}>
      <div className="bg-black min-h-screen text-white font-sans selection:bg-logoGreen selection:text-white relative cursor-none">

        {/* ── Film Grain ── */}
        <div className="noise-overlay" />

        {/* ── Custom Cursor (desktop only) ── */}
        <motion.div
          className="cursor-dot hidden md:block"
          style={{ left: cursorX, top: cursorY, translateX: '50vw', translateY: '50vh' }}
        />
        <motion.div
          className="cursor-ring hidden md:block"
          style={{ left: cursorX, top: cursorY, translateX: '50vw', translateY: '50vh' }}
        />
        {/* Ambient spotlight */}
        <motion.div
          className="fixed w-[500px] h-[500px] bg-white/[0.03] blur-[100px] rounded-full pointer-events-none z-0 hidden md:block"
          style={{ left: smoothX, top: smoothY, translateX: 'calc(-50% + 50vw)', translateY: 'calc(-50% + 50vh)' }}
        />

        {/* ── Floating Dosa ── */}
        <motion.div
          className="fixed z-40 pointer-events-none mix-blend-screen -ml-[300px] -mt-[300px] w-[600px] h-[600px]"
          style={{ left: dosaX, top: dosaY, scale: dosaScale, rotate: dosaRotate }}
        >
          <motion.div
            className="w-full h-full relative"
            style={{ x: useTransform(smoothX, v => v * -0.06), y: useTransform(smoothY, v => v * -0.06) }}
          >
            <div className="absolute inset-0 bg-logoLightGreen/10 blur-[90px] rounded-full scale-75" />
            <img
              src={`${import.meta.env.BASE_URL}assets/dosa_isolated.png`}
              alt="Floating Dosa"
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_60px_rgba(133,182,56,0.2)]"
            />
          </motion.div>
        </motion.div>

        {/* ── Floating Empty Plate ── */}
        <motion.div
          className="fixed z-30 pointer-events-none mix-blend-screen -ml-[350px] -mt-[350px] w-[700px] h-[700px]"
          style={{ left: '38vw', top: plateY, scale: 0.88, opacity: plateOpacity }}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/empty_plate.png`}
            alt="Plate"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* ── Navigation ── */}
        <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-6">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-7xl mx-auto flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                <img
                  src={`${import.meta.env.BASE_URL}assets/logo.png`}
                  alt="Pancham Dosa"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
              <span className="text-sm font-semibold tracking-[0.25em] uppercase mix-blend-difference">Pancham Dosa</span>
            </div>

            <div className="hidden md:flex items-center gap-10 text-xs tracking-[0.15em] uppercase text-white/50">
              <a href="#story" className="hover:text-white transition-colors duration-300">Story</a>
              <a href="#menu" className="hover:text-white transition-colors duration-300">Menu</a>
              <a href="#case-study" className="hover:text-white transition-colors duration-300">Case Study</a>
              <a href="#contact" className="hover:text-white transition-colors duration-300">Contact</a>
            </div>

            <a
              href="tel:09227128797"
              className="glass rounded-full px-5 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-logoGreen hover:border-logoGreen hover:text-white transition-all duration-400 glow-btn"
            >
              Order Now
            </a>
          </motion.div>
        </nav>

        <main>

          {/* ════════════════════════════════════════════════════════════════════
              SECTION 1 · HERO
          ════════════════════════════════════════════════════════════════════ */}
          <section className="relative h-[160vh] flex flex-col items-center justify-start pt-[28vh] overflow-hidden">

            {/* Parallax ambient blob */}
            <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ y: heroBgY }}>
              <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-logoGreen/10 blur-[160px]" />
            </motion.div>

            {/* Hero text layers */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-10">
              <motion.h2
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 0.18, scale: 1 }}
                transition={{ duration: 2, ease: 'easeOut' }}
                style={{ y: heroTextY }}
                className="text-[18vw] leading-none font-black uppercase tracking-tighter text-stroke mix-blend-overlay select-none"
              >
                Authentic
              </motion.h2>
            </div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-full text-center pointer-events-none z-50">
              <motion.h2
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 0.88, scale: 1 }}
                transition={{ duration: 2, ease: 'easeOut', delay: 0.08 }}
                style={{ y: useTransform(heroTextY, v => v * 0.6) }}
                className="text-[18vw] leading-none font-black uppercase tracking-tighter mix-blend-screen select-none drop-shadow-[0_20px_60px_rgba(255,255,255,0.08)]"
              >
                Authentic
              </motion.h2>
            </div>

            {/* Hero metadata bottom */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
              style={{ opacity: heroOpacity }}
              className="relative z-50 w-full max-w-7xl mx-auto px-6 md:px-12 mt-auto mb-[18vh] grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { label: "Location", value: "Ghatlodiya, Ahmedabad" },
                { label: "Opening", value: "11 AM – 11 PM" },
                { label: "Specialty", value: "South Indian Cuisine" },
                { label: "Rating", value: "4.8 ★  (537 reviews)" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.1 }}>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gray-600 mb-1.5">{item.label}</p>
                  <p className="text-sm font-light text-gray-300">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{ opacity: heroOpacity }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 text-[10px] tracking-[0.25em] uppercase text-gray-600"
            >
              Scroll
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown size={14} className="text-logoLightGreen" />
              </motion.div>
            </motion.div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              SECTION 2 · STORY — THE ART OF CRISPNESS
          ════════════════════════════════════════════════════════════════════ */}
          <section id="story" className="relative min-h-screen py-32 flex items-center section-gradient-1">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-12 gap-16">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                className="md:col-span-6"
              >
                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
                  <span className="w-8 h-[1px] bg-logoLightGreen" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-logoLightGreen font-semibold">The Institution</span>
                </motion.div>

                <div className="line-wrapper mb-4">
                  <motion.h3 variants={lineReveal} className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight">
                    The fine art
                  </motion.h3>
                </div>
                <div className="line-wrapper mb-12">
                  <motion.h3 variants={lineReveal} className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight italic text-logoLightGreen">
                    of crispness.
                  </motion.h3>
                </div>

                <div className="space-y-6 max-w-md">
                  {[
                    "Fermented to perfection, our batter hits a screaming-hot cast iron, spreading into an impossibly thin golden canvas.",
                    "Our proprietary Gotala blend makes each bite explode with genuine South Indian flavour. No shortcuts. Pure artisan precision.",
                  ].map((line, i) => (
                    <motion.p
                      key={i}
                      variants={{ hidden: { opacity: 0, filter: 'blur(8px)', y: 12 }, show: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.9, delay: 0.6 + i * 0.2, ease: 'easeOut' } } }}
                      className="text-gray-400 font-light text-lg leading-relaxed"
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
              </motion.div>

              {/* Right column stats */}
              <div className="md:col-span-5 md:col-start-8 flex flex-col justify-center gap-6">
                {[
                  { n: "100%", label: "Freshly ground batter daily" },
                  { n: "Pure", label: "Farm-grade coconut & ghee" },
                  { n: "0", label: "Preservatives or artificial colour" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="glass rounded-2xl p-7 impact-card hover:bg-white/[0.05] transition-all duration-500"
                  >
                    <span className="text-3xl font-bold text-gradient-green block mb-1">{s.n}</span>
                    <span className="text-sm text-gray-400 font-light">{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* TECH MARQUEE STRIP */}
          <div className="relative py-6 border-y border-white/[0.06] overflow-hidden bg-white/[0.01]">
            <div className="marquee-track">
              {[...TECH_STACK, ...TECH_STACK].map((t, i) => (
                <span key={i} className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/30 font-medium whitespace-nowrap">
                  <span>{t.icon}</span> {t.name}
                  <span className="ml-6 text-logoGreen/30">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════════
              SECTION 3 · MENU
          ════════════════════════════════════════════════════════════════════ */}
          <section id="menu" className="relative min-h-[180vh] pt-32 pb-24 section-gradient-2">
            <div ref={menuRef} className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12">

              {/* Placeholder column for floating dosa */}
              <div className="hidden md:block md:col-span-5" />

              <div className="md:col-span-6 md:col-start-7">
                <motion.div
                  variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
                  className="mb-16"
                >
                  <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-[1px] bg-logoLightGreen" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-logoLightGreen font-semibold">Signature Menu</span>
                  </motion.div>
                  <div className="line-wrapper">
                    <motion.h3 variants={lineReveal} className="text-5xl md:text-6xl font-light tracking-tight">
                      Curated <span className="italic text-white/40">plates.</span>
                    </motion.h3>
                  </div>
                </motion.div>

                <div className="flex flex-col w-full">
                  {MENU_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-5%' }}
                      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                      onHoverStart={() => setHoveredMenu(item.id)}
                      onHoverEnd={() => setHoveredMenu(null)}
                      className="group border-b border-white/[0.08] relative overflow-hidden cursor-pointer"
                    >
                      {/* Expanding bg */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-logoGreen/[0.04] to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: hoveredMenu === item.id ? 1 : 0 }}
                        style={{ originX: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />

                      <div className="relative z-10 py-8 px-4 flex justify-between items-center gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl md:text-2xl font-light tracking-wide group-hover:text-logoLightGreen transition-colors duration-500">{item.name}</h4>
                            {item.tag && (
                              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] uppercase bg-logoGreen/15 text-logoLightGreen rounded-full border border-logoGreen/20">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>

                        <div className="flex items-center gap-5 shrink-0">
                          <motion.span
                            animate={{ y: hoveredMenu === item.id ? -3 : 0, color: hoveredMenu === item.id ? '#85B638' : 'rgba(255,255,255,0.6)' }}
                            transition={{ duration: 0.3 }}
                            className="text-xl font-light"
                          >
                            {item.price}
                          </motion.span>
                          <motion.div
                            animate={{
                              backgroundColor: hoveredMenu === item.id ? '#85B638' : 'transparent',
                              borderColor: hoveredMenu === item.id ? '#85B638' : 'rgba(255,255,255,0.2)',
                            }}
                            className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-400"
                          >
                            <motion.div animate={{ rotate: hoveredMenu === item.id ? -45 : 0 }} transition={{ duration: 0.3 }}>
                              <MoveRight size={14} className={hoveredMenu === item.id ? 'text-black' : 'text-white/40'} />
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  className="text-xs text-gray-600 mt-8 px-4 tracking-wide"
                >
                  All dosas served with signature chutney & sambhar · Timings: 11 AM – 11 PM
                </motion.p>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              SECTION 4 · CASE STUDY
          ════════════════════════════════════════════════════════════════════ */}
          <section id="case-study" className="relative py-32 overflow-hidden border-t border-white/[0.06]">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

              <motion.div
                variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="mb-20"
              >
                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-[1px] bg-logoLightGreen" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-logoLightGreen font-semibold">Portfolio Case Study</span>
                </motion.div>
                <div className="line-wrapper mb-3">
                  <motion.h3 variants={lineReveal} className="text-5xl md:text-7xl font-light tracking-tight">
                    Behind the
                  </motion.h3>
                </div>
                <div className="line-wrapper">
                  <motion.h3 variants={lineReveal} className="text-5xl md:text-7xl font-light tracking-tight italic text-logoLightGreen">
                    experience.
                  </motion.h3>
                </div>
              </motion.div>

              {/* Case study 4-grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {CASE_STUDY.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={scaleIn}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: i * 0.1 }}
                    className={`impact-card rounded-3xl p-8 glass group hover:-translate-y-1.5 transition-transform duration-500 bg-gradient-to-br ${item.color}`}
                  >
                    <div className={`inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase border px-3 py-1 rounded-full mb-6 ${item.accent}`}>
                      <span>{item.icon}</span> {item.label}
                    </div>
                    <h4 className="text-2xl font-semibold mb-4 tracking-tight">{item.title}</h4>
                    <p className="text-gray-400 font-light leading-relaxed text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
                {STATS.map((s, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="glass rounded-2xl p-6 text-center impact-card hover:bg-white/[0.05] transition-all duration-500"
                  >
                    <div className="text-4xl font-bold text-gradient-green mb-2 stat-number">
                      {s.value}<span className="text-2xl ml-1">{s.suffix}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 tracking-[0.15em] uppercase">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              SECTION 5 · TECH STACK
          ════════════════════════════════════════════════════════════════════ */}
          <section className="relative py-24 border-t border-white/[0.06] section-gradient-1">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <motion.div
                variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="mb-14"
              >
                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                  <Code2 size={14} className="text-logoLightGreen" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-logoLightGreen font-semibold">Built With</span>
                </motion.div>
                <div className="line-wrapper">
                  <motion.h3 variants={lineReveal} className="text-4xl md:text-5xl font-light tracking-tight">
                    Technology <span className="italic text-white/40">stack.</span>
                  </motion.h3>
                </div>
              </motion.div>

              <motion.div
                variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="flex flex-wrap gap-3"
              >
                {TECH_STACK.map((t, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: i * 0.06 } } }}
                    className="tech-pill glass rounded-full px-5 py-3 text-sm font-medium text-gray-300 border border-white/10 flex items-center gap-2 cursor-default"
                  >
                    <span className="text-base">{t.icon}</span> {t.name}
                  </motion.div>
                ))}
              </motion.div>

              {/* Experience highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
                {[
                  { icon: <Zap size={22} className="text-logoLightGreen" />, title: "Physics Animations", desc: "Lenis smooth scroll + Framer Motion spring physics. Every interaction feels tactile and alive, not robotic." },
                  { icon: <Layers size={22} className="text-logoLightGreen" />, title: "Layered Visual Depth", desc: "Film grain, ambient spotlights, parallax blobs, and a scroll-driven floating dosa that lands on a plate." },
                  { icon: <Globe size={22} className="text-logoLightGreen" />, title: "Globally Deployed", desc: "CI/CD via GitHub Actions. Automated build + deploy pipeline on every push to main. Zero downtime." },
                  { icon: <BarChart3 size={22} className="text-logoLightGreen" />, title: "Performance First", desc: "Lazy loading, mix-blend CSS compositing, and GPU-only transforms ensure 60fps on every device." },
                  { icon: <Users size={22} className="text-logoLightGreen" />, title: "Mobile Optimised", desc: "Touch-friendly animations, responsive grids from 320px, and light-mode mouse effects disabled on mobile." },
                  { icon: <Code2 size={22} className="text-logoLightGreen" />, title: "Type-Safe Codebase", desc: "Full TypeScript with strict mode. No any-casts. Clean component separation and reusable motion variants." },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl p-7 impact-card group hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="mb-5">{card.icon}</div>
                    <h4 className="font-semibold text-base mb-2 group-hover:text-logoLightGreen transition-colors duration-300">{card.title}</h4>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">{card.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              SECTION 6 · TESTIMONIAL
          ════════════════════════════════════════════════════════════════════ */}
          <section className="relative py-32 border-t border-white/[0.06] overflow-hidden section-gradient-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10"
              >
                <div className="text-[8rem] leading-none text-white/[0.04] font-serif select-none mb-4 -mt-8">"</div>
                <p className="text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed tracking-tight text-gray-200 mb-12">
                  {TESTIMONIALS[activeTestimonial].text}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5].map(i => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="w-1.5 h-1.5 rounded-full bg-logoLightGreen"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-500 tracking-[0.2em] uppercase">{TESTIMONIALS[activeTestimonial].author}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Info strip overlay */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="max-w-7xl mx-auto px-6 md:px-12 mt-20 grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {[
                { icon: <MapPin size={16} />, label: "Find Us", value: "Sayona Circle, Ghatlodiya, Ahmedabad" },
                { icon: <Clock size={16} />, label: "Hours", value: "Every Day · 11 AM – 11 PM" },
                { icon: <Star size={16} />, label: "Reviews", value: "4.8 ★ across 537 Google Reviews" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="show"
                  viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}
                  className="glass rounded-2xl p-6 flex items-start gap-4 impact-card hover:bg-white/[0.05] transition-all duration-500"
                >
                  <div className="text-logoLightGreen mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gray-600 mb-1">{item.label}</p>
                    <p className="text-sm text-gray-300">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              SECTION 7 · CTA — WORK WITH ME
          ════════════════════════════════════════════════════════════════════ */}
          <section id="contact" className="relative py-40 border-t border-white/[0.06] overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-logoGreen/[0.06] blur-[180px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto px-6 md:px-12 text-center relative z-10">
              <motion.div
                variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              >
                <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-8">
                  <span className="w-8 h-[1px] bg-logoLightGreen" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-logoLightGreen font-semibold">Freelance Developer</span>
                  <span className="w-8 h-[1px] bg-logoLightGreen" />
                </motion.div>

                <div className="line-wrapper mb-3">
                  <motion.h3 variants={lineReveal} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
                    Let's build
                  </motion.h3>
                </div>
                <div className="line-wrapper mb-12">
                  <motion.h3 variants={lineReveal} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gradient-green">
                    something great.
                  </motion.h3>
                </div>

                <motion.p
                  variants={fadeUp}
                  className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-14"
                >
                  I design and develop premium interactive websites like this one — for restaurants, brands, and startups that refuse to be ordinary. Fast delivery, pixel-perfect results.
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="mailto:hello@example.com"
                    className="px-10 py-5 rounded-2xl bg-logoGreen text-white font-bold tracking-[0.15em] uppercase text-sm cta-glow hover:bg-logoLightGreen transition-colors duration-400 flex items-center gap-3 group"
                  >
                    Work With Me
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="tel:09227128797"
                    className="px-10 py-5 rounded-2xl glass border border-white/10 hover:border-logoGreen/40 text-white font-medium tracking-[0.1em] text-sm transition-all duration-400 glow-btn flex items-center gap-3"
                  >
                    <Phone size={16} className="text-logoLightGreen" />
                    09227128797
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════════
              FOOTER
          ════════════════════════════════════════════════════════════════════ */}
          <footer className="relative border-t border-white/[0.06] py-12 px-6 md:px-12">
            <motion.div
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-logoGreen/40 to-transparent origin-left"
            />

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                    <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="Logo" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                  <span className="text-sm font-semibold tracking-[0.2em] uppercase">Pancham Dosa</span>
                </div>
                <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
                  The Flavours of South. Sayona Circle, Ghatlodiya, Ahmedabad.
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="flex gap-3">
                  {[
                    { icon: <Instagram size={15} />, label: 'Instagram' },
                    { icon: <Facebook size={15} />, label: 'Facebook' },
                    { icon: <Phone size={15} />, label: 'Call' },
                  ].map((s, i) => (
                    <a
                      key={i}
                      href="#"
                      aria-label={s.label}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/10 hover:bg-logoGreen hover:border-logoGreen text-white/50 hover:text-white transition-all duration-300"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
                <p className="text-[10px] text-gray-700 tracking-[0.15em] uppercase">
                  © {new Date().getFullYear()} Pancham Dosa. All rights reserved.
                </p>
              </div>
            </div>
          </footer>

        </main>
      </div>
    </ReactLenis>
  )
}
