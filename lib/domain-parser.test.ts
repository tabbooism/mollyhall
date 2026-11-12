import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseDomainInput,
  calculateDomainRiskScore,
  DEFAULT_RUNEHALL_DOMAINS,
} from './domain-parser';

test('parseDomainInput cleans protocol and trailing slashes correctly', () => {
  const result = parseDomainInput('https://api.runehall.com/');
  assert.equal(result.isValid, true);
  assert.equal(result.normalized, 'api.runehall.com');
  assert.equal(result.subdomain, 'api');
  assert.equal(result.rootDomain, 'runehall.com');
  assert.equal(result.isWildcard, false);
});

test('parseDomainInput handles wildcard domains correctly', () => {
  const result = parseDomainInput('*.runehall.com');
  assert.equal(result.isValid, true);
  assert.equal(result.isWildcard, true);
  assert.equal(result.normalized, '*.runehall.com');
  assert.equal(result.rootDomain, 'runehall.com');
});

test('parseDomainInput flags invalid domain inputs', () => {
  const result = parseDomainInput('not-a-valid-domain');
  assert.equal(result.isValid, false);
});

test('calculateDomainRiskScore assigns higher risk to high-risk open ports and bad TLS', () => {
  const safeProfile = calculateDomainRiskScore({
    openPorts: [443],
    tlsGrade: 'A+',
    dnssec: true,
    spfValid: true,
    dmarcPolicy: 'reject',
    anomalyScore: 5,
  });
  assert.equal(safeProfile.level, 'Low');
  assert.ok(safeProfile.score < 25);

  const riskyProfile = calculateDomainRiskScore({
    openPorts: [80, 8080, 3389, 445], // RDP + SMB
    tlsGrade: 'F',
    dnssec: false,
    spfValid: false,
    dmarcPolicy: 'missing',
    anomalyScore: 85,
  });
  assert.equal(riskyProfile.level, 'Critical');
  assert.ok(riskyProfile.score >= 75);
});

test('DEFAULT_RUNEHALL_DOMAINS contains monitored runehall.com assets', () => {
  assert.ok(DEFAULT_RUNEHALL_DOMAINS.length >= 6);
  const root = DEFAULT_RUNEHALL_DOMAINS.find((d) => d.domain === 'runehall.com');
  assert.ok(root !== undefined);
  assert.equal(root.rootDomain, 'runehall.com');

  const devSubdomain = DEFAULT_RUNEHALL_DOMAINS.find((d) => d.domain === 'dev.runehall.com');
  assert.ok(devSubdomain !== undefined);
  assert.equal(devSubdomain.potentialExfiltrationDetected, true);
});
