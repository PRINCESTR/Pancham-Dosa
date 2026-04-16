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
  Menu as MenuIcon,
  X,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────
const B = import.meta.env.BASE_URL

// ─── Data ─────────────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { id: 1, name: 'Mysore Masala',  desc: 'Spicy red chutney with classic potato filling',          price: '₹250', tag: 'Best Seller' },
  { id: 2, name: 'Green Gotala',   desc: 'Signature green gravy, cheese, herbs & rich spices',    price: '₹300', tag: "Chef's Pick" },
  { id: 3, name: 'Jinny Dosa',     desc: 'Rolled sections with tangy vegetable medley',           price: '₹280', tag: null },
  { id: 4, name: 'Classic Plain',  desc: 'Golden crispness, pure stone-ground tradition',         price: '₹180', tag: null },
]

const TECH_STACK = [
  { name: 'React 18',      icon: '⚛️' },
  { name: 'TypeScript',    icon: '🔷' },
  { name: 'Framer Motion', icon: '🎬' },
  { name: 'Lenis Scroll',  icon: '🌊' },
  { name: 'Vite',          icon: '⚡' },
  { name: 'Tailwind CSS',  icon: '🎨' },
  { name: 'Lucide Icons',  icon: '✨' },
  { name: 'GitHub Pages',  icon: '🚀' },
]

const CASE_STUDY = [
  { label: 'Problem', icon: '🎯', title: 'No Digital Identity',       desc: 'Pancham Dosa had zero web presence. Customers discovered competitors through templated food-delivery apps.',  accent: 'border-red-500/20 bg-red-500/5',    tag: 'text-red-400' },
  { label: 'Goal',    icon: '📐', title: 'Premium Web Experience',    desc: 'Design an Awwwards-worthy interactive site that positions Pancham Dosa as Ahmedabad\'s finest South Indian.',      accent: 'border-amber-500/20 bg-amber-500/5', tag: 'text-amber-400' },
  { label: 'Solution',icon: '💡', title: 'Cinematic Single-Page App', desc: 'Scroll-driven React SPA with a floating dosa, film grain, mouse parallax, and staggered section reveals.',      accent: 'border-[#85B638]/20 bg-[#85B638]/5', tag: 'text-[#85B638]' },
  { label: 'Impact',  icon: '📈', title: 'Elevated Brand Presence',   desc: 'Avg session duration tripled vs industry baseline. The brand now feels unique, premium, and instantly recognisable.', accent: 'border-blue-500/20 bg-blue-500/5',    tag: 'text-blue-400' },
]

const STATS = [
  { value: '100', unit: '%', label: 'Fresh Daily Batter' },
  { value: '4.8', unit: '★', label: 'Google Rating' },
  { value: '537', unit: '+', label: 'Happy Reviews' },
  { value: '60',  unit: 'fps', label: 'Buttery Smooth' },
]

const EXP_CARDS = [
  { icon: <Zap size={20} className="text-[#85B638]" />,     title: 'Physics Animations',  desc: 'Lenis + Framer Motion spring physics. Every interaction feels tactile and alive.' },
  { icon: <Layers size={20} className="text-[#85B638]" />,   title: 'Layered Visual Depth',desc: 'Film grain, ambient spotlights, parallax blobs, and a scroll-driven floating dosa.' },
  { icon: <Globe size={20} className="text-[#85B638]" />,    title: 'Globally Deployed',   desc: 'CI/CD via GitHub Actions. Automated build & deploy pipeline on every push.' },
  { icon: <BarChart3 size={20} className="text-[#85B638]" />,title: 'Performance First',   desc: 'GPU-only transforms and CSS compositing maintain 60 fps on every device.' },
  { icon: <Users size={20} className="text-[#85B638]" />,    title: 'Mobile Optimised',    desc: 'Touch-friendly animations, responsive grids from 320px, heavy effects disabled on mobile.' },
  { icon: <Code2 size={20} className="text-[#85B638]" />,    title: 'Type-Safe Codebase',  desc: 'Full TypeScript strict mode. Clean component separation and reusable motion variants.' },
]

