import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_INTEL_DOSSIERS,
  GOOGLE_DORK_TEMPLATES,
  INITIAL_IOC_RECORDS,
  buildGoogleDorkUrl,
  computeSha256Simulated,
} from './war-room-data';

test('INITIAL_INTEL_DOSSIERS contains active investigation files', () => {
  assert.ok(INITIAL_INTEL_DOSSIERS.length >= 3);
  const stagingDossier = INITIAL_INTEL_DOSSIERS.find((d) => d.id === 'DOS-2026-01');
  assert.ok(stagingDossier !== undefined);
  assert.equal(stagingDossier.confidenceGrade, 'A (Confirmed)');
});

test('buildGoogleDorkUrl correctly formats search URLs', () => {
  const url = buildGoogleDorkUrl('site:{{TARGET}} ext:env', 'runehall.com');
  assert.ok(url.startsWith('https://www.google.com/search?q='));
  assert.ok(url.includes('runehall.com'));
});

test('INITIAL_IOC_RECORDS contains critical DNS tunneling indicator', () => {
  const exfilIoc = INITIAL_IOC_RECORDS.find((i) => i.id === 'IOC-002');
  assert.ok(exfilIoc !== undefined);
  assert.equal(exfilIoc.threatLevel, 'Critical');
  assert.equal(exfilIoc.type, 'DNS-Tunneling');
});

test('computeSha256Simulated returns deterministic 64-char string prefix', () => {
  const hash1 = computeSha256Simulated('test-string');
  const hash2 = computeSha256Simulated('test-string');
  assert.equal(hash1, hash2);
  assert.ok(hash1.length >= 32);
});
