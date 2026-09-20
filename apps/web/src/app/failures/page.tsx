"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HalftoneReveal from '@/components/HalftoneReveal';

export default function FailuresPage() {
  const [minimized, setMinimized] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] p-8">
      <header className="mb-12 border-b border-[var(--color-border)] pb-4 max-w-5xl mx-auto flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-mono text-[var(--color-danger)]">FAILURE DISCOVERED</h1>
          <p className="text-[var(--color-text-muted)] mt-2">The behavioral model has diverged from baseline expectations.</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-[var(--color-warning)]">SEVERITY: HIGH</div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded shadow-2xl">
          <h3 className="text-sm font-mono text-[var(--color-text-muted)] mb-6">TIMELINE</h3>
          <div className="font-mono flex flex-col items-center">
            <div className="p-3 border border-[var(--color-border)] rounded w-48 text-center text-[var(--color-text-muted)]">S04 (AUTHENTICATED)</div>
            <div className="h-8 border-l border-dashed border-[var(--color-border)] my-1"></div>
            <div className="p-3 border border-[var(--color-border)] rounded w-48 text-center text-[var(--color-text-muted)]">S07 (PAYMENT_INIT)</div>
            <div className="h-8 border-l border-[var(--color-danger)] my-1 relative">
              <span className="absolute left-4 top-2 text-xs text-[var(--color-danger)]">DIVERGENCE</span>
            </div>
            <div className="p-3 border border-[var(--color-danger)] bg-[var(--color-danger)]/10 rounded w-48 text-center text-[var(--color-danger)] font-bold">S12 (TIMEOUT_LOCKED)</div>
          </div>
        </div>

        <div>
          <div className="mb-8">
            <h3 className="text-sm font-mono text-[var(--color-text-muted)] mb-3">TRIGGER SCENARIO</h3>
            <div className="bg-[var(--color-surface-2)] p-4 rounded border border-[var(--color-border)] space-y-2 font-mono text-sm">
              <div className={minimized ? 'opacity-30 line-through text-[var(--color-text-muted)] transition-all' : ''}>+ Malformed input (email)</div>
              <div>+ Latency injection (1200ms)</div>
              <div>+ Concurrency (20)</div>
              <div className={minimized ? 'opacity-30 line-through text-[var(--color-text-muted)] transition-all' : ''}>+ Ordering variation (flip steps)</div>
            </div>
          </div>

          {!minimized ? (
            <button 
              onClick={() => setMinimized(true)}
              className="w-full py-4 border border-[var(--color-warning)] text-[var(--color-warning)] font-bold rounded hover:bg-[var(--color-warning)]/10 transition-colors"
            >
              MINIMIZE FAILURE (DELTA DEBUG)
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="p-4 bg-[var(--color-success)]/10 border border-[var(--color-success)] rounded text-[var(--color-success)] mb-6 text-center font-bold">
                MINIMAL REPRODUCER FOUND
              </div>
              <button 
                onClick={() => window.location.href = '/reports'}
                className="w-full py-4 bg-[var(--color-danger)] text-white font-bold rounded hover:opacity-90 transition-colors"
              >
                REPLAY & VERIFY
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 mb-24">
        <h3 className="text-sm font-mono text-[var(--color-text-muted)] mb-3">SYSTEM SNAPSHOT EVIDENCE (HOVER TO INSPECT)</h3>
        <div style={{ height: '400px', position: 'relative', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
          <HalftoneReveal
            src="https://picsum.photos/seed/blackbox-crash/1200/800"
            inkColor="#ef4444"
            paperColor="#0a0a0a"
            mode="duotone"
            dotDensity={90}
            angle={28}
            revealRadius={0.28}
          />
        </div>
      </div>
    </div>
  );
}
