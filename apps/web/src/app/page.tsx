"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Network, Search, Zap, ShieldAlert, Cpu, Server, Database, Cloud, Code, Globe, Lock } from 'lucide-react';
import RotatingText from '@/components/RotatingText';
import PixelSwap from '@/components/PixelSwap';
import LogoLoop from '@/components/LogoLoop';
import FallingText from '@/components/FallingText';
import Strands from '@/components/Strands';

import ParticleText from '@/components/ParticleText';
import StarBorder from '@/components/StarBorder';
import Aurora from '@/components/Aurora';
import BorderGlow from '@/components/BorderGlow';
import LatticeLoader from '@/components/LatticeLoader';

export default function Home() {
  const [isBooting, setIsBooting] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isBooting) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <LatticeLoader status="working" label="INITIALIZING CORE" showTimer={false} fontSize={16} glow={true} color="#38bdf8" />
        <div className="font-mono text-xs text-[var(--color-text-muted)] animate-[pulse_2s_ease-in-out_infinite]">ESTABLISHING NEURAL LINK...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] overflow-hidden font-sans relative">
      {/* Full Screen Aurora Background */}
      <div className="fixed inset-0 w-full h-screen z-0 opacity-30 pointer-events-none mix-blend-screen">
        <Aurora colorStops={["#007acc", "#00bfff", "#4169e1"]} blend={0.8} amplitude={1.5} speed={0.6} />
      </div>

      {/* Animated Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-24">        {/* HERO SECTION */}
        <div className="relative flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto mt-12 overflow-hidden py-10">

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#4b5563]">
              REVEAL THE
            </span>
            <br/>
            <div className="flex justify-center h-28 items-center mt-2">
              <RotatingText
                texts={['INVISIBLE.', 'UNTESTED.', 'OBSCURE.', 'UNKNOWN.']}
                mainClassName="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] px-2 sm:px-2 md:px-3 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={3000}
              />
            </div>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-full max-w-3xl mx-auto h-[120px] md:h-[150px] font-light z-20"
          >
            <FallingText
              text={`Black Box performs deterministic, controlled experiments on authorized software systems. We reconstruct hidden behavioral states and mathematically generate reproducible failure scenarios—without ever seeing the source code.`}
              highlightWords={["deterministic", "controlled experiments", "hidden behavioral states", "reproducible failure scenarios", "source code."]}
              highlightClass="text-[var(--color-info)] font-bold drop-shadow-[0_0_8px_rgba(102,163,255,0.5)]"
              trigger="hover"
              backgroundColor="transparent"
              wireframes={false}
              gravity={0.5}
              fontSize="1.125rem"
              mouseConstraintStiffness={0.9}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mt-12 w-full sm:w-auto"
          >
            <Link href="/targets" className="px-10 py-5 bg-white text-black font-bold rounded-lg flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)]">
              Initialize Investigation <span className="ml-3 font-mono">→</span>
            </Link>
            <Link href="/investigate?run_id=demo" className="px-10 py-5 bg-[var(--color-surface)]/80 border border-[var(--color-border)] text-white font-bold rounded-lg flex items-center justify-center hover:bg-[var(--color-surface-2)] transition-colors backdrop-blur-md hover:border-white/30">
              View Demo Telemetry
            </Link>
          </motion.div>
        </div>

        {/* LOGO LOOP BANNER */}
        <div className="mt-24 w-full border-y border-[var(--color-border)] py-8 relative overflow-hidden bg-[var(--color-surface)]/50">
          <div className="text-center text-xs font-mono text-[var(--color-text-muted)] mb-6 tracking-widest">SUPPORTED TARGET ARCHITECTURES</div>
          <div style={{ height: '50px', position: 'relative', overflow: 'hidden' }}>
            <LogoLoop
              logos={[
                { node: <div className="flex items-center gap-2"><Server size={24}/> <span>REST API</span></div>, title: "REST" },
                { node: <div className="flex items-center gap-2"><Globe size={24}/> <span>GraphQL</span></div>, title: "GraphQL" },
                { node: <div className="flex items-center gap-2"><Database size={24}/> <span>gRPC</span></div>, title: "gRPC" },
                { node: <div className="flex items-center gap-2"><Cloud size={24}/> <span>Kubernetes</span></div>, title: "K8s" },
                { node: <div className="flex items-center gap-2"><Code size={24}/> <span>WebSockets</span></div>, title: "WebSockets" },
                { node: <div className="flex items-center gap-2"><Lock size={24}/> <span>OAuth2</span></div>, title: "OAuth2" },
              ]}
              speed={40}
              direction="left"
              logoHeight={24}
              gap={60}
              hoverSpeed={10}
              scaleOnHover
              fadeOut
              fadeOutColor="var(--color-background)"
            />
          </div>
        </div>

        {/* FEATURES GRID - BENTO BOX */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Network className="text-[var(--color-info)]" size={36} />,
              title: "State Reconstruction",
              desc: "Dynamically infers finite state machines from API responses using temporal fingerprinting and latency clustering.",
              span: "md:col-span-4",
              height: "h-full min-h-[300px]",
              glowColor: "60 100 50" // yellowish info
            },
            {
              icon: <ShieldAlert className="text-[var(--color-danger)]" size={36} />,
              title: "Patient Zero Injection",
              desc: "Synthesizes hostile perturbations to trigger edge cases.",
              usePixelSwap: true,
              span: "md:col-span-2",
              height: "h-full min-h-[300px]",
              glowColor: "0 100 60" // red
            },
            {
              icon: <Cpu className="text-[var(--color-success)]" size={36} />,
              title: "Delta Debugging",
              desc: "Isolates the exact sequence of events required to reproduce a failure, minimizing noise and establishing absolute proof with complete accuracy.",
              span: "md:col-span-6",
              height: "h-[250px]",
              glowColor: "140 100 50" // green
            }
          ].map((feature, idx) => {
            const cardInner = (
              <div className={`p-8 bg-[var(--color-surface)]/40 hover:bg-[var(--color-surface)]/60 transition-all group relative overflow-hidden flex flex-col justify-center ${feature.height}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-info)]/5 rounded-full blur-3xl group-hover:bg-[var(--color-info)]/20 transition-colors"></div>
                <div className="mb-6 p-4 bg-[var(--color-background)]/80 inline-flex self-start rounded-xl border border-[var(--color-border)]/50 backdrop-blur-sm">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-[var(--color-text-muted)] text-md leading-relaxed max-w-2xl">{feature.desc}</p>
              </div>
            );

            const cardContent = (
              <BorderGlow 
                className="w-full h-full rounded-2xl"
                glowColor={feature.glowColor}
                backgroundColor="#0a0d14"
                borderRadius={16}
                edgeSensitivity={40}
                colors={['#38bdf8', '#818cf8', '#c084fc']}
              >
                {cardInner}
              </BorderGlow>
            );

            const altContent = (
              <BorderGlow 
                className="w-full h-full rounded-2xl"
                glowColor="0 100 50"
                backgroundColor="#ef4444"
                borderRadius={16}
              >
                <div className={`p-8 text-white h-full flex flex-col justify-center items-center text-center ${feature.height}`}>
                  <ShieldAlert size={48} className="mb-4" />
                  <h3 className="text-2xl font-black mb-2">VULNERABILITY</h3>
                  <p className="text-sm font-bold opacity-80">Injection sequence complete.</p>
                </div>
              </BorderGlow>
            );

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.7 }}
                className={feature.span}
              >
                {feature.usePixelSwap ? (
                  <PixelSwap
                    firstContent={cardContent}
                    secondContent={altContent}
                    pixelSize={60}
                    gap={0}
                    pixelRadius={0}
                    pixelScale={0.8}
                    duration={600}
                    pixelDuration={400}
                    pattern="horizontal"
                    fade={true}
                    trigger="hover"
                    aspectRatio="auto"
                    className="w-full h-full rounded-2xl overflow-hidden"
                  />
                ) : (
                  cardContent
                )}
              </motion.div>
            );
          })}
        </div>





        {/* MASSIVE PARTICLE FOOTER */}
        <div className="w-full mt-40 border-t border-[var(--color-border)] pt-20 pb-10">
          <div style={{ width: '100%', height: '360px', background: 'transparent' }}>
            <ParticleText
              text="BLACK BOX"
              particleSize={3}
              density={5}
              color="#ffffff"
              highlightColor="var(--color-info)"
              scatter={200}
              gatherDuration={2000}
              stagger={450}
              pointerRepel={60}
              repelRadius={150}
              idleDrift={1}
              trigger="none"
              fontSize="clamp(4rem, 16vw, 12rem)"
              fontWeight={900}
              fontFamily="monospace"
              glow={true}
            />
          </div>
          <div className="text-center text-[var(--color-text-muted)] font-mono text-sm mt-8">
            // TERMINAL OF TRUTH // 2026
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(600px); }
        }
      `}} />
    </div>
  );
}
