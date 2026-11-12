export interface MitreTechnique {
  id: string; // e.g. T1596
  name: string;
  tacticId: string; // e.g. TA0043
  tacticName: string;
  description: string;
  detectionRule: string;
  mitigation: string;
  status: 'tested_secure' | 'flagged_risk' | 'remediated' | 'untested';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  associatedModule: string;
}

export interface MitreTactic {
  id: string; // e.g. TA0043
  code: string;
  name: string;
  description: string;
  techniques: MitreTechnique[];
}

export const MITRE_ENTERPRISE_TACTICS: MitreTactic[] = [
  {
    id: 'TA0043',
    code: 'RECON',
    name: 'Reconnaissance',
    description: 'Gathering credentials, active DNS records, WHOIS data, and attack surface posture.',
    techniques: [
      {
        id: 'T1596',
        name: 'Search Open Technical Databases',
        tacticId: 'TA0043',
        tacticName: 'Reconnaissance',
        description: 'Adversaries query public DNS zones, certificate transparency logs (crt.sh), and RDAP registries.',
        detectionRule: 'Detect repeated DNS-over-HTTPS bursts and abnormal RDAP query rates against runehall.com.',
        mitigation: 'Implement WHOIS privacy, rate-limit edge authoritative nameservers, and monitor CT logs.',
        status: 'tested_secure',
        severity: 'Medium',
        associatedModule: 'recon_report / dns_recon / rdap_domain',
      },
      {
        id: 'T1595',
        name: 'Active Scanning & Port Probing',
        tacticId: 'TA0043',
        tacticName: 'Reconnaissance',
        description: 'SYN/ACK port probing to discover listening services and grab application banners.',
        detectionRule: 'Suricata / Snort alert on rapid TCP connect sequences across ports 80, 443, 8080, 22.',
        mitigation: 'Drop unauthenticated WAN traffic at Cloudflare WAF; enforce strict security group ingress.',
        status: 'flagged_risk',
        severity: 'High',
        associatedModule: 'port_probe / ufw_audit',
      },
      {
        id: 'T1592',
        name: 'Gather Victim Host Information',
        tacticId: 'TA0043',
        tacticName: 'Reconnaissance',
        description: 'Infer server tech stack from HTTP response headers, server tokens, and cookies.',
        detectionRule: 'Audit for Server, X-Powered-By, and framework signature disclosures in responses.',
        mitigation: 'Strip Server headers in reverse proxy; disable debug actuator endpoints.',
        status: 'flagged_risk',
        severity: 'High',
        associatedModule: 'tech_fingerprint / http_headers',
      },
    ],
  },
  {
    id: 'TA0042',
    code: 'RES_DEV',
    name: 'Resource Development',
    description: 'Establishing infrastructure, acquiring domains, staging canaries, and assembling simulation payloads.',
    techniques: [
      {
        id: 'T1587',
        name: 'Develop Simulation Payloads',
        tacticId: 'TA0042',
        tacticName: 'Resource Development',
        description: 'Compile safe, non-destructive audit plugins and simulated canaries for defense validation.',
        detectionRule: 'Continuous hash attestation of active RedOps plugins against master signature ledger.',
        mitigation: 'Require signed cryptographic manifests for all deployed assessment modules.',
        status: 'tested_secure',
        severity: 'Low',
        associatedModule: 'spawift-core / custom-plugins',
      },
      {
        id: 'T1588',
        name: 'Obtain Capabilities & Open Tools',
        tacticId: 'TA0042',
        tacticName: 'Resource Development',
        description: 'Using open threat intelligence feeds and certificate transparency monitors.',
        detectionRule: 'Monitor outbound requests to crt.sh, archive.org, and ip-api.com.',
        mitigation: 'Route threat hunting traffic through egress proxy with audit logging.',
        status: 'tested_secure',
        severity: 'Low',
        associatedModule: 'wayback / ip_info / ct_watch',
      },
    ],
  },
  {
    id: 'TA0001',
    code: 'INIT_ACC',
    name: 'Initial Access',
    description: 'Boundary probing, exploiting public-facing applications, and testing edge authentication barriers.',
    techniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application',
        tacticId: 'TA0001',
        tacticName: 'Initial Access',
        description: 'Targeting misconfigured web servers or exposed administrative microservices.',
        detectionRule: 'Flagged on dev.runehall.com:8080 due to unauthenticated /actuator/env endpoint.',
        mitigation: 'Enforce Zero Trust reverse proxy; deploy Playbook PB-03 host isolation.',
        status: 'flagged_risk',
        severity: 'Critical',
        associatedModule: 'http_extra / vuln-discovery',
      },
      {
        id: 'T1078',
        name: 'Valid Accounts & Cloud Credentials',
        tacticId: 'TA0001',
        tacticName: 'Initial Access',
        description: 'Attempting to use stolen credentials or bypass multi-factor authentication barriers.',
        detectionRule: 'Monitor Cloud IAM for logins lacking hardware token FIDO2 attestation.',
        mitigation: 'Enforce 100% MFA across all cloud access points with zero exemptions.',
        status: 'tested_secure',
        severity: 'High',
        associatedModule: 'cloud-mfa-governor / Playbook PB-02',
      },
    ],
  },
  {
    id: 'TA0002',
    code: 'EXEC',
    name: 'Execution',
    description: 'Running scripts, commands, or unauthorized debug procedures on targeted compute instances.',
    techniques: [
      {
        id: 'T1059',
        name: 'Command and Scripting Interpreter',
        tacticId: 'TA0002',
        tacticName: 'Execution',
        description: 'Execution of Python, Bash, or container shell commands on worker nodes.',
        detectionRule: 'Audit container process trees for spawned interactive /bin/sh or curl commands.',
        mitigation: 'Deploy distroless read-only container root filesystems; strip debug shells.',
        status: 'tested_secure',
        severity: 'Medium',
        associatedModule: 'ufw_audit / ssh_audit',
      },
    ],
  },
  {
    id: 'TA0005',
    code: 'DEF_EVAS',
    name: 'Defense Evasion',
    description: 'Evading perimeter firewalls, modifying security configurations, and bypassing inspection.',
    techniques: [
      {
        id: 'T1562',
        name: 'Impair Defenses & Disable Logs',
        tacticId: 'TA0005',
        tacticName: 'Defense Evasion',
        description: 'Attempts to tamper with SIEM logging streams or disable local UFW firewall rules.',
        detectionRule: 'Alert immediately if audit.sqlite or syslog shipping stream is interrupted.',
        mitigation: 'Immutable write-once logging to centralized cloud bucket; tamper alarms.',
        status: 'tested_secure',
        severity: 'High',
        associatedModule: 'ufw_audit / audit.py',
      },
      {
        id: 'T1036',
        name: 'Masquerading & Fake Domain Variants',
        tacticId: 'TA0005',
        tacticName: 'Defense Evasion',
        description: 'Typosquatting or registering similar TLD variants to deceive users and bypass filters.',
        detectionRule: 'Automated daily monitoring of homoglyph and TLD variations for runehall.com.',
        mitigation: 'Defensive domain block registration and proactive DMARC reject enforcement.',
        status: 'tested_secure',
        severity: 'Medium',
        associatedModule: 'tld_variants / email_security',
      },
    ],
  },
  {
    id: 'TA0006',
    code: 'CRED_ACC',
    name: 'Credential Access',
    description: 'Stealing credentials, harvesting API keys, or dumping secrets from exposed environment variables.',
    techniques: [
      {
        id: 'T1552',
        name: 'Unsecured Credentials in Env Variables',
        tacticId: 'TA0006',
        tacticName: 'Credential Access',
        description: 'Accessing plain-text API secrets, database passwords, or JWT keys in /actuator/env.',
        detectionRule: 'Automated finding VULN-2026-0891 flagged exposed environment variable dump.',
        mitigation: 'Rotate all application secrets via Vault; isolate staging environment from production keys.',
        status: 'flagged_risk',
        severity: 'Critical',
        associatedModule: 'vuln_setkit / Playbook PB-02',
      },
    ],
  },
  {
    id: 'TA0010',
    code: 'EXFIL',
    name: 'Exfiltration',
    description: 'Transmitting sensitive data outside the perimeter via alternative or encrypted channels.',
    techniques: [
      {
        id: 'T1048',
        name: 'Exfiltration Over Alternative Protocol (DNS Tunneling)',
        tacticId: 'TA0010',
        tacticName: 'Exfiltration',
        description: 'Encoding data into DNS TXT queries with high Shannon entropy to bypass HTTP inspection.',
        detectionRule: 'Shannon entropy > 4.8 detected on dev.runehall.com egress DNS stream.',
        mitigation: 'Execute Playbook PB-01: sever egress network interface and sinkhole DNS queries.',
        status: 'remediated',
        severity: 'Critical',
        associatedModule: 'entropy_audit / Playbook PB-01',
      },
      {
        id: 'T1567',
        name: 'Exfiltration Over Web Service / Cloud Storage',
        tacticId: 'TA0010',
        tacticName: 'Exfiltration',
        description: 'Uploading sensitive data bursts to untrusted external S3 or cloud storage buckets.',
        detectionRule: 'Cloudflare Gateway DLP alerted on payload burst exceeding 10MB threshold.',
        mitigation: 'Enforce egress proxy whitelist with strict Cloudflare CASB rules.',
        status: 'tested_secure',
        severity: 'High',
        associatedModule: 'spawift-core / dlp-canary',
      },
    ],
  },
];

export function computeMitreCoverage(tactics: MitreTactic[]): {
  totalTechniques: number;
  testedCount: number;
  flaggedCount: number;
  remediatedCount: number;
  coveragePercentage: number;
} {
  let total = 0;
  let tested = 0;
  let flagged = 0;
  let remediated = 0;

  for (const tactic of tactics) {
    for (const tech of tactic.techniques) {
      total += 1;
      if (tech.status === 'tested_secure') tested += 1;
      if (tech.status === 'flagged_risk') flagged += 1;
      if (tech.status === 'remediated') remediated += 1;
    }
  }

  const covered = tested + flagged + remediated;
  const coveragePercentage = total === 0 ? 0 : Math.round((covered / total) * 100);

  return {
    totalTechniques: total,
    testedCount: tested,
    flaggedCount: flagged,
    remediatedCount: remediated,
    coveragePercentage,
  };
}
