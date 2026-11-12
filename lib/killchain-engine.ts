export type KillchainPhaseId =
  | 'recon'
  | 'weaponization'
  | 'delivery'
  | 'exploitation'
  | 'c2_exfil'
  | 'remediation';

export interface KillchainStep {
  id: string;
  phaseId: KillchainPhaseId;
  name: string;
  techniqueId: string; // e.g. T1596, T1190
  description: string;
  status: 'pending' | 'running' | 'completed' | 'blocked' | 'flagged';
  durationMs: number;
  findingsCount: number;
  outputSummary?: string;
}

export interface KillchainPhase {
  id: KillchainPhaseId;
  name: string;
  mitreStage: string;
  description: string;
  steps: KillchainStep[];
}

export interface KillchainSession {
  id: string;
  targetDomain: string;
  environment: 'production' | 'staging' | 'hybrid-cloud' | 'internal-spa-wift';
  status: 'idle' | 'running' | 'paused' | 'completed' | 'aborted';
  currentPhaseIndex: number;
  progressPercent: number;
  startedAt?: string;
  completedAt?: string;
  autonomousMode: boolean;
  totalVulnerabilitiesFound: number;
  exfiltrationSignalsBlocked: number;
  activeModules: string[];
  logs: { timestamp: string; level: 'INFO' | 'WARN' | 'CRIT' | 'PASS'; message: string; phase: KillchainPhaseId }[];
}

