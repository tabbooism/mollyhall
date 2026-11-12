export interface ComplianceFramework {
  id: 'gdpr' | 'soc2' | 'iso27001' | 'hipaa' | 'pci_dss' | 'nist';
  name: string;
  version: string;
  description: string;
  complianceScore: number; // 0 - 100
  status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  totalControls: number;
  passedControls: number;
  failedControls: number;
  auditFrequency: 'Continuous' | 'Daily' | 'Weekly' | 'Monthly';
  lastAudited: string;
  nextScheduledAudit: string;
  controls: {
    id: string;
    code: string;
    name: string;
    status: 'pass' | 'fail' | 'partial';
    evidence: string;
  }[];
}

export interface SecurityAuditSchedule {
  id: string;
  title: string;
  framework: string;
  targetScope: string;
  cadence: 'Hourly' | 'Daily' | 'Weekly' | 'Bi-Weekly' | 'Monthly';
  nextRun: string;
  lastRunStatus: 'Passed' | 'Action Required' | 'Running';
  autonomousExecutor: string;
  enabled: boolean;
}

export interface VulnerabilityFinding {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  cvssScore: number;
  cwe: string;
  cve?: string;
  targetAsset: string;
  discoveryModule: string;
  discoveredAt: string;
  status: 'Open' | 'Mitigated' | 'Remediating' | 'False Positive';
  description: string;
  proofOfConcept: string;
  remediationAdvice: string;
}

export interface IncidentPlaybook {
  id: string;
  title: string;
  targetThreat: string;
  triggerCondition: string;
  severity: 'Critical' | 'High' | 'Medium';
  estimatedExecutionTime: string;
  steps: {
    order: number;
    actionName: string;
    serviceAffected: string;
    description: string;
    status: 'pending' | 'in_progress' | 'executed' | 'skipped';
  }[];
}

