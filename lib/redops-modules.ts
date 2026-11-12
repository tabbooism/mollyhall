// Shared catalog of available modules and Fortress scripts

export interface RedOpsModuleInfo {
  name: string;
  description: string;
}

export interface FortressScriptInfo {
  name: string;
  script: string;
  description: string;
}

export const REDOPS_AVAILABLE_MODULES: RedOpsModuleInfo[] = [
  { name: 'recon_report', description: 'Runs the full recon suite and produces one graded ops assessment (A–F).' },
  { name: 'dns_recon', description: 'Enumerates DNS records (A/AAAA/MX/TXT/NS/CNAME/SOA/CAA) via DNS-over-HTTPS.' },
  { name: 'subdomain_enum', description: 'Finds subdomains from public certificate transparency logs.' },
  { name: 'tls_cert', description: 'Grabs the live TLS certificate: subject, issuer, SANs, validity window.' },
  { name: 'rdap_domain', description: 'RDAP whois: registrar, creation/expiry dates, status, nameservers.' },
  { name: 'email_security', description: 'Checks SPF, DMARC and common DKIM selectors for a domain.' },
  { name: 'http_headers', description: 'Inspects and audits standard HTTP security headers for a web target.' },
  { name: 'http_methods', description: 'Audits allowed HTTP methods (OPTIONS/TRACE) for dangerous verbs.' },
  { name: 'tech_fingerprint', description: 'Infers server tech from headers and HTML markers.' },
  { name: 'cookie_audit', description: 'Checks cookie flags: Secure, HttpOnly, SameSite.' },
  { name: 'dnssec', description: 'Checks DNSSEC validation status for a domain.' },
  { name: 'ip_info', description: 'IP geolocation + ASN (ip-api.com).' },
  { name: 'reverse_dns', description: 'PTR lookup for an IP address via DNS-over-HTTPS.' },
  { name: 'wayback', description: 'Lists archived snapshots of a URL from the Wayback Machine.' },
  { name: 'port_probe', description: 'TCP connect probe on common ports; grabs banners where offered.' },
  { name: 'cf_zones', description: 'Lists Cloudflare zones on the token.' },
  { name: 'cf_dns', description: 'Lists DNS records for a zone. Target = zone name or id.' },
  { name: 'cf_purge', description: 'Purges Cloudflare cache for a zone. Needs config confirm=yes.' },
  { name: 'cf_workers', description: 'Lists workers + account id (integrates your worker fleet).' },
];

export const FORTRESS_OPS_SCRIPTS: FortressScriptInfo[] = [
  { name: 'bonus_abuse_hunt', script: 'bonus_abuse_hunt.py', description: 'Win-stacking, round-amount clustering, velocity spikes.' },
  { name: 'dangling_dns', script: 'dangling_dns.py', description: 'CNAMEs from crt.sh subdomains; flags third-party targets.' },
  { name: 'ct_watch', script: 'ct_watch.py', description: 'Certs issued for your domain in the last 30 days, newest first.' },
  { name: 'entropy_audit', script: 'entropy_audit.py', description: 'Shannon entropy calculator across DNS and data channels.' },
  { name: 'security_txt', script: 'security_txt.py', description: 'Validates RFC 9116 security.txt compliance and contact keys.' },
  { name: 'email_auth_summary', script: 'email_auth_summary.py', description: 'Aggregates SPF, DKIM, and DMARC enforcement ratings.' },
  { name: 'subdomains_crt', script: 'subdomains_crt.py', description: 'Rapid crt.sh certificate transparency log parser.' },
  { name: 'tls_cert_inspect', script: 'tls_cert_inspect.py', description: 'Live TLS handshake parameter inspector and expiration check.' },
  { name: 'ufw_audit', script: 'ufw_audit.py', description: 'Audit local UFW firewall rules against WAN exposures.' },
  { name: 'ssh_audit', script: 'ssh_audit.py', description: 'SSH configuration audit: password auth, root login, cipher keys.' },
];
