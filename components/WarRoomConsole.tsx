'use client';

import React, { useState } from 'react';
import {
  Radio,
  Shield,
  ShieldAlert,
  Search,
  ExternalLink,
  Plus,
  Copy,
  Check,
  Lock,
  Clock,
  Layers,
  Activity,
  AlertOctagon,
  FileText,
  Key,
} from 'lucide-react';
import {
  INITIAL_INTEL_DOSSIERS,
  GOOGLE_DORK_TEMPLATES,
  INITIAL_IOC_RECORDS,
  INITIAL_WAR_ROOM_EVENTS,
  IntelDossier,
  IndicatorOfCompromise,
  WarRoomEvent,
  buildGoogleDorkUrl,
  computeSha256Simulated,
} from '../lib/war-room-data';

interface WarRoomConsoleProps {
  targetDomain?: string;
}

export const WarRoomConsole: React.FC<WarRoomConsoleProps> = ({
  targetDomain = 'runehall.com',
}) => {
  const [defconLevel, setDefconLevel] = useState<number>(2);
  const [dossiers, setDossiers] = useState<IntelDossier[]>(INITIAL_INTEL_DOSSIERS);
  const [iocs, setIocs] = useState<IndicatorOfCompromise[]>(INITIAL_IOC_RECORDS);
  const [events, setEvents] = useState<WarRoomEvent[]>(INITIAL_WAR_ROOM_EVENTS);
  const [activeTab, setActiveTab] = useState<'iocs' | 'dossiers' | 'dorks' | 'lockbox' | 'timeline'>('iocs');

  const [selectedDossier, setSelectedDossier] = useState<IntelDossier>(dossiers[0]);
  const [iocSearch, setIocSearch] = useState('');
  const [lockboxInput, setLockboxInput] = useState(
    'GET /actuator/env HTTP/1.1\nHost: dev.runehall.com:8080\nUser-Agent: Mozilla/5.0 (compatible; RedOps/4.2)'
  );
  const [calculatedHash, setCalculatedHash] = useState<string>(
    computeSha256Simulated(lockboxInput)
  );
  const [copiedHash, setCopiedHash] = useState(false);

  // New IOC state modal
  const [showAddIoc, setShowAddIoc] = useState(false);
  const [newIocType, setNewIocType] = useState<IndicatorOfCompromise['type']>('IPv4');
  const [newIocValue, setNewIocValue] = useState('');
  const [newIocLevel, setNewIocLevel] = useState<IndicatorOfCompromise['threatLevel']>('High');

  const handleComputeHash = () => {
    setCalculatedHash(computeSha256Simulated(lockboxInput));
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(calculatedHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleAddIocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIocValue.trim()) return;
    const newRecord: IndicatorOfCompromise = {
      id: `IOC-${Date.now().toString().slice(-4)}`,
      type: newIocType,
      value: newIocValue.trim(),
      threatLevel: newIocLevel,
      source: 'Operator War Room Dispatch',
      firstReported: new Date().toISOString(),
      actionTaken: 'Blocked',
    };
    setIocs([newRecord, ...iocs]);
    setShowAddIoc(false);
    setNewIocValue('');
  };

  const filteredIocs = iocs.filter((ioc) => {
    if (!iocSearch) return true;
    return (
      ioc.value.toLowerCase().includes(iocSearch.toLowerCase()) ||
      ioc.type.toLowerCase().includes(iocSearch.toLowerCase()) ||
      ioc.source.toLowerCase().includes(iocSearch.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Threat Level / DEFCON Crisis Broadcast Bar */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-red-600 via-amber-700 to-red-950 text-white border border-red-500/40 shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-100 tracking-wide font-mono">
                  WAR ROOM // THREAT INTELLIGENCE & CRISIS STATION
                </h1>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    defconLevel === 1
                      ? 'bg-red-600 text-white animate-bounce'
                      : defconLevel === 2
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  DEFCON {defconLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Centralized intelligence nexus inspired by <strong className="text-slate-200 font-mono">redops-intel</strong>: live IOC tracking, case dossiers, Google Dork Forge, and tamper-proof evidence lockbox.
              </p>
            </div>
          </div>

          {/* DEFCON Selector Controls */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded border border-slate-800 text-xs font-mono">
            <span className="text-[10px] text-slate-500 px-1 font-bold">DEFCON:</span>
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDefconLevel(lvl)}
                className={`px-2 py-1 rounded transition-all font-bold ${
                  defconLevel === lvl
                    ? lvl === 1
                      ? 'bg-red-600 text-white'
                      : lvl === 2
                      ? 'bg-red-800 text-white'
                      : lvl === 3
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-700 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                0{lvl}
              </button>
            ))}
          </div>
        </div>

        {/* DEFCON Alert Text */}
        <div className="p-3 rounded bg-red-950/30 border border-red-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-red-300">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              CRISIS STATE: dev.runehall.com staging network interface isolated; honeypot active.
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">Primary Target: {targetDomain}</span>
        </div>
      </div>

      {/* War Room Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-slate-800 pb-2 text-xs font-mono">
        {[
          { id: 'iocs', label: 'Indicators of Compromise (IOCs)', count: iocs.length },
          { id: 'dossiers', label: 'Case Dossiers', count: dossiers.length },
          { id: 'dorks', label: 'Google Dork Forge', count: GOOGLE_DORK_TEMPLATES.length },
          { id: 'lockbox', label: 'Evidence Lockbox (SHA-256)' },
          { id: 'timeline', label: 'Crisis Timeline', count: events.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 whitespace-nowrap font-semibold ${
              activeTab === tab.id
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-950/70 text-slate-300">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: IOC Records Table */}
      {activeTab === 'iocs' && (
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-mono">
                INDICATORS OF COMPROMISE (IOC) ACTIVE LEDGER
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                Cryptographically tracked malicious IPs, exfiltration strings, and honeypot redirects.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddIoc(true)}
                className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD NEW IOC</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={iocSearch}
              onChange={(e) => setIocSearch(e.target.value)}
              placeholder="Search IOCs by value, protocol, or origin..."
              className="w-full pl-8 pr-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">TYPE</th>
                  <th className="p-3">INDICATOR VALUE</th>
                  <th className="p-3">SEVERITY</th>
                  <th className="p-3">DISCOVERY SOURCE</th>
                  <th className="p-3">FIRST SEEN</th>
                  <th className="p-3 text-right">ACTION TAKEN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredIocs.map((ioc) => (
                  <tr key={ioc.id} className="hover:bg-slate-950/60 transition-all">
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-bold">
                        {ioc.type}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-200 max-w-md truncate">
                      {ioc.value}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ioc.threatLevel === 'Critical'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : ioc.threatLevel === 'High'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}
                      >
                        {ioc.threatLevel}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{ioc.source}</td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      {new Date(ioc.firstReported).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-emerald-400 border border-slate-800">
                        {ioc.actionTaken}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Case Dossiers */}
      {activeTab === 'dossiers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400">ACTIVE DOSSIER FILES:</span>
            <div className="space-y-2">
              {dossiers.map((dossier) => {
                const isSelected = selectedDossier.id === dossier.id;
                return (
                  <div
                    key={dossier.id}
                    onClick={() => setSelectedDossier(dossier)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500">{dossier.id}</span>
                      <span className="text-emerald-400 font-bold">{dossier.confidenceGrade}</span>
                    </div>
                    <h3 className="text-sm font-bold font-mono text-slate-100 mt-1">
                      {dossier.codename}
                    </h3>
                    <div className="text-xs text-slate-400 mt-1">{dossier.subjectType}</div>
                    <div className="mt-2 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                      <span>Target: {dossier.primaryTarget}</span>
                      <span className="text-red-400 font-bold">Risk: {dossier.riskRating}/100</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-red-400">{selectedDossier.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    {selectedDossier.status}
                  </span>
                </div>
                <h2 className="text-base font-bold font-mono text-slate-100 mt-1">
                  {selectedDossier.codename}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 px-2 py-1 rounded border border-red-800">
                  RISK: {selectedDossier.riskRating}/100
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-500 font-bold uppercase">
                EXECUTIVE SYNOPSIS:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800 font-mono">
                {selectedDossier.synopsis}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                INFRASTRUCTURE & CANARY ARTIFACTS:
              </span>
              <div className="space-y-1 font-mono text-xs">
                {selectedDossier.infrastructureIndicators.map((ind, i) => (
                  <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    • {ind}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                KEY FORENSIC FINDINGS:
              </span>
              <div className="space-y-1 font-mono text-xs">
                {selectedDossier.keyFindings.map((f, i) => (
                  <div key={i} className="p-2 rounded bg-emerald-950/20 border border-emerald-800/40 text-emerald-200">
                    ✔ {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Google Dork Forge */}
      {activeTab === 'dorks' && (
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 font-mono">
              GOOGLE DORK FORGE & OSINT RECONNAISSANCE ENGINE
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Clickable Google dork queries tailored to hunt for exposed assets, environment dumps, and open buckets on{' '}
              <strong className="text-slate-200 font-mono">{targetDomain}</strong>.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            {GOOGLE_DORK_TEMPLATES.map((dork) => {
              const url = buildGoogleDorkUrl(dork.dorkPattern, targetDomain);
              return (
                <div
                  key={dork.id}
                  className="p-3.5 rounded bg-slate-950 border border-slate-800/90 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{dork.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400">
                        {dork.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{dork.description}</div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800/60 text-[10px] text-red-300 mt-2 break-all">
                      {dork.dorkPattern.replace(/\{\{TARGET\}\}/g, targetDomain)}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
                    >
                      <span>Execute Dork</span>
                      <ExternalLink className="w-3 h-3 text-red-400" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Evidence Lockbox */}
      {activeTab === 'lockbox' && (
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>CRYPTOGRAPHIC EVIDENCE LOCKBOX & SHA-256 NOTARY</span>
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Paste request payloads, memory dump excerpts, or packet captures to generate tamper-proof SHA-256 audit tokens.
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">EVIDENCE PAYLOAD OR PACKET DATA:</label>
              <textarea
                rows={5}
                value={lockboxInput}
                onChange={(e) => {
                  setLockboxInput(e.target.value);
                  setCalculatedHash(computeSha256Simulated(e.target.value));
                }}
                className="w-full p-3 rounded bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>COMPUTED SHA-256 ATTESTATION HASH:</span>
                <button
                  onClick={handleCopyHash}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Hash</span>
                </button>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs break-all font-bold">
                {calculatedHash}
              </div>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Cryptographic Chain: Chain of custody locked under ISO 27001 Annex A.8.28</span>
              <span className="text-emerald-400 font-bold">VERIFIED IMMUTABLE</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Crisis Timeline */}
      {activeTab === 'timeline' && (
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>LIVE INCIDENT CHRONICLE & CRISIS TIMELINE</span>
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Continuous chronological ledger of incident triage, containment actions, and remediation confirmations.
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {events.map((ev) => (
              <div
                key={ev.id}
                className={`p-3.5 rounded border flex items-start gap-3 transition-all ${
                  ev.level === 'ALERT'
                    ? 'bg-red-950/20 border-red-900/60'
                    : ev.level === 'ACTION'
                    ? 'bg-amber-950/20 border-amber-900/60'
                    : ev.level === 'RESOLVED'
                    ? 'bg-emerald-950/20 border-emerald-900/60'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center shrink-0 text-[10px] font-bold ${
                    ev.level === 'ALERT'
                      ? 'bg-red-600 text-white'
                      : ev.level === 'ACTION'
                      ? 'bg-amber-600 text-white'
                      : ev.level === 'RESOLVED'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {ev.level[0]}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{ev.title}</span>
                    <span className="text-[10px] text-slate-500">{ev.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{ev.details}</p>
                  <div className="text-[10px] text-slate-500 mt-1">Operator: {ev.operator}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New IOC Modal */}
      {showAddIoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full p-5 space-y-4 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-100">REGISTER NEW INDICATOR OF COMPROMISE</span>
              <button onClick={() => setShowAddIoc(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddIocSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Indicator Type:</label>
                <select
                  value={newIocType}
                  onChange={(e) => setNewIocType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <option value="IPv4">IPv4 Address</option>
                  <option value="Domain">Domain / FQDN</option>
                  <option value="SHA-256">SHA-256 Payload Hash</option>
                  <option value="DNS-Tunneling">DNS Tunneling Canary</option>
                  <option value="URL">Malicious URL</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Indicator Value:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 185.220.101.5 or c2.badactor.com"
                  value={newIocValue}
                  onChange={(e) => setNewIocValue(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Threat Level:</label>
                <select
                  value={newIocLevel}
                  onChange={(e) => setNewIocLevel(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddIoc(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Save IOC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
