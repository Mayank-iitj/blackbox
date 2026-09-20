"use client";
import React from 'react';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] p-8">
      <header className="mb-12 border-b border-[var(--color-border)] pb-4 max-w-5xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-mono">INVESTIGATION REPORT</h1>
          <p className="text-[var(--color-text-muted)] mt-2">Target: demo-api-v1</p>
        </div>
        <button 
          onClick={() => alert("Generating PDF Report...")}
          className="px-6 py-2 bg-[var(--color-text-primary)] text-[var(--color-background)] font-bold rounded hover:opacity-90"
        >
          EXPORT PDF
        </button>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded shadow-lg">
          <div className="text-sm font-mono text-[var(--color-text-muted)] mb-4">BEHAVIOR MAP</div>
          <div className="text-4xl font-bold text-[var(--color-info)] mb-2">14</div>
          <div className="text-sm text-[var(--color-text-muted)]">Inferred States</div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="text-4xl font-bold text-[var(--color-info)] mb-2">31</div>
            <div className="text-sm text-[var(--color-text-muted)]">Observed Transitions</div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded shadow-lg">
          <div className="text-sm font-mono text-[var(--color-text-muted)] mb-4">RESILIENCE</div>
          <div className="text-4xl font-bold text-[var(--color-danger)] mb-2">3</div>
          <div className="text-sm text-[var(--color-text-muted)]">Reproducible Failures</div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="text-4xl font-bold text-[var(--color-warning)] mb-2">7</div>
            <div className="text-sm text-[var(--color-text-muted)]">Anomalies Detected</div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-sm font-mono text-[var(--color-text-muted)] mb-4">COVERAGE CONFIDENCE</div>
            <div className="text-5xl font-bold text-[var(--color-success)]">82%</div>
          </div>
          <div className="text-sm text-[var(--color-text-muted)] mt-4">
            Based on similarity clustering of 1,402 probes across 4 mutation strategies.
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto mt-12 text-center text-sm font-mono text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-8">
        THE SOURCE CODE WAS HIDDEN. THE BEHAVIOR WAS NOT.
      </div>
    </div>
  );
}
