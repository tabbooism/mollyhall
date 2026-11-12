'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Code2,
  Layers,
  Radio,
  ExternalLink,
  Cpu,
  RefreshCw,
  GitBranch,
} from 'lucide-react';
import { REDOPS_AVAILABLE_MODULES, FORTRESS_OPS_SCRIPTS } from '../lib/redops-modules';

interface MaxPayneRedOpsConsoleProps {
  defaultTarget?: string;
}

export const MaxPayneRedOpsConsole: React.FC<MaxPayneRedOpsConsoleProps> = ({
  defaultTarget = 'runehall.com',
}) => {
  const [target, setTarget] = useState(defaultTarget);
  const [mode, setMode] = useState<'modules' | 'fortress'>('modules');
  const [selectedModule, setSelectedModule] = useState<string>('recon_report');
  const [selectedFortressScript, setSelectedFortressScript] = useState<string>('dangling_dns.py');

  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<{
    stdout: string;
    stderr?: string;
    command: string;
    durationMs: number;
    success: boolean;
    data: any;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [activeTabCode, setActiveTabCode] = useState<'terminal' | 'json' | 'code'>('terminal');

  const handleRunExecution = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      const payload = {
        module: mode === 'modules' ? selectedModule : selectedFortressScript,
        target,
        scriptType: mode === 'modules' ? 'module' : 'ops-script',
      };

      const res = await fetch('/api/redops/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      setOutput(json);
    } catch (err: any) {
      setOutput({
        stdout: `Error communicating with RedOps Python Engine: ${err.message}`,
        command: '',
        durationMs: 0,
        success: false,
        data: null,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyStdout = () => {
    if (!output) return;
    navigator.clipboard.writeText(output.stdout || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeModuleMeta =
    mode === 'modules'
      ? REDOPS_AVAILABLE_MODULES.find((m) => m.name === selectedModule)
      : FORTRESS_OPS_SCRIPTS.find((s) => s.script === selectedFortressScript);

  return (
    <div className="space-y-6">
      {/* Top Banner with Git Repository & Engine Connection Notice */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-red-600 to-rose-900 text-white border border-red-500/40 shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-bold text-slate-100 tracking-wide font-mono">
                  MAXPAYNE REDOPS ENGINE // LIVE OPERATIONAL FLEET
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 font-bold">
                  PYTHON 3.10 STDLIB
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                  LIVE EXECUTOR ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Imported from <strong className="text-slate-200 font-mono">Ashes2Ashley/redops-framework</strong> and <strong className="text-slate-200 font-mono">redops-intel</strong> (Max Payne Red Ops suite). Directly runs live reconnaissance, DNS-over-HTTPS audits, TLS handshake checks, and Fortress defensive scripts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://github.com/Ashes2Ashley/redops-framework"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <GitBranch className="w-3.5 h-3.5 text-red-400" />
              <span>redops-framework</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Git Sync Alert Info */}
        <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>REPOSITORY SYNC: 19 Core Modules + 10 Fortress Defense Scripts Mounted</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Source: Ashes2Ashley/redops-framework @ 8f7b6de
          </span>
        </div>
      </div>

      {/* Target & Module Selector Bar */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
        {/* Mode Toggle: Modules vs Fortress */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('modules')}
              className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                mode === 'modules'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>CORE RECON MODULES (19)</span>
            </button>
            <button
              onClick={() => setMode('fortress')}
              className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                mode === 'fortress'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>FORTRESS DEFENSIVE SCRIPTS (10)</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500">TARGET PRESETS:</span>
            {['runehall.com', 'api.runehall.com', 'dev.runehall.com', 'vault.runehall.com'].map((p) => (
              <button
                key={p}
                onClick={() => setTarget(p)}
                className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px]"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs and Execute Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5">
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              TARGET SCOPE (DOMAIN OR IP):
            </label>
            <div className="relative">
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. runehall.com"
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              {mode === 'modules' ? 'SELECT REDOPS MODULE:' : 'SELECT FORTRESS SCRIPT:'}
            </label>
            {mode === 'modules' ? (
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-red-500"
              >
                {REDOPS_AVAILABLE_MODULES.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} — {m.description.slice(0, 45)}...
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedFortressScript}
                onChange={(e) => setSelectedFortressScript(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-red-500"
              >
                {FORTRESS_OPS_SCRIPTS.map((s) => (
                  <option key={s.script} value={s.script}>
                    {s.script} — {s.description.slice(0, 45)}...
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="md:col-span-3 pt-4 md:pt-4 flex items-center gap-2">
            <button
              onClick={handleRunExecution}
              disabled={isRunning || !target.trim()}
              className={`w-full py-2.5 px-4 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                isRunning || !target.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40 border border-red-500'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>EXECUTING...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>RUN LIVE SCRIPT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Module Description Card */}
        {activeModuleMeta && (
          <div className="p-3 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-bold uppercase">{activeModuleMeta.name}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">{activeModuleMeta.description}</span>
            </div>
            <button
              onClick={() => {
                if (mode === 'modules') setSelectedModule('recon_report');
                handleRunExecution();
              }}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-medium whitespace-nowrap"
            >
              Run Full Recon Assessment →
            </button>
          </div>
        )}
      </div>

      {/* Execution Results Viewport */}
      <div className="rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex flex-col h-[520px]">
        {/* Terminal Header */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <span className="font-mono text-xs font-bold text-slate-300 ml-2">
              redops-engine://exec/{mode === 'modules' ? selectedModule : selectedFortressScript}
            </span>
            {output && (
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                  output.success
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {output.success ? 'EXIT: 0 (SUCCESS)' : 'EXIT: 1 (FAILED)'}
              </span>
            )}
            {output?.durationMs && (
              <span className="text-[10px] font-mono text-slate-500">
                {output.durationMs}ms
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 rounded p-0.5 border border-slate-800 text-[10px] font-mono">
              <button
                onClick={() => setActiveTabCode('terminal')}
                className={`px-2 py-0.5 rounded transition-all ${
                  activeTabCode === 'terminal' ? 'bg-red-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                STDOUT
              </button>
              <button
                onClick={() => setActiveTabCode('json')}
                className={`px-2 py-0.5 rounded transition-all ${
                  activeTabCode === 'json' ? 'bg-red-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                PARSED JSON
              </button>
            </div>

            <button
              onClick={handleCopyStdout}
              disabled={!output}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs"
              title="Copy output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed selection:bg-red-900/60 text-slate-300">
          {isRunning ? (
            <div className="flex items-center gap-3 py-6 justify-center text-amber-400">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Executing Python script against target {target}...</span>
            </div>
          ) : output ? (
            activeTabCode === 'terminal' ? (
              <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-200">
                {output.stdout || output.stderr || 'No output emitted.'}
              </pre>
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-300">
                {output.data ? JSON.stringify(output.data, null, 2) : 'No structured JSON parsed from output.'}
              </pre>
            )
          ) : (
            <div className="text-slate-600 space-y-2 py-8 text-center">
              <p>Ready to execute MaxPayne RedOps module.</p>
              <p className="text-[11px] text-slate-500">
                Select a module above (e.g. <code>recon_report</code> or <code>email_security</code>) and click &quot;Run Live Script&quot; to inspect real target infrastructure.
              </p>
            </div>
          )}
        </div>

        {/* Terminal Footer */}
        <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>RUNNER: Python 3.10 / stdlib-only sandbox</span>
          <span>COMMAND: {output?.command || 'idle'}</span>
        </div>
      </div>
    </div>
  );
};
