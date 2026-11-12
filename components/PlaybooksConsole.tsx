'use client';

import React, { useState } from 'react';
import {
  Layers,
  ShieldAlert,
  Play,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
  Server,
  Lock,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { IncidentPlaybook } from '../lib/compliance-calculator';

interface PlaybooksConsoleProps {
  playbooks: IncidentPlaybook[];
  onExecutePlaybookStep: (playbookId: string, stepOrder: number) => void;
  onExecuteFullPlaybook: (playbookId: string) => void;
  activePlaybookId?: string;
}

export const PlaybooksConsole: React.FC<PlaybooksConsoleProps> = ({
  playbooks,
  onExecutePlaybookStep,
  onExecuteFullPlaybook,
  activePlaybookId,
}) => {
  const [selectedPbId, setSelectedPbId] = useState<string>(activePlaybookId || playbooks[0]?.id || 'pb-01');

  const selectedPb = playbooks.find((p) => p.id === selectedPbId) || playbooks[0];

  const totalSteps = selectedPb.steps.length;
  const executedSteps = selectedPb.steps.filter((s) => s.status === 'executed').length;
  const percentComplete = Math.round((executedSteps / totalSteps) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <h1 className="text-base font-bold text-slate-100 tracking-wide">
              INCIDENT RESPONSE PLAYBOOKS & AUTOMATED CONTAINMENT
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-400 border border-amber-800">
              SOAR ORCHESTRATION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pre-flighted automated containment routines for exfiltration alerts, cloud credential leaks, and staging isolation.
          </p>
        </div>

        <button
          onClick={() => onExecuteFullPlaybook(selectedPb.id)}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-red-950 border border-red-500 shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>EXECUTE FULL PLAYBOOK</span>
        </button>
      </div>

      {/* Main Split: Playbooks Selector (Left 4 cols) + Interactive Playbook Runner (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Playbook List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold font-mono text-slate-400">PLAYBOOK INVENTORY:</span>
          <div className="space-y-2">
            {playbooks.map((pb) => {
              const isSelected = pb.id === selectedPbId;
              const completedCount = pb.steps.filter((s) => s.status === 'executed').length;

              return (
                <div
                  key={pb.id}
                  onClick={() => setSelectedPbId(pb.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500/50'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{pb.id.toUpperCase()}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
                        pb.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {pb.severity}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-200 mt-1">{pb.title}</h3>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">{pb.targetThreat}</div>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Est: {pb.estimatedExecutionTime}</span>
                    <span className="text-emerald-400 font-semibold">
                      {completedCount}/{pb.steps.length} Steps
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Playbook Step-by-Step Interactive Execution View */}
        <div className="lg:col-span-8 rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">{selectedPb.title}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  {selectedPb.estimatedExecutionTime} SLA
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Trigger: <strong className="text-slate-300 font-mono">{selectedPb.triggerCondition}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">STATUS:</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {percentComplete}% CONTAINED
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">
              CONTAINMENT ACTION SEQUENCE:
            </span>

            {selectedPb.steps.map((step) => {
              const isExecuted = step.status === 'executed';
              const isInProgress = step.status === 'in_progress';

              return (
                <div
                  key={step.order}
                  className={`p-3.5 rounded border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isExecuted
                      ? 'bg-slate-950/40 border-emerald-900/60'
                      : isInProgress
                      ? 'bg-amber-950/20 border-amber-600/70 animate-pulse'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 ${
                        isExecuted
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : isInProgress
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isExecuted ? <CheckCircle2 className="w-3.5 h-3.5" /> : `0${step.order}`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{step.actionName}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                          {step.serviceAffected}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isExecuted ? (
                      <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                        EXECUTED
                      </span>
                    ) : (
                      <button
                        onClick={() => onExecutePlaybookStep(selectedPb.id, step.order)}
                        className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
                      >
                        Run Step
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Containment Receipt Note */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Immutable containment audit log signed with SHA-256 for compliance evidence.</span>
            </span>
            <span className="font-mono text-slate-400 text-[11px]">Audit ID: #IR-8921-SIG</span>
          </div>
        </div>
      </div>
    </div>
  );
};
