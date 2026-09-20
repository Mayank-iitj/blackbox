"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StarBorder from '@/components/StarBorder';

export default function PatientZeroPage() {
  const router = useRouter();
  const [latency, setLatency] = useState(false);
  const [concurrency, setConcurrency] = useState(false);
  const [payload, setPayload] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ run_id: 'demo' });
    if (latency || concurrency || payload) {
      params.append('chaos', 'true');
    }
    router.push(`/investigate?${params.toString()}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#000000]">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#222222] rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-600 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500 rounded-full blur-3xl opacity-10 pointer-events-none"></div>

        <h1 className="text-2xl font-mono font-bold text-white mb-2 tracking-widest text-[var(--color-danger)]">SYNTHESIZE_PATIENT_ZERO</h1>
        <p className="text-[#888888] font-mono text-xs mb-8">Configure mutation profiles to inject chaos into the system graph.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white font-mono tracking-wider border-b border-[#333] pb-2">MUTATION VECTORS</h3>
            
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${payload ? 'bg-red-500 border-red-500' : 'bg-transparent border-[#444] group-hover:border-[#666]'}`}>
                {payload && <span className="text-white text-xs">✓</span>}
              </div>
              <input type="checkbox" className="hidden" checked={payload} onChange={() => setPayload(!payload)} />
              <div>
                <div className="text-sm font-mono text-white">Payload Fuzzing</div>
                <div className="text-xs font-mono text-[#666]">Inject nulls, type swaps, and invalid schemas.</div>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${latency ? 'bg-orange-500 border-orange-500' : 'bg-transparent border-[#444] group-hover:border-[#666]'}`}>
                {latency && <span className="text-white text-xs">✓</span>}
              </div>
              <input type="checkbox" className="hidden" checked={latency} onChange={() => setLatency(!latency)} />
              <div>
                <div className="text-sm font-mono text-white">Latency Injection</div>
                <div className="text-xs font-mono text-[#666]">Simulate Slowloris and extreme response delays.</div>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${concurrency ? 'bg-yellow-500 border-yellow-500' : 'bg-transparent border-[#444] group-hover:border-[#666]'}`}>
                {concurrency && <span className="text-white text-xs">✓</span>}
              </div>
              <input type="checkbox" className="hidden" checked={concurrency} onChange={() => setConcurrency(!concurrency)} />
              <div>
                <div className="text-sm font-mono text-white">Concurrency Storm</div>
                <div className="text-xs font-mono text-[#666]">Execute parallel requests to trigger race conditions.</div>
              </div>
            </label>
          </div>

          <div className="pt-6 flex justify-end">
            <StarBorder
              as="button"
              type="submit"
              className="font-mono tracking-widest text-xs w-full"
              color="#ef4444"
              speed="3s"
              thickness={1}
              backgroundColor="#0a0a0a"
              textColor="white"
              borderColor="#222222"
            >
              DEPLOY CHAOS
            </StarBorder>
          </div>
        </form>
      </div>
    </div>
  );
}
