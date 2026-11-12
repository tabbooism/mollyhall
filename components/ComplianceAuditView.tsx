'use client';

import React, { useState } from 'react';
import {
  FileText,
  FileCheck2,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Play,
  Download,
  Printer,
  CheckCircle2,
  RefreshCw,
  Plus,
  Sliders,
} from 'lucide-react';
import {
  ComplianceFramework,
  SecurityAuditSchedule,
} from '../lib/compliance-calculator';

interface ComplianceAuditViewProps {
  frameworks: ComplianceFramework[];
  auditSchedules: SecurityAuditSchedule[];
  onTriggerAuditNow: (scheduleId: string) => void;
  onToggleSchedule: (scheduleId: string) => void;
  onOpenExportModal: () => void;
}

export const ComplianceAuditView: React.FC<ComplianceAuditViewProps> = ({
  frameworks,
  auditSchedules,
  onTriggerAuditNow,
  onToggleSchedule,
  onOpenExportModal,
}) => {
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>(frameworks[0]?.id || 'gdpr');
  const [auditRunningId, setAuditRunningId] = useState<string | null>(null);

  const selectedFw = frameworks.find((f) => f.id === selectedFrameworkId) || frameworks[0];

  const handleRunAudit = (id: string) => {
    setAuditRunningId(id);
    setTimeout(() => {
      onTriggerAuditNow(id);
      setAuditRunningId(null);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-400" />
            <h1 className="text-base font-bold text-slate-100 tracking-wide">
              REGULATORY COMPLIANCE & AUTOMATED AUDIT SYSTEM
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-800">
              GLOBAL STANDARDS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous automated auditing for GDPR, SOC 2, ISO/IEC 27001, and PCI-DSS compliance across all runehall.com infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExportModal}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md border border-blue-500 shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>EXPORT EXECUTIVE & COMPLIANCE SUMMARY</span>
          </button>
        </div>
      </div>

      {/* Framework Scores Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {frameworks.map((fw) => {
          const isSelected = fw.id === selectedFrameworkId;
          return (
            <div
              key={fw.id}
              onClick={() => setSelectedFrameworkId(fw.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-950/20 ring-1 ring-blue-500/50'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400">{fw.version}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    fw.status === 'Compliant'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {fw.status}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-200 mt-2">{fw.name}</h2>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-blue-400">{fw.complianceScore}%</span>
                <span className="text-xs text-slate-400">compliance score</span>
              </div>

              <div className="w-full bg-slate-950 h-1.5 rounded-full mt-3 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${fw.complianceScore}%` }}
                />
              </div>

              <div className="mt-2.5 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                <span>Passed: {fw.passedControls}/{fw.totalControls}</span>
                <span>Cadence: {fw.auditFrequency}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Selected Framework Controls Table (Left 7 Cols) + Automated Audit Scheduler (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Framework Controls Breakdown */}
        <div className="lg:col-span-7 rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-100">{selectedFw.name} CONTROL EVIDENCE</h2>
              <div className="text-xs text-slate-400 mt-0.5">{selectedFw.description}</div>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Last Audited: {new Date(selectedFw.lastAudited).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="space-y-2.5">
            {selectedFw.controls.map((control) => (
              <div
                key={control.id}
                className="p-3 rounded bg-slate-950 border border-slate-800/80 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400">{control.code}</span>
                    <span className="text-xs font-semibold text-slate-200">{control.name}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold shrink-0 ${
                      control.status === 'pass'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : control.status === 'partial'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {control.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded border border-slate-800/50">
                  <strong className="text-slate-300">Audited Evidence:</strong> {control.evidence}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Next Automated Audit: {selectedFw.nextScheduledAudit}</span>
            <span className="text-emerald-400">Cryptographically Signed</span>
          </div>
        </div>

        {/* Right Column: Automated Audit Scheduler Console */}
        <div className="lg:col-span-5 rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-100">AUTOMATED AUDIT SCHEDULER</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {auditSchedules.filter((s) => s.enabled).length} Active Daemons
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Autonomous audit daemons execute non-intrusive compliance verifications at scheduled intervals and feed results into the central SIEM.
          </p>

          {/* Audit Schedule List */}
          <div className="space-y-3">
            {auditSchedules.map((schedule) => {
              const isRunning = auditRunningId === schedule.id;

              return (
                <div
                  key={schedule.id}
                  className="p-3.5 rounded bg-slate-950 border border-slate-800/90 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-200">{schedule.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Scope: {schedule.targetScope}
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleSchedule(schedule.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all ${
                        schedule.enabled
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {schedule.enabled ? 'ACTIVE' : 'PAUSED'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Cadence: <strong className="text-slate-200">{schedule.cadence}</strong></span>
                    <span>Next: {schedule.nextRun.split(' ')[1] || schedule.nextRun}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono truncate max-w-[170px]">
                      {schedule.autonomousExecutor}
                    </span>

                    <button
                      onClick={() => handleRunAudit(schedule.id)}
                      disabled={isRunning}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all"
                    >
                      {isRunning ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Auditing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current text-emerald-400" />
                          <span>Run Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
