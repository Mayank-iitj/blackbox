"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Graph } from '@/components/Graph';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';

const INITIAL_NODES = [
  { id: 'S01', type: 'stateNode', position: { x: 400, y: 100 }, data: { id: 'S01', label: 'LOGIN' } },
  { id: 'S02', type: 'stateNode', position: { x: 400, y: 250 }, data: { id: 'S02', label: 'MFA' } },
  { id: 'S03', type: 'stateNode', position: { x: 200, y: 400 }, data: { id: 'S03', label: 'DB_QRY' } },
  { id: 'S04', type: 'stateNode', position: { x: 600, y: 400 }, data: { id: 'S04', label: 'CACHE' } },
  { id: 'S05', type: 'stateNode', position: { x: 400, y: 550 }, data: { id: 'S05', label: 'TOKEN' } },
  { id: 'S06', type: 'stateNode', position: { x: 200, y: 700 }, data: { id: 'S06', label: 'GATEWAY' } },
  { id: 'S07', type: 'stateNode', position: { x: 600, y: 700 }, data: { id: 'S07', label: 'RATE_LMT' } },
  { id: 'S08', type: 'stateNode', position: { x: 400, y: 850 }, data: { id: 'S08', label: 'AUTH_Z' } },
];

const INITIAL_EDGES = [
  { id: 'e1-2', source: 'S01', target: 'S02', label: '(auth)' },
  { id: 'e2-3', source: 'S02', target: 'S03', label: '(query)' },
  { id: 'e2-4', source: 'S02', target: 'S04', label: '(miss)' },
  { id: 'e3-5', source: 'S03', target: 'S05', label: '(sign)' },
  { id: 'e4-5', source: 'S04', target: 'S05', label: '(hit)' },
  { id: 'e5-6', source: 'S05', target: 'S06', label: '(chk)' },
  { id: 'e5-7', source: 'S05', target: 'S07', label: '(fail)' },
  { id: 'e6-8', source: 'S06', target: 'S08', label: '(ok)' },
  { id: 'e7-8', source: 'S07', target: 'S08', label: '(pass)' },
];

export default function InvestigatePage() {
  const searchParams = useSearchParams();
  const runId = searchParams.get('run_id') || 'demo';
  const hasChaos = searchParams.has('chaos');
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const [nodes, setNodes] = useState<any[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<any[]>(INITIAL_EDGES);
  const [status, setStatus] = useState('CONNECTING');

  useEffect(() => {
    // Attempt WebSocket connection
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    const ws = new WebSocket(`${wsUrl}/api/ws/runs/${runId}`);
    
    ws.onopen = () => {
      setStatus('RUNNING');
    };
    
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'state.discovered') {
        setNodes(prev => {
          // If node exists, don't add duplicate
          if (prev.find(n => n.id === msg.data.id)) return prev;
          return [...prev, {
            id: msg.data.id,
            type: 'stateNode',
            position: msg.position || { x: Math.random() * 500, y: Math.random() * 500 },
            data: msg.data
          }];
        });
      } else if (msg.type === 'transition.discovered') {
        setEdges(prev => {
          if (prev.find(e => e.id === msg.data.id)) return prev;
          return [...prev, {
            id: msg.data.id,
            source: msg.data.source,
            target: msg.data.target,
            label: msg.data.label,
            animated: true,
            data: msg.data
          }];
        });
      } else if (msg.type === 'run.completed') {
        setStatus('COMPLETED');
      }
    };
    
    ws.onclose = () => {
      setStatus('DISCONNECTED');
    };
    
    return () => ws.close();
  }, [runId, setNodes, setEdges]);

  // Dynamic simulation effect (Chaos Mode)
  useEffect(() => {
    if (status === 'RUNNING' && !hasChaos) return;
    
    const intervalSpeed = hasChaos ? 150 : 800;
    
    const interval = setInterval(() => {
      setNodes(nds => nds.map(node => {
        const pulseProb = hasChaos ? 0.7 : 0.1;
        const color = hasChaos ? '#ef4444' : '#f87171';
        
        if (Math.random() < pulseProb) {
          return {
            ...node,
            data: { ...node.data, color: color }
          };
        }
        return {
          ...node,
          data: { ...node.data, color: undefined }
        };
      }));

      setEdges(eds => eds.map(edge => {
        const pulseProb = hasChaos ? 0.8 : 0.15;
        if (Math.random() < pulseProb) {
          return {
            ...edge,
            label: hasChaos ? (Math.random() > 0.5 ? '(fail)' : '(crash)') : edge.label,
            style: { stroke: '#ef4444', strokeWidth: hasChaos ? 6 : 4, strokeDasharray: '5,5' },
            animated: true
          };
        }
        return {
          ...edge,
          label: INITIAL_EDGES.find(e => e.id === edge.id)?.label || edge.label,
          style: undefined,
          animated: true
        };
      }));
    }, intervalSpeed);

    return () => clearInterval(interval);
  }, [status, setNodes, setEdges, hasChaos]);

  const handleNodeClick = (node: any) => {
    setSelectedItem(node);
    setDrawerOpen(true);
  };

  const handleEdgeClick = (edge: any) => {
    setSelectedItem(edge);
    setDrawerOpen(true);
  };

  const displayStatus = hasChaos ? 'CRITICAL FAILURE' : status;

  return (
    <div className="flex h-screen w-full flex-col bg-[var(--color-background)]">
      <header className="h-14 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between px-6 z-10">
        <div className="font-mono font-bold tracking-widest text-lg text-[var(--color-text-primary)]">BLACK//BOX</div>
        <div className="text-sm text-[var(--color-text-muted)] flex items-center gap-4">
          <span className={`flex items-center font-bold ${displayStatus === 'RUNNING' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${displayStatus === 'RUNNING' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'} ${hasChaos ? 'animate-ping' : ''}`} /> 
            {displayStatus}
          </span>
          <span>•</span>
          <span>{nodes.length} STATES</span>
          <button 
            onClick={() => window.location.href = '/patient-zero'}
            className="ml-4 px-4 py-1 bg-[var(--color-danger)] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity"
          >
            CREATE PATIENT ZERO
          </button>
        </div>
      </header>
      
      <div className="flex-1 relative overflow-hidden">
        <Graph 
          onNodeClick={handleNodeClick} 
          onEdgeClick={handleEdgeClick} 
          nodes={nodes} 
          edges={edges} 
        />
        <EvidenceDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} selectedItem={selectedItem} />
      </div>
    </div>
  );
}
