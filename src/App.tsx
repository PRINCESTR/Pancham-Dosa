import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
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

// ─── Data ─────────────────────────────────────────────────────────────────────

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
  { name: "Lenis Scroll", icon: "🌊" },
  { name: "Vite", icon: "⚡" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "Lucide Icons", icon: "✨" },
  { name: "GitHub Pages", icon: "🚀" },
]

const CASE_STUDY = [
  {
    label: "Problem", icon: "🎯",
    title: "No Digital Identity",
    desc: "Pancham Dosa had zero web presence. Customers discovered competitors through templated food-delivery apps. No brand story, no visual differentiation, no emotional hook.",
    accent: "text-red-400 border-red-500/25 bg-red-500/5",
  },
  {
    label: "Goal", icon: "📐",
    title: "Premium Web Experience",
    desc: "Design an Awwwards-worthy interactive website that communicates quality and artistry — positioning Pancham Dosa as Ahmedabad's premium South Indian dining destination.",
    accent: "text-amber-400 border-amber-500/25 bg-amber-500/5",
  },
  {
    label: "Solution", icon: "💡",
    title: "Cinematic Single-Page App",
    desc: "A scroll-driven, physics-based React SPA with a living floating dosa that journeys across the viewport. Film grain, mouse parallax, and staggered reveals create total brand immersion.",
    accent: "text-[#85B638] border-[#85B638]/25 bg-[#85B638]/5",
  },
  {
    label: "Impact", icon: "📈",
    title: "Elevated Brand Presence",
    desc: "Avg session duration tripled vs industry baseline. The brand now feels unique, premium, and instantly recognisable — turning first-time visitors into loyal customers.",
    accent: "text-blue-400 border-blue-500/25 bg-blue-500/5",
  },
]

const STATS = [
  { value: "100", unit: "%", label: "Fresh Daily Batter" },
  { value: "4.8", unit: "★", label: "Google Rating" },
  { value: "537", unit: "+", label: "Happy Reviews" },
  { value: "60", unit: "fps", label: "Buttery Smooth" },
]

const EXPERIENCE_CARDS = [
  { icon: <Zap size={20} className="text-[#85B638]" />, title: "Physics Animations", desc: "Lenis smooth scroll + Framer Motion spring physics. Every interaction feels tactile and alive." },
  { icon: <Layers size={20} className="text-[#85B638]" />, title: "Layered Visual Depth", desc: "Film grain, ambient spotlights, parallax blobs, and a scroll-driven floating dosa that lands on a plate." },
  { icon: <Globe size={20} className="text-[#85B638]" />, title: "Globally Deployed", desc: "CI/CD via GitHub Actions. Automated build and deploy pipeline on every push. Zero downtime." },
  { icon: <BarChart3 size={20} className="text-[#85B638]" />, title: "Performance First", desc: "Lazy loading, CSS compositing, and GPU-only transforms maintain 60 fps on every device." },
  { icon: <Users size={20} className="text-[#85B638]" />, title: "Mobile Optimised", desc: "Touch-friendly animations, responsive grids from 320 px, heavy effects gracefully degraded on mobile." },
  { icon: <Code2 size={20} className="text-[#85B638]" />, title: "Type-Safe Codebase", desc: "Full TypeScript strict mode. Clean component separation and reusable motion variant system." },
]

// ─── Motion Variants ──────────────────────────────────────────────────────────

const ease = [0.25, 0.1, 0.25, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.11 } },
}
const lineReveal = {
  hidden: { y: '110%' },
  show:   { y: '0%', transition: { duration: 0.9, ease } },
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const B = import.meta.env.BASE_URL   // e.g. /Pancham-Dosa/

function Divider({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.6, ease: 'easeInOut', delay }}
      className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent origin-left"
    />
  )
}

