'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Shield,
  Layers,
  ChevronRight,
  Filter,
  Copy,
  Check,
  Zap,
  ArrowRight,
} from 'lucide-react';
import {
  KillchainPhase,
  KillchainStep,
  computeKillchainProgress,
} from '../lib/killchain-engine';

interface SpaWiftKillchainConsoleProps {
  phases: KillchainPhase[];
  isKillchainRunning: boolean;
  onStartKillchain: () => void;
  onPauseKillchain: () => void;
  onResetKillchain: () => void;
  onStepNextPhase: () => void;
  targetDomain: string;
}

export const SpaWiftKillchainConsole: React.FC<SpaWiftKillchainConsoleProps> = ({
  phases,
  isKillchainRunning,
  onStartKillchain,
  onPauseKillchain,
  onResetKillchain,
  onStepNextPhase,
  targetDomain,
}) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(phases[0]?.id || 'recon');
  const [selectedStep, setSelectedStep] = useState<KillchainStep | null>(phases[0]?.steps[0] || null);
  const [logFilter, setLogFilter] = useState<'ALL' | 'CRIT' | 'WARN' | 'PASS'>('ALL');
  const [copiedLogs, setCopiedLogs] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const selectedPhase = phases.find((p) => p.id === selectedPhaseId) || phases[0];
  const stats = computeKillchainProgress(phases);

  // Default terminal log feed
  const [terminalLogs, setTerminalLogs] = useState<
    { timestamp: string; level: 'INFO' | 'WARN' | 'CRIT' | 'PASS'; message: string; technique?: string }[]
  >([
    { timestamp: '20:46:10.102', level: 'INFO', message: 'Spa Wift RedOps Assessment Framework v4.2.0 initialized.' },
    { timestamp: '20:46:10.245', level: 'INFO', message: `Target defined: ${targetDomain} (including 7 registered subdomains).` },
    { timestamp: '20:46:11.020', level: 'PASS', message: 'Pre-flight check: Non-destructive safe mode ACTIVE. Rate limit throttles engaged.' },
    { timestamp: '20:46:12.441', level: 'INFO', message: 'Phase 01 Recon: Zone transfer request to ns1.runehall.com returned REFUSED (AXFR secured).' },
    { timestamp: '20:46:13.890', level: 'INFO', message: 'Phase 01 Recon: Discovered 7 subdomains via Certificate Transparency log analysis.' },
    { timestamp: '20:46:15.112', level: 'WARN', message: 'Phase 01 Recon: dev.runehall.com exposed port 8080 and self-signed intermediate TLS cert.' },
    { timestamp: '20:46:17.330', level: 'INFO', message: 'Phase 02 Weaponization: Compiled 4 assessment modules & 3 custom telemetry plugins.' },
    { timestamp: '20:46:19.450', level: 'PASS', message: 'Phase 03 Delivery: Cloudflare WAF successfully blocked obfuscated request smuggling probe.' },
    { timestamp: '20:46:21.802', level: 'CRIT', message: 'Phase 04 Exploitation: dev.runehall.com:8080 unauthenticated /actuator/env exposed sensitive properties.' },
    { timestamp: '20:46:24.120', level: 'CRIT', message: 'Phase 05 Exfiltration: High-entropy DNS TXT queries on dev.runehall.com triggered exfiltration alert EX-8902.' },
    { timestamp: '20:46:26.550', level: 'WARN', message: 'Phase 06 Remediation: Automated Playbook PB-01 (Quarantine & Egress Sever) armed.' },
  ]);

  // Append logs when killchain is running
  useEffect(() => {
    if (!isKillchainRunning) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const messages: { level: 'INFO' | 'WARN' | 'CRIT' | 'PASS'; message: string; technique?: string }[] = [
        { level: 'INFO', message: `Probing perimeter boundary node for ${targetDomain}...`, technique: 'T1595.002' },
        { level: 'PASS', message: 'Cloudflare Zero Trust gateway validated token authentication.', technique: 'T1078' },
        { level: 'WARN', message: 'Staging sub-host response latency jitter detected (142ms delta).', technique: 'T1059' },
        { level: 'INFO', message: 'Synthesizing compliance evidence for ISO 27001 Annex A.8.8.', technique: 'ISMS-A8' },
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setTerminalLogs((prev) => [...prev.slice(-40), { timestamp: timeStr, ...randomMsg }]);
    }, 2800);
    return () => clearInterval(interval);
  }, [isKillchainRunning, targetDomain]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const filteredLogs = terminalLogs.filter((l) => {
    if (logFilter === 'ALL') return true;
    return l.level === logFilter;
  });

  const handleCopyLogs = () => {
    const text = filteredLogs.map((l) => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Console Header & Killchain Controls */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-red-500" />
            <h1 className="text-base font-bold text-slate-100 tracking-wide">
              SPA WIFT AUTOMATED KILLCHAIN CONSOLE
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-950/80 text-red-400 border border-red-800">
              MITRE ATT&CK MAPPED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-stage intrusion emulation & defensive posture validation against{' '}
            <strong className="text-slate-200 font-mono">{targetDomain}</strong>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {isKillchainRunning ? (
            <button
              onClick={onPauseKillchain}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>PAUSE RUN</span>
            </button>
          ) : (
            <button
              onClick={onStartKillchain}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-900/40 transition-all border border-red-500"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RUN AUTONOMOUS KILLCHAIN</span>
            </button>
          )}

          <button
            onClick={onStepNextPhase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>STEP NEXT</span>
          </button>

          <button
            onClick={onResetKillchain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
            title="Reset simulation parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Progress & Killchain Phase Stepper */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono text-slate-400">
              PROGRESS: <strong className="text-slate-100">{stats.percentage}%</strong>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              Steps Completed: <strong className="text-emerald-400 font-mono">{stats.completedSteps}/{stats.totalSteps}</strong>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              Flagged Anomalies: <strong className="text-red-400 font-mono">{stats.flaggedSteps}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-slate-400">EXECUTION MODE:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-semibold">
              SAFE SANDBOX / AUTONOMOUS
            </span>
          </div>
        </div>

        {/* Phase Timeline Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {phases.map((phase, idx) => {
            const isSelected = phase.id === selectedPhaseId;
            const hasFlagged = phase.steps.some((s) => s.status === 'flagged');
            const isRunning = phase.steps.some((s) => s.status === 'running');
            const isCompleted = phase.steps.every((s) => s.status === 'completed' || s.status === 'flagged');

            return (
              <button
                key={phase.id}
                onClick={() => {
                  setSelectedPhaseId(phase.id);
                  setSelectedStep(phase.steps[0] || null);
                }}
                className={`p-3 rounded text-left transition-all relative border ${
                  isSelected
                    ? 'border-red-500 bg-red-950/40 ring-1 ring-red-500/50'
                    : hasFlagged
                    ? 'border-red-900/60 bg-red-950/20 hover:border-red-800'
                    : isRunning
                    ? 'border-amber-600/70 bg-amber-950/20 animate-pulse'
                    : isCompleted
                    ? 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                    : 'border-slate-800/40 bg-slate-950/20 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-slate-400">0{idx + 1}</span>
                  {hasFlagged ? (
                    <span className="text-red-400 font-bold">ANOMALY</span>
                  ) : isRunning ? (
                    <span className="text-amber-400 font-bold">RUNNING</span>
                  ) : isCompleted ? (
                    <span className="text-emerald-400">PASSED</span>
                  ) : (
                    <span className="text-slate-500">PENDING</span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-200 truncate">{phase.name}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{phase.mitreStage.split('-')[0]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split: Steps Detail & Live Terminal Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Selected Phase Steps & Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-red-400">
                  {selectedPhase.name}
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5">{selectedPhase.mitreStage}</div>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {selectedPhase.steps.length} Steps
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedPhase.description}
            </p>

            {/* Steps List */}
            <div className="space-y-2 pt-2">
              {selectedPhase.steps.map((step) => {
                const isStepSelected = selectedStep?.id === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStep(step)}
                    className={`p-3 rounded border transition-all cursor-pointer ${
                      isStepSelected
                        ? 'border-red-500 bg-red-950/30'
                        : step.status === 'flagged'
                        ? 'border-red-900 bg-red-950/20 hover:border-red-700'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-200">{step.name}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                          step.status === 'flagged'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : step.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : step.status === 'running'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                      <span>MITRE: {step.techniqueId}</span>
                      <span>{step.durationMs > 0 ? `${step.durationMs}ms` : 'Queued'}</span>
                    </div>

                    {step.outputSummary && (
                      <div className="text-[11px] text-slate-300 mt-2 p-2 rounded bg-slate-900 border border-slate-800 font-mono">
                        {step.outputSummary}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Deep Inspector Box */}
          {selectedStep && (
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-mono border-b border-slate-800 pb-2">
                <span className="font-bold text-red-400">{selectedStep.techniqueId}</span>
                <span>Findings: {selectedStep.findingsCount}</span>
              </div>
              <div className="text-slate-300">{selectedStep.description}</div>
              {selectedStep.status === 'flagged' && (
                <div className="p-2.5 rounded bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                  <strong>Detection Note:</strong> This step triggered security defense alarms. Remediation playbook has been assigned to isolate this vector.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (7 Cols): Real-time Terminal Log Stream */}
        <div className="lg:col-span-7 rounded-lg bg-slate-950 border border-slate-800 flex flex-col h-[580px] overflow-hidden shadow-inner">
          {/* Terminal Title Bar */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              </div>
              <span className="font-mono text-xs font-semibold text-slate-300 ml-2">
                spa-wift://killchain/stream.log
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Tabs */}
              <div className="flex items-center bg-slate-950 rounded p-0.5 border border-slate-800 text-[10px] font-mono">
                {(['ALL', 'CRIT', 'WARN', 'PASS'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setLogFilter(filter)}
                    className={`px-2 py-0.5 rounded transition-all ${
                      logFilter === filter
                        ? 'bg-red-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyLogs}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Copy terminal logs"
              >
                {copiedLogs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5 selection:bg-red-900">
            {filteredLogs.map((log, index) => {
              const levelColor =
                log.level === 'CRIT'
                  ? 'text-red-400 font-bold'
                  : log.level === 'WARN'
                  ? 'text-amber-400'
                  : log.level === 'PASS'
                  ? 'text-emerald-400'
                  : 'text-slate-400';

              return (
                <div key={index} className="flex items-start gap-2 hover:bg-slate-900/60 p-0.5 rounded">
                  <span className="text-slate-500 shrink-0 select-none">{log.timestamp}</span>
                  <span
                    className={`px-1 rounded text-[10px] shrink-0 font-bold ${
                      log.level === 'CRIT'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : log.level === 'WARN'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : log.level === 'PASS'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className={`${levelColor} flex-1 break-all`}>{log.message}</span>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Footer Status */}
          <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LISTENER: PORT 4432 (TLS 1.3 mTLS)</span>
            </div>
            <span>TOTAL EVENTS: {filteredLogs.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