export const INITIAL_COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'gdpr',
    name: 'GDPR (EU 2016/679)',
    version: '2026 Revision',
    description: 'European Union General Data Protection Regulation - Art 25, 32 (Security of Processing), 33 (Breach Notification).',
    complianceScore: 96,
    status: 'Compliant',
    totalControls: 18,
    passedControls: 17,
    failedControls: 1,
    auditFrequency: 'Daily',
    lastAudited: '2026-11-10T18:00:00Z',
    nextScheduledAudit: '2026-11-11T18:00:00Z',
    controls: [
      { id: 'c-gdpr-1', code: 'Art. 25', name: 'Data Protection by Design & Default', status: 'pass', evidence: 'Zero Trust architecture and encrypted transit enforced.' },
      { id: 'c-gdpr-2', code: 'Art. 32(1)(a)', name: 'Pseudonymisation & Encryption of Personal Data', status: 'pass', evidence: 'AES-256 GCM applied to sensitive storage backends.' },
      { id: 'c-gdpr-3', code: 'Art. 32(1)(b)', name: 'Ongoing Confidentiality & System Resilience', status: 'partial', evidence: 'Staging environment dev.runehall.com requires network isolation patch.' },
      { id: 'c-gdpr-4', code: 'Art. 33', name: '72-Hour Breach Notification Automation', status: 'pass', evidence: 'Automated RedOps incident playbook dispatches alerts to DPO within 60s.' },
    ],
  },
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    version: '2025 Trust Services Criteria',
    description: 'AICPA Security, Availability, Processing Integrity, Confidentiality, and Privacy controls.',
    complianceScore: 94,
    status: 'Compliant',
    totalControls: 24,
    passedControls: 22,
    failedControls: 2,
    auditFrequency: 'Continuous',
    lastAudited: '2026-11-10T20:00:00Z',
    nextScheduledAudit: 'Continuous (Automated)',
    controls: [
      { id: 'c-soc-1', code: 'CC6.1', name: 'Logical Access Security & MFA Enforcement', status: 'pass', evidence: 'MFA enforced across 100% cloud access points via FIDO2/TOTP.' },
      { id: 'c-soc-2', code: 'CC6.6', name: 'Boundary Protection & Network Intrusion Prevention', status: 'partial', evidence: 'Spa Wift exfiltration canary flagged staging egress query anomaly.' },
      { id: 'c-soc-3', code: 'CC7.1', name: 'Vulnerability Management & Pen Testing Workflows', status: 'pass', evidence: 'Automated RedOps killchain runs scheduled every 24 hours.' },
      { id: 'c-soc-4', code: 'CC7.2', name: 'Incident Response & Anomaly Triage', status: 'pass', evidence: 'Playbook execution latency averages 4.2 minutes.' },
    ],
  },
  {
    id: 'iso27001',
    name: 'ISO/IEC 27001:2022',
    version: '2022 Standard',
    description: 'Information Security Management System (ISMS) Annex A Information Security Controls.',
    complianceScore: 95,
    status: 'Compliant',
    totalControls: 32,
    passedControls: 30,
    failedControls: 2,
    auditFrequency: 'Weekly',
    lastAudited: '2026-11-08T00:00:00Z',
    nextScheduledAudit: '2026-11-15T00:00:00Z',
    controls: [
      { id: 'c-iso-1', code: 'A.5.15', name: 'Access Control & Authentication Mechanisms', status: 'pass', evidence: 'Role-based access control and hardware token enforcement verified.' },
      { id: 'c-iso-2', code: 'A.8.8', name: 'Management of Technical Vulnerabilities', status: 'pass', evidence: 'RedOps automated set kit active for continuous discovery.' },
      { id: 'c-iso-3', code: 'A.8.12', name: 'Data Leakage Prevention (DLP)', status: 'partial', evidence: 'Exfiltration resistance probe blocked 9/10 simulated vectors.' },
    ],
  },
  {
    id: 'pci_dss',
    name: 'PCI-DSS v4.0.1',
    version: 'v4.0.1 Mandatory',
    description: 'Payment Card Industry Data Security Standard - Cardholder Data Environment protection.',
    complianceScore: 92,
    status: 'Compliant',
    totalControls: 16,
    passedControls: 15,
    failedControls: 1,
    auditFrequency: 'Daily',
    lastAudited: '2026-11-10T12:00:00Z',
    nextScheduledAudit: '2026-11-11T12:00:00Z',
    controls: [
      { id: 'c-pci-1', code: 'Req 8.4.2', name: 'Multi-Factor Authentication for all CDE access', status: 'pass', evidence: '100% of all administrative access verified with hardware MFA.' },
      { id: 'c-pci-2', code: 'Req 11.3.1', name: 'Automated External Vulnerability Scans', status: 'pass', evidence: 'Quarterly ASV scans supplemented with daily RedOps autonomous runs.' },
    ],
  },
];

export const INITIAL_AUDIT_SCHEDULES: SecurityAuditSchedule[] = [
  {
    id: 'aud-01',
    title: 'Daily Perimeter & Runehall.com Subdomain Audit',
    framework: 'SOC 2 CC7.1 / ISO 27001 A.8.8',
    targetScope: 'runehall.com + 7 subdomains',
    cadence: 'Daily',
    nextRun: '2026-11-11 00:00 UTC',
    lastRunStatus: 'Passed',
    autonomousExecutor: 'RedOps Spa Wift Engine v4.2',
    enabled: true,
  },
  {
    id: 'aud-02',
    title: 'Continuous Cloud Access MFA Enforcement Verification',
    framework: 'PCI-DSS 8.4.2 / GDPR Art. 32',
    targetScope: 'AWS, GCP, Azure, Spa Wift Cloud',
    cadence: 'Hourly',
    nextRun: '2026-11-10 21:00 UTC',
    lastRunStatus: 'Passed',
    autonomousExecutor: 'MFA Sentinel Agent',
    enabled: true,
  },
  {
    id: 'aud-03',
    title: 'Weekly Full Killchain Simulation & Exfiltration Resistance',
    framework: 'ISO 27001 A.8.12 / NIST SP 800-53',
    targetScope: 'Full Hybrid Infrastructure',
    cadence: 'Weekly',
    nextRun: '2026-11-15 02:00 UTC',
    lastRunStatus: 'Action Required',
    autonomousExecutor: 'Spa Wift Autonomous Killchain',
    enabled: true,
  },
  {
    id: 'aud-04',
    title: 'Global Data Protection & Privacy Audit Assessment',
    framework: 'GDPR / HIPAA',
    targetScope: 'All Database and Storage Buckets',
    cadence: 'Daily',
    nextRun: '2026-11-11 06:00 UTC',
    lastRunStatus: 'Passed',
    autonomousExecutor: 'Compliance Audit Daemon',
    enabled: true,
  },
];

