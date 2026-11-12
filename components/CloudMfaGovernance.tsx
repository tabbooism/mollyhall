'use client';

import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  Users,
  Key,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Fingerprint,
  Zap,
} from 'lucide-react';

interface CloudAccessPoint {
  id: string;
  provider: 'AWS' | 'Google Cloud' | 'Microsoft Azure' | 'Spa Wift Cloud' | 'Kubernetes API';
  environment: string;
  totalIdentities: number;
  mfaEnforcedCount: number;
  mfaMechanism: 'FIDO2 / Hardware YubiKey' | 'WebAuthn Biometric' | 'TOTP Authenticator' | 'mTLS + Hardware Token';
  sessionTimeoutMinutes: number;
  lastAuditedAt: string;
  status: 'Compliant' | 'Warning' | 'Locked';
  exemptionCount: number;
}

export const CloudMfaGovernance: React.FC = () => {
  const [accessPoints, setAccessPoints] = useState<CloudAccessPoint[]>([
    {
      id: 'cap-aws-01',
      provider: 'AWS',
      environment: 'Production & Staging VPC (us-east-1 / us-west-2)',
      totalIdentities: 18,
      mfaEnforcedCount: 18,
      mfaMechanism: 'FIDO2 / Hardware YubiKey',
      sessionTimeoutMinutes: 60,
      lastAuditedAt: '2026-11-10T20:40:00Z',
      status: 'Compliant',
      exemptionCount: 0,
    },
    {
      id: 'cap-gcp-02',
      provider: 'Google Cloud',
      environment: 'GKE Kubernetes Cluster & Cloud Identity',
      totalIdentities: 12,
      mfaEnforcedCount: 12,
      mfaMechanism: 'WebAuthn Biometric',
      sessionTimeoutMinutes: 30,
      lastAuditedAt: '2026-11-10T20:38:00Z',
      status: 'Compliant',
      exemptionCount: 0,
    },
    {
      id: 'cap-azure-03',
      provider: 'Microsoft Azure',
      environment: 'Azure Entra ID & Resource Groups',
      totalIdentities: 9,
      mfaEnforcedCount: 9,
      mfaMechanism: 'FIDO2 / Hardware YubiKey',
      sessionTimeoutMinutes: 45,
      lastAuditedAt: '2026-11-10T20:30:00Z',
      status: 'Compliant',
      exemptionCount: 0,
    },
    {
      id: 'cap-spawift-04',
      provider: 'Spa Wift Cloud',
      environment: 'Automated Killchain Engine Controller Node',
      totalIdentities: 6,
      mfaEnforcedCount: 6,
      mfaMechanism: 'mTLS + Hardware Token',
      sessionTimeoutMinutes: 15,
      lastAuditedAt: '2026-11-10T20:45:00Z',
      status: 'Compliant',
      exemptionCount: 0,
    },
    {
      id: 'cap-k8s-05',
      provider: 'Kubernetes API',
      environment: 'Production Calico Ingress & In-Cluster Control',
      totalIdentities: 14,
      mfaEnforcedCount: 14,
      mfaMechanism: 'mTLS + Hardware Token',
      sessionTimeoutMinutes: 30,
      lastAuditedAt: '2026-11-10T20:41:00Z',
      status: 'Compliant',
      exemptionCount: 0,
    },
  ]);

  const [simulatingAudit, setSimulatingAudit] = useState(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const totalUsers = accessPoints.reduce((acc, c) => acc + c.totalIdentities, 0);
  const totalEnforced = accessPoints.reduce((acc, c) => acc + c.mfaEnforcedCount, 0);
  const enforcementPercentage = Math.round((totalEnforced / totalUsers) * 100);

  const handleRunMfaAudit = () => {
    setSimulatingAudit(true);
    setAuditMessage(null);
    setTimeout(() => {
      setSimulatingAudit(false);
      setAuditMessage(
        'All 5 Cloud Environments verified: 100% MFA compliance confirmed. 0 unauthenticated or bypass attempts detected. Zero-trust boundary locked.'
      );
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-slate-100 tracking-wide">
              MULTI-FACTOR AUTHENTICATION (MFA) CLOUD ACCESS GOVERNANCE
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
              ZERO TRUST STRICT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mandatory multi-factor authentication enforcement across all cloud environment access points, console logins, and API keys.
          </p>
        </div>

        <button
          onClick={handleRunMfaAudit}
          disabled={simulatingAudit}
          className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md border border-emerald-500 shrink-0"
        >
          {simulatingAudit ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>VERIFYING POLICIES...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AUDIT ALL CLOUD ACCESS POINTS</span>
            </>
          )}
        </button>
      </div>

      {auditMessage && (
        <div className="p-3.5 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{auditMessage}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>MFA ENFORCEMENT RATE</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400">
            {enforcementPercentage}%
          </div>
          <div className="text-[11px] text-emerald-300">
            {totalEnforced}/{totalUsers} Active Cloud Identities Protected
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>PROTECTED CLOUD PROVIDERS</span>
            <Key className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-blue-400">
            {accessPoints.length}
          </div>
          <div className="text-[11px] text-slate-400">
            AWS, GCP, Azure, Spa Wift, Kubernetes
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>EXEMPTIONS GRANTED</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-slate-100">
            0
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            Zero-Tolerance Policy Enforced
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>PRIMARY MECHANISMS</span>
            <Fingerprint className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold font-mono text-purple-300">
            FIDO2 & WebAuthn
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Phishing-Resistant Hardware Keys
          </div>
        </div>
      </div>

      {/* Access Points Table */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-100">
            CLOUD ACCESS POINT MFA INVENTORY & POLICIES
          </h2>
          <span className="text-xs font-mono text-emerald-400">Status: ALL POLICIES COMPLIANT</span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">CLOUD PROVIDER & SCOPE</th>
                <th className="p-3">IDENTITIES</th>
                <th className="p-3">MFA MECHANISM</th>
                <th className="p-3">SESSION TIMEOUT</th>
                <th className="p-3">EXEMPTIONS</th>
                <th className="p-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {accessPoints.map((ap) => (
                <tr key={ap.id} className="hover:bg-slate-950/60 transition-all">
                  <td className="p-3">
                    <div className="font-bold text-slate-200">{ap.provider}</div>
                    <div className="text-[10px] text-slate-500">{ap.environment}</div>
                  </td>
                  <td className="p-3">
                    <span className="text-emerald-400 font-bold">
                      {ap.mfaEnforcedCount} / {ap.totalIdentities}
                    </span>
                    <span className="text-slate-500 text-[10px] ml-1">(100%)</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                      {ap.mfaMechanism}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{ap.sessionTimeoutMinutes} mins</td>
                  <td className="p-3 text-emerald-400 font-bold">0</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[10px]">
                      {ap.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Global Security Controls Note */}
        <div className="p-3.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Conditional Access & Impossible Travel Detection Rules:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            All Cloud IAM sessions enforce hardware-backed cryptographic attestation. Out-of-band requests originating from outside authorized CIDR blocks or non-whitelisted geographical regions automatically trigger session invalidation and incident alert dispatch.
          </p>
        </div>
      </div>
    </div>
  );
};
