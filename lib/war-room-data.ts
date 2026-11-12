export interface IntelDossier {
  id: string;
  codename: string;
  subjectType: 'Threat Group' | 'Rogue Actor' | 'Infrastructure Cluster' | 'Canary Target';
  confidenceGrade: 'A (Confirmed)' | 'B (High Confidence)' | 'C (Moderate)' | 'D (Unconfirmed)';
  status: 'Active Investigation' | 'Quarantined' | 'Monitoring' | 'Archived';
  firstSeen: string;
  lastActive: string;
  primaryTarget: string;
  associatedHandles: string[];
  infrastructureIndicators: string[];
  riskRating: number; // 0 - 100
  synopsis: string;
  keyFindings: string[];
}

export interface GoogleDorkTemplate {
  id: string;
  name: string;
  category: 'Exposed Files' | 'Cloud Buckets' | 'Admin Panels' | 'Vulnerabilities' | 'Credentials';
  dorkPattern: string; // e.g. site:{{TARGET}} ext:env | ext:yml
  description: string;
}

export interface IndicatorOfCompromise {
  id: string;
  type: 'IPv4' | 'Domain' | 'SHA-256' | 'URL' | 'JA3 Fingerprint' | 'DNS-Tunneling';
  value: string;
  threatLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  associatedDossierId?: string;
  source: string;
  firstReported: string;
  actionTaken: 'Blocked' | 'Quarantined' | 'Monitoring' | 'Honeypot Redirect';
}

export interface WarRoomEvent {
  id: string;
  timestamp: string;
  level: 'ALERT' | 'INFO' | 'ACTION' | 'RESOLVED';
  title: string;
  details: string;
  operator: string;
}

export const INITIAL_INTEL_DOSSIERS: IntelDossier[] = [
  {
    id: 'DOS-2026-01',
    codename: 'OP_RUNE_STAGING_EXFIL',
    subjectType: 'Infrastructure Cluster',
    confidenceGrade: 'A (Confirmed)',
    status: 'Active Investigation',
    firstSeen: '2026-11-10T19:30:00Z',
    lastActive: '2026-11-11T07:15:00Z',
    primaryTarget: 'dev.runehall.com:8080',
    associatedHandles: ['spawift-canary', 'c2-beacon-alpha'],
    infrastructureIndicators: [
      '54.214.99.124 (AWS EC2)',
      'High-entropy DNS TXT queries > 4.8 Shannon',
      'Port 8080 /actuator/env exposed WAN',
    ],
    riskRating: 88,
    synopsis: 'Unauthorized reconnaissance probe targeting exposed development actuator and attempting DNS tunneling exfiltration bursts.',
    keyFindings: [
      'Disclosed environment variables matching database connection strings.',
      'Attempted 24 chunked base64 DNS queries via Cloudflare edge.',
      'Contained via RedOps Playbook PB-01 network sever.',
    ],
  },
  {
    id: 'DOS-2026-02',
    codename: 'OP_PHISHING_HOMOGLYPH_WATCH',
    subjectType: 'Threat Group',
    confidenceGrade: 'B (High Confidence)',
    status: 'Monitoring',
    firstSeen: '2026-11-08T12:00:00Z',
    lastActive: '2026-11-10T14:22:00Z',
    primaryTarget: 'runehall.com TLD variants',
    associatedHandles: ['runhall-fake-sec', 'tg://@rune_spoof'],
    infrastructureIndicators: [
      'rṵnehall.com (Punycode xn--rnehall-4m4c.com)',
      '185.220.101.5 (Known bulletproof VPS)',
      'Let’s Encrypt 90-day cert issued yesterday',
    ],
    riskRating: 65,
    synopsis: 'Proactive surveillance on newly registered homoglyph lookalike domains targeting customers of runehall.com.',
    keyFindings: [
      'Certificate transparency log watcher detected rogue cert issuance.',
      'DMARC p=reject actively protecting corporate mail domains.',
      'Domain takedown notification submitted to registrar.',
    ],
  },
  {
    id: 'DOS-2026-03',
    codename: 'OP_CLOUD_CREDENTIAL_SENTINEL',
    subjectType: 'Canary Target',
    confidenceGrade: 'A (Confirmed)',
    status: 'Quarantined',
    firstSeen: '2026-11-10T18:00:00Z',
    lastActive: '2026-11-11T04:12:00Z',
    primaryTarget: 'AWS & GCP IAM Access Points',
    associatedHandles: ['cloud-sec-audit', 'bastion-gate-01'],
    infrastructureIndicators: [
      'AWS IAM Role: arn:aws:iam::382953583838:role/DevStaging',
      'Zero exemptions to FIDO2 / WebAuthn MFA policy',
      'Session token invalidation SLA: 15 seconds',
    ],
    riskRating: 25,
    synopsis: 'Defensive validation of multi-cloud access points verifying impossible travel detection and mandatory hardware MFA.',
    keyFindings: [
      '100% MFA compliance verified across 59 active cloud operators.',
      'Simulated non-MFA console login was blocked at boundary gateway.',
    ],
  },
];