export const INITIAL_VULNERABILITY_SETKIT: VulnerabilityFinding[] = [
  {
    id: 'VULN-2026-0891',
    title: 'Unauthenticated Metrics & Env Dump on Staging Microservice',
    severity: 'High',
    cvssScore: 7.8,
    cwe: 'CWE-200: Information Exposure',
    cve: 'CVE-2025-49219',
    targetAsset: 'dev.runehall.com:8080',
    discoveryModule: 'Advanced Set Kit for Vulnerability Discovery',
    discoveredAt: '2026-11-10T20:42:15Z',
    status: 'Open',
    description: 'Spring Boot Actuator /actuator/env endpoint exposed publicly without authentication, disclosing internal environment variables and database hostnames.',
    proofOfConcept: 'GET /actuator/env HTTP/1.1 -> Host: dev.runehall.com:8080 -> 200 OK with propertySources configuration map.',
    remediationAdvice: 'Restrict actuator endpoint visibility to internal management subnet or enforce mutual TLS/OAuth2 authorization.',
  },
  {
    id: 'VULN-2026-0892',
    title: 'Potential DNS Tunneling Exfiltration Anomaly on Dev Subdomain',
    severity: 'High',
    cvssScore: 7.5,
    cwe: 'CWE-319: Cleartext Transmission of Sensitive Information via Tunnel',
    targetAsset: 'dev.runehall.com',
    discoveryModule: 'Runehall Subdomain Exfiltration Sentinel',
    discoveredAt: '2026-11-10T20:43:00Z',
    status: 'Remediating',
    description: 'Automated heuristic detected anomalous high-entropy TXT requests (> 4.8 Shannon entropy) originating from dev staging host.',
    proofOfConcept: 'Simulated C2 beacon canary matched 24 bursts of encoded base64 sub-queries within 120s window.',
    remediationAdvice: 'Deploy egress DNS firewall rule, apply strict DNS sinkholing, and isolate dev container runtime network interface.',
  },
  {
    id: 'VULN-2026-0893',
    title: 'Weak TLS Cipher Suites Enabled on Legacy Staging Ingress',
    severity: 'Medium',
    cvssScore: 5.3,
    cwe: 'CWE-326: Inadequate Encryption Strength',
    targetAsset: 'dev.runehall.com:443',
    discoveryModule: 'Spa Wift Automated Killchain Engine',
    discoveredAt: '2026-11-10T20:31:00Z',
    status: 'Open',
    description: 'Server accepts TLS 1.2 with CBC cipher suites susceptible to Lucky13 and timing oracle vulnerabilities.',
    proofOfConcept: 'TLS Handshake ClientHello with TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA negotiated successfully.',
    remediationAdvice: 'Disable CBC mode ciphers; require AEAD ciphers (AES-GCM or ChaCha20-Poly1305) and enforce TLS 1.3 as default.',
  },
  {
    id: 'VULN-2026-0894',
    title: 'Missing Strict DMARC Quarantine Policy on Staging Mail MX',
    severity: 'Low',
    cvssScore: 3.4,
    cwe: 'CWE-345: Insufficient Verification of Data Authenticity',
    targetAsset: 'mail.runehall.com',
    discoveryModule: 'Advanced Set Kit for Vulnerability Discovery',
    discoveredAt: '2026-11-10T20:25:00Z',
    status: 'Mitigated',
    description: 'DMARC record was configured as p=none during migration, allowing spoofing attempts without receiver rejection.',
    proofOfConcept: 'TXT _dmarc.mail.runehall.com returned "v=DMARC1; p=none; sp=none;"',
    remediationAdvice: 'Upgrade DMARC policy from p=none to p=reject with rua reporting configured.',
  },
];

