// Automated test for Rule 3 (group discount and booking limit).
// Run with:  npm test   (which runs: node --test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateBookingPrice, MAX_SPOTS_PER_BOOKING } from '../src/rules/bookingRules.js';

test('valid: 2 spots (Rs 3000) is allowed with no discount', () => {
  const result = calculateBookingPrice(3000, 2);
  assert.equal(result.ok, true);
  assert.equal(result.discount, 0);
  assert.equal(result.total, 3000);
});

test('boundary: exactly 3 spots gets 15% off', () => {
  const result = calculateBookingPrice(4500, 3);
  assert.equal(result.ok, true);
  assert.equal(result.discount, 675);
  assert.equal(result.total, 3825);
});

test('boundary: exactly 8 spots is the most allowed', () => {
  const result = calculateBookingPrice(12000, MAX_SPOTS_PER_BOOKING);
  assert.equal(MAX_SPOTS_PER_BOOKING, 8);
  assert.equal(result.ok, true);
});

test('invalid: 9 spots is blocked with a message', () => {
  const result = calculateBookingPrice(13500, 9);
  assert.equal(result.ok, false);
  assert.match(result.message, /at most 8 spots/);
});
