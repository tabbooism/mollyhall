'use client';

import React, { useState } from 'react';
import {
  Globe,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Server,
  Lock,
  ExternalLink,
  Plus,
  Filter,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import {
  EnrichedDomain,
  parseDomainInput,
  calculateDomainRiskScore,
} from '../lib/domain-parser';

interface DomainEnrichmentViewProps {
  domains: EnrichedDomain[];
  onAddDomain: (domain: EnrichedDomain) => void;
  onSelectDomainForHunt: (domain: string) => void;
}

export const DomainEnrichmentView: React.FC<DomainEnrichmentViewProps> = ({
  domains,
  onAddDomain,
  onSelectDomainForHunt,
}) => {
  const [inputQuery, setInputQuery] = useState('dev.runehall.com');
  const [filterMode, setFilterMode] = useState<'all' | 'anomalous' | 'high_risk'>('all');
  const [selectedDomain, setSelectedDomain] = useState<EnrichedDomain>(
    domains.find((d) => d.domain === 'dev.runehall.com') || domains[0]
  );
  const [isScanning, setIsScanning] = useState(false);
  const [searchTableTerm, setSearchTableTerm] = useState('');

  // Handle parsing of domain
  const parsedMeta = parseDomainInput(inputQuery);

  const handleEnrichSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!parsedMeta.isValid) return;

    setIsScanning(true);
    setTimeout(() => {
      // Check if domain already exists
      const existing = domains.find((d) => d.domain === parsedMeta.normalized);
      if (existing) {
        setSelectedDomain(existing);
      } else {
        // Generate new enriched domain
        const openPorts = [80, 443, 8443];
        const risk = calculateDomainRiskScore({
          openPorts,
          tlsGrade: 'A',
          dnssec: true,
          spfValid: true,
          dmarcPolicy: 'reject',
          anomalyScore: 10,
        });

        const newDomain: EnrichedDomain = {
          rawInput: inputQuery,
          domain: parsedMeta.normalized,
          subdomain: parsedMeta.subdomain,
          rootDomain: parsedMeta.rootDomain,
          isWildcard: parsedMeta.isWildcard,
          isValid: true,
          ipAddresses: ['35.190.247.19'],
          asn: 'AS15169 GOOGLE-CLOUD',
          isp: 'Google Cloud Platform',
          geoCountry: 'United States',
          geoCity: 'Council Bluffs, IA',
          tlsVersion: 'TLS 1.3 / ChaCha20-Poly1305',
          tlsGrade: 'A',
          dnssec: true,
          spfValid: true,
          dmarcPolicy: 'reject',
          openPorts,
          riskScore: risk.score,
          riskLevel: risk.level,
          exfiltrationAnomalyScore: 12,
          potentialExfiltrationDetected: false,
          lastScannedAt: new Date().toISOString(),
          status: 'active',
          activeThreatIndicators: ['Newly enriched via Threat Hunting Parser'],
        };
        onAddDomain(newDomain);
        setSelectedDomain(newDomain);
      }
      setIsScanning(false);
    }, 600);
  };

  const filteredDomains = domains.filter((d) => {
    if (filterMode === 'anomalous' && !d.potentialExfiltrationDetected) return false;
    if (filterMode === 'high_risk' && d.riskLevel !== 'High' && d.riskLevel !== 'Critical') return false;
    if (searchTableTerm) {
      return (
        d.domain.toLowerCase().includes(searchTableTerm.toLowerCase()) ||
        d.asn.toLowerCase().includes(searchTableTerm.toLowerCase()) ||
        d.ipAddresses.some((ip) => ip.includes(searchTableTerm))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Threat Hunting Input & Domain Parser Bar */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-red-500" />
              <h1 className="text-base font-bold text-slate-100 tracking-wide">
                DOMAIN PARSING & THREAT ENRICHMENT ENGINE
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous ingestion of FQDNs, wildcard subdomains, and IP blocks. Continuous anomaly monitoring for{' '}
              <strong className="text-slate-200 font-mono">runehall.com</strong>.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-mono">PRESETS:</span>
            {['runehall.com', 'dev.runehall.com', 'auth.runehall.com', 'vault.runehall.com'].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setInputQuery(preset);
                  const target = domains.find((d) => d.domain === preset);
                  if (target) setSelectedDomain(target);
                }}
                className="px-2 py-1 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleEnrichSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="e.g. runehall.com, *.runehall.com, api.runehall.com, 104.21.48.112"
              className="w-full pl-9 pr-4 py-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            disabled={isScanning || !parsedMeta.isValid}
            className={`px-4 py-2.5 rounded text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all ${
              isScanning || !parsedMeta.isValid
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-900/40 border border-red-500'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>ENRICHING...</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5" />
                <span>PARSE & ENRICH DOMAIN</span>
              </>
            )}
          </button>
        </form>

        {/* Parser Syntax Evaluation Bar */}
        <div className="p-3 rounded bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">PARSED RESULT:</span>
            <span className="text-slate-300">
              Root: <strong className="text-slate-100">{parsedMeta.rootDomain || 'N/A'}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              Subdomain: <strong className="text-blue-400">{parsedMeta.subdomain || '@'}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              Wildcard:{' '}
              <strong className={parsedMeta.isWildcard ? 'text-amber-400' : 'text-slate-400'}>
                {parsedMeta.isWildcard ? 'YES (*.)' : 'NO'}
              </strong>
            </span>
          </div>

          <div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                parsedMeta.isValid
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-red-950 text-red-400 border border-red-800'
              }`}
            >
              {parsedMeta.isValid ? 'VALID FQDN SYNTAX' : 'INVALID SYNTAX'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Selected Domain Deep Profile + Monitored Subdomains Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Selected Domain Intelligence Profile */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold font-mono text-slate-100">
                    {selectedDomain.domain}
                  </h2>
                  {selectedDomain.potentialExfiltrationDetected && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-600 text-white font-mono font-bold animate-pulse">
                      EXFIL ALERT
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 font-mono">
                  {selectedDomain.asn} • {selectedDomain.isp}
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                    selectedDomain.riskLevel === 'Critical'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : selectedDomain.riskLevel === 'High'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  RISK: {selectedDomain.riskScore}/100 ({selectedDomain.riskLevel})
                </span>
              </div>
            </div>

            {/* Exfiltration Warning Box if flagged */}
            {selectedDomain.potentialExfiltrationDetected && (
              <div className="p-3 rounded bg-red-950/40 border border-red-500/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-red-300">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  <span>DATA EXFILTRATION ATTEMPT SUSPECTED</span>
                </div>
                <p className="text-[11px] text-red-200 leading-relaxed">
                  Subdomain exhibited anomalous DNS TXT query burst matching high-entropy base64 chunks. Anomaly Score: <strong>{selectedDomain.exfiltrationAnomalyScore}/100</strong>.
                </p>
                <div className="pt-1">
                  <span className="text-[10px] text-red-400 font-mono">
                    RECOMMENDED: Trigger Incident Playbook PB-01 to isolate staging subnet.
                  </span>
                </div>
              </div>
            )}

            {/* Enrichment Badges Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500">TLS GRADE / PROTOCOL</div>
                <div className="text-slate-200 font-bold mt-0.5 flex items-center justify-between">
                  <span>{selectedDomain.tlsGrade}</span>
                  <span className="text-[10px] text-slate-400">{selectedDomain.tlsVersion.split('/')[0]}</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500">DNSSEC STATUS</div>
                <div className="text-slate-200 font-bold mt-0.5 flex items-center justify-between">
                  <span>{selectedDomain.dnssec ? 'ENABLED' : 'DISABLED'}</span>
                  <span className={selectedDomain.dnssec ? 'text-emerald-400' : 'text-amber-400'}>
                    {selectedDomain.dnssec ? 'SECURE' : 'VULNERABLE'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500">DMARC POLICY</div>
                <div className="text-slate-200 font-bold mt-0.5 uppercase">
                  {selectedDomain.dmarcPolicy}
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500">LOCATION & GEO</div>
                <div className="text-slate-200 truncate mt-0.5">
                  {selectedDomain.geoCity || selectedDomain.geoCountry}
                </div>
              </div>
            </div>

            {/* Resolved IP Addresses */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400">RESOLVED A / AAAA RECORDS:</span>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                {selectedDomain.ipAddresses.map((ip) => (
                  <div key={ip} className="flex items-center justify-between">
                    <span>{ip}</span>
                    <span className="text-[10px] text-slate-500">IPv4 Ingress</span>
                  </div>
                ))}
                {selectedDomain.ipv6Addresses?.map((ip6) => (
                  <div key={ip6} className="flex items-center justify-between">
                    <span className="truncate">{ip6}</span>
                    <span className="text-[10px] text-slate-500">IPv6</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Ports Detected */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400">DETECTED OPEN PORTS:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedDomain.openPorts.map((port) => {
                  const isRisky = [22, 8080, 445, 3389].includes(port);
                  return (
                    <span
                      key={port}
                      className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                        isRisky
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      Port {port} {isRisky ? '(ALERT)' : ''}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Threat Indicators */}
            {selectedDomain.activeThreatIndicators.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono text-slate-400">THREAT HUNTING INDICATORS:</span>
                <div className="space-y-1">
                  {selectedDomain.activeThreatIndicators.map((ind, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono"
                    >
                      • {ind}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 Cols): Runehall.com Subdomains Inventory Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-100 tracking-wide">
                  RUNEHALL.COM SUBDOMAIN ASSET INVENTORY
                </h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  Continuous anomaly, certificate, and exfiltration tracking across {domains.length} assets.
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-950 rounded p-0.5 border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      filterMode === 'all' ? 'bg-red-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({domains.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('anomalous')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      filterMode === 'anomalous' ? 'bg-red-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Anomalies ({domains.filter((d) => d.potentialExfiltrationDetected).length})
                  </button>
                  <button
                    onClick={() => setFilterMode('high_risk')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      filterMode === 'high_risk' ? 'bg-red-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    High Risk
                  </button>
                </div>
              </div>
            </div>

            {/* Search Input for Subdomains */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Filter by subdomain, IP, or ASN..."
                value={searchTableTerm}
                onChange={(e) => setSearchTableTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto border border-slate-800 rounded">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">SUBDOMAIN</th>
                    <th className="p-2.5">INGRESS IP / ASN</th>
                    <th className="p-2.5">TLS / DNSSEC</th>
                    <th className="p-2.5">RISK / EXFIL</th>
                    <th className="p-2.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredDomains.map((d) => {
                    const isSelected = selectedDomain.domain === d.domain;
                    return (
                      <tr
                        key={d.domain}
                        onClick={() => setSelectedDomain(d)}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-red-950/30'
                            : d.potentialExfiltrationDetected
                            ? 'bg-red-950/10 hover:bg-red-950/20'
                            : 'hover:bg-slate-950/60'
                        }`}
                      >
                        <td className="p-2.5">
                          <div className="font-semibold text-slate-200">{d.domain}</div>
                          <div className="text-[10px] text-slate-500">Ports: {d.openPorts.join(', ')}</div>
                        </td>
                        <td className="p-2.5">
                          <div className="text-slate-300">{d.ipAddresses[0]}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{d.asn}</div>
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              d.tlsGrade === 'A+' || d.tlsGrade === 'A'
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-red-950 text-red-400'
                            }`}
                          >
                            TLS {d.tlsGrade}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1.5">
                            {d.dnssec ? 'DNSSEC' : 'NO-SEC'}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                d.riskLevel === 'Critical'
                                  ? 'bg-red-500/20 text-red-400'
                                  : d.riskLevel === 'High'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}
                            >
                              {d.riskScore}
                            </span>
                            {d.potentialExfiltrationDetected && (
                              <span className="px-1 py-0.2 text-[9px] rounded bg-red-600 text-white font-bold">
                                EXFIL
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDomain(d);
                              onSelectDomainForHunt(d.domain);
                            }}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700"
                          >
                            Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Anomaly detection summary note */}
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Continuous runehall.com DNS telemetry polling rate: every 15 seconds.</span>
              </span>
              <span className="font-mono text-slate-300">Default Baseline: ZERO EXFIL TOLERANCE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
