export interface EnrichedDomain {
  rawInput: string;
  domain: string;
  subdomain: string;
  rootDomain: string;
  isWildcard: boolean;
  isValid: boolean;
  ipAddresses: string[];
  ipv6Addresses?: string[];
  asn: string;
  isp: string;
  geoCountry: string;
  geoCity: string;
  tlsVersion: string;
  tlsGrade: 'A+' | 'A' | 'B' | 'C' | 'F';
  dnssec: boolean;
  spfValid: boolean;
  dmarcPolicy: 'reject' | 'quarantine' | 'none' | 'missing';
  openPorts: number[];
  riskScore: number; // 0 - 100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  exfiltrationAnomalyScore: number; // 0 - 100
  potentialExfiltrationDetected: boolean;
  lastScannedAt: string;
  status: 'active' | 'warning' | 'critical' | 'quarantined';
  activeThreatIndicators: string[];
}

export function parseDomainInput(input: string): {
  normalized: string;
  subdomain: string;
  rootDomain: string;
  isWildcard: boolean;
  isValid: boolean;
} {
  const clean = input.trim().toLowerCase();
  if (!clean) {
    return { normalized: '', subdomain: '', rootDomain: '', isWildcard: false, isValid: false };
  }

  // Remove protocol if present
  let stripped = clean.replace(/^(https?:\/\/)?/, '').replace(/\/.*$/, '');
  const isWildcard = stripped.startsWith('*.');
  if (isWildcard) {
    stripped = stripped.slice(2);
  }

  // Basic domain regex validation
  const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  const isValid = domainRegex.test(stripped);

  if (!isValid) {
    return { normalized: stripped, subdomain: '', rootDomain: stripped, isWildcard, isValid: false };
  }

  const parts = stripped.split('.');
  let rootDomain = stripped;
  let subdomain = '';

  if (parts.length > 2) {
    rootDomain = parts.slice(-2).join('.');
    subdomain = parts.slice(0, -2).join('.');
  } else {
    rootDomain = stripped;
    subdomain = '@';
  }

  return {
    normalized: isWildcard ? `*.${stripped}` : stripped,
    subdomain,
    rootDomain,
    isWildcard,
    isValid: true,
  };
}

export function calculateDomainRiskScore(data: {
  openPorts: number[];
  tlsGrade: 'A+' | 'A' | 'B' | 'C' | 'F';
  dnssec: boolean;
  spfValid: boolean;
  dmarcPolicy: 'reject' | 'quarantine' | 'none' | 'missing';
  anomalyScore: number;
}): { score: number; level: 'Low' | 'Medium' | 'High' | 'Critical' } {
  let score = 0;

  // Risky ports: SSH (22), RDP (3389), SMB (445), Unencrypted HTTP (80), Telnet (23)
  const highRiskPorts = [23, 445, 3389];
  const mediumRiskPorts = [21, 22, 8080, 5432, 27017];

  for (const port of data.openPorts) {
    if (highRiskPorts.includes(port)) score += 25;
    else if (mediumRiskPorts.includes(port)) score += 10;
  }

  // TLS Grade penalties
  if (data.tlsGrade === 'F') score += 30;
  else if (data.tlsGrade === 'C') score += 20;
  else if (data.tlsGrade === 'B') score += 10;

  // DNS security penalties
  if (!data.dnssec) score += 5;
  if (!data.spfValid) score += 10;
  if (data.dmarcPolicy === 'missing' || data.dmarcPolicy === 'none') score += 15;

  // Add anomaly contribution
  score += Math.round(data.anomalyScore * 0.3);

  score = Math.min(100, Math.max(0, score));

  let level: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (score >= 75) level = 'Critical';
  else if (score >= 50) level = 'High';
  else if (score >= 25) level = 'Medium';

  return { score, level };
}

