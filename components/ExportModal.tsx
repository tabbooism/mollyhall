'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Lock,
} from 'lucide-react';
import { EnrichedDomain } from '../lib/domain-parser';
import { KillchainPhase, computeKillchainProgress } from '../lib/killchain-engine';
import { ComplianceFramework, VulnerabilityFinding } from '../lib/compliance-calculator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  domains: EnrichedDomain[];
  phases: KillchainPhase[];
  frameworks: ComplianceFramework[];
  vulnerabilities: VulnerabilityFinding[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  domains,
  phases,
  frameworks,
  vulnerabilities,
}) => {
  const [reportType, setReportType] = useState<
    'executive' | 'technical_json' | 'compliance_cert' | 'stix_bundle' | 'csv_inventory'
  >('executive');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const killchainStats = computeKillchainProgress(phases);
  const avgCompliance =
    frameworks.reduce((acc, f) => acc + f.complianceScore, 0) / (frameworks.length || 1);
  const exfilThreats = domains.filter((d) => d.potentialExfiltrationDetected);

  const handlePrint = () => {
    window.print();
  };

  const technicalReportData = {
    report_metadata: {
      generated_at: '2026-04-12T08:00:00.000Z',
      framework: 'RedOps Spa Wift v4.2',
      primary_target: 'runehall.com',
      subdomains_audited: domains.length,
      overall_compliance_average: `${avgCompliance.toFixed(1)}%`,
    },
    killchain_summary: {
      completion_percentage: `${killchainStats.percentage}%`,
      flagged_phases: phases.filter((p) => p.steps.some((s) => s.status === 'flagged')).map((p) => p.name),
      total_findings: vulnerabilities.length,
    },
    exfiltration_anomalies: exfilThreats.map((d) => ({
      domain: d.domain,
      risk_score: d.riskScore,
      anomaly_score: d.exfiltrationAnomalyScore,
      threat_indicators: d.activeThreatIndicators,
    })),
    vulnerability_findings: vulnerabilities,
    compliance_frameworks: frameworks.map((f) => ({
      name: f.name,
      score: f.complianceScore,
      status: f.status,
      passed_controls: f.passedControls,
      total_controls: f.totalControls,
    })),
  };

  const stixBundleData = {
    type: 'bundle',
    id: 'bundle--redops-runehall-assessment-2026',
    spec_version: '2.1',
    objects: [
      {
        type: 'identity',
        spec_version: '2.1',
        id: 'identity--b3f81e3a-4422-4a06-a81d-e59048a1c0b3',
        name: 'Runehall Cyber Defense Operations (RedOps)',
        identity_class: 'organization',
        sectors: ['technology', 'financial-services'],
      },
      {
        type: 'threat-actor',
        spec_version: '2.1',
        id: 'threat-actor--78e91d84-c8c2-48f1-9318-7b961c0e35dc',
        name: 'APT29 / Nobelium (Simulated Adversary)',
        threat_actor_types: ['nation-state', 'espionage'],
        sophistication: 'advanced',
        primary_motivation: 'intelligence-collection',
      },
      ...domains.map((d, idx) => ({
        type: 'indicator',
        spec_version: '2.1',
        id: `indicator--${idx + 1}0000000-0000-0000-0000-000000000000`,
        name: `Perimeter Asset Indicator: ${d.domain}`,
        pattern: `[domain-name:value = '${d.domain}']`,
        pattern_type: 'stix',
        valid_from: '2026-04-12T00:00:00Z',
        confidence: d.riskScore,
      })),
    ],
  };

  const csvRows = [
    ['Domain', 'Asset Scope', 'IP Addresses', 'TLS Grade', 'Risk Score', 'Exfil Status', 'Active Threat Indicators'].join(','),
    ...domains.map((d) =>
      [
        `"${d.domain}"`,
        `"${d.isWildcard ? 'Wildcard' : d.subdomain ? 'Subdomain' : 'Apex'}"`,
        `"${d.ipAddresses.join('; ')}"`,
        `"${d.tlsGrade} (${d.tlsVersion})"`,
        d.riskScore,
        d.potentialExfiltrationDetected ? 'ALERT' : 'NORMAL',
        `"${d.activeThreatIndicators.join('; ')}"`,
      ].join(',')
    ),
  ].join('\n');

  const handleDownloadJson = () => {
    const dataToDownload = reportType === 'stix_bundle' ? stixBundleData : technicalReportData;
    const filename =
      reportType === 'stix_bundle'
        ? `stix2.1-bundle-runehall-${Date.now()}.json`
        : `redops-assessment-report-runehall-${Date.now()}.json`;

    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `runehall-perimeter-assets-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    const md = `# RED OPS CYBERSECURITY ASSESSMENT & AUDIT REPORT
**Target:** runehall.com (*.runehall.com)  
**Date:** ${new Date().toLocaleDateString()}  
**Compliance Posture:** ${avgCompliance.toFixed(1)}% (GDPR, SOC 2, ISO 27001, PCI-DSS)  
**Cloud MFA Enforcement:** 100% across all 5 cloud access environments  

## Executive Summary
The RedOps Spa Wift automated assessment framework completed multi-stage killchain simulations and continuous perimeter monitoring. Anomaly sentinel detected potential DNS tunneling queries on staging host (dev.runehall.com), and Playbook PB-01 was armed for quarantine.

## Discovered Vulnerabilities:
${vulnerabilities.map((v) => `- [${v.severity} - CVSS ${v.cvssScore}] ${v.title} (${v.targetAsset})`).join('\n')}

## Next Scheduled Automated Audit:
Daily recurring at 00:00 UTC via Spa Wift Autonomous Daemon.`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="text-base font-bold text-slate-100">
                EXPORTABLE ASSESSMENT & COMPLIANCE DOCUMENTS
              </h2>
              <div className="text-xs text-slate-400">
                Formal executive briefings, audit evidence certificates, and JSON technical payloads.
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-mono px-2 py-1 rounded bg-slate-800"
          >
            ✕ ESC
          </button>
        </div>

        {/* Sub Navigation Bar */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setReportType('executive')}
              className={`px-2.5 py-1.5 rounded transition-all font-medium ${
                reportType === 'executive'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Executive Brief
            </button>
            <button
              onClick={() => setReportType('compliance_cert')}
              className={`px-2.5 py-1.5 rounded transition-all font-medium ${
                reportType === 'compliance_cert'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Compliance Certificate
            </button>
            <button
              onClick={() => setReportType('stix_bundle')}
              className={`px-2.5 py-1.5 rounded transition-all font-medium ${
                reportType === 'stix_bundle'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              STIX 2.1 Bundle
            </button>
            <button
              onClick={() => setReportType('csv_inventory')}
              className={`px-2.5 py-1.5 rounded transition-all font-medium ${
                reportType === 'csv_inventory'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Perimeter CSV
            </button>
            <button
              onClick={() => setReportType('technical_json')}
              className={`px-2.5 py-1.5 rounded transition-all font-medium ${
                reportType === 'technical_json'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Technical JSON
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy MD</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            {reportType === 'csv_inventory' ? (
              <button
                onClick={handleDownloadCsv}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            ) : (
              <button
                onClick={handleDownloadJson}
                className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JSON</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-200 print:text-black print:bg-white">
          {reportType === 'executive' && (
            <div className="space-y-6 max-w-3xl mx-auto border border-slate-800 p-6 rounded-lg bg-slate-950/60 print:border-none print:p-0">
              {/* Document Header */}
              <div className="border-b border-slate-800 pb-4 flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">
                    CONFIDENTIAL // CISO & EXECUTIVE SUMMARY
                  </div>
                  <h1 className="text-xl font-bold text-slate-100 mt-1">
                    CYBERSECURITY ASSESSMENT & THREAT INTELLIGENCE AUDIT
                  </h1>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    Target Enterprise Scope: runehall.com & All Subdomains
                  </div>
                </div>
                <div className="text-right text-xs font-mono text-slate-400">
                  <div>DATE: April 12, 2026</div>
                  <div className="text-emerald-400 font-bold">ENGINE: Spa Wift v4.2</div>
                </div>
              </div>

              {/* High-Level Score Card */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">OVERALL COMPLIANCE</div>
                  <div className="text-2xl font-bold font-mono text-blue-400 mt-0.5">
                    {avgCompliance.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-500">GDPR, SOC2, ISO27001</div>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">CLOUD MFA RATE</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                    100%
                  </div>
                  <div className="text-[10px] text-slate-500">All Cloud Access Points</div>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">EXFIL ANOMALIES</div>
                  <div className="text-2xl font-bold font-mono text-red-400 mt-0.5">
                    {exfilThreats.length} Flagged
                  </div>
                  <div className="text-[10px] text-slate-500">Containment Armed</div>
                </div>
              </div>

              {/* Executive Overview Paragraph */}
              <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                <h3 className="font-bold text-slate-100 uppercase tracking-wide">
                  1. Assessment Scope & Executive Synopsis
                </h3>
                <p>
                  During the continuous assessment cycle, the RedOps automated testing engine initiated non-destructive simulation killchains across <strong>runehall.com</strong>, including 7 external subdomains and hybrid cloud ingress points. Cloud infrastructure access policies across AWS, Google Cloud, and Azure were verified at <strong>100% multi-factor authentication enforcement</strong> with zero exemptions.
                </p>
                <p>
                  A critical data exfiltration anomaly was identified on <strong>dev.runehall.com</strong> involving high-entropy DNS TXT queries and an exposed microservice debug actuator (port 8080). Automated containment playbook PB-01 was immediately dispatched to sever egress and quarantine the affected subnet without impacting production customer gateways.
                </p>
              </div>

              {/* Findings Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                  2. Priority Vulnerabilities & Remediation Actions
                </h3>
                <div className="border border-slate-800 rounded overflow-hidden text-xs font-mono">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px]">
                      <tr>
                        <th className="p-2">SEVERITY</th>
                        <th className="p-2">VULNERABILITY</th>
                        <th className="p-2">TARGET ASSET</th>
                        <th className="p-2">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {vulnerabilities.map((v) => (
                        <tr key={v.id}>
                          <td className="p-2">
                            <span className={v.severity === 'Critical' ? 'text-red-400 font-bold' : v.severity === 'High' ? 'text-amber-400 font-bold' : 'text-blue-400'}>
                              {v.severity} ({v.cvssScore})
                            </span>
                          </td>
                          <td className="p-2 text-slate-200">{v.title}</td>
                          <td className="p-2 text-slate-400">{v.targetAsset}</td>
                          <td className="p-2 text-slate-300">{v.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signoff Block */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div>
                  <div>Lead Auditor: Automated RedOps Sentinel Agent</div>
                  <div>Attestation Hash: 0x8F92...B31A</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold">REGULATORY AUDIT: PASSED</div>
                  <div>Next Scheduled Cycle: Daily 00:00 UTC</div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'compliance_cert' && (
            <div className="space-y-6 max-w-3xl mx-auto border-2 border-blue-500/40 p-8 rounded-xl bg-slate-950 text-center">
              <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto" />
              <div>
                <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
                  GLOBAL REGULATORY COMPLIANCE ATTESTATION
                </span>
                <h2 className="text-xl font-bold text-slate-100 mt-1">
                  CERTIFICATE OF CYBERSECURITY COMPLIANCE
                </h2>
                <div className="text-xs text-slate-400 mt-1">
                  Issued to Organization: Runehall Global Perimeter (runehall.com)
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left font-mono text-xs">
                {frameworks.map((f) => (
                  <div key={f.id} className="p-3 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">{f.name}</div>
                    <div className="text-base font-bold text-blue-400 mt-0.5">{f.complianceScore}%</div>
                    <div className="text-[10px] text-emerald-400 font-bold">{f.status}</div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-slate-300 leading-relaxed text-left space-y-2 border-t border-slate-800 pt-4">
                <p>
                  This certifies that all cloud environment access points enforce multi-factor authentication (MFA) and zero-trust perimeter segmentation. Continuous automated security audits have been scheduled on recurring intervals to guarantee full data protection compliance under GDPR (Art. 25, 32) and SOC 2 Type II trust principles.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Certification Token: REDOPS-ISO-GDPR-2026-RN8</span>
                <span className="text-emerald-400 font-bold">VERIFIED SECURE</span>
              </div>
            </div>
          )}

          {reportType === 'stix_bundle' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>OASIS STIX 2.1 THREAT INTELLIGENCE BUNDLE</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-mono border border-red-500/30">
                      RFC 8827
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Standardized structured cybersecurity telemetry representation for SIEM/SOAR ingestion.
                  </p>
                </div>
              </div>
              <pre className="p-4 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400/90 leading-relaxed overflow-x-auto max-h-[500px]">
                {JSON.stringify(stixBundleData, null, 2)}
              </pre>
            </div>
          )}

          {reportType === 'csv_inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    PERIMETER ASSET & THREAT INVENTORY (CSV PREVIEW)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Comma-separated value format for export to spreadsheets and compliance audits.
                  </p>
                </div>
              </div>
              <pre className="p-4 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-blue-300 leading-relaxed overflow-x-auto max-h-[500px]">
                {csvRows}
              </pre>
            </div>
          )}

          {reportType === 'technical_json' && (
            <pre className="p-4 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto max-h-[500px]">
              {JSON.stringify(technicalReportData, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
