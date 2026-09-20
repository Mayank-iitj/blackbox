"use client";
import React, { useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { StateNode } from './StateNode';

const COLORS = ['#38bdf8', '#4ade80', '#fbbf24', '#f87171'];

export function Graph({ 
  onNodeClick, 
  onEdgeClick,
  nodes: propNodes,
  edges: propEdges
}: { 
  onNodeClick?: (node: Node) => void, 
  onEdgeClick?: (edge: Edge) => void,
  nodes: Node[],
  edges: Edge[]
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(propNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(propEdges);

  const nodeTypes = useMemo(() => ({ stateNode: StateNode }), []);

  // Sync incoming props to state for dynamic rendering
  useEffect(() => {
    setNodes(propNodes);
  }, [propNodes, setNodes]);

  useEffect(() => {
    const styledEdges = propEdges.map((edge, i) => {
      const color = COLORS[i % COLORS.length];
      return {
        ...edge,
        animated: true,
        style: {
          stroke: color,
          strokeWidth: 2,
          strokeDasharray: '5, 5',
        },
        labelStyle: { fill: color, fontWeight: 700, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#0f172a', opacity: 0.8 },
      };
    });
    setEdges(styledEdges);
  }, [propEdges, setEdges]);

  return (
    <div className="absolute inset-0 bg-[#070b14]" style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(e, node) => onNodeClick?.(node)}
        onEdgeClick={(e, edge) => onEdgeClick?.(edge)}
        fitView
        defaultEdgeOptions={{ type: 'straight' }}
      >
        <Background color="#1e293b" gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}
