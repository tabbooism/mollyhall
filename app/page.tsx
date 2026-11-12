'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from '../components/Navbar';
import { OperationsHUD } from '../components/OperationsHUD';
import { SpaWiftKillchainConsole } from '../components/SpaWiftKillchainConsole';
import { DomainEnrichmentView } from '../components/DomainEnrichmentView';
import { VulnerabilitySetKit } from '../components/VulnerabilitySetKit';
import { PlaybooksConsole } from '../components/PlaybooksConsole';
import { ComplianceAuditView } from '../components/ComplianceAuditView';
import { ModulesPluginManager } from '../components/ModulesPluginManager';
import { CloudMfaGovernance } from '../components/CloudMfaGovernance';
import { ExportModal } from '../components/ExportModal';
import { MaxPayneRedOpsConsole } from '../components/MaxPayneRedOpsConsole';
import { MitreMatrixConsole } from '../components/MitreMatrixConsole';
import { WarRoomConsole } from '../components/WarRoomConsole';

import { DEFAULT_RUNEHALL_DOMAINS, EnrichedDomain } from '../lib/domain-parser';
import {
  INITIAL_KILLCHAIN_PHASES,
  KillchainPhase,
  PRECONFIGURED_MODULES,
  SecurityModule,
} from '../lib/killchain-engine';
import {
  INITIAL_COMPLIANCE_FRAMEWORKS,
  INITIAL_AUDIT_SCHEDULES,
  INITIAL_VULNERABILITY_SETKIT,
  INCIDENT_RESPONSE_PLAYBOOKS,
  ComplianceFramework,
  SecurityAuditSchedule,
  VulnerabilityFinding,
  IncidentPlaybook,
} from '../lib/compliance-calculator';

