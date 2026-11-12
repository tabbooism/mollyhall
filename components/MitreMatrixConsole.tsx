'use client';

import React, { useState } from 'react';
import {
  Layers,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  Info,
  Check,
  Copy,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  MITRE_ENTERPRISE_TACTICS,
  MitreTactic,
  MitreTechnique,
  computeMitreCoverage,
} from '../lib/mitre-matrix';

export const MitreMatrixConsole: React.FC = () => {
  const [tactics, setTactics] = useState<MitreTactic[]>(MITRE_ENTERPRISE_TACTICS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'tested_secure' | 'flagged_risk' | 'remediated'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState<MitreTechnique | null>(
    tactics[0].techniques[0] || null
  );
  const [copiedLayer, setCopiedLayer] = useState(false);

  const stats = computeMitreCoverage(tactics);

  const handleToggleTechniqueStatus = (techId: string, newStatus: MitreTechnique['status']) => {
    setTactics((prev) =>
      prev.map((tactic) => ({
        ...tactic,
        techniques: tactic.techniques.map((tech) =>
          tech.id === techId ? { ...tech, status: newStatus } : tech
        ),
      }))
    );
    if (selectedTechnique && selectedTechnique.id === techId) {
      setSelectedTechnique((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleExportNavigatorJson = () => {
    const layer = {
      name: 'RedOps Spa Wift Security Coverage Matrix',
      versions: { attack: '14', navigator: '4.8.1', layer: '4.4' },
      domain: 'enterprise-attack',
      description: 'MITRE ATT&CK coverage evaluated by RedOps automated assessment framework for runehall.com.',
      techniques: tactics.flatMap((t) =>
        t.techniques.map((tech) => ({
          techniqueID: tech.id,
          tactic: t.name.toLowerCase().replace(/\s+/g, '-'),
          score: tech.status === 'tested_secure' ? 100 : tech.status === 'flagged_risk' ? 20 : 70,
          color: tech.status === 'tested_secure' ? '#10b981' : tech.status === 'flagged_risk' ? '#ef4444' : '#3b82f6',
          comment: `Status: ${tech.status}. Module: ${tech.associatedModule}`,
        }))
      ),
    };

    const blob = new Blob([JSON.stringify(layer, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redops-mitre-coverage-layer-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedLayer(true);
    setTimeout(() => setCopiedLayer(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-500" />
            <h1 className="text-base font-bold text-slate-100 tracking-wide font-mono">
              MITRE ATT&CK® ENTERPRISE MATRIX NAVIGATOR
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 font-bold">
              v14 ENTERPRISE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Full enterprise adversary emulation matrix correlating Spa Wift killchain phases, MaxPayne Python modules, and defensive containment barriers.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportNavigatorJson}
            className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            {copiedLayer ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            <span>Export ATT&CK Layer JSON</span>
          </button>
        </div>
      </div>

      {/* Coverage & Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded bg-slate-900 border border-slate-800">
          <div className="text-[10px] text-slate-500">TACTIC COVERAGE RATE</div>
          <div className="text-2xl font-bold text-emerald-400 mt-0.5">
            {stats.coveragePercentage}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {stats.testedCount + stats.remediatedCount} of {stats.totalTechniques} Verified
          </div>
        </div>

        <div className="p-3.5 rounded bg-slate-900 border border-slate-800">
          <div className="text-[10px] text-slate-500">TESTED & SECURED</div>
          <div className="text-2xl font-bold text-blue-400 mt-0.5">
            {stats.testedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Verified with zero leaks</div>
        </div>

        <div className="p-3.5 rounded bg-slate-900 border border-slate-800">
          <div className="text-[10px] text-slate-500">ACTIVE FLAGGED RISKS</div>
          <div className="text-2xl font-bold text-red-400 mt-0.5">
            {stats.flaggedCount}
          </div>
          <div className="text-[10px] text-red-300 mt-1">Playbooks armed for triage</div>
        </div>

        <div className="p-3.5 rounded bg-slate-900 border border-slate-800">
          <div className="text-[10px] text-slate-500">REMEDIATED IN RUN</div>
          <div className="text-2xl font-bold text-purple-400 mt-0.5">
            {stats.remediatedCount}
          </div>
          <div className="text-[10px] text-purple-300 mt-1">DNS Tunneling quarantined</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by technique ID (e.g. T1190), name, or detection..."
            className="w-full pl-8 pr-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded border border-slate-800 text-[11px] font-mono">
          {(['all', 'tested_secure', 'flagged_risk', 'remediated'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-2.5 py-1 rounded transition-all capitalize ${
                statusFilter === filter
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Tactics & Techniques Matrix (Left 8 Cols) + Technique Inspector (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tactics Matrix Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tactics.map((tactic) => {
              const filteredTechniques = tactic.techniques.filter((tech) => {
                if (statusFilter !== 'all' && tech.status !== statusFilter) return false;
                if (searchTerm) {
                  return (
                    tech.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    tech.description.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                }
                return true;
              });

              if (filteredTechniques.length === 0 && (statusFilter !== 'all' || searchTerm)) {
                return null;
              }

              return (
                <div
                  key={tactic.id}
                  className="rounded-lg bg-slate-900 border border-slate-800 p-4 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">{tactic.id}</span>
                      <h2 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wide">
                        {tactic.name}
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {filteredTechniques.length} Techniques
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed truncate">
                    {tactic.description}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    {filteredTechniques.map((tech) => {
                      const isSelected = selectedTechnique?.id === tech.id;
                      return (
                        <div
                          key={tech.id}
                          onClick={() => setSelectedTechnique(tech)}
                          className={`p-2.5 rounded border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-red-500 bg-red-950/30'
                              : tech.status === 'flagged_risk'
                              ? 'border-red-900/60 bg-slate-950 hover:border-red-700'
                              : tech.status === 'remediated'
                              ? 'border-blue-900/60 bg-slate-950 hover:border-blue-700'
                              : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-200 truncate font-mono">
                              {tech.id}: {tech.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase font-bold shrink-0 ${
                                tech.status === 'tested_secure'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : tech.status === 'flagged_risk'
                                  ? 'bg-red-950 text-red-400 border border-red-800'
                                  : tech.status === 'remediated'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {tech.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                            <span>Severity: {tech.severity}</span>
                            <span className="text-slate-500 truncate max-w-[140px]">
                              {tech.associatedModule}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Technique Inspector Panel */}
        <div className="lg:col-span-4 space-y-4">
          {selectedTechnique ? (
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-red-400">
                      {selectedTechnique.id}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {selectedTechnique.tacticName}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mt-1 font-mono">
                    {selectedTechnique.name}
                  </h3>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                    selectedTechnique.severity === 'Critical'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : selectedTechnique.severity === 'High'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}
                >
                  {selectedTechnique.severity}
                </span>
              </div>

              {/* Status Update Dropdown */}
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Assessment Status:</span>
                <select
                  value={selectedTechnique.status}
                  onChange={(e) =>
                    handleToggleTechniqueStatus(selectedTechnique.id, e.target.value as any)
                  }
                  className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="tested_secure">Tested Secure</option>
                  <option value="flagged_risk">Flagged Risk</option>
                  <option value="remediated">Remediated</option>
                  <option value="untested">Untested</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-500 font-bold uppercase">
                  ATT&CK ADVERSARY TECHNIQUE DETAILS:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                  {selectedTechnique.description}
                </p>
              </div>

              {/* Detection Rule */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-red-400 font-bold uppercase flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>REDOPS SIEM DETECTION RULE:</span>
                </span>
                <div className="p-3 rounded bg-red-950/20 border border-red-800/40 text-xs font-mono text-red-200 leading-relaxed">
                  {selectedTechnique.detectionRule}
                </div>
              </div>

              {/* Mitigation Advice */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>HARDENING & MITIGATION:</span>
                </span>
                <div className="p-3 rounded bg-emerald-950/20 border border-emerald-800/40 text-xs font-mono text-emerald-200 leading-relaxed">
                  {selectedTechnique.mitigation}
                </div>
              </div>

              {/* Associated RedOps Module */}
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Associated RedOps Module:</span>
                <span className="text-slate-200 font-bold">{selectedTechnique.associatedModule}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 rounded bg-slate-900 border border-slate-800">
              Select a technique from the matrix to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
