import assert from 'node:assert/strict';
import { test } from 'node:test';
import { estimateCommission, formatLira, monthlyCommission, toAmount, yearlyCommission, yearlySavings } from './commission.js';

const EXAMPLE = Object.freeze({ orders: '300', basket: '400', rate: '20', share: '20' });

test('300 orders × 400 TL × 20% → 24,000 TL a month, 288,000 TL a year', () => {
  assert.equal(monthlyCommission(300, 400, 20), 24000);
  assert.equal(yearlyCommission(24000), 288000);
});

test('moving 20% of the orders saves 57,600 TL a year', () => {
  assert.equal(yearlySavings(288000, 20), 57600);
});

test('estimateCommission turns raw field values into the three results', () => {
  assert.deepEqual(estimateCommission(EXAMPLE), { monthly: 24000, yearly: 288000, savings: 57600 });
});

test('empty, invalid or negative fields give no result', () => {
  for (const bad of ['', '  ', 'abc', '-5']) assert.equal(estimateCommission({ ...EXAMPLE, orders: bad }), null);
  assert.equal(estimateCommission({ ...EXAMPLE, rate: '' }), null);
});

test('rates and shares above 100% are rejected', () => {
  assert.equal(toAmount('101', 100), null);
  assert.equal(toAmount('100', 100), 100);
  assert.equal(estimateCommission({ ...EXAMPLE, share: '150' }), null);
});

test('decimal rates are accepted', () => {
  assert.equal(estimateCommission({ ...EXAMPLE, rate: '17.5' }).monthly, 21000);
});

test('formatLira shows whole lira in Turkish, and "—" without an amount', () => {
  assert.equal(formatLira(57600).replace(/\s/g, ''), '₺57.600');
  assert.equal(formatLira(1234.6).replace(/\s/g, ''), '₺1.235');
  assert.equal(formatLira(null), '—');
});
