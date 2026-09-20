"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function TargetOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [targetType, setTargetType] = useState('api');
  const [authorized, setAuthorized] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  
  const handleBeginExperiment = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const targetRes = await fetch(`${apiUrl}/api/targets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Target', base_url: baseUrl || 'http://localhost', type: targetType })
      });
      const target = await targetRes.json();
      
      const runRes = await fetch(`${apiUrl}/api/runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_id: target.id })
      });
      const run = await runRes.json();
      
      router.push(`/investigate?run_id=${run.id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to connect to API");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col p-8">
      <header className="mb-12 border-b border-[var(--color-border)] pb-4">
        <h1 className="text-3xl font-bold font-mono">NEW TARGET INVESTIGATION</h1>
        <div className="flex gap-4 mt-4 text-sm font-mono text-[var(--color-text-muted)]">
          <span className={step >= 1 ? "text-[var(--color-info)]" : ""}>01: TYPE</span> •
          <span className={step >= 2 ? "text-[var(--color-info)]" : ""}>02: AUTH</span> •
          <span className={step >= 3 ? "text-[var(--color-info)]" : ""}>03: SCOPE</span>
        </div>
      </header>

      <div className="max-w-2xl w-full mx-auto flex-1">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl mb-6">Select Target Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`p-6 border rounded cursor-pointer transition-colors ${targetType === 'api' ? 'border-[var(--color-info)] bg-[var(--color-surface-2)]' : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'}`}
                onClick={() => setTargetType('api')}
              >
                <div className="font-bold mb-2 text-white">API</div>
                <div className="text-xs text-[var(--color-text-muted)]">REST/GraphQL endpoints. High determinism.</div>
              </div>
              <div 
                className={`p-6 border rounded cursor-pointer transition-colors ${targetType === 'website' ? 'border-[var(--color-info)] bg-[var(--color-surface-2)]' : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'}`}
                onClick={() => setTargetType('website')}
              >
                <div className="font-bold mb-2 text-white">Website</div>
                <div className="text-xs text-[var(--color-text-muted)]">Browser flow. (Experimental)</div>
              </div>
              <div 
                className={`p-6 border rounded cursor-pointer transition-colors ${targetType === 'logs' ? 'border-[var(--color-info)] bg-[var(--color-surface-2)]' : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'}`}
                onClick={() => setTargetType('logs')}
              >
                <div className="font-bold mb-2 text-white">Network Logs</div>
                <div className="text-xs text-[var(--color-text-muted)]">Offline HAR analysis.</div>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="mt-8 px-6 py-3 bg-[var(--color-text-primary)] text-black font-bold rounded hover:opacity-90 transition-opacity">Next Step →</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl mb-6">Authorization</h2>
            <div className="p-6 bg-[var(--color-surface-2)] border-l-4 border-[var(--color-warning)] text-[var(--color-warning)] mb-6">
              <h3 className="font-bold mb-2">SAFETY NOTICE</h3>
              <p className="text-sm">Only analyze systems you own or have explicit authorization to test. BLACK BOX will perform automated exploratory interactions that may mutate state.</p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={authorized} onChange={(e) => setAuthorized(e.target.checked)} className="w-5 h-5 accent-[var(--color-info)]" />
              <span>I confirm I am authorized to probe this target.</span>
            </label>
            <div className="mt-8 flex gap-4">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-[var(--color-border)] font-bold rounded hover:bg-[var(--color-surface-2)]">← Back</button>
              <button disabled={!authorized} onClick={() => setStep(3)} className="px-6 py-3 bg-[var(--color-info)] text-black font-bold rounded disabled:opacity-50 hover:opacity-90 transition-opacity">Acknowledge & Next →</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl mb-6">Scope Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--color-text-muted)] mb-1">Base URL</label>
                <input type="text" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.example.com" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-info)]" />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-text-muted)] mb-1">Max Concurrency</label>
                <input type="number" defaultValue={5} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-info)]" />
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <button onClick={() => setStep(2)} className="px-6 py-3 border border-[var(--color-border)] font-bold rounded hover:bg-[var(--color-surface-2)]">← Back</button>
              <button onClick={handleBeginExperiment} className="px-6 py-3 bg-[var(--color-success)] text-black font-bold rounded hover:opacity-90 transition-opacity">BEGIN CONTROLLED EXPERIMENT</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