export const INCIDENT_RESPONSE_PLAYBOOKS: IncidentPlaybook[] = [
  {
    id: 'pb-01',
    title: 'Data Exfiltration Quarantine & Egress Sever',
    targetThreat: 'DNS Tunneling / Data Exfiltration on dev.runehall.com',
    triggerCondition: 'Exfiltration anomaly score > 70 or continuous C2 beaconing detected',
    severity: 'Critical',
    estimatedExecutionTime: '30 seconds',
    steps: [
      { order: 1, actionName: 'Sever Ingress/Egress Network Interface', serviceAffected: 'AWS Security Group sg-dev-8080', description: 'Attach restrictive emergency quarantine security group blocking all non-bastion traffic.', status: 'executed' },
      { order: 2, actionName: 'Terminate Active C2 TCP & UDP Sockets', serviceAffected: 'Kernel iptables & conntrack', description: 'Flush open socket state tables on dev worker node #2.', status: 'executed' },
      { order: 3, actionName: 'Sinkhole Rogue DNS Resolution Queries', serviceAffected: 'Cloudflare Gateway / Route53', description: 'Redirect anomalous subdomain queries to safe analysis honeypot.', status: 'in_progress' },
      { order: 4, actionName: 'Capture Volatile Memory Dump for Forensics', serviceAffected: 'LiME Memory Acquirer', description: 'Dump memory page table before instance container teardown.', status: 'pending' },
      { order: 5, actionName: 'Dispatch Urgent SOC & CISO PagerDuty Alert', serviceAffected: 'PagerDuty & Slack SOC Warroom', description: 'Transmit full incident metadata and containment receipt.', status: 'pending' },
    ],
  },
  {
    id: 'pb-02',
    title: 'Cloud IAM Key Revocation & Mandatory MFA Enforcement',
    targetThreat: 'Compromised Cloud Credentials or MFA Bypass Attempt',
    triggerCondition: 'Cloud MFA policy violation or stale credential usage',
    severity: 'High',
    estimatedExecutionTime: '15 seconds',
    steps: [
      { order: 1, actionName: 'Deactivate Compromised AWS/GCP API Keys', serviceAffected: 'IAM Access Key Manager', description: 'Set status to Inactive for key IDs with suspicious geographical signatures.', status: 'pending' },
      { order: 2, actionName: 'Force Terminate All Active Cloud Console Sessions', serviceAffected: 'AWS STS / Google Cloud Identity', description: 'Invalidate all current OAuth bearer and SAML tokens.', status: 'pending' },
      { order: 3, actionName: 'Trigger Immediate FIDO2/Hardware Token MFA Re-challenge', serviceAffected: 'Zero Trust Access Gateway', description: 'Prompt user for physical YubiKey or biometric touch validation.', status: 'pending' },
      { order: 4, actionName: 'Enforce Least-Privilege Role Boundary', serviceAffected: 'Cloud Permission Boundary', description: 'Strip wildcard AdministratorAccess and attach read-only lockdown policy.', status: 'pending' },
    ],
  },
  {
    id: 'pb-03',
    title: 'Zero Trust Host Isolation & Container Patching',
    targetThreat: 'Exposed Debug Actuator / Unauthenticated Microservice',
    triggerCondition: 'Vulnerability Severity >= 7.0 on external endpoint',
    severity: 'High',
    estimatedExecutionTime: '45 seconds',
    steps: [
      { order: 1, actionName: 'Apply Kubernetes NetworkPolicy Denial', serviceAffected: 'Kube-System Calico CNI', description: 'Drop all inbound packets to port 8080 from outside the cluster VPC.', status: 'pending' },
      { order: 2, actionName: 'Rotate Application Secret Variables', serviceAffected: 'HashiCorp Vault / AWS Secrets Manager', description: 'Trigger automatic rotation of database credentials and JWT signing keys.', status: 'pending' },
      { order: 3, actionName: 'Deploy Hardened Container Image Build', serviceAffected: 'GitOps ArgoCD Pipeline', description: 'Promote hotfix commit with management.endpoints.web.exposure.exclude=*', status: 'pending' },
    ],
  },
];

export function calculateAverageCompliance(frameworks: ComplianceFramework[]): number {
  if (frameworks.length === 0) return 0;
  const sum = frameworks.reduce((acc, f) => acc + f.complianceScore, 0);
  return Math.round((sum / frameworks.length) * 10) / 10;
}