export const INITIAL_KILLCHAIN_PHASES: KillchainPhase[] = [
  {
    id: 'recon',
    name: 'Reconnaissance & Asset Discovery',
    mitreStage: 'TA0043 - Reconnaissance',
    description: 'Active/passive DNS enumeration, TLS certificate graph discovery, and attack surface mapping.',
    steps: [
      {
        id: 'step-recon-1',
        phaseId: 'recon',
        name: 'Zone Transfer & Subdomain Enumeration',
        techniqueId: 'T1596.001',
        description: 'Verify DNS AXFR vulnerability and aggregate subdomains from certificate transparency logs.',
        status: 'completed',
        durationMs: 840,
        findingsCount: 7,
        outputSummary: 'Discovered 7 active subdomains for runehall.com. No unauthenticated AXFR leaks.',
      },
      {
        id: 'step-recon-2',
        phaseId: 'recon',
        name: 'TLS Fingerprinting & Cipher Suite Audit',
        techniqueId: 'T1596.005',
        description: 'Analyze cryptographic handshake parameters, deprecated TLS 1.0/1.1 protocols, and certificate chains.',
        status: 'completed',
        durationMs: 620,
        findingsCount: 1,
        outputSummary: 'dev.runehall.com uses TLS 1.2 with intermediate self-signed CA warning.',
      },
      {
        id: 'step-recon-3',
        phaseId: 'recon',
        name: 'Autonomous Port & Service Identification',
        techniqueId: 'T1595.002',
        description: 'Non-destructive SYN/ACK scan across standard web, administration, and database ports.',
        status: 'completed',
        durationMs: 1420,
        findingsCount: 4,
        outputSummary: 'Open services identified: Port 80, 443, 8080 (dev), 8200 (vault).',
      },
    ],
  },
  {
    id: 'weaponization',
    name: 'Module Load & Simulation Staging',
    mitreStage: 'TA0042 - Resource Development',
    description: 'Assemble Spa Wift simulated payloads, load custom assessment plugins, and configure audit parameters.',
    steps: [
      {
        id: 'step-weap-1',
        phaseId: 'weaponization',
        name: 'Spa Wift Native Engine Pre-flight Check',
        techniqueId: 'T1587.001',
        description: 'Verify sandbox isolation, rate limit throttles, and safe-execution guardrails.',
        status: 'completed',
        durationMs: 350,
        findingsCount: 0,
        outputSummary: 'Simulation container initialized. Safe non-destructive testing sandbox locked.',
      },
      {
        id: 'step-weap-2',
        phaseId: 'weaponization',
        name: 'Dynamic Rule & Plugin Injection',
        techniqueId: 'T1588.002',
        description: 'Compile active Lua/TypeScript security assessment plugins and custom heuristic scripts.',
        status: 'completed',
        durationMs: 410,
        findingsCount: 0,
        outputSummary: '8 pre-configured modules and 3 custom enterprise plugins loaded successfully.',
      },
    ],
  },
  {
    id: 'delivery',
    name: 'Boundary Probing & WAF Testing',
    mitreStage: 'TA0001 - Initial Access',
    description: 'Autonomous boundary test verifying zero trust ingress filters and perimeter firewall responsiveness.',
    steps: [
      {
        id: 'step-deliv-1',
        phaseId: 'delivery',
        name: 'Edge WAF Rule Bypassing Resistance',
        techniqueId: 'T1190',
        description: 'Inspect rate limiters, HTTP request smuggling defenses, and header sanitization.',
        status: 'completed',
        durationMs: 1100,
        findingsCount: 0,
        outputSummary: 'Cloudflare WAF blocked simulated obfuscated query strings on production endpoints.',
      },
      {
        id: 'step-deliv-2',
        phaseId: 'delivery',
        name: 'API Gateway Authentication Canary',
        techniqueId: 'T1078.004',
        description: 'Transmit benign canary tokens to test unauthorized token rejection and audit logging.',
        status: 'completed',
        durationMs: 530,
        findingsCount: 1,
        outputSummary: 'api.runehall.com returned 401 Unauthorized as expected. dev.runehall.com allowed unauthenticated debug trace.',
      },
    ],
  },
  {
    id: 'exploitation',
    name: 'Vulnerability Profiling & Misconfig Discovery',
    mitreStage: 'TA0002 - Execution & Privilege Escalation',
    description: 'Evaluate zero-day vulnerability susceptibility, unpatched libraries, and cloud IAM permissions.',
    steps: [
      {
        id: 'step-exploit-1',
        phaseId: 'exploitation',
        name: 'SSRF & Metadata Service Extraction Test',
        techniqueId: 'T1552.005',
        description: 'Test cloud instance metadata (IMDSv2) protection against SSRF vectors.',
        status: 'completed',
        durationMs: 890,
        findingsCount: 0,
        outputSummary: 'IMDSv2 enforced with hop-limit 1. Metadata service safe.',
      },
      {
        id: 'step-exploit-2',
        phaseId: 'exploitation',
        name: 'Staging Endpoint Security Isolation',
        techniqueId: 'T1068',
        description: 'Check if staging infrastructure can reach sensitive production databases or KMS vaults.',
        status: 'flagged',
        durationMs: 1650,
        findingsCount: 2,
        outputSummary: 'FLAGGED: dev.runehall.com (port 8080) contains accessible debug actuator with environment variable dumps.',
      },
    ],
  },
  {
    id: 'c2_exfil',
    name: 'Exfiltration & Anomaly Resistance Check',
    mitreStage: 'TA0010 - Exfiltration',
    description: 'Evaluate DLP controls, DNS tunneling detection, and outbound data staging resistance.',
    steps: [
      {
        id: 'step-exfil-1',
        phaseId: 'c2_exfil',
        name: 'Simulated DNS Tunneling Canary Injection',
        techniqueId: 'T1048.003',
        description: 'Dispatch high-entropy DNS TXT queries to assess internal SOC anomaly alarm triggers.',
        status: 'flagged',
        durationMs: 1980,
        findingsCount: 1,
        outputSummary: 'ANOMALY DETECTED: High-entropy DNS queries on dev.runehall.com triggered threshold alarm #EX-8902.',
      },
      {
        id: 'step-exfil-2',
        phaseId: 'c2_exfil',
        name: 'Encrypted Channel DLP Threshold Analysis',
        techniqueId: 'T1567',
        description: 'Test large outbound multipart payload boundaries against DLP policies.',
        status: 'completed',
        durationMs: 910,
        findingsCount: 0,
        outputSummary: 'Outbound egress proxy successfully throttled and alerted on payload burst exceeding 10MB.',
      },
    ],
  },
  {
    id: 'remediation',
    name: 'Defensive Remediation & Playbook Trigger',
    mitreStage: 'Defensive Feedback & Hardening',
    description: 'Synthesize findings into automated mitigation playbooks and executive compliance summaries.',
    steps: [
      {
        id: 'step-remed-1',
        phaseId: 'remediation',
        name: 'Automated Containment Dispatch',
        techniqueId: 'IR-PLAYBOOK-01',
        description: 'Issue quarantine instructions to isolate vulnerable dev staging endpoint.',
        status: 'running',
        durationMs: 420,
        findingsCount: 1,
        outputSummary: 'Playbook "Quarantine Staging Microservice & Rotate IAM Keys" initiated.',
      },
      {
        id: 'step-remed-2',
        phaseId: 'remediation',
        name: 'Regulatory Compliance Audit Update',
        techniqueId: 'AUDIT-AUTO-SYNC',
        description: 'Sync assessment results to GDPR, SOC 2, and ISO 27001 evidence logs.',
        status: 'pending',
        durationMs: 0,
        findingsCount: 0,
        outputSummary: 'Awaiting playbook confirmation.',
      },
    ],
  },
];

