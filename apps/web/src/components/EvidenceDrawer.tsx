"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function EvidenceDrawer({ isOpen, onClose, selectedItem }: { isOpen: boolean, onClose: () => void, selectedItem: any }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[400px] bg-[var(--color-surface)] border-l border-[var(--color-border)] p-6 z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold font-mono text-[var(--color-text-primary)]">EVIDENCE E-{Math.floor(Math.random() * 1000)}</h2>
              <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-white">✕</button>
            </div>
            
            {selectedItem && (
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] mb-1 uppercase">Target</div>
                  <div className="font-mono text-sm bg-[var(--color-surface-2)] p-2 rounded text-[var(--color-text-primary)]">{selectedItem.data?.label || selectedItem.label || 'Unknown'}</div>
                </div>
                
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] mb-1 uppercase">Confidence</div>
                  <div className="w-full bg-[var(--color-surface-2)] h-2 rounded overflow-hidden">
                    <div className="bg-[var(--color-success)] h-full" style={{ width: `${(selectedItem.data?.confidence || 0.9) * 100}%` }} />
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] mb-1 uppercase">Schema Evidence</div>
                  <pre className="font-mono text-xs bg-[var(--color-surface-2)] p-4 rounded overflow-x-auto text-[var(--color-info)]">
                    {JSON.stringify(selectedItem.data?.schema || { status: 200, message: "OK" }, null, 2)}
                  </pre>
                </div>
                
                <div className="pt-4 border-t border-[var(--color-border)]">
                  <button className="w-full py-3 bg-[var(--color-border)] text-white font-bold rounded hover:bg-[var(--color-surface-2)] transition-colors mb-2">
                    OPEN RAW
                  </button>
                  <button className="w-full py-3 bg-[var(--color-danger)] text-white font-bold rounded hover:opacity-90 transition-colors">
                    REPLAY
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