export const DEFAULT_RUNEHALL_DOMAINS: EnrichedDomain[] = [
  {
    rawInput: 'runehall.com',
    domain: 'runehall.com',
    subdomain: '@',
    rootDomain: 'runehall.com',
    isWildcard: false,
    isValid: true,
    ipAddresses: ['104.21.48.112', '172.67.189.44'],
    ipv6Addresses: ['2606:4700:3033::6815:3070'],
    asn: 'AS13335 CLOUDFLARENET',
    isp: 'Cloudflare Edge Proxy',
    geoCountry: 'United States',
    geoCity: 'San Francisco, CA',
    tlsVersion: 'TLS 1.3 / ChaCha20-Poly1305',
    tlsGrade: 'A+',
    dnssec: true,
    spfValid: true,
    dmarcPolicy: 'reject',
    openPorts: [443, 80],
    riskScore: 12,
    riskLevel: 'Low',
    exfiltrationAnomalyScore: 4,
    potentialExfiltrationDetected: false,
    lastScannedAt: '2026-11-10T20:30:00Z',
    status: 'active',
    activeThreatIndicators: [],
  },
  {
    rawInput: 'api.runehall.com',
    domain: 'api.runehall.com',
    subdomain: 'api',
    rootDomain: 'runehall.com',
    isWildcard: false,
    isValid: true,
    ipAddresses: ['35.233.142.89'],
    asn: 'AS15169 GOOGLE-CLOUD',
    isp: 'Google Cloud Engine',
    geoCountry: 'United States',
    geoCity: 'Council Bluffs, IA',
    tlsVersion: 'TLS 1.3 / AES-256-GCM',
    tlsGrade: 'A',
    dnssec: true,
    spfValid: true,
    dmarcPolicy: 'reject',
    openPorts: [443],
    riskScore: 18,
    riskLevel: 'Low',
    exfiltrationAnomalyScore: 14,
    potentialExfiltrationDetected: false,
    lastScannedAt: '2026-11-10T20:35:00Z',
    status: 'active',
    activeThreatIndicators: ['Rate-limiting baseline 98% nominal'],
  },
  {
    rawInput: 'auth.runehall.com',
    domain: 'auth.runehall.com',
    subdomain: 'auth',
    rootDomain: 'runehall.com',
    isWildcard: false,
    isValid: true,
    ipAddresses: ['34.102.241.11'],
    asn: 'AS15169 GOOGLE-CLOUD',
    isp: 'Google Identity Gateway',
    geoCountry: 'United States',
    geoCity: 'The Dalles, OR',
    tlsVersion: 'TLS 1.3 / ECDHE-RSA-AES256',
    tlsGrade: 'A+',
    dnssec: true,
    spfValid: true,
    dmarcPolicy: 'reject',
    openPorts: [443],
    riskScore: 8,
    riskLevel: 'Low',
    exfiltrationAnomalyScore: 6,
    potentialExfiltrationDetected: false,
    lastScannedAt: '2026-11-10T20:40:00Z',
    status: 'active',
    activeThreatIndicators: ['MFA 100% Enforced', 'FIDO2 / WebAuthn Active'],
  },
  {
    rawInput: 'dev.runehall.com',
    domain: 'dev.runehall.com',
    subdomain: 'dev',
    rootDomain: 'runehall.com',
    isWildcard: false,
    isValid: true,
    ipAddresses: ['54.214.99.124'],
    asn: 'AS16509 AMAZON-02',
    isp: 'AWS EC2 Staging Pool',
    geoCountry: 'United States',
    geoCity: 'Portland, OR',
    tlsVersion: 'TLS 1.2 / Self-Signed Intermediate',
    tlsGrade: 'C',
    dnssec: false,
    spfValid: true,
    dmarcPolicy: 'quarantine',
    openPorts: [80, 443, 8080, 22],
    riskScore: 68,
    riskLevel: 'High',
    exfiltrationAnomalyScore: 78,
    potentialExfiltrationDetected: true,
    lastScannedAt: '2026-11-10T20:42:00Z',
    status: 'critical',
    activeThreatIndicators: [
      'Unusual outbound DNS TXT payload queries detected (DNS Tunneling attempt)',
      'Port 8080 staging microservice exposed to WAN without mutual TLS',
      'Potential data staging under /tmp/.spawift_cache',
    ],
  },
  {
    rawInput: 'vault.runehall.com',
    domain: 'vault.runehall.com',
    subdomain: 'vault',
    rootDomain: 'runehall.com',
    isWildcard: false,
    isValid: true,
    ipAddresses: ['13.56.12.98'],
    asn: 'AS16509 AMAZON-02',
    isp: 'AWS KMS / HSM Cluster',
    geoCountry: 'United States',
    geoCity: 'San Jose, CA',
    tlsVersion: 'TLS 1.3 / mTLS Enforced',
    tlsGrade: 'A+',
    dnssec: true,
    spfValid: true,
    dmarcPolicy: 'reject',
    openPorts: [8200, 443],
    riskScore: 15,
    riskLevel: 'Low',
    exfiltrationAnomalyScore: 9,
    potentialExfiltrationDetected: false,
    lastScannedAt: '2026-11-10T20:38:00Z',
    status: 'active',
    activeThreatIndicators: ['Audit log stream verified to SIEM'],
  },
  {
    rawInput: 'cdn.runehall.com',
    domain: 'cdn.runehall.com',
    subdomain: 'cdn',
    rootDomain: 'runehall.com',
    isWildcard: false,
    isValid: true,
    ipAddresses: ['151.101.65.140'],
    asn: 'AS54113 FASTLY',
    isp: 'Fastly Edge CDN',
    geoCountry: 'United States',
    geoCity: 'New York, NY',
    tlsVersion: 'TLS 1.3 / SNI Routing',
    tlsGrade: 'A',
    dnssec: true,
    spfValid: true,
    dmarcPolicy: 'reject',
    openPorts: [443],
    riskScore: 22,
    riskLevel: 'Low',
    exfiltrationAnomalyScore: 12,
    potentialExfiltrationDetected: false,
    lastScannedAt: '2026-11-10T20:30:00Z',
    status: 'active',
    activeThreatIndicators: [],
  },
  {
    rawInput: 'mail.runehall.com',
    domain: 'mail.runehall.com',
    subdomain: 'mail',
    rootDomain: 'runehall.com',
    isWildcard: false,
    isValid: true,
    ipAddresses: ['209.85.233.26'],
    asn: 'AS15169 GOOGLE-CLOUD',
    isp: 'Google Workspace MX Pool',
    geoCountry: 'United States',
    geoCity: 'Mountain View, CA',
    tlsVersion: 'TLS 1.3 / STARTTLS Strict',
    tlsGrade: 'A',
    dnssec: true,
    spfValid: true,
    dmarcPolicy: 'reject',
    openPorts: [25, 465, 587],
    riskScore: 16,
    riskLevel: 'Low',
    exfiltrationAnomalyScore: 11,
    potentialExfiltrationDetected: false,
    lastScannedAt: '2026-11-10T20:25:00Z',
    status: 'active',
    activeThreatIndicators: ['DKIM 2048-bit rotated 4 days ago'],
  },
];