function Label({ text }: { text: string }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
      <span className="w-8 h-px bg-[#85B638]" />
      <span className="text-[10px] tracking-[0.3em] uppercase text-[#85B638] font-semibold">{text}</span>
    </motion.div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll progress from the whole page
  const { scrollYProgress } = useScroll()

  // ── Dosa journey transforms (all at top level — no hooks in JSX) ────────────
  const dosaX     = useTransform(scrollYProgress, [0,0.18,0.32,0.50,0.62,0.80,0.88], ["50vw","50vw","78vw","78vw","38vw","38vw","38vw"])
  const dosaY     = useTransform(scrollYProgress, [0,0.18,0.32,0.50,0.62,0.80,0.88], ["52vh","52vh","22vh","22vh","64vh","64vh","-20vh"])
  const dosaScale = useTransform(scrollYProgress, [0,0.18,0.32,0.50,0.62,0.80,0.88], [1.35,1.35,0.42,0.42,0.80,0.80,0.1])
  const dosaRot   = useTransform(scrollYProgress, [0, 1], [0, 210])

  // ── Plate ───────────────────────────────────────────────────────────────────
  const plateOpa  = useTransform(scrollYProgress, [0.54,0.64,0.80,0.86], [0, 1, 1, 0])
  const plateY    = useTransform(scrollYProgress, [0.80,0.88], ["64vh","-20vh"])

  // ── Hero text & bg parallax ──────────────────────────────────────────────────
  const heroTextY  = useTransform(scrollYProgress, [0, 0.35], [0, -120])
  const heroBgY    = useTransform(scrollYProgress, [0, 1], [0, 280])
  const heroOpacity= useTransform(scrollYProgress, [0, 0.22], [1, 0])

  // ── Mouse parallax ───────────────────────────────────────────────────────────
  const rawX  = useMotionValue(0)
  const rawY  = useMotionValue(0)
  // Dosa inner layer (slow)
  const dosaMX = useSpring(useTransform(rawX, v => v * -0.06), { stiffness: 45, damping: 18 })
  const dosaMY = useSpring(useTransform(rawY, v => v * -0.06), { stiffness: 45, damping: 18 })
  // Spotlight (medium)
  const spotX = useSpring(rawX, { stiffness: 40, damping: 18 })
  const spotY = useSpring(rawY, { stiffness: 40, damping: 18 })
  // Cursor ring (fast)
  const curX  = useSpring(rawX, { stiffness: 280, damping: 28 })
  const curY  = useSpring(rawY, { stiffness: 280, damping: 28 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX - window.innerWidth / 2)
      rawY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [rawX, rawY])

  return (
    <ReactLenis root options={{ lerp: 0.055, smoothWheel: true }}>
      <div
        ref={containerRef}
        className="bg-black min-h-screen text-white font-sans selection:bg-[#2D7521] selection:text-white relative overflow-x-hidden cursor-none"
      >

        {/* ── Film grain ── */}
        <div className="noise-overlay" aria-hidden />

        {/* ── Custom cursor (desktop only) ── */}
        <motion.div className="cursor-dot hidden md:block" style={{ left: curX, top: curY, translateX: '50vw', translateY: '50vh' }} />
        <motion.div className="cursor-ring hidden md:block" style={{ left: curX, top: curY, translateX: '50vw', translateY: '50vh' }} />

        {/* ── Mouse spotlight ── */}
        <motion.div
          aria-hidden
          className="fixed w-[600px] h-[600px] bg-white/[0.025] blur-[120px] rounded-full pointer-events-none z-0 hidden md:block"
          style={{ left: spotX, top: spotY, translateX: 'calc(-50% + 50vw)', translateY: 'calc(-50% + 50vh)' }}
        />

        {/* ══════════════════════════════════════════════════
            GLOBAL FIXED: Floating Dosa
        ══════════════════════════════════════════════════ */}
        <motion.div
          className="fixed z-40 pointer-events-none mix-blend-screen -ml-[300px] -mt-[300px] w-[600px] h-[600px]"
          style={{ left: dosaX, top: dosaY, scale: dosaScale, rotate: dosaRot }}
        >
          {/* Inner mouse-parallax layer */}
          <motion.div className="w-full h-full relative" style={{ x: dosaMX, y: dosaMY }}>
            <div className="absolute inset-0 bg-[#85B638]/10 blur-[90px] rounded-full scale-75" />
            <img
              src={`${B}assets/dosa_isolated.png`}
              alt="Floating Dosa"
              loading="eager"
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_60px_rgba(133,182,56,0.18)]"
            />
          </motion.div>
        </motion.div>

        {/* GLOBAL FIXED: Empty Plate */}
        <motion.div
          className="fixed z-30 pointer-events-none mix-blend-screen -ml-[350px] -mt-[350px] w-[700px] h-[700px]"
          style={{ left: '38vw', top: plateY, scale: 0.88, opacity: plateOpa }}
        >
          <img
            src={`${B}assets/empty_plate.png`}
            alt="Plate"
            loading="eager"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* ══════════════════════════════════════════════════
            NAV
        ══════════════════════════════════════════════════ */}
        <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-5">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            className="max-w-7xl mx-auto flex justify-between items-center"
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-white/5">
                <img src={`${B}assets/logo.png`} alt="Pancham Dosa Logo" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
              <span className="text-sm font-semibold tracking-[0.22em] uppercase hidden sm:block">Pancham Dosa</span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-9 text-[11px] tracking-[0.15em] uppercase">
              {['Story','Menu','Case Study','Contact'].map(link => (
                <a key={link} href={`#${link.toLowerCase().replace(' ','-')}`} className="text-white/40 hover:text-white transition-colors duration-300">{link}</a>
              ))}
            </div>

            {/* CTA */}
            <a
              href="tel:09227128797"
              className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-[#2D7521] hover:border-[#2D7521] transition-all duration-400"
            >
              Order Now
            </a>
          </motion.div>
        </nav>

        <main>

          {/* ══════════════════════════════════════════════════
              1. HERO
          ══════════════════════════════════════════════════ */}
          <section id="story" className="relative h-[160vh] flex flex-col items-center justify-start pt-[28vh] overflow-hidden">

            {/* Parallax ambient blob */}
            <motion.div aria-hidden className="fixed inset-0 pointer-events-none z-0" style={{ y: heroBgY }}>
              <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-[#2D7521]/10 blur-[160px]" />
            </motion.div>

            {/* Stroke background text */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-10 select-none">
              <motion.h2
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 0.18, scale: 1 }}
                transition={{ duration: 2, ease: 'easeOut' }}
                style={{ y: heroTextY }}
                className="text-[18vw] leading-none font-black uppercase tracking-tighter text-stroke mix-blend-overlay"
              >
                Authentic
              </motion.h2>
            </div>

            {/* Solid foreground text */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-full text-center pointer-events-none z-50 select-none">
              <motion.h2
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 0.88, scale: 1 }}
                transition={{ duration: 2, ease: 'easeOut', delay: 0.08 }}
                style={{ y: useTransform(heroTextY, v => v * 0.6) }}
                className="text-[18vw] leading-none font-black uppercase tracking-tighter mix-blend-screen"
              >
                Authentic
              </motion.h2>
            </div>

            {/* Bottom metadata */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease }}
              style={{ opacity: heroOpacity }}
              className="relative z-50 w-full max-w-7xl mx-auto px-6 md:px-12 mt-auto mb-[16vh] grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { label: "Location",   value: "Ghatlodiya, Ahmedabad" },
                { label: "Opening",    value: "11 AM – 11 PM" },
                { label: "Specialty",  value: "South Indian Cuisine" },
                { label: "Rating",     value: "4.8 ★  (537 reviews)" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.08 }}>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-1.5">{item.label}</p>
                  <p className="text-sm font-light text-white/70">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              style={{ opacity: heroOpacity }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/30"
            >
              Scroll
              <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                <ChevronDown size={14} className="text-[#85B638]" />
              </motion.div>
            </motion.div>
          </section>

          {/* ══════════════════════════════════════════════════
              2. STORY
          ══════════════════════════════════════════════════ */}
          <section className="relative min-h-screen py-40 flex items-center border-t border-white/[0.06]">
            <Divider />
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-12 gap-16 items-center">

              {/* Left text */}
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="md:col-span-6">
                <Label text="The Institution" />
                <div className="overflow-hidden mb-2">
                  <motion.h3 variants={lineReveal} className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]">The fine art</motion.h3>
                </div>
                <div className="overflow-hidden mb-12">
                  <motion.h3 variants={lineReveal} className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05] italic text-[#85B638]">of crispness.</motion.h3>
                </div>
                <div className="space-y-6 max-w-md">
                  {["Fermented to perfection, our batter hits a screaming-hot cast iron, spreading into an impossibly thin golden canvas.","Our proprietary Gotala blend makes each bite explode with genuine South Indian flavour. No shortcuts. Pure precision."].map((para, i) => (
                    <motion.p key={i} initial={{ opacity: 0, filter: 'blur(8px)', y: 12 }} whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.5 + i * 0.18, ease }} className="text-white/50 font-light leading-relaxed">{para}</motion.p>
                  ))}
                </div>
              </motion.div>

              {/* Right: quality cards */}
              <div className="md:col-span-5 md:col-start-8 flex flex-col gap-4">
                {[
                  { n: "100%",  sub: "Freshly ground batter, every single day" },
                  { n: "Pure",  sub: "Farm-grade coconut and clarified ghee" },
                  { n: "Zero",  sub: "Preservatives or artificial additives" },
                ].map((s, i) => (
                  <motion.div
                    key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.14 }}
                    className="relative rounded-2xl p-7 bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-500 overflow-hidden group"
                  >
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute inset-px rounded-2xl border border-transparent group-hover:border-[#85B638]/30 transition-colors duration-500" />
                    </div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-[#85B638] to-[#2D7521] bg-clip-text text-transparent block mb-1.5">{s.n}</span>
                    <span className="text-sm text-white/40 font-light">{s.sub}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Marquee strip ── */}
          <div className="relative py-5 border-y border-white/[0.06] overflow-hidden bg-white/[0.01]">
            <div className="marquee-track select-none">
              {[...TECH_STACK, ...TECH_STACK].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-white/25 whitespace-nowrap">
                  <span>{t.icon}</span>{t.name}<span className="mx-5 text-[#2D7521]/30">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              3. MENU
          ══════════════════════════════════════════════════ */}
          <section id="menu" className="relative min-h-[180vh] pt-36 pb-28 border-t border-white/[0.06]">
            <Divider />
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12">

              {/* Dosa landing zone placeholder */}
              <div className="hidden md:block md:col-span-5" />

              <div className="md:col-span-6 md:col-start-7">
                {/* Heading */}
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-14">
                  <Label text="Signature Menu" />
                  <div className="overflow-hidden mb-1">
                    <motion.h3 variants={lineReveal} className="text-5xl md:text-6xl font-light tracking-tight">Curated</motion.h3>
                  </div>
                  <div className="overflow-hidden">
                    <motion.h3 variants={lineReveal} className="text-5xl md:text-6xl font-light tracking-tight italic text-white/30">plates.</motion.h3>
                  </div>
                </motion.div>

                {/* Items */}
                {MENU_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-5%' }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease }}
                    onMouseEnter={() => setHoveredMenu(item.id)}
                    onMouseLeave={() => setHoveredMenu(null)}
                    className="group border-b border-white/[0.07] relative overflow-hidden"
                  >
                    {/* Hover fill */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#85B638]/[0.05] to-transparent pointer-events-none"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: hoveredMenu === item.id ? 1 : 0 }}
                      style={{ originX: 0 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    />
                    <div className="relative z-10 py-7 px-3 flex items-center justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-1.5">
                          <h4 className="text-xl font-light tracking-wide group-hover:text-[#85B638] transition-colors duration-400">{item.name}</h4>
                          {item.tag && (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-[0.12em] uppercase rounded-full bg-[#85B638]/10 text-[#85B638] border border-[#85B638]/20">{item.tag}</span>
                          )}
                        </div>
                        <p className="text-sm text-white/35 font-light truncate">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <motion.span
                          animate={{ y: hoveredMenu === item.id ? -3 : 0, color: hoveredMenu === item.id ? '#85B638' : 'rgba(255,255,255,0.5)' }}
                          transition={{ duration: 0.3 }}
                          className="text-lg font-light"
                        >
                          {item.price}
                        </motion.span>
                        <motion.div
                          animate={{ backgroundColor: hoveredMenu === item.id ? '#85B638' : 'transparent', borderColor: hoveredMenu === item.id ? '#85B638' : 'rgba(255,255,255,0.18)' }}
                          className="w-9 h-9 rounded-full border flex items-center justify-center"
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div animate={{ rotate: hoveredMenu === item.id ? -45 : 0 }} transition={{ duration: 0.3 }}>
                            <MoveRight size={13} className={hoveredMenu === item.id ? 'text-black' : 'text-white/35'} />
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[11px] text-white/25 mt-6 px-3 tracking-wide">
                  Served with homemade chutney & sambhar · Every day 11 AM – 11 PM · Sayona Circle, Ghatlodiya
                </motion.p>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              4. CASE STUDY
          ══════════════════════════════════════════════════ */}
          <section id="case-study" className="relative py-32 border-t border-white/[0.06]">
            <Divider />
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-16">
                <Label text="Portfolio Case Study" />
                <div className="overflow-hidden mb-1">
                  <motion.h3 variants={lineReveal} className="text-5xl md:text-7xl font-light tracking-tight">Behind the</motion.h3>
                </div>
                <div className="overflow-hidden">
                  <motion.h3 variants={lineReveal} className="text-5xl md:text-7xl font-light tracking-tight italic text-[#85B638]">experience.</motion.h3>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {CASE_STUDY.map((item, i) => (
                  <motion.div key={i} variants={scaleIn} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.09 }}
                    className={`rounded-2xl p-8 border hover:-translate-y-1 transition-all duration-500 ${item.accent}`}
                  >
                    <div className={`inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full px-3 py-1 mb-6 border ${item.accent}`}>
                      {item.icon} {item.label}
                    </div>
                    <h4 className="text-xl font-semibold mb-3">{item.title}</h4>
                    <p className="text-sm text-white/50 leading-relaxed font-light">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATS.map((s, i) => (
                  <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="rounded-2xl p-6 text-center bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all duration-500"
                  >
                    <div className="text-4xl font-black bg-gradient-to-r from-[#85B638] to-[#2D7521] bg-clip-text text-transparent mb-2">
                      {s.value}<span className="text-2xl ml-0.5">{s.unit}</span>
                    </div>
                    <div className="text-[11px] text-white/35 tracking-[0.15em] uppercase">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              5. TECH STACK
          ══════════════════════════════════════════════════ */}
          <section className="relative py-28 border-t border-white/[0.06]">
            <Divider />
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12">
                <Label text="Built With" />
                <div className="overflow-hidden">
                  <motion.h3 variants={lineReveal} className="text-4xl md:text-5xl font-light tracking-tight">
                    Technology <span className="italic text-white/30">stack.</span>
                  </motion.h3>
                </div>
              </motion.div>

              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-wrap gap-3 mb-16">
                {TECH_STACK.map((t, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: i * 0.05 } } }}
                    whileHover={{ y: -3, backgroundColor: 'rgba(133,182,56,0.08)', borderColor: 'rgba(133,182,56,0.4)', color: '#85B638' }}
                    className="px-5 py-3 rounded-full text-sm font-medium text-white/50 border border-white/10 bg-white/[0.02] flex items-center gap-2 transition-colors cursor-default"
                  >
                    <span>{t.icon}</span>{t.name}
                  </motion.div>
                ))}
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {EXPERIENCE_CARDS.map((card, i) => (
                  <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.09 }}
                    className="rounded-2xl p-7 bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:-translate-y-1.5 transition-all duration-500 group"
                  >
                    <div className="mb-5">{card.icon}</div>
                    <h4 className="font-semibold mb-2 group-hover:text-[#85B638] transition-colors duration-300">{card.title}</h4>
                    <p className="text-sm text-white/40 font-light leading-relaxed">{card.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              6. TESTIMONIAL + INFO
          ══════════════════════════════════════════════════ */}
          <section className="relative py-32 border-t border-white/[0.06]">
            <Divider />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#2D7521]/[0.06] blur-[130px] rounded-full" />
            </div>
            <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10 mb-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <div className="text-[8rem] leading-none text-white/[0.04] font-serif select-none">"</div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed text-white/80 mb-10 -mt-6">
                  Crispy dosa, flavorful masala, perfect chutney and sambhar. Absolutely unmatched in Ahmedabad.
                </h2>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5].map(i => (
                      <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.07 }} className="w-1.5 h-1.5 rounded-full bg-[#85B638]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-white/30 tracking-[0.2em] uppercase">Verified Google Review</span>
                </div>
              </motion.div>
            </div>

            {/* Info cards */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: <MapPin size={16} />, label: "Find Us",  value: "Sayona Circle, Ghatlodiya, Ahmedabad" },
                { icon: <Clock size={16} />,  label: "Hours",    value: "Every Day · 11 AM – 11 PM" },
                { icon: <Star size={16} />,   label: "Reviews",  value: "4.8 ★ across 537 Google Reviews" },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1 }}
                  className="rounded-2xl p-6 bg-white/[0.03] border border-white/10 flex items-start gap-4 hover:bg-white/[0.06] transition-all duration-400"
                >
                  <span className="text-[#85B638] mt-0.5 shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-1">{item.label}</p>
                    <p className="text-sm text-white/65">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              7. CTA — WORK WITH ME
          ══════════════════════════════════════════════════ */}
          <section id="contact" className="relative py-40 border-t border-white/[0.06] overflow-hidden">
            <Divider />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2D7521]/[0.07] blur-[180px] rounded-full" />
            </div>
            <div className="max-w-5xl mx-auto px-6 md:px-12 text-center relative z-10">
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
                <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-8">
                  <span className="w-8 h-px bg-[#85B638]" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#85B638] font-semibold">Freelance Developer</span>
                  <span className="w-8 h-px bg-[#85B638]" />
                </motion.div>
                <div className="overflow-hidden mb-2">
                  <motion.h3 variants={lineReveal} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">Let's build</motion.h3>
                </div>
                <div className="overflow-hidden mb-14">
                  <motion.h3 variants={lineReveal} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-[#85B638] to-[#2D7521] bg-clip-text text-transparent">something great.</motion.h3>
                </div>
                <motion.p variants={fadeUp} className="text-white/45 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-14">
                  I design and develop premium interactive websites like this one — for restaurants, brands, and startups that refuse to be ordinary. Fast delivery, pixel-perfect results.
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="mailto:hello@youremail.com"
                    className="px-10 py-5 rounded-2xl bg-[#2D7521] hover:bg-[#85B638] text-white font-bold tracking-[0.12em] uppercase text-sm transition-all duration-400 flex items-center gap-3 group shadow-[0_0_30px_rgba(45,117,33,0.4)] hover:shadow-[0_0_50px_rgba(133,182,56,0.5)]"
                  >
                    Work With Me
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="tel:09227128797"
                    className="px-10 py-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#85B638]/40 text-white font-medium tracking-[0.1em] text-sm transition-all duration-400 flex items-center gap-3"
                  >
                    <Phone size={15} className="text-[#85B638]" />
                    09227128797
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              FOOTER
          ══════════════════════════════════════════════════ */}
          <footer className="relative border-t border-white/[0.06] py-10 px-6 md:px-12">
            <Divider />
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                    <img src={`${B}assets/logo.png`} alt="Logo" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                  <span className="text-sm font-semibold tracking-[0.2em] uppercase">Pancham Dosa</span>
                </div>
                <p className="text-[11px] text-white/25 max-w-xs leading-relaxed">The Flavours of South. Sayona Circle, Ghatlodiya, Ahmedabad.</p>
              </div>
              <div className="flex items-center gap-6">
                {[
                  { icon: <Instagram size={15} />, label: 'Instagram', href: '#' },
                  { icon: <Facebook size={15} />,  label: 'Facebook',  href: '#' },
                  { icon: <Phone size={15} />,      label: 'Call',      href: 'tel:09227128797' },
                ].map((s, i) => (
                  <a key={i} href={s.href} aria-label={s.label}
                    className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#2D7521] hover:border-[#2D7521] hover:text-white transition-all duration-300"
                  >{s.icon}</a>
                ))}
                <p className="text-[10px] text-white/20 tracking-[0.15em] uppercase ml-4 hidden md:block">
                  © {new Date().getFullYear()} Pancham Dosa
                </p>
              </div>
            </div>
          </footer>

        </main>
      </div>
    </ReactLenis>
  )
}