export function computeKillchainProgress(phases: KillchainPhase[]): {
  completedSteps: number;
  totalSteps: number;
  flaggedSteps: number;
  percentage: number;
} {
  let completed = 0;
  let total = 0;
  let flagged = 0;

  for (const phase of phases) {
    for (const step of phase.steps) {
      total += 1;
      if (step.status === 'completed' || step.status === 'flagged') {
        completed += 1;
      }
      if (step.status === 'flagged') {
        flagged += 1;
      }
    }
  }

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completedSteps: completed, totalSteps: total, flaggedSteps: flagged, percentage };
}

export interface SecurityModule {
  id: string;
  name: string;
  category: 'Reconnaissance' | 'Vulnerability Discovery' | 'Killchain' | 'Data Exfiltration' | 'Cloud IAM' | 'Custom';
  description: string;
  version: string;
  author: string;
  isPreconfigured: boolean;
  isEnabled: boolean;
  executionMode: 'autonomous' | 'scheduled' | 'manual';
  supportedTargets: string[];
  parameters: { key: string; label: string; value: string; type: 'text' | 'number' | 'boolean' }[];
}

export const PRECONFIGURED_MODULES: SecurityModule[] = [
  {
    id: 'mod-spawift-core',
    name: 'Spa Wift Automated Killchain Engine',
    category: 'Killchain',
    description: 'Autonomous orchestration of multi-stage simulated intrusions and defense validation.',
    version: '4.2.0-redops',
    author: 'RedOps Core Engineering',
    isPreconfigured: true,
    isEnabled: true,
    executionMode: 'autonomous',
    supportedTargets: ['*.runehall.com', 'Internal VPC', 'Spa Wift Cloud'],
    parameters: [
      { key: 'safe_mode', label: 'Safe Non-Destructive Mode', value: 'true', type: 'boolean' },
      { key: 'max_concurrency', label: 'Concurrent Threat Probes', value: '8', type: 'number' },
      { key: 'c2_simulation_channel', label: 'C2 Canary Protocol', value: 'DNS-TXT', type: 'text' },
    ],
  },
  {
    id: 'mod-runehall-anomaly',
    name: 'Runehall Subdomain Exfiltration Sentinel',
    category: 'Data Exfiltration',
    description: 'Continuously sniffs DNS queries, TLS handshakes, and outbound payload bursts across runehall.com.',
    version: '2.8.4',
    author: 'Threat Intel Labs',
    isPreconfigured: true,
    isEnabled: true,
    executionMode: 'autonomous',
    supportedTargets: ['runehall.com', '*.runehall.com'],
    parameters: [
      { key: 'dns_entropy_threshold', label: 'DNS Entropy Alert Level', value: '4.8', type: 'number' },
      { key: 'alert_on_exfil_staging', label: 'Alert on /tmp & /var Staging', value: 'true', type: 'boolean' },
    ],
  },
  {
    id: 'mod-cloud-mfa-governor',
    name: 'Cloud Environment MFA Enforcement Watcher',
    category: 'Cloud IAM',
    description: 'Monitors multi-factor authentication compliance across AWS, GCP, Azure, and Spa Wift clusters.',
    version: '3.1.2',
    author: 'Identity & Access Group',
    isPreconfigured: true,
    isEnabled: true,
    executionMode: 'scheduled',
    supportedTargets: ['AWS IAM', 'GCP Identity', 'Azure AD', 'Kubernetes API'],
    parameters: [
      { key: 'enforce_hardware_key', label: 'Require FIDO2 / WebAuthn', value: 'true', type: 'boolean' },
      { key: 'grace_period_hours', label: 'MFA Violation Grace Period', value: '0', type: 'number' },
    ],
  },
  {
    id: 'mod-vuln-discovery-setkit',
    name: 'Advanced Set Kit for Vulnerability Discovery',
    category: 'Vulnerability Discovery',
    description: 'Comprehensive scanner discovering zero-day vulnerabilities, misconfigured services, and weak ciphers.',
    version: '5.0.1',
    author: 'RedOps Vulnerability Lab',
    isPreconfigured: true,
    isEnabled: true,
    executionMode: 'autonomous',
    supportedTargets: ['All Ingress Perimeters'],
    parameters: [
      { key: 'cve_database_sync', label: 'Live NVD & CISA KEV Sync', value: 'true', type: 'boolean' },
      { key: 'deep_api_fuzzing', label: 'Include GraphQL / REST Fuzzing', value: 'true', type: 'boolean' },
    ],
  },
];
