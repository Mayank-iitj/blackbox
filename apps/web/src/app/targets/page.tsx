"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StarBorder from '@/components/StarBorder';

export default function TargetSetupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create target
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const targetRes = await fetch(`${apiUrl}/api/targets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, base_url: baseUrl, type: 'api' })
      });
      const targetData = await targetRes.json();

      // 2. Start discovery run
      const runRes = await fetch(`${apiUrl}/api/runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_id: targetData.id })
      });
      const runData = await runRes.json();

      // 3. Redirect to investigate page
      router.push(`/investigate?run_id=${runData.id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#000000]">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#222222] rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-10 pointer-events-none"></div>

        <h1 className="text-2xl font-mono font-bold text-white mb-2 tracking-widest">CONFIGURE_TARGET</h1>
        <p className="text-[#888888] font-mono text-xs mb-8">Define the API perimeter for the discovery engine to crawl.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white font-mono tracking-wider">TARGET NAME</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Core Banking API"
              className="w-full bg-[#111111] border border-[#333333] rounded px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white font-mono tracking-wider">BASE URL</label>
            <input 
              type="url" 
              required
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com/v1"
              className="w-full bg-[#111111] border border-[#333333] rounded px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <StarBorder
              as="button"
              type="submit"
              disabled={loading}
              className="font-mono tracking-widest text-xs w-full"
              color="#3b82f6"
              speed="4s"
              thickness={1}
              backgroundColor="#0a0a0a"
              textColor="white"
              borderColor="#222222"
            >
              {loading ? "INITIALIZING..." : "START DISCOVERY"}
            </StarBorder>
          </div>
        </form>
      </div>
    </div>
  );
}
