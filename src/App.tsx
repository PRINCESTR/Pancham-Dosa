import { useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, MoveRight, CornerRightDown, Instagram, Facebook } from 'lucide-react'
import { ReactLenis } from '@studio-freight/react-lenis'

// Mock Data
const MENU_ITEMS = [
  { id: 1, name: "Mysore Masala", desc: "Spicy red chutney spread with classic potato filling", price: "₹250" },
  { id: 2, name: "Green Gotala", desc: "Signature green gravy, cheese, herbs and rich spices", price: "₹300" },
  { id: 3, name: "Jinny Dosa", desc: "Rolled sections filled with tangy chopped veggies", price: "₹280" },
  { id: 4, name: "Classic Plain", desc: "Pure golden crispness without filling", price: "₹180" },
]

export default function App() {
  const { scrollYProgress } = useScroll()

  // ---- CINEMATIC SCROLL TRANSFORMS ----
  const dosaX = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9], 
    ["50vw", "50vw", "75vw", "75vw", "40vw", "40vw", "40vw"]
  )
  
  const dosaY = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9], 
    ["50vh", "50vh", "25vh", "25vh", "65vh", "65vh", "-30vh"]
  )
  
  const dosaScale = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9], 
    [1.4, 1.4, 0.45, 0.45, 0.85, 0.85, 0.2]
  )
  
  const dosaRotate = useTransform(scrollYProgress, [0, 1], [0, 180])
  
  // Empty Plate transforms 
  const plateOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.8, 0.85], [0, 1, 1, 0])
  const plateY = useTransform(scrollYProgress, [0.8, 0.9], ["65vh", "-30vh"])

  // Parallax Hero Text
  const heroText1Y = useTransform(scrollYProgress, [0, 0.4], [0, -100])
  const heroText2Y = useTransform(scrollYProgress, [0, 0.4], [0, -40])

  // Parallax Background elements
  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, 300])

  // Mouse Tracking setup for Parallax & Custom Cursor
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  
  // For custom visual cursor (tracks exact)
  const cursorX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const cursorY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate deviation from center for parallax
      const cw = window.innerWidth / 2
      const ch = window.innerHeight / 2
      mouseX.set(e.clientX - cw)
      mouseY.set(e.clientY - ch)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  // Multi-line animation helper
  const animateTextLines = (text: string[]) => {
    return text.map((line, i) => (
      <motion.p
        key={i}
        initial={{ opacity: 0, filter: "blur(10px)", y: 15 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
      >
        {line}
      </motion.p>
    ))
  }

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <div className="bg-black min-h-screen text-white font-sans selection:bg-logoGreen selection:text-white relative cursor-none">
        
        {/* CUSTOM CURSOR SYSTEM */}
        <motion.div 
           className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
           style={{ x: cursorX, y: cursorY, translateX: 'calc(-50% + 50vw)', translateY: 'calc(-50% + 50vh)' }}
        />
        <motion.div 
           className="fixed top-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none z-0 hidden md:block"
           style={{ x: smoothMouseX, y: smoothMouseY, translateX: 'calc(-50% + 50vw)', translateY: 'calc(-50% + 50vh)' }}
        />

        {/* FILM GRAIN OVERLAY */}
        <div className="noise-overlay"></div>

        {/* GLOBAL FIXED ELEMENTS */}
        
        {/* 1. Floating Dosa Wrapper (Scroll driven) */}
        <motion.div 
          className="fixed z-40 pointer-events-none mix-blend-screen -ml-[300px] -mt-[300px] w-[600px] h-[600px]"
          style={{ left: dosaX, top: dosaY, scale: dosaScale, rotate: dosaRotate }}
        >
          {/* Inner Layer (Mouse parallax driven + soft glow) */}
          <motion.div 
             className="w-full h-full relative"
             style={{ x: useTransform(smoothMouseX, v => v * -0.05), y: useTransform(smoothMouseY, v => v * -0.05) }}
          >
             <div className="absolute inset-0 bg-logoLightGreen/10 blur-[80px] rounded-full scale-75 shadow-2xl"></div>
          <img src={`${import.meta.env.BASE_URL}assets/dosa_isolated.png`} alt="Floating Dosa" className="w-full h-full object-contain relative z-10" />
          </motion.div>
        </motion.div>

        {/* 2. Floating Empty Plate */}
        <motion.div 
          className="fixed z-30 pointer-events-none mix-blend-screen -ml-[350px] -mt-[350px] w-[700px] h-[700px]"
          style={{ left: "40vw", top: plateY, scale: 0.9, opacity: plateOpacity }}
        >
          <img src={`${import.meta.env.BASE_URL}assets/empty_plate.png`} alt="Empty Plate Pad" className="w-full h-full object-contain opacity-80" />
        </motion.div>

        {/* MINIMAL NAVIGATION */}
        <nav className="fixed top-0 w-full z-50 p-8 mix-blend-difference">
          <motion.div 
             initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}
             className="max-w-[90vw] mx-auto flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white/5">
                <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="Pancham Dosa Logo" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <h1 className="text-xl font-medium tracking-[0.3em] uppercase">Pancham</h1>
            </div>
            <button className="text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center gap-3 group">
              <span className="group-hover:text-logoLightGreen transition-colors duration-500">Order Now</span> 
              <ArrowRight size={14} className="group-hover:translate-x-1 group-hover:text-logoLightGreen transition-all duration-500" />
            </button>
          </motion.div>
        </nav>

        <main>
          {/* SECTION 1: CINEMATIC HERO */}
          <section className="relative h-[150vh] flex flex-col justify-start pt-[30vh] overflow-hidden">
            {/* Background Parallax Layer */}
            <motion.div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ y: bgY1 }}>
                 {/* Subtle ambient light from logo colors */}
                 <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-logoGreen/20 blur-[150px] rounded-full mix-blend-color-dodge"></div>
            </motion.div>

            {/* Massive background typography */}
            <div className="fixed top-1/2 left-1/2 w-full text-center -translate-x-1/2 -translate-y-[40%] px-4 z-10 pointer-events-none">
              <motion.h2 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 0.25, scale: 1 }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 style={{ y: heroText1Y }}
                 className="text-[15vw] leading-[0.8] font-black uppercase tracking-tighter text-outline mix-blend-overlay"
              >
                Authentic
              </motion.h2>
            </div>
            <div className="fixed top-1/2 left-1/2 w-full text-center -translate-x-1/2 -translate-y-[60%] px-4 z-50 pointer-events-none drop-shadow-2xl">
              <motion.h2 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 0.9, scale: 1 }}
                 transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                 style={{ y: heroText2Y }}
                 className="text-[15vw] leading-[0.8] font-black uppercase tracking-tighter mix-blend-screen text-white drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
              >
                Authentic
              </motion.h2>
            </div>

            {/* Subtitles Fading In */}
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
               className="relative z-50 max-w-[90vw] mx-auto w-full mt-auto mb-[20vh] grid grid-cols-2"
            >
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-2">Location</p>
                <p className="text-lg font-light tracking-wide text-gray-300">Ghatlodiya, Ahmedabad</p>
              </div>
              <div className="text-right">
                <p className="text-xs tracking-[0.3em] uppercase text-logoLightGreen mb-2">Since</p>
                <p className="text-lg font-light tracking-wide text-gray-300">The Beginning</p>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: "100%" }}
               transition={{ duration: 1, delay: 0.8 }}
               className="absolute bottom-12 left-12 z-50 flex flex-col justify-end gap-4 text-xs font-light tracking-[0.2em] uppercase text-gray-500"
            >
              Scroll
              <motion.div className="w-[1px] bg-logoGreen origin-top" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }} style={{ height: "48px" }}></motion.div>
            </motion.div>
          </section>

          {/* SECTION 2: THE ART (CRISPNESS) */}
          <section className="relative h-[150vh] flex items-center">
            {/* Visual Particle / Steam illusion */}
             <motion.div 
               className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen" 
               initial={{ opacity: 0 }} whileInView={{ opacity: 0.3 }} transition={{ duration: 2 }}
             >
                <div className="absolute top-1/2 left-[20%] w-[40vw] h-[40vh] bg-white/5 blur-[100px] rounded-full animate-pulse"></div>
             </motion.div>

            <div className="max-w-[90vw] mx-auto w-full grid grid-cols-1 md:grid-cols-12 relative z-20">
              <div className="md:col-span-6 md:col-start-1 pr-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <CornerRightDown className="text-logoGreen w-8 h-8 mb-12 stroke-[1]" />
                  <h3 className="text-6xl lg:text-7xl font-light mb-12 leading-[1.1] tracking-tight">The fine art of <br/><span className="italic opacity-50 text-logoLightGreen">crispness.</span></h3>
                  
                  <div className="space-y-8 font-light text-lg leading-relaxed max-w-md text-gray-400">
                    {animateTextLines([
                      "Fermented to absolute perfection, our signature batter hits the screaming hot cast iron, spreading into an impossibly thin, golden canvas.",
                      "Enhanced with our proprietary Gotala blend, each bite explodes with the genuine, uncompromised flavors of the South. No shortcuts. Pure precision."
                    ])}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* SECTION 3: THE MENU */}
          <section className="relative h-[200vh] pt-40">
            <div className="max-w-[90vw] mx-auto grid grid-cols-1 md:grid-cols-12 relative z-20">
              
              <div className="hidden md:block md:col-span-5 relative">
                 <motion.div 
                   initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1, ease: "easeOut" }} viewport={{ once: true }}
                   className="absolute top-0 w-full h-[1px] bg-white/10 origin-left"
                 />
              </div>

              <div className="md:col-span-6 md:col-start-7 pl-0 md:pl-12">
                <motion.h2 
                   initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
                   className="text-xs font-semibold tracking-[0.3em] uppercase text-logoLightGreen mb-16 px-4"
                >
                  Signature Menu
                </motion.h2>

                <div className="flex flex-col relative w-full overflow-hidden">
                  {MENU_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="group border-b border-white/10 py-10 px-6 relative cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 overflow-hidden"
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                    >
                      {/* Hover background expansion */}
                      <div className="absolute inset-0 bg-white/[0.03] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out z-0"></div>
                      
                      <div className="relative z-10 w-full flex justify-between items-center pr-4">
                        <div>
                          <h4 className="text-2xl font-light mb-2 group-hover:text-logoLightGreen transition-colors tracking-wide duration-500">{item.name}</h4>
                          <p className="text-gray-500 font-light text-sm max-w-xs">{item.desc}</p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                           {/* Price animate in on hover */}
                           <span className="text-xl font-light text-white/50 group-hover:text-white transition-all transform group-hover:-translate-y-1 duration-500 inline-block">{item.price}</span>
                           <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-logoLightGreen group-hover:bg-logoLightGreen group-hover:text-black transition-all duration-500">
                             <MoveRight size={14} className="text-white/50 group-hover:text-black group-hover:-rotate-45 transition-all duration-500" />
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          {/* SECTION 4: EDITORIAL EXPERIENCE (TESTIMONIAL) */}
          <section className="relative py-40 overflow-hidden flex flex-col justify-center min-h-[80vh] border-t border-white/10 mt-20">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ margin: "-20%" }}
               transition={{ duration: 1.2, ease: "easeOut" }}
               className="relative z-20 max-w-5xl mx-auto px-6 text-center"
            >
              {/* Decorative huge quotes */}
              <div className="absolute -top-12 -left-4 text-9xl text-white/5 font-serif select-none pointer-events-none">"</div>
              
              <h2 className="text-4xl md:text-5xl font-light mb-16 leading-tight tracking-tight px-4 text-gray-200 indent-8">
                 A flawless execution of South Indian classics. The aesthetic and the taste are completely unmatched in Ahmedabad.
              </h2>
              
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5, duration: 0.8 }}
                 className="inline-flex flex-col items-center"
              >
                <div className="flex gap-2 mb-4">
                  {[1,2,3,4,5].map(i => <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.5 + (i * 0.1) }} className="w-1.5 h-1.5 bg-logoLightGreen rounded-full"></motion.div>)}
                </div>
                <span className="text-gray-500 font-semibold tracking-[0.2em] text-[10px] uppercase">Highly Recommended</span>
              </motion.div>
            </motion.div>

            {/* Subtle background element moving */}
            <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ y: bgY1 }}>
                 <div className="absolute top-[80%] left-1/4 w-[400px] h-[400px] bg-logoGreen/5 blur-[120px] rounded-full"></div>
            </motion.div>
          </section>

          {/* FOOTER */}
          <footer className="relative bg-black pt-32 pb-12 overflow-hidden group">
            {/* Animated subtle divider for footer */}
            <motion.div 
               initial={{ scaleX: 0 }}
               whileInView={{ scaleX: 1 }}
               viewport={{ margin: "50px" }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               className="absolute top-0 w-full h-[1px] bg-white/10 origin-center"
            />

            <div className="max-w-[90vw] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 mb-24 px-4 relative z-10">
              <div className="md:col-span-5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 flex items-center justify-center border border-white/5">
                    <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="Pancham Dosa Logo" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                  </div>
                  <h1 className="text-xl font-light tracking-[0.2em] uppercase text-white">Pancham Dosa</h1>
                </div>
                <p className="text-gray-500 font-light leading-relaxed max-w-xs transition-colors hover:text-gray-300">
                  Elevating traditional cuisine. Experience uncompromising quality and taste in every single bite.
                </p>
              </div>
              
              <div className="md:col-span-3 md:col-start-7">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-logoGreen mb-8">Location</h4>
                <p className="text-white font-light text-lg mb-2 cursor-pointer hover:text-logoLightGreen transition-colors">Sayona Circle,</p>
                <p className="text-gray-500 font-light cursor-pointer hover:text-gray-300 transition-colors">Ghatlodiya, Ahmedabad</p>
              </div>

              <div className="md:col-span-3">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-logoGreen mb-8">Connect</h4>
                <p className="text-white font-light text-lg mb-6 hover:text-logoLightGreen transition-colors cursor-pointer inline-block overflow-hidden relative">
                   <span className="relative z-10">09227128797</span>
                   <span className="absolute bottom-0 left-0 w-full h-px bg-logoLightGreen origin-left scale-x-0 hover:scale-x-100 transition-transform"></span>
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-logoGreen hover:border-logoGreen hover:text-black transition-all group overflow-hidden pointer-events-auto">
                    <Instagram size={16} className="group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-logoGreen hover:border-logoGreen hover:text-black transition-all group overflow-hidden pointer-events-auto">
                    <Facebook size={16} className="group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            <div className="max-w-[90vw] mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-gray-600 text-[10px] font-bold tracking-[0.1em] uppercase px-4 relative z-10">
              <p>© {new Date().getFullYear()} Pancham. All rights reserved.</p>
              <div className="flex gap-8 mt-6 md:mt-0">
                <a href="#" className="hover:text-logoLightGreen transition-colors">Privacy</a>
                <a href="#" className="hover:text-logoLightGreen transition-colors">Terms</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </ReactLenis>
  )
}
