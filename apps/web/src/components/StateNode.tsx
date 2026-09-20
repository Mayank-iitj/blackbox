import React from 'react';
import { Handle, Position } from 'reactflow';

const COLORS = ['#38bdf8', '#4ade80', '#fbbf24', '#f87171'];

export function StateNode({ data }: { data: any }) {
  // Pick a consistent color based on ID string length or hash
  const colorIndex = (data.id?.length || 0 + (data.label?.charCodeAt(0) || 0)) % COLORS.length;
  const color = data.color || COLORS[colorIndex];

  return (
    <div 
      className="rounded px-4 py-2 font-mono text-sm shadow-lg whitespace-nowrap"
      style={{
        backgroundColor: '#0f172a', // Dark blue-black
        color: color,
        border: `1px solid ${color}`,
        boxShadow: `0 0 12px ${color}40, inset 0 0 4px ${color}20`
      }}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold">{data.id}</span>
        {data.label && <span>[{data.label.replace(/[[\]]/g, '')}]</span>}
      </div>
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-none" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-transparent !border-none" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-transparent !border-none" />
    </div>
  );
}