export default function RedOpsApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as ActiveTab | null;
      if (tabParam) return tabParam;
    }
    return 'overview';
  });
  const [domains, setDomains] = useState<EnrichedDomain[]>(DEFAULT_RUNEHALL_DOMAINS);
  const [phases, setPhases] = useState<KillchainPhase[]>(INITIAL_KILLCHAIN_PHASES);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>(INITIAL_COMPLIANCE_FRAMEWORKS);
  const [auditSchedules, setAuditSchedules] = useState<SecurityAuditSchedule[]>(INITIAL_AUDIT_SCHEDULES);
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityFinding[]>(INITIAL_VULNERABILITY_SETKIT);
  const [playbooks, setPlaybooks] = useState<IncidentPlaybook[]>(INCIDENT_RESPONSE_PLAYBOOKS);
  const [modules, setModules] = useState<SecurityModule[]>(PRECONFIGURED_MODULES);

  const [isKillchainRunning, setIsKillchainRunning] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedPlaybookToFocus, setSelectedPlaybookToFocus] = useState<string>('pb-01');

  const handleTabChange = (newTab: ActiveTab) => {
    setActiveTab(newTab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Quick Trigger Killchain Simulation
  const handleStartKillchain = () => {
    setIsKillchainRunning(true);
    // Advance steps simulation
    setTimeout(() => {
      setPhases((prev) =>
        prev.map((phase) => ({
          ...phase,
          steps: phase.steps.map((s) => ({
            ...s,
            status: s.status === 'pending' || s.status === 'running' ? 'completed' : s.status,
          })),
        }))
      );
      setIsKillchainRunning(false);
    }, 4500);
  };

  const handlePauseKillchain = () => {
    setIsKillchainRunning(false);
  };

  const handleResetKillchain = () => {
    setIsKillchainRunning(false);
    setPhases(INITIAL_KILLCHAIN_PHASES);
  };

  const handleStepNextPhase = () => {
    setPhases((prev) => {
      const next = [...prev];
      for (const phase of next) {
        for (const step of phase.steps) {
          if (step.status === 'pending') {
            step.status = 'running';
            return next;
          }
          if (step.status === 'running') {
            step.status = 'completed';
            return next;
          }
        }
      }
      return next;
    });
  };

  // Add newly enriched domain
  const handleAddDomain = (newDomain: EnrichedDomain) => {
    setDomains((prev) => [newDomain, ...prev.filter((d) => d.domain !== newDomain.domain)]);
  };

  // Update Vulnerability Status
  const handleUpdateFindingStatus = (id: string, newStatus: VulnerabilityFinding['status']) => {
    setVulnerabilities((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
  };

  // Playbook execution handlers
  const handleExecutePlaybookStep = (playbookId: string, stepOrder: number) => {
    setPlaybooks((prev) =>
      prev.map((pb) => {
        if (pb.id !== playbookId) return pb;
        return {
          ...pb,
          steps: pb.steps.map((s) => (s.order === stepOrder ? { ...s, status: 'executed' } : s)),
        };
      })
    );
  };

  const handleExecuteFullPlaybook = (playbookId: string) => {
    setPlaybooks((prev) =>
      prev.map((pb) => {
        if (pb.id !== playbookId) return pb;
        return {
          ...pb,
          steps: pb.steps.map((s) => ({ ...s, status: 'executed' })),
        };
      })
    );

    // If PB-01 was executed, mitigate the exfiltration finding
    if (playbookId === 'pb-01') {
      setVulnerabilities((prev) =>
        prev.map((v) =>
          v.id === 'VULN-2026-0892' ? { ...v, status: 'Mitigated' } : v
        )
      );
      // Lower dev.runehall.com anomaly score
      setDomains((prev) =>
        prev.map((d) =>
          d.domain === 'dev.runehall.com'
            ? {
                ...d,
                potentialExfiltrationDetected: false,
                exfiltrationAnomalyScore: 18,
                riskScore: 35,
                riskLevel: 'Medium',
                activeThreatIndicators: ['Quarantine active: Egress severed via Playbook PB-01'],
              }
            : d
        )
      );
    }
  };

  const handleTriggerPlaybookFromOtherTab = (playbookId: string) => {
    setSelectedPlaybookToFocus(playbookId);
    setActiveTab('playbooks');
  };

  // Automated audit trigger
  const handleTriggerAuditNow = (scheduleId: string) => {
    setAuditSchedules((prev) =>
      prev.map((s) =>
        s.id === scheduleId
          ? {
              ...s,
              lastRunStatus: 'Passed',
              nextRun: 'Just completed • Next in 24 hours',
            }
          : s
      )
    );
    // Slight compliance score improvement as automated audit passes
    setFrameworks((prev) =>
      prev.map((f) => ({
        ...f,
        complianceScore: Math.min(99, f.complianceScore + 1),
      }))
    );
  };

  const handleToggleSchedule = (scheduleId: string) => {
    setAuditSchedules((prev) =>
      prev.map((s) => (s.id === scheduleId ? { ...s, enabled: !s.enabled } : s))
    );
  };

  // Modules & Custom Plugins
  const handleToggleModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, isEnabled: !m.isEnabled } : m))
    );
  };

  const handleAddCustomPlugin = (newModule: SecurityModule) => {
    setModules((prev) => [newModule, ...prev]);
  };

  const exfilAlertCount = domains.filter((d) => d.potentialExfiltrationDetected).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onQuickRunKillchain={handleStartKillchain}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isKillchainRunning={isKillchainRunning}
        exfilAlertCount={exfilAlertCount}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === 'overview' && (
          <OperationsHUD
            domains={domains}
            phases={phases}
            frameworks={frameworks}
            vulnerabilities={vulnerabilities}
            isKillchainRunning={isKillchainRunning}
            onNavigateTab={handleTabChange}
            onTriggerKillchain={handleStartKillchain}
            onExecutePlaybook={handleTriggerPlaybookFromOtherTab}
          />
        )}

        {activeTab === 'redops_engine' && (
          <MaxPayneRedOpsConsole defaultTarget="runehall.com" />
        )}

        {activeTab === 'mitre_matrix' && (
          <MitreMatrixConsole />
        )}

        {activeTab === 'war_room' && (
          <WarRoomConsole targetDomain="runehall.com" />
        )}

        {activeTab === 'killchain' && (
          <SpaWiftKillchainConsole
            phases={phases}
            isKillchainRunning={isKillchainRunning}
            onStartKillchain={handleStartKillchain}
            onPauseKillchain={handlePauseKillchain}
            onResetKillchain={handleResetKillchain}
            onStepNextPhase={handleStepNextPhase}
            targetDomain="runehall.com"
          />
        )}

        {activeTab === 'domain_hunting' && (
          <DomainEnrichmentView
            domains={domains}
            onAddDomain={handleAddDomain}
            onSelectDomainForHunt={(domain) => {
              // Can select domain
            }}
          />
        )}

        {activeTab === 'vuln_setkit' && (
          <VulnerabilitySetKit
            vulnerabilities={vulnerabilities}
            onTriggerPlaybook={handleTriggerPlaybookFromOtherTab}
            onUpdateFindingStatus={handleUpdateFindingStatus}
          />
        )}

        {activeTab === 'playbooks' && (
          <PlaybooksConsole
            playbooks={playbooks}
            onExecutePlaybookStep={handleExecutePlaybookStep}
            onExecuteFullPlaybook={handleExecuteFullPlaybook}
            activePlaybookId={selectedPlaybookToFocus}
          />
        )}

        {activeTab === 'compliance_audits' && (
          <ComplianceAuditView
            frameworks={frameworks}
            auditSchedules={auditSchedules}
            onTriggerAuditNow={handleTriggerAuditNow}
            onToggleSchedule={handleToggleSchedule}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'plugins_modules' && (
          <ModulesPluginManager
            modules={modules}
            onToggleModule={handleToggleModule}
            onAddCustomPlugin={handleAddCustomPlugin}
          />
        )}

        {activeTab === 'cloud_mfa' && <CloudMfaGovernance />}
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>RedOps Framework v4.2 • Spa Wift Autonomous Assessment Engine</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Target: runehall.com</span>
          <span>MFA: Enforced</span>
          <span>Compliance: 94.8%</span>
        </div>
      </footer>

      {/* Exportable Documents & Executive Summary Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        domains={domains}
        phases={phases}
        frameworks={frameworks}
        vulnerabilities={vulnerabilities}
      />
    </div>
  );
}
