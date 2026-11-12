'use client';

import React from 'react';
import {
  Shield,
  ShieldAlert,
  Terminal,
  Globe,
  Layers,
  FileText,
  Lock,
  Cpu,
  Activity,
  Play,
  RotateCw,
  Printer,
  Sparkles,
  Radio,
  ShieldCheck,
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'redops_engine'
  | 'mitre_matrix'
  | 'war_room'
  | 'killchain'
  | 'domain_hunting'
  | 'vuln_setkit'
  | 'playbooks'
  | 'compliance_audits'
  | 'plugins_modules'
  | 'cloud_mfa';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onQuickRunKillchain: () => void;
  onOpenExportModal: () => void;
  isKillchainRunning: boolean;
  exfilAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onQuickRunKillchain,
  onOpenExportModal,
  isKillchainRunning,
  exfilAlertCount,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Operations HUD', icon: Activity },
    { id: 'redops_engine', label: 'MaxPayne Fleet', icon: Terminal, badge: '19 MODS', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { id: 'mitre_matrix', label: 'MITRE ATT&CK Matrix', icon: Layers, badge: 'v14', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { id: 'war_room', label: 'Crisis War Room', icon: Radio, badge: 'DEFCON 2', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { id: 'killchain', label: 'Spa Wift Killchains', icon: Cpu, badge: isKillchainRunning ? 'RUNNING' : 'ACTIVE', badgeColor: isKillchainRunning ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'domain_hunting', label: 'Domain Threat Hunting', icon: Globe, badge: 'runehall.com', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { id: 'vuln_setkit', label: 'Vulnerability Set Kit', icon: ShieldAlert, badge: exfilAlertCount > 0 ? `${exfilAlertCount} Alert` : undefined, badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { id: 'playbooks', label: 'Incident Playbooks', icon: ShieldCheck },
    { id: 'compliance_audits', label: 'Compliance & Audits', icon: FileText, badge: '94.8%', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { id: 'plugins_modules', label: 'Modules & Plugins', icon: Cpu },
    { id: 'cloud_mfa', label: 'Cloud MFA Governance', icon: Lock, badge: '100% MFA', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur">
      {/* Top Bar with Framework Branding & Security Status */}
      <div className="px-4 lg:px-6 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 via-rose-700 to-red-950 flex items-center justify-center shadow-lg shadow-red-900/30 border border-red-500/40">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-wider text-slate-100 text-sm">
                <span>RED OPS</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-950/80 text-red-400 border border-red-800 font-mono">
                  SPA WIFT FRAMEWORK
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Automated Cybersecurity Assessment & Threat Management Suite
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-800">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              ENGINE: <span className="text-emerald-400 font-semibold">ONLINE</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[11px]">
            <span className="text-slate-400">TARGET:</span>
            <span className="text-red-400 font-medium">runehall.com (+7 subdomains)</span>
          </div>
        </div>

        {/* Global Security Controls & Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/50 text-[11px] font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">CLOUD MFA:</span>
            <span className="text-emerald-400 font-bold">100% ENFORCED</span>
          </div>

          <button
            onClick={onQuickRunKillchain}
            disabled={isKillchainRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-all ${
              isKillchainRunning
                ? 'bg-amber-950/50 text-amber-300 border border-amber-700/60 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-900/40 border border-red-500 active:scale-95'
            }`}
            title="Execute automated Spa Wift assessment killchain"
          >
            {isKillchainRunning ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>KILLCHAIN IN PROGRESS...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>TRIGGER KILLCHAIN</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
            title="Export compliance audit documents & executive summaries"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">EXPORT REPORTS</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav className="px-4 lg:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-t border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-red-500 text-red-400 bg-red-950/20 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
