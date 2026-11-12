import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MITRE_ENTERPRISE_TACTICS,
  computeMitreCoverage,
} from './mitre-matrix';

test('MITRE_ENTERPRISE_TACTICS contains core enterprise tactics', () => {
  const tacticCodes = MITRE_ENTERPRISE_TACTICS.map((t) => t.code);
  assert.ok(tacticCodes.includes('RECON'));
  assert.ok(tacticCodes.includes('INIT_ACC'));
  assert.ok(tacticCodes.includes('EXFIL'));
  assert.ok(tacticCodes.includes('DEF_EVAS'));
});

test('computeMitreCoverage calculates coverage stats properly', () => {
  const coverage = computeMitreCoverage(MITRE_ENTERPRISE_TACTICS);
  assert.ok(coverage.totalTechniques > 5);
  assert.ok(coverage.testedCount > 0);
  assert.ok(coverage.flaggedCount > 0);
  assert.ok(coverage.coveragePercentage >= 80 && coverage.coveragePercentage <= 100);
});

test('Techniques have proper mitigations and detection rules', () => {
  for (const tactic of MITRE_ENTERPRISE_TACTICS) {
    for (const tech of tactic.techniques) {
      assert.ok(tech.detectionRule.length > 10);
      assert.ok(tech.mitigation.length > 10);
      assert.ok(['tested_secure', 'flagged_risk', 'remediated', 'untested'].includes(tech.status));
    }
  }
});