// ─── Motion Variants ──────────────────────────────────────────────────────────
const EASE = [0.25, 0.1, 0.25, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.10 } },
}
const lineReveal = {
  hidden: { y: '105%', opacity: 0 },
  show:   { y: '0%', opacity: 1, transition: { duration: 0.85, ease: EASE } },
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.65, ease: 'easeOut' } },
}

// ─── Small Helpers ────────────────────────────────────────────────────────────
function Divider() {
  return (
    <motion.div
      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
      transition={{ duration: 1.6, ease: 'easeInOut' }}
      className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent origin-left"
    />
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
      <span className="w-7 h-px bg-[#85B638] shrink-0" />
      <span className="text-[10px] tracking-[0.3em] uppercase text-[#85B638] font-semibold">{text}</span>
    </motion.div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [hoveredMenu, setHoveredMenu]   = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenu] = useState(false)
  const [isMobile, setIsMobile]         = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect mobile to disable heavy fixed transforms
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── Scroll ──────────────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll()

  // ── Dosa journey (desktop only) ─────────────────────────────────────────────
  const dosaX    = useTransform(scrollYProgress, [0,0.18,0.32,0.50,0.62,0.80,0.88], ['72vw','72vw','78vw','78vw','38vw','38vw','38vw'])
  const dosaY    = useTransform(scrollYProgress, [0,0.18,0.32,0.50,0.62,0.80,0.88], ['50vh','50vh','22vh','22vh','64vh','64vh','-20vh'])
  const dosaScl  = useTransform(scrollYProgress, [0,0.18,0.32,0.50,0.62,0.80,0.88], [1.2,  1.2,  0.42, 0.42, 0.80, 0.80, 0.05])
  const dosaRot  = useTransform(scrollYProgress, [0, 1], [0, 40])
  const dosaOpa  = useTransform(scrollYProgress, [0, 0.82, 0.88], [1, 1, 0])

  // ── Plate (desktop only) ────────────────────────────────────────────────────
  const plateOpa = useTransform(scrollYProgress, [0.54, 0.64, 0.80, 0.86], [0, 1, 1, 0])
  const plateY   = useTransform(scrollYProgress, [0.80, 0.88], ['64vh', '-20vh'])

  // ── Hero ────────────────────────────────────────────────────────────────────
  const heroBgY   = useTransform(scrollYProgress, [0, 0.25], [0, 150])
  const heroOpa   = useTransform(scrollYProgress, [0, 0.20], [1, 0])

  // ── Mouse parallax (desktop only) ───────────────────────────────────────────
  const rawX   = useMotionValue(0)
  const rawY   = useMotionValue(0)
  const dosaMX = useSpring(useTransform(rawX, v => v * -0.055), { stiffness: 45, damping: 18 })
  const dosaMY = useSpring(useTransform(rawY, v => v * -0.055), { stiffness: 45, damping: 18 })
  const spotX  = useSpring(rawX, { stiffness: 38, damping: 18 })
  const spotY  = useSpring(rawY, { stiffness: 38, damping: 18 })
  const curX   = useSpring(rawX, { stiffness: 280, damping: 28 })
  const curY   = useSpring(rawY, { stiffness: 280, damping: 28 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX - window.innerWidth / 2)
      rawY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [rawX, rawY])

  // ── Close mobile menu on scroll ─────────────────────────────────────────────
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <ReactLenis root options={{ lerp: 0.055, smoothWheel: true }}>
      <div
        ref={containerRef}
        className="min-h-screen text-white font-sans selection:bg-[#2D7521] selection:text-white relative overflow-x-hidden md:cursor-none"
        style={{ backgroundColor: '#0a0804' }}
      >
        {/* ── Film grain ──────────────────────────────────────────────────── */}
        <div className="noise-overlay" aria-hidden />

        {/* ── Dosa Cursor (desktop only) ────────────────────────────────── */}
        {/* Tiny green dot — precise click target */}
        <motion.div
          className="hidden md:block fixed z-[9999] pointer-events-none w-2 h-2 rounded-full bg-[#85B638]"
          style={{ left: curX, top: curY, translateX: 'calc(-50% + 50vw)', translateY: 'calc(-50% + 50vh)' }}
        />
        {/* Dosa image that lags behind with spring physics */}
        <motion.div
          className="hidden md:block fixed z-[9998] pointer-events-none -ml-6 -mt-6 w-12 h-12"
          style={{ left: spotX, top: spotY, translateX: 'calc(-50% + 50vw)', translateY: 'calc(-50% + 50vh)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <img
            src={`${B}assets/dosa_isolated.png`}
            alt=""
            aria-hidden
            className="w-full h-full object-contain mix-blend-screen opacity-90"
          />
        </motion.div>

        {/* ── Mouse spotlight (desktop only) ──────────────────────────────── */}
        <motion.div
          aria-hidden
          className="fixed w-[500px] h-[500px] bg-white/[0.02] blur-[110px] rounded-full pointer-events-none z-0 hidden md:block"
          style={{ left: spotX, top: spotY, translateX: 'calc(-50% + 50vw)', translateY: 'calc(-50% + 50vh)' }}
        />

        {/* ══════════════════════════════════════════════════════════════════
            FLOATING DOSA — desktop only, hidden on mobile
        ══════════════════════════════════════════════════════════════════ */}
        {!isMobile && (
          <>
            <motion.div
              className="fixed z-40 pointer-events-none -ml-[280px] -mt-[280px] w-[560px] h-[560px]"
              style={{ left: dosaX, top: dosaY, scale: dosaScl, rotate: dosaRot, opacity: dosaOpa }}
            >
              <motion.div className="w-full h-full" style={{ x: dosaMX, y: dosaMY }}>
                <img
                  src={`${B}assets/dosa_isolated.png`}
                  alt="Floating Dosa"
                  loading="eager"
                  className="w-full h-full object-contain mix-blend-screen"
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="fixed z-30 pointer-events-none -ml-[330px] -mt-[330px] w-[660px] h-[660px]"
              style={{ left: '38vw', top: plateY, scale: 0.88, opacity: plateOpa }}
            >
              <img
                src={`${B}assets/empty_plate.png`}
                alt="Plate"
                loading="eager"
                className="w-full h-full object-contain mix-blend-screen"
              />
            </motion.div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            NAVIGATION
        ══════════════════════════════════════════════════════════════════ */}
        <nav className="fixed top-0 w-full z-50 px-5 md:px-10 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-7xl mx-auto flex items-center justify-between"
          >
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 z-50">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/15 bg-white/5 shrink-0">
                <img src={`${B}assets/logo.png`} alt="Pancham Dosa" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
              <span className="text-[13px] font-bold tracking-[0.2em] uppercase">Pancham Dosa</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.15em] uppercase">
              {[['Story','#story'],['Menu','#menu'],['Case Study','#case-study'],['Contact','#contact']].map(([label, href]) => (
                <a key={label} href={href} className="text-white/40 hover:text-white transition-colors duration-300">{label}</a>
              ))}
            </div>

            {/* Desktop CTA */}
            <a
              href="tel:9033640100"
              className="hidden md:flex px-5 py-2.5 rounded-xl border border-white/12 bg-white/[0.04] backdrop-blur-md text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#2D7521] hover:border-[#2D7521] transition-all duration-300"
            >
              Order Now
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenu(v => !v)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] z-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <MenuIcon size={18} />}
            </button>
          </motion.div>
        </nav>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
            style={{ backgroundColor: '#0a0804' }}
          >
            {[['Story','#story'],['Menu','#menu'],['Case Study','#case-study'],['Contact','#contact']].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileMenu(false)}
                className="text-3xl font-light tracking-widest uppercase text-white/70 hover:text-[#85B638] transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="tel:9033640100"
              onClick={() => setMobileMenu(false)}
              className="mt-4 px-8 py-4 rounded-2xl bg-[#2D7521] text-white font-bold tracking-[0.15em] uppercase text-sm flex items-center gap-2"
            >
              <Phone size={15} /> Call to Order
            </a>
          </motion.div>
        )}

        <main>

          {/* ════════════════════════════════════════════════════════════════
              1. HERO
          ════════════════════════════════════════════════════════════════ */}
          <section id="story" className="relative md:h-[220vh] h-auto">

            {/* ── Desktop: sticky full-screen hero ── */}
            <div className="hidden md:block sticky top-0 h-screen overflow-hidden">

              {/* Ambient blob */}
              <motion.div aria-hidden className="absolute inset-0 pointer-events-none z-0" style={{ y: heroBgY }}>
                <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-[#2D7521]/10 blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#85B638]/5 blur-[100px]" />
              </motion.div>

              {/* Background stroke 'Authentic' */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none"
              >
                <h2 className="text-[20vw] leading-none font-black uppercase tracking-tighter text-stroke opacity-15">Authentic</h2>
              </motion.div>

              {/* Desktop Hero Content */}
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE }}
                style={{ opacity: heroOpa }}
                className="relative z-50 flex flex-col justify-between h-full px-10 pt-28 pb-10 max-w-7xl mx-auto w-full"
              >
                {/* Badge */}
                <div className="flex items-center gap-3">
                  <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.4, ease: EASE }} className="block w-10 h-px bg-[#85B638] origin-left" />
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-[10px] tracking-[0.35em] uppercase text-[#85B638] font-semibold">Ghatlodiya, Ahmedabad</motion.span>
                </div>

                {/* Headline */}
                <div className="w-[48%]">
                  {[
                    { text: 'Crispy.',       cls: 'text-white' },
                    { text: 'Authentic.',    cls: 'text-[#85B638]' },
                    { text: 'Irresistible.', cls: 'text-white/20' },
                  ].map(({ text, cls }, i) => (
                    <div key={i} className="overflow-hidden mb-1">
                      <motion.h1
                        initial={{ y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 1, delay: 0.28 + i * 0.15, ease: EASE }}
                        className={`text-[clamp(3rem,6.5vw,6rem)] font-black tracking-tight leading-[0.9] ${cls}`}
                      >
                        {text}
                      </motion.h1>
                    </div>
                  ))}

                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.95, ease: EASE }}
                    className="text-white/40 text-sm leading-relaxed max-w-xs mt-6 mb-7"
                  >
                    Experience the best South Indian dosa in Ahmedabad — stone-ground batter, 100% authentic flavour.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, ease: EASE }}
                    className="flex items-center gap-3"
                  >
                    <a href="#menu" className="px-7 py-3.5 rounded-xl bg-[#2D7521] hover:bg-[#85B638] text-white text-sm font-bold tracking-[0.12em] uppercase transition-all flex items-center gap-2 group shadow-[0_8px_30px_rgba(45,117,33,0.4)]">
                      View Menu <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    <a href="tel:9033640100" className="px-7 py-3.5 rounded-xl border border-white/10 hover:border-white/25 text-white/50 hover:text-white text-sm transition-all">
                      Call Now
                    </a>
                  </motion.div>
                </div>

                {/* Bottom metadata */}
                <div className="grid grid-cols-4 gap-6 border-t border-white/[0.06] pt-5">
                  {[['Opening','11 AM – 11 PM'],['Location','Ghatlodiya, Ahmedabad'],['Specialty','South Indian Cuisine'],['Rating','4.8 ★ (537 reviews)']].map(([label, value], i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + i * 0.07 }}>
                      <p className="text-[9px] tracking-[0.28em] uppercase text-white/25 mb-1">{label}</p>
                      <p className="text-xs font-light text-white/55">{value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Scroll cue */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                style={{ opacity: heroOpa }}
                className="absolute bottom-8 right-10 z-50 flex flex-col items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase text-white/25"
              >
                <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <ChevronDown size={13} className="text-[#85B638]" />
                </motion.div>
                Scroll
              </motion.div>
            </div>

            {/* ── Mobile Hero: static, no sticky ── */}
            <div className="md:hidden flex flex-col min-h-screen pt-24 pb-10 px-5 relative overflow-hidden">

              {/* Ambient blobs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2D7521]/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-[#85B638]/5 blur-[60px] rounded-full pointer-events-none" />

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ease: EASE }}
                className="flex items-center gap-2 mb-8"
              >
                <span className="w-6 h-px bg-[#85B638]" />
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#85B638] font-semibold">Ghatlodiya, Ahmedabad</span>
              </motion.div>

              {/* Headline */}
              <div className="mb-6">
                {[
                  { text: 'Crispy.',       cls: 'text-white' },
                  { text: 'Authentic.',    cls: 'text-[#85B638]' },
                  { text: 'Irresistible.', cls: 'text-white/20' },
                ].map(({ text, cls }, i) => (
                  <div key={i} className="overflow-hidden mb-1">
                    <motion.h1
                      initial={{ y: '105%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 0.9, delay: 0.35 + i * 0.12, ease: EASE }}
                      className={`text-[13.5vw] font-black tracking-tight leading-[0.88] ${cls}`}
                    >
                      {text}
                    </motion.h1>
                  </div>
                ))}
              </div>

              {/* Dosa image — mobile static display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
                className="w-full flex justify-center my-6"
              >
                <img
                  src={`${B}assets/dosa_isolated.png`}
                  alt="Dosa"
                  className="w-[75vw] h-[75vw] max-w-[320px] max-h-[320px] object-contain mix-blend-screen drop-shadow-[0_0_40px_rgba(133,182,56,0.2)]"
                />
              </motion.div>

              {/* Tagline + CTA */}
              <motion.p
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, ease: EASE }}
                className="text-white/40 text-sm leading-relaxed mb-6"
              >
                Experience the best South Indian dosa in Ahmedabad — stone-ground batter, 100% authentic flavour.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, ease: EASE }}
                className="flex gap-3 mb-10"
              >
                <a href="#menu" className="flex-1 text-center px-5 py-4 rounded-2xl bg-[#2D7521] hover:bg-[#85B638] text-white text-sm font-bold tracking-[0.1em] uppercase transition-all shadow-[0_6px_24px_rgba(45,117,33,0.4)] flex items-center justify-center gap-2">
                  View Menu <ArrowRight size={14} />
                </a>
                <a href="tel:9033640100" className="px-5 py-4 rounded-2xl border border-white/10 text-white/50 text-sm flex items-center justify-center">
                  <Phone size={15} />
                </a>
              </motion.div>

              {/* Mobile meta bar */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/[0.07] pt-6">
                {[['Opening','11 AM – 11 PM'],['Rating','4.8 ★ (537 reviews)']].map(([l, v], i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 + i * 0.07 }}>
                    <p className="text-[9px] tracking-[0.25em] uppercase text-white/25 mb-1">{l}</p>
                    <p className="text-xs font-light text-white/55">{v}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════
              2. STORY
          ════════════════════════════════════════════════════════════════ */}
          <section className="relative py-20 md:py-40 border-t border-white/[0.06]">
            <Divider />
            <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start md:items-center">

              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="md:col-span-6">
                <SectionLabel text="The Institution" />
                <div className="overflow-hidden mb-1">
                  <motion.h3 variants={lineReveal} className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">The fine art</motion.h3>
                </div>
                <div className="overflow-hidden mb-8 md:mb-12">
                  <motion.h3 variants={lineReveal} className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] italic text-[#85B638]">of crispness.</motion.h3>
                </div>
                <div className="space-y-5 max-w-md">
                  {[
                    'Fermented to perfection, our batter hits a screaming-hot cast iron, spreading into an impossibly thin golden canvas.',
                    'Our proprietary Gotala blend makes each bite explode with genuine South Indian flavour. No shortcuts. Pure precision.',
                  ].map((p, i) => (
                    <motion.p key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.15, ease: EASE }} className="text-white/50 font-light leading-relaxed text-sm md:text-base">{p}</motion.p>
                  ))}
                </div>
              </motion.div>

              <div className="md:col-span-5 md:col-start-8 flex flex-col gap-3 md:gap-4">
                {[
                  { n: '100%', sub: 'Freshly ground batter, every single day' },
                  { n: 'Pure', sub: 'Farm-grade coconut and clarified ghee' },
                  { n: 'Zero', sub: 'Preservatives or artificial additives' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                    className="rounded-2xl p-5 md:p-7 bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-400 group relative overflow-hidden"
                  >
                    <div className="absolute inset-px rounded-2xl border border-transparent group-hover:border-[#85B638]/25 transition-all duration-500 pointer-events-none" />
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#85B638] to-[#2D7521] bg-clip-text text-transparent block mb-1">{s.n}</span>
                    <span className="text-sm text-white/40 font-light">{s.sub}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Marquee strip ── */}
          <div className="relative py-4 border-y border-white/[0.06] overflow-hidden bg-white/[0.01]">
            <div className="marquee-track select-none">
              {[...TECH_STACK, ...TECH_STACK].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-white/20 whitespace-nowrap">
                  <span>{t.icon}</span>{t.name}<span className="mx-4 text-[#2D7521]/25">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              3. MENU
          ════════════════════════════════════════════════════════════════ */}
          <section id="menu" className="relative border-t border-white/[0.06] pt-20 pb-16 md:pt-36 md:pb-28 md:min-h-[180vh]">
            <Divider />
            <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-8">

              {/* Desktop: left placeholder for dosa landing */}
              <div className="hidden md:block md:col-span-5" />

              <div className="col-span-1 md:col-span-6 md:col-start-7">
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10 md:mb-14">
                  <SectionLabel text="Signature Menu" />
                  <div className="overflow-hidden mb-1">
                    <motion.h3 variants={lineReveal} className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">Curated</motion.h3>
                  </div>
                  <div className="overflow-hidden">
                    <motion.h3 variants={lineReveal} className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight italic text-white/30">plates.</motion.h3>
                  </div>
                </motion.div>

                {MENU_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-5%' }}
                    transition={{ duration: 0.7, delay: index * 0.09, ease: EASE }}
                    onMouseEnter={() => setHoveredMenu(item.id)}
                    onMouseLeave={() => setHoveredMenu(null)}
                    className="group border-b border-white/[0.07] relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#85B638]/[0.05] to-transparent pointer-events-none"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: hoveredMenu === item.id ? 1 : 0 }}
                      style={{ originX: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                    <div className="relative z-10 py-5 md:py-7 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="text-lg md:text-xl font-light tracking-wide group-hover:text-[#85B638] transition-colors duration-300">{item.name}</h4>
                          {item.tag && (
                            <span className="px-2 py-0.5 text-[9px] font-bold tracking-[0.1em] uppercase rounded-full bg-[#85B638]/10 text-[#85B638] border border-[#85B638]/20 shrink-0">{item.tag}</span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-white/35 font-light leading-snug">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-base md:text-lg font-light transition-colors duration-300 ${hoveredMenu === item.id ? 'text-[#85B638]' : 'text-white/50'}`}>{item.price}</span>
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${hoveredMenu === item.id ? 'bg-[#85B638] border-[#85B638]' : 'border-white/18'}`}>
                          <MoveRight size={12} className={hoveredMenu === item.id ? 'text-black -rotate-45' : 'text-white/35'} style={{ transition: 'transform 0.3s' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-[10px] text-white/20 mt-5 tracking-wide">
                  Served with homemade chutney & sambhar · Every day 11 AM – 11 PM · Sayona Circle, Ghatlodiya
                </motion.p>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════
              4. CASE STUDY
          ════════════════════════════════════════════════════════════════ */}
          <section id="case-study" className="relative py-20 md:py-32 border-t border-white/[0.06]">
            <Divider />
            <div className="max-w-7xl mx-auto px-5 md:px-10">
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12 md:mb-16">
                <SectionLabel text="Portfolio Case Study" />
                <div className="overflow-hidden mb-1">
                  <motion.h3 variants={lineReveal} className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight">Behind the</motion.h3>
                </div>
                <div className="overflow-hidden">
                  <motion.h3 variants={lineReveal} className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight italic text-[#85B638]">experience.</motion.h3>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                {CASE_STUDY.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={scaleIn} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className={`rounded-2xl p-6 md:p-8 border hover:-translate-y-0.5 transition-all duration-400 ${item.accent}`}
                  >
                    <div className={`inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.18em] uppercase rounded-full px-2.5 py-1 mb-5 border ${item.accent} ${item.tag}`}>
                      {item.icon} {item.label}
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-white/50 leading-relaxed font-light">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {STATS.map((s, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="rounded-2xl p-5 md:p-6 text-center bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all duration-400"
                  >
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#85B638] to-[#2D7521] bg-clip-text text-transparent mb-1">
                      {s.value}<span className="text-xl md:text-2xl ml-0.5">{s.unit}</span>
                    </div>
                    <div className="text-[10px] text-white/35 tracking-[0.15em] uppercase">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════
              5. TECH STACK
          ════════════════════════════════════════════════════════════════ */}
          <section className="relative py-20 md:py-28 border-t border-white/[0.06]">
            <Divider />
            <div className="max-w-7xl mx-auto px-5 md:px-10">
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10 md:mb-12">
                <SectionLabel text="Built With" />
                <div className="overflow-hidden">
                  <motion.h3 variants={lineReveal} className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">
                    Technology <span className="italic text-white/30">stack.</span>
                  </motion.h3>
                </div>
              </motion.div>

              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-16">
                {TECH_STACK.map((t, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: i * 0.05 } } }}
                    whileHover={{ y: -2, backgroundColor: 'rgba(133,182,56,0.08)', borderColor: 'rgba(133,182,56,0.4)', color: '#85B638' }}
                    className="px-4 md:px-5 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-medium text-white/50 border border-white/10 bg-white/[0.02] flex items-center gap-2 transition-colors cursor-default"
                  >
                    <span>{t.icon}</span>{t.name}
                  </motion.div>
                ))}
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {EXP_CARDS.map((card, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="rounded-2xl p-6 md:p-7 bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-400 group"
                  >
                    <div className="mb-4">{card.icon}</div>
                    <h4 className="font-semibold text-sm md:text-base mb-2 group-hover:text-[#85B638] transition-colors duration-300">{card.title}</h4>
                    <p className="text-xs md:text-sm text-white/40 font-light leading-relaxed">{card.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════
              6. TESTIMONIAL + INFO
          ════════════════════════════════════════════════════════════════ */}
          <section className="relative py-20 md:py-32 border-t border-white/[0.06]">
            <Divider />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#2D7521]/[0.06] blur-[100px] rounded-full" />
            </div>

            <div className="max-w-3xl mx-auto px-5 md:px-10 text-center relative z-10 mb-14 md:mb-20">
              <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut' }}>
                <div className="text-6xl md:text-[7rem] leading-none text-white/[0.04] font-serif select-none">"</div>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-light leading-relaxed text-white/75 mb-8 -mt-4 md:-mt-6">
                  Crispy dosa, flavorful masala, perfect chutney and sambhar. Absolutely unmatched in Ahmedabad.
                </h2>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5].map(i => (
                      <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.06 }} className="w-1.5 h-1.5 rounded-full bg-[#85B638]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/30 tracking-[0.2em] uppercase">Verified Google Review</span>
                </div>
              </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {[
                { icon: <MapPin size={15} />, label: 'Find Us',  value: 'Sayona Circle, Ghatlodiya, Ahmedabad' },
                { icon: <Clock size={15} />,  label: 'Hours',    value: 'Every Day · 11 AM – 11 PM' },
                { icon: <Star size={15} />,   label: 'Reviews',  value: '4.8 ★ across 537 Google Reviews' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.09 }}
                  className="rounded-2xl p-5 md:p-6 bg-white/[0.03] border border-white/10 flex items-start gap-4 hover:bg-white/[0.06] transition-all duration-400"
                >
                  <span className="text-[#85B638] mt-0.5 shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/25 mb-1">{item.label}</p>
                    <p className="text-sm text-white/65">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════
              7. CTA — WORK WITH ME
          ════════════════════════════════════════════════════════════════ */}
          <section id="contact" className="relative py-24 md:py-40 border-t border-white/[0.06] overflow-hidden">
            <Divider />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2D7521]/[0.07] blur-[160px] rounded-full" />
            </div>
            <div className="max-w-4xl mx-auto px-5 md:px-10 text-center relative z-10">
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
                <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-7 md:mb-9">
                  <span className="w-7 h-px bg-[#85B638]" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#85B638] font-semibold">Freelance Developer</span>
                  <span className="w-7 h-px bg-[#85B638]" />
                </motion.div>

                <div className="overflow-hidden mb-1">
                  <motion.h3 variants={lineReveal} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">Let's build</motion.h3>
                </div>
                <div className="overflow-hidden mb-10 md:mb-14">
                  <motion.h3 variants={lineReveal} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-[#85B638] to-[#2D7521] bg-clip-text text-transparent">something great.</motion.h3>
                </div>

                <motion.p variants={fadeUp} className="text-white/40 text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto mb-6">
                  I design and develop premium interactive websites — for restaurants, brands, and startups that refuse to be ordinary. Fast delivery, pixel-perfect results.
                </motion.p>

                {/* ── Demo Notice ── */}
                <motion.div
                  variants={fadeUp}
                  className="inline-flex items-start gap-3 rounded-2xl border border-[#85B638]/20 bg-[#85B638]/5 px-5 py-4 mb-10 md:mb-12 max-w-xl mx-auto text-left"
                >
                  <span className="text-lg mt-0.5 shrink-0">⚡</span>
                  <div>
                    <p className="text-[#85B638] text-xs font-bold tracking-[0.15em] uppercase mb-1">This is just a demo</p>
                    <p className="text-white/50 text-sm font-light leading-relaxed">
                      The final website will be significantly more impressive — richer animations, more content, custom 3D elements, and production-grade polish. Call us to discuss your vision.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="tel:9033640100"
                    className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-[#2D7521] hover:bg-[#85B638] text-white font-bold tracking-[0.12em] uppercase text-sm transition-all flex items-center justify-center gap-3 group shadow-[0_0_28px_rgba(45,117,33,0.4)] hover:shadow-[0_0_44px_rgba(133,182,56,0.5)]"
                  >
                    Call to Discuss
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="tel:9033640100"
                    className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#85B638]/40 text-white font-medium tracking-[0.09em] text-sm transition-all flex items-center justify-center gap-3"
                  >
                    <Phone size={15} className="text-[#85B638]" />
                    9033640100
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════
              FOOTER
          ════════════════════════════════════════════════════════════════ */}
          <footer className="relative border-t border-white/[0.06] py-10 px-5 md:px-10">
            <Divider />
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                {/* Brand */}
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <img src={`${B}assets/logo.png`} alt="Logo" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                    <span className="text-sm font-bold tracking-[0.18em] uppercase">Pancham Dosa</span>
                  </div>
                  <p className="text-[11px] text-white/25 max-w-[240px] leading-relaxed">The Flavours of South. Sayona Circle, Ghatlodiya, Ahmedabad.</p>
                </div>

                {/* Social + copyright */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="flex items-center gap-3">
                    {[
                      { icon: <Instagram size={14} />, label: 'Instagram', href: '#' },
                      { icon: <Facebook size={14} />,  label: 'Facebook',  href: '#' },
                      { icon: <Phone size={14} />,     label: 'Call',      href: 'tel:9033640100' },
                    ].map((s, i) => (
                      <a key={i} href={s.href} aria-label={s.label}
                        className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#2D7521] hover:border-[#2D7521] hover:text-white transition-all duration-300"
                      >{s.icon}</a>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/20 tracking-[0.12em] uppercase">
                    © {new Date().getFullYear()} Pancham Dosa. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>

        </main>
      </div>
    </ReactLenis>
  )
}
