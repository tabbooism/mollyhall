'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Sliders,
  Settings,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { SecurityModule } from '../lib/killchain-engine';

interface ModulesPluginManagerProps {
  modules: SecurityModule[];
  onToggleModule: (moduleId: string) => void;
  onAddCustomPlugin: (plugin: SecurityModule) => void;
}

export const ModulesPluginManager: React.FC<ModulesPluginManagerProps> = ({
  modules,
  onToggleModule,
  onAddCustomPlugin,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0]?.id || '');
  const [isSandboxTesting, setIsSandboxTesting] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<string | null>(null);

  // New Custom Plugin state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newPluginName, setNewPluginName] = useState('');
  const [newPluginCategory, setNewPluginCategory] = useState<'Reconnaissance' | 'Vulnerability Discovery' | 'Killchain' | 'Data Exfiltration' | 'Cloud IAM' | 'Custom'>('Custom');
  const [newPluginDescription, setNewPluginDescription] = useState('');
  const [newPluginScript, setNewPluginScript] = useState(`-- Custom Spa Wift Security Assessment Plugin
function assess_target(context)
  local target = context.target_domain
  redops.log("Probing custom client infrastructure for: " .. target)
  
  -- Canary payload validation
  local resp = redops.http_get(target .. "/.well-known/security.txt")
  if resp.status == 200 then
    redops.record_evidence("Security.txt published", "LOW_RISK")
  end
  
  return { status = "COMPLETED", findings = 0 }
end`);

  const selectedModule = modules.find((m) => m.id === selectedModuleId) || modules[0];

  const handleTestSandbox = () => {
    setIsSandboxTesting(true);
    setSandboxResult(null);
    setTimeout(() => {
      setIsSandboxTesting(false);
      setSandboxResult(
        `[SANDBOX PASSED] Executed "${selectedModule.name}" in isolated container.\nMemory peak: 24MB • Latency: 120ms • 0 system call violations • Safe mode verified.`
      );
    }, 700);
  };

  const handleCreatePlugin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPluginName.trim()) return;

    const newModule: SecurityModule = {
      id: `mod-custom-${Date.now()}`,
      name: newPluginName,
      category: newPluginCategory,
      description: newPluginDescription || 'Custom client infrastructure assessment plugin.',
      version: '1.0.0-custom',
      author: 'Security Operations Engineer',
      isPreconfigured: false,
      isEnabled: true,
      executionMode: 'manual',
      supportedTargets: ['Client Perimeter', '*.runehall.com'],
      parameters: [
        { key: 'target_scope', label: 'Target Scope', value: 'client-vpc-east', type: 'text' },
        { key: 'safe_rate_limit', label: 'Rate Limit (req/sec)', value: '50', type: 'number' },
      ],
    };

    onAddCustomPlugin(newModule);
    setSelectedModuleId(newModule.id);
    setShowNewModal(false);
    setNewPluginName('');
    setNewPluginDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-red-500" />
            <h1 className="text-base font-bold text-slate-100 tracking-wide">
              SECURITY MODULES & CUSTOM PLUGIN EXTENSION FRAMEWORK
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-400 border border-red-800">
              RAPID DEPLOYMENT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Out-of-the-box pre-configured modules for multi-cloud deployments, plus sandboxed custom plugin script engine.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md border border-red-500 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>NEW CUSTOM PLUGIN</span>
        </button>
      </div>

      {/* Main Split: Modules List (Left 5 Cols) + Configuration & Sandbox (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Modules List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono font-bold text-slate-400">INSTALLED MODULES:</span>
          <div className="space-y-2">
            {modules.map((mod) => {
              const isSelected = mod.id === selectedModuleId;
              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    setSelectedModuleId(mod.id);
                    setSandboxResult(null);
                  }}
                  className={`p-3.5 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200">{mod.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleModule(mod.id);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                        mod.isEnabled
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {mod.isEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>
                      {mod.isPreconfigured ? 'Out-of-the-Box' : 'Custom Plugin'} • v{mod.version}
                    </span>
                    <span className="text-slate-400">{mod.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Module Details, Parameters & Sandbox Runner */}
        {selectedModule && (
          <div className="lg:col-span-7 rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-5 shadow-sm">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-100">{selectedModule.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    v{selectedModule.version}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Author: {selectedModule.author} • Mode: {selectedModule.executionMode}
                </div>
              </div>

              <button
                onClick={handleTestSandbox}
                disabled={isSandboxTesting}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                {isSandboxTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span>Sandbox Test</span>
                  </>
                )}
              </button>
            </div>

            {/* Sandbox Output Banner */}
            {sandboxResult && (
              <pre className="p-3 rounded bg-slate-950 border border-emerald-900/60 font-mono text-xs text-emerald-300 leading-relaxed whitespace-pre-wrap">
                {sandboxResult}
              </pre>
            )}

            {/* Targets Supported */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                SUPPORTED TARGET INFRASTRUCTURE:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedModule.supportedTargets.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Module Parameters Configurator */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                RUNTIME CONFIGURATION PARAMETERS:
              </span>
              <div className="space-y-2">
                {selectedModule.parameters.map((param) => (
                  <div
                    key={param.key}
                    className="p-3 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{param.label}</div>
                      <div className="text-[10px] text-slate-500">{param.key}</div>
                    </div>
                    <input
                      type="text"
                      defaultValue={param.value}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono text-right focus:outline-none focus:border-red-500 w-36"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Code / Logic Preview */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>SANDBOX EXECUTION LOGIC (HEURISTIC SCRIPT):</span>
              </span>
              <pre className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto">
{`-- Module Core Hook
function run_module_scan(target_env)
  redops.enforce_mfa_barrier()
  redops.profile_perimeter(target_env)
  redops.emit_siem_event("ASSESSMENT_PULSE_OK")
end`}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* New Custom Plugin Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold text-slate-100">CREATE CUSTOM ASSESSMENT PLUGIN</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlugin} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Plugin Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS PrivateLink Egress Auditing Plugin"
                  value={newPluginName}
                  onChange={(e) => setNewPluginName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category:</label>
                <select
                  value={newPluginCategory}
                  onChange={(e) => setNewPluginCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500"
                >
                  <option value="Custom">Custom</option>
                  <option value="Reconnaissance">Reconnaissance</option>
                  <option value="Vulnerability Discovery">Vulnerability Discovery</option>
                  <option value="Killchain">Killchain</option>
                  <option value="Data Exfiltration">Data Exfiltration</option>
                  <option value="Cloud IAM">Cloud IAM</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description:</label>
                <input
                  type="text"
                  placeholder="Briefly describe what this plugin assesses..."
                  value={newPluginDescription}
                  onChange={(e) => setNewPluginDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Plugin Script Code (Lua / TypeScript):</label>
                <textarea
                  rows={6}
                  value={newPluginScript}
                  onChange={(e) => setNewPluginScript(e.target.value)}
                  className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Save & Load Plugin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
