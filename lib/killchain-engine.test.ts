import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_KILLCHAIN_PHASES,
  computeKillchainProgress,
  PRECONFIGURED_MODULES,
} from './killchain-engine';

test('INITIAL_KILLCHAIN_PHASES defines all critical attack/defense stages', () => {
  const phaseIds = INITIAL_KILLCHAIN_PHASES.map((p) => p.id);
  assert.ok(phaseIds.includes('recon'));
  assert.ok(phaseIds.includes('weaponization'));
  assert.ok(phaseIds.includes('delivery'));
  assert.ok(phaseIds.includes('exploitation'));
  assert.ok(phaseIds.includes('c2_exfil'));
  assert.ok(phaseIds.includes('remediation'));
});

test('computeKillchainProgress correctly calculates percentages and flagged steps', () => {
  const progress = computeKillchainProgress(INITIAL_KILLCHAIN_PHASES);
  assert.ok(progress.totalSteps > 0);
  assert.ok(progress.completedSteps > 0);
  assert.ok(progress.percentage >= 0 && progress.percentage <= 100);
  assert.ok(progress.flaggedSteps >= 2);
});

test('PRECONFIGURED_MODULES contains Spa Wift killchain and Runehall exfiltration sentinel', () => {
  const spawift = PRECONFIGURED_MODULES.find((m) => m.id === 'mod-spawift-core');
  assert.ok(spawift !== undefined);
  assert.equal(spawift.isEnabled, true);

  const runehallSentinel = PRECONFIGURED_MODULES.find((m) => m.id === 'mod-runehall-anomaly');
  assert.ok(runehallSentinel !== undefined);
  assert.equal(runehallSentinel.category, 'Data Exfiltration');

  const mfaGovernor = PRECONFIGURED_MODULES.find((m) => m.id === 'mod-cloud-mfa-governor');
  assert.ok(mfaGovernor !== undefined);
  assert.equal(mfaGovernor.category, 'Cloud IAM');
});
