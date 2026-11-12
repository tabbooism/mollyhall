import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_COMPLIANCE_FRAMEWORKS,
  INITIAL_AUDIT_SCHEDULES,
  INITIAL_VULNERABILITY_SETKIT,
  INCIDENT_RESPONSE_PLAYBOOKS,
  calculateAverageCompliance,
} from './compliance-calculator';

test('INITIAL_COMPLIANCE_FRAMEWORKS contains major regulatory standards', () => {
  const ids = INITIAL_COMPLIANCE_FRAMEWORKS.map((f) => f.id);
  assert.ok(ids.includes('gdpr'));
  assert.ok(ids.includes('soc2'));
  assert.ok(ids.includes('iso27001'));
  assert.ok(ids.includes('pci_dss'));
});

test('calculateAverageCompliance accurately calculates mean framework score', () => {
  const avg = calculateAverageCompliance(INITIAL_COMPLIANCE_FRAMEWORKS);
  assert.ok(avg >= 90 && avg <= 100);
});

test('INITIAL_AUDIT_SCHEDULES includes automated recurring audits for runehall.com', () => {
  const runehallAudit = INITIAL_AUDIT_SCHEDULES.find((a) => a.id === 'aud-01');
  assert.ok(runehallAudit !== undefined);
  assert.equal(runehallAudit.cadence, 'Daily');
  assert.equal(runehallAudit.enabled, true);
});

test('INCIDENT_RESPONSE_PLAYBOOKS has exfiltration quarantine and MFA revocation playbooks', () => {
  const exfilPb = INCIDENT_RESPONSE_PLAYBOOKS.find((p) => p.id === 'pb-01');
  assert.ok(exfilPb !== undefined);
  assert.ok(exfilPb.steps.length >= 4);

  const mfaPb = INCIDENT_RESPONSE_PLAYBOOKS.find((p) => p.id === 'pb-02');
  assert.ok(mfaPb !== undefined);
  assert.equal(mfaPb.severity, 'High');
});

test('INITIAL_VULNERABILITY_SETKIT catalogs high-priority findings on targets', () => {
  const findings = INITIAL_VULNERABILITY_SETKIT;
  assert.ok(findings.length >= 3);
  const openFindings = findings.filter((f) => f.status === 'Open' || f.status === 'Remediating');
  assert.ok(openFindings.length >= 2);
});
