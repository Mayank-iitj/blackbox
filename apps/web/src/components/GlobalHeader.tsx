"use client";
import React from 'react';
import Link from 'next/link';
import StaggeredMenu from '@/components/StaggeredMenu';
import BellToggle from '@/components/BellToggle';

const menuItems = [
  { label: 'DASHBOARD', ariaLabel: 'Dashboard', link: '/' },
  { label: 'TARGET SETUP', ariaLabel: 'Targets', link: '/targets' },
  { label: 'PATIENT ZERO', ariaLabel: 'Patient Zero', link: '/patient-zero' },
  { label: 'INVESTIGATE', ariaLabel: 'Investigate', link: '/investigate' },
  { label: 'FAILURES', ariaLabel: 'Failures', link: '/failures' }
];

export default function GlobalHeader() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 100 }}>
      <StaggeredMenu
        position="right"
        items={menuItems}
        displaySocials={false}
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#000000"
        changeMenuColorOnOpen={true}
        colors={['#1a1a1a', '#ff4444', '#000000']}
        accentColor="#ff4444"
      >
        <div className="flex-1 flex justify-between items-center pointer-events-auto pr-6">
          <Link href="/" className="font-mono font-bold tracking-widest text-xl text-white flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-sm shadow-[0_0_10px_white]"></div>
            BLACK//BOX
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm font-mono text-[#a1a1aa] border border-[#333] px-3 py-1 rounded-full bg-[#111]">
              SYSTEM.ONLINE
            </div>
            <BellToggle
              offLabel="Subscribe to Alerts"
              onLabel="Alerts Enabled"
              color="#a1a1aa"
              background="#18181b"
              onColor="#ffffff"
              onBackground="#27272a"
              size="sm"
              radius={22}
              ringAmplitude={20}
              ringPasses={6}
              ringDuration={900}
              crossfadeMs={250}
              count={3}
              badge={true}
              badgeColor="#ef4444"
              waves={true}
              clapper={true}
            />
          </div>
        </div>
      </StaggeredMenu>
    </div>
  );
}
