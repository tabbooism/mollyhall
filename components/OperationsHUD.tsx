'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Globe,
  Lock,
  Activity,
  AlertTriangle,
  ArrowRight,
  Zap,
  CheckCircle2,
  FileCheck2,
  Radio,
  Server,
  AlertOctagon,
  Layers,
  Search,
  ExternalLink,
  Shield,
  Sparkles,
} from 'lucide-react';
import { EnrichedDomain } from '../lib/domain-parser';
import { KillchainPhase, computeKillchainProgress } from '../lib/killchain-engine';
import { ComplianceFramework, VulnerabilityFinding } from '../lib/compliance-calculator';

interface OperationsHUDProps {
  domains: EnrichedDomain[];
  phases: KillchainPhase[];
  frameworks: ComplianceFramework[];
  vulnerabilities: VulnerabilityFinding[];
  isKillchainRunning: boolean;
  onNavigateTab: (tab: any) => void;
  onTriggerKillchain: () => void;
  onExecutePlaybook: (playbookId: string) => void;
}

export const OperationsHUD: React.FC<OperationsHUDProps> = ({
  domains,
  phases,
  frameworks,
  vulnerabilities,
  isKillchainRunning,
  onNavigateTab,
  onTriggerKillchain,
  onExecutePlaybook,
}) => {
  const [defcon, setDefcon] = useState<number>(2);
  const killchainStats = computeKillchainProgress(phases);
  const exfilThreats = domains.filter((d) => d.potentialExfiltrationDetected);
  const criticalVulns = vulnerabilities.filter((v) => v.severity === 'Critical' || v.severity === 'High');
  const avgCompliance =
    frameworks.reduce((acc, f) => acc + f.complianceScore, 0) / (frameworks.length || 1);

  return (
    <div className="space-y-6">
      {/* Top Threat Banner for Anomalies */}
      {exfilThreats.length > 0 && (
        <div className="rounded-lg border border-red-500/50 bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/60 p-4 shadow-lg shadow-red-950/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-red-600/20 border border-red-500 text-red-400 shrink-0 mt-0.5">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-red-200 text-sm tracking-wide">
                  CRITICAL ANOMALY DETECTED: EXFILTRATION SUSPECTED
                </span>
                <div className="flex items-center gap-1 bg-slate-950/90 px-2 py-0.5 rounded border border-red-500/40">
                  <span className="text-[10px] text-slate-400 uppercase font-mono mr-1">DEFCON:</span>
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setDefcon(lvl)}
                      className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded transition-all ${
                        defcon === lvl
                          ? lvl === 1
                            ? 'bg-rose-600 text-white animate-pulse'
                            : lvl === 2
                            ? 'bg-red-500 text-white'
                            : lvl === 3
                            ? 'bg-amber-500 text-slate-950'
                            : lvl === 4
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                      title={`Switch to DEFCON ${lvl}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Anomalous DNS tunneling burst detected on{' '}
                <strong className="text-red-400 font-mono">dev.runehall.com</strong> (Port 8080 exposed, high-entropy TXT requests). Automated playbook containment is armed.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onExecutePlaybook('pb-01')}
              className="px-3.5 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all shadow-md shadow-red-950 border border-red-400"
            >
              TRIGGER QUARANTINE PLAYBOOK
            </button>
            <button
              onClick={() => onNavigateTab('vuln_setkit')}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-all"
            >
              INSPECT FINDINGS
            </button>
          </div>
        </div>
      )}

      {/* RedOps Tactical Operations Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Station 1: MaxPayne Fleet Engine */}
        <div
          onClick={() => onNavigateTab('redops_engine')}
          className="cursor-pointer group rounded-lg border border-red-900/40 bg-gradient-to-br from-red-950/30 via-slate-900 to-slate-900/90 p-4 hover:border-red-500 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                MaxPayne Fleet Runner
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              19 PYTHON MODS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2">
            Execute stdlib reconnaissance modules and Fortress scripts directly against runehall.com.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-mono text-red-400 group-hover:text-red-300">
            <span>Launch Engine Console</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Station 2: MITRE ATT&CK Matrix */}
        <div
          onClick={() => onNavigateTab('mitre_matrix')}
          className="cursor-pointer group rounded-lg border border-purple-900/40 bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-900/90 p-4 hover:border-purple-500 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                MITRE ATT&CK Matrix
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
              14 TACTICS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2">
            Enterprise v14 tactical coverage, technique verification, detection rules, and Navigator export.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-mono text-purple-400 group-hover:text-purple-300">
            <span>Inspect ATT&CK Heatmap</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Station 3: Crisis War Room */}
        <div
          onClick={() => onNavigateTab('war_room')}
          className="cursor-pointer group rounded-lg border border-amber-900/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900/90 p-4 hover:border-amber-500 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Crisis War Room
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              INTEL DOSSIERS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2">
            Adversary intelligence files, Google Dork query generator, IOC ledger, and SHA-256 evidence lockbox.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-mono text-amber-400 group-hover:text-amber-300">
            <span>Enter Crisis Station</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Active Killchain */}
        <div
          onClick={() => onNavigateTab('killchain')}
          className="cursor-pointer group p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-red-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Spa Wift Killchain
            </span>
            <Terminal className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">
              {killchainStats.percentage}%
            </span>
            <span className="text-xs font-mono text-emerald-400">
              {killchainStats.completedSteps}/{killchainStats.totalSteps} steps
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isKillchainRunning ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
              }`}
              style={{ width: `${killchainStats.percentage}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Status:</span>
            <span className={isKillchainRunning ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
              {isKillchainRunning ? 'Executing Pipeline' : 'Phase 6: Remediation'}
            </span>
          </div>
        </div>

        {/* Card 2: Monitored Subdomains */}
        <div
          onClick={() => onNavigateTab('domain_hunting')}
          className="cursor-pointer group p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-red-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Runehall.com Ingress
            </span>
            <Globe className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">
              {domains.length}
            </span>
            <span className="text-xs text-slate-400">active assets</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Protected Subdomains:</span>
            <span className="text-slate-200 font-mono font-medium">100% Enriched</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>DNSSEC & TLS 1.3 Baseline</span>
          </div>
        </div>

        {/* Card 3: Exfiltration Sentinel */}
        <div
          onClick={() => onNavigateTab('vuln_setkit')}
          className="cursor-pointer group p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-red-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Exfil Anomaly Radar
            </span>
            <Radio className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-red-400">
              {exfilThreats.length}
            </span>
            <span className="text-xs text-red-300 font-medium">anomalous target</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Egress Canary:</span>
            <span className="text-red-400 font-mono font-bold">TXT Entropy &gt; 4.8</span>
          </div>
          <div className="mt-2 text-[10px] text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>dev.runehall.com flagged</span>
          </div>
        </div>

        {/* Card 4: Cloud MFA Enforcement */}
        <div
          onClick={() => onNavigateTab('cloud_mfa')}
          className="cursor-pointer group p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-red-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Cloud Access MFA
            </span>
            <Lock className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              100%
            </span>
            <span className="text-xs text-emerald-300">enforced</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Access Points:</span>
            <span className="text-slate-200 font-mono">5 Clouds / 59 Users</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3" />
            <span>Zero-Trust FIDO2 Verified</span>
          </div>
        </div>

        {/* Card 5: Regulatory Compliance */}
        <div
          onClick={() => onNavigateTab('compliance_audits')}
          className="cursor-pointer group p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-red-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Compliance Posture
            </span>
            <FileCheck2 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-400">
              {avgCompliance.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">average score</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Frameworks:</span>
            <span className="text-slate-200 font-mono">GDPR, SOC2, ISO27K</span>
          </div>
          <div className="mt-2 text-[10px] text-blue-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Automated Daily Audits</span>
          </div>
        </div>
      </div>

      {/* Mid Section: Killchain Stage Flow & Threat Activity Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Spa Wift Killchain Execution Map */}
        <div className="lg:col-span-2 rounded-lg bg-slate-900/80 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red-500" />
              <h2 className="font-bold text-sm text-slate-100 tracking-wide">
                SPA WIFT AUTOMATED KILLCHAIN LIFECYCLE
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">Target: runehall.com</span>
              <button
                onClick={onTriggerKillchain}
                disabled={isKillchainRunning}
                className="px-2.5 py-1 text-xs rounded bg-red-600/90 hover:bg-red-500 text-white font-medium"
              >
                {isKillchainRunning ? 'Re-running...' : 'Run Simulation'}
              </button>
            </div>
          </div>

          {/* Phase Nodes */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {phases.map((phase, idx) => {
              const hasFlagged = phase.steps.some((s) => s.status === 'flagged');
              const isRunning = phase.steps.some((s) => s.status === 'running');
              const isDone = phase.steps.every((s) => s.status === 'completed' || s.status === 'flagged');

              return (
                <div
                  key={phase.id}
                  onClick={() => onNavigateTab('killchain')}
                  className={`p-3 rounded border transition-all cursor-pointer ${
                    hasFlagged
                      ? 'bg-red-950/30 border-red-500/60 hover:border-red-400'
                      : isRunning
                      ? 'bg-amber-950/30 border-amber-500/60 animate-pulse'
                      : isDone
                      ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/30 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Phase 0{idx + 1}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] uppercase ${
                        hasFlagged
                          ? 'bg-red-500/20 text-red-400'
                          : isRunning
                          ? 'bg-amber-500/20 text-amber-400'
                          : isDone
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {hasFlagged ? 'FLAGGED' : isRunning ? 'RUNNING' : isDone ? 'PASSED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 truncate">{phase.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{phase.mitreStage}</div>
                  <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Steps: {phase.steps.length}</span>
                    {hasFlagged && <span className="text-red-400 font-semibold font-mono">1 anomaly</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Autonomous remediation pipeline engaged for anomalous staging assets.</span>
            </span>
            <button
              onClick={() => onNavigateTab('killchain')}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 font-medium text-xs"
            >
              Open Console <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Col: Monitored Subdomains Quick Snapshot & Threat Feed */}
        <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <h2 className="font-bold text-sm text-slate-100 tracking-wide">
                RUNEHALL.COM ASSETS
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('domain_hunting')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              View All ({domains.length})
            </button>
          </div>

          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
            {domains.map((item) => (
              <div
                key={item.domain}
                onClick={() => onNavigateTab('domain_hunting')}
                className={`p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between ${
                  item.potentialExfiltrationDetected
                    ? 'bg-red-950/30 border-red-800 hover:border-red-600'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                      {item.domain}
                    </span>
                    {item.potentialExfiltrationDetected && (
                      <span className="px-1 text-[9px] font-mono rounded bg-red-600 text-white">
                        EXFIL RISK
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                    <span>TLS: {item.tlsGrade}</span>
                    <span>•</span>
                    <span>Ports: {item.openPorts.slice(0, 3).join(', ')}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      item.riskLevel === 'Critical'
                        ? 'bg-red-500/20 text-red-400'
                        : item.riskLevel === 'High'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    Risk: {item.riskScore}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Audit Schedule:</span>
            <span className="font-mono text-slate-300 font-medium">Daily at 00:00 UTC</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Vulnerabilities & Incident Response Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discovered Vulnerabilities Preview */}
        <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h2 className="font-bold text-sm text-slate-100">
                ACTIVE VULNERABILITY DISCOVERY FINDINGS
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('vuln_setkit')}
              className="text-xs text-red-400 hover:text-red-300 font-medium"
            >
              Open Set Kit
            </button>
          </div>

          <div className="space-y-2">
            {vulnerabilities.slice(0, 3).map((v) => (
              <div
                key={v.id}
                onClick={() => onNavigateTab('vuln_setkit')}
                className="p-3 rounded bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-200 truncate">{v.title}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono rounded shrink-0 ${
                      v.severity === 'Critical'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : v.severity === 'High'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    CVSS {v.cvssScore} • {v.severity}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                  <span>Target: {v.targetAsset}</span>
                  <span className="text-slate-500">{v.cwe.split(':')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rapid Incident Response Playbooks Action Box */}
        <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <h2 className="font-bold text-sm text-slate-100">
                INCIDENT RESPONSE PLAYBOOKS & CONTAINMENT
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('playbooks')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Manage Playbooks
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded bg-slate-950/60 border border-red-900/40 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-red-300">
                  Data Exfiltration Quarantine & Egress Sever
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Target: dev.runehall.com • Steps: 5 containment actions
                </div>
              </div>
              <button
                onClick={() => onExecutePlaybook('pb-01')}
                className="px-2.5 py-1 text-xs rounded bg-red-600 hover:bg-red-500 text-white font-medium shrink-0"
              >
                Execute Now
              </button>
            </div>

            <div className="p-3 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Cloud IAM Key Revocation & Mandatory MFA Enforcement
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Enforces hardware key re-challenge across AWS/GCP access points
                </div>
              </div>
              <button
                onClick={() => onExecutePlaybook('pb-02')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium shrink-0 border border-slate-700"
              >
                Execute Now
              </button>
            </div>

            <div className="p-3 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Zero Trust Host Isolation & Container Patching
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Drops unauthenticated traffic to port 8080 via Kubernetes NetworkPolicy
                </div>
              </div>
              <button
                onClick={() => onExecutePlaybook('pb-03')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium shrink-0 border border-slate-700"
              >
                Execute Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