export const GOOGLE_DORK_TEMPLATES: GoogleDorkTemplate[] = [
  {
    id: 'dork-1',
    name: 'Exposed Environment & Config Files',
    category: 'Exposed Files',
    dorkPattern: 'site:{{TARGET}} ext:env | ext:yml | ext:json | ext:conf "password" | "secret"',
    description: 'Finds accidental commits of production .env or YAML configuration files.',
  },
  {
    id: 'dork-2',
    name: 'Unprotected Spring Boot Actuators',
    category: 'Admin Panels',
    dorkPattern: 'site:{{TARGET}} inurl:/actuator/env | inurl:/actuator/heapdump | inurl:/actuator/health',
    description: 'Pinpoints unauthenticated metrics and memory inspection endpoints.',
  },
  {
    id: 'dork-3',
    name: 'Open Cloud S3 & GCS Buckets',
    category: 'Cloud Buckets',
    dorkPattern: 'site:s3.amazonaws.com | site:storage.googleapis.com "{{TARGET}}"',
    description: 'Discovers public read/write cloud storage buckets associated with the target domain.',
  },
  {
    id: 'dork-4',
    name: 'Security.txt & Vulnerability Disclosure Policies',
    category: 'Vulnerabilities',
    dorkPattern: 'site:{{TARGET}} inurl:security.txt | inurl:.well-known/security.txt',
    description: 'Verifies published RFC 9116 responsible disclosure guidelines.',
  },
  {
    id: 'dork-5',
    name: 'Leaked Database Backups & SQL Dumps',
    category: 'Exposed Files',
    dorkPattern: 'site:{{TARGET}} ext:sql | ext:dump | ext:bak | ext:tar.gz',
    description: 'Searches for misplaced database snapshots or archive archives.',
  },
  {
    id: 'dork-6',
    name: 'Swagger & OpenAPI Definition Endpoints',
    category: 'Admin Panels',
    dorkPattern: 'site:{{TARGET}} inurl:swagger-ui.html | inurl:api-docs | inurl:v2/api-docs',
    description: 'Locates interactive API testbeds exposed without token validation.',
  },
];

export const INITIAL_IOC_RECORDS: IndicatorOfCompromise[] = [
  {
    id: 'IOC-001',
    type: 'IPv4',
    value: '54.214.99.124',
    threatLevel: 'High',
    associatedDossierId: 'DOS-2026-01',
    source: 'RedOps Port Probe & Anomaly Radar',
    firstReported: '2026-11-10T20:42:00Z',
    actionTaken: 'Quarantined',
  },
  {
    id: 'IOC-002',
    type: 'DNS-Tunneling',
    value: 'tunnel.c2.dev.runehall.com (High Shannon entropy: 4.88)',
    threatLevel: 'Critical',
    associatedDossierId: 'DOS-2026-01',
    source: 'Runehall Subdomain Exfiltration Sentinel',
    firstReported: '2026-11-10T20:43:10Z',
    actionTaken: 'Blocked',
  },
  {
    id: 'IOC-003',
    type: 'SHA-256',
    value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    threatLevel: 'Low',
    source: 'Evidence Lockbox Attestation',
    firstReported: '2026-11-11T00:00:00Z',
    actionTaken: 'Monitoring',
  },
  {
    id: 'IOC-004',
    type: 'Domain',
    value: 'rṵnehall.com',
    threatLevel: 'Medium',
    associatedDossierId: 'DOS-2026-02',
    source: 'Certificate Transparency Log Watcher',
    firstReported: '2026-11-09T11:20:00Z',
    actionTaken: 'Honeypot Redirect',
  },
];

export const INITIAL_WAR_ROOM_EVENTS: WarRoomEvent[] = [
  {
    id: 'ev-1',
    timestamp: '2026-11-11 07:15:10',
    level: 'ALERT',
    title: 'Exfiltration Threshold Triggered on dev.runehall.com',
    details: 'Anomalous DNS TXT queries exceeded 4.8 Shannon entropy baseline. Playbook PB-01 engaged.',
    operator: 'Sentinel Daemon #4',
  },
  {
    id: 'ev-2',
    timestamp: '2026-11-11 07:18:40',
    level: 'ACTION',
    title: 'Playbook PB-01 Quarantine Executed',
    details: 'Severed ingress/egress network interface on security group sg-dev-8080. Sockets flushed.',
    operator: 'Lead Incident Commander',
  },
  {
    id: 'ev-3',
    timestamp: '2026-11-11 07:22:00',
    level: 'RESOLVED',
    title: 'DNS Sinkhole Confirmed Active',
    details: 'Subdomain queries routed to safe inspection honeypot. Production gateways unaffected.',
    operator: 'Cloudflare Edge Proxy',
  },
  {
    id: 'ev-4',
    timestamp: '2026-11-11 07:35:00',
    level: 'INFO',
    title: 'Live Reconnaissance Audit Complete',
    details: 'recon_report executed via Python 3.10 stdlib. Hygiene score 6/10 (Grade C) logged.',
    operator: 'MaxPayne RedOps Engine',
  },
];

export function buildGoogleDorkUrl(pattern: string, target: string): string {
  const cleanTarget = target.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const query = pattern.replace(/\{\{TARGET\}\}/g, cleanTarget);
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function computeSha256Simulated(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256_${hex.repeat(8).slice(0, 64)}`;
}
