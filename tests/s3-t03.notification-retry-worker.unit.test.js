import assert from "node:assert/strict";
import test from "node:test";

import {
  BACKOFF_MS,
  buildDeduplicationKey,
  buildRetryPatch,
  buildSuccessPatch,
  isAlreadySent,
  MAX_ATTEMPTS,
  NON_RECOVERABLE_CODES,
  nextRetryAt,
  shouldRetry
} from "../services/shared/notificationRetryWorker.js";

const NOW_MS = 1700000000000; // fixed epoch for deterministic tests

// ── Constants ────────────────────────────────────────────────────────────────

test("MAX_ATTEMPTS is 3", () => {
  assert.equal(MAX_ATTEMPTS, 3);
});

test("BACKOFF_MS has 3 entries: 30s, 5min, 30min", () => {
  assert.equal(BACKOFF_MS.length, 3);
  assert.equal(BACKOFF_MS[0], 30 * 1000);
  assert.equal(BACKOFF_MS[1], 5 * 60 * 1000);
  assert.equal(BACKOFF_MS[2], 30 * 60 * 1000);
});

test("NON_RECOVERABLE_CODES includes UNKNOWN_TEMPLATE, MISSING_VARIABLES, INVALID_RECIPIENT", () => {
  assert.ok(NON_RECOVERABLE_CODES.has("UNKNOWN_TEMPLATE"));
  assert.ok(NON_RECOVERABLE_CODES.has("MISSING_VARIABLES"));
  assert.ok(NON_RECOVERABLE_CODES.has("INVALID_RECIPIENT"));
});

// ── shouldRetry ──────────────────────────────────────────────────────────────

test("shouldRetry returns true for transient error with attempts < MAX", () => {
  const { shouldRetry: retry, reason } = shouldRetry({ attempts: 1, errorCode: null });
  assert.ok(retry);
  assert.equal(reason, "transient_error");
});

test("shouldRetry returns false when attempts >= MAX_ATTEMPTS", () => {
  const { shouldRetry: retry, reason } = shouldRetry({ attempts: 3, errorCode: null });
  assert.equal(retry, false);
  assert.equal(reason, "max_attempts_reached");
});

test("shouldRetry returns false for UNKNOWN_TEMPLATE regardless of attempts", () => {
  const { shouldRetry: retry, reason } = shouldRetry({ attempts: 0, errorCode: "UNKNOWN_TEMPLATE" });
  assert.equal(retry, false);
  assert.equal(reason, "non_recoverable_error");
});

test("shouldRetry returns false for MISSING_VARIABLES", () => {
  const { shouldRetry: retry } = shouldRetry({ attempts: 0, errorCode: "MISSING_VARIABLES" });
  assert.equal(retry, false);
});

test("shouldRetry returns false for INVALID_RECIPIENT", () => {
  const { shouldRetry: retry } = shouldRetry({ attempts: 0, errorCode: "INVALID_RECIPIENT" });
  assert.equal(retry, false);
});

test("shouldRetry returns true for unknown error code with attempts < MAX", () => {
  const { shouldRetry: retry } = shouldRetry({ attempts: 2, errorCode: "SMTP_TIMEOUT" });
  assert.ok(retry);
});

// ── nextRetryAt ──────────────────────────────────────────────────────────────

test("nextRetryAt for attempt 1 adds 30s", () => {
  const result = nextRetryAt({ attempts: 1, nowMs: NOW_MS });
  const expected = new Date(NOW_MS + BACKOFF_MS[0]).toISOString();
  assert.equal(result, expected);
});

test("nextRetryAt for attempt 2 adds 5min", () => {
  const result = nextRetryAt({ attempts: 2, nowMs: NOW_MS });
  const expected = new Date(NOW_MS + BACKOFF_MS[1]).toISOString();
  assert.equal(result, expected);
});

test("nextRetryAt for attempt 3 adds 30min", () => {
  const result = nextRetryAt({ attempts: 3, nowMs: NOW_MS });
  const expected = new Date(NOW_MS + BACKOFF_MS[2]).toISOString();
  assert.equal(result, expected);
});

test("nextRetryAt clamps to last backoff for attempts > 3", () => {
  const r3 = nextRetryAt({ attempts: 3, nowMs: NOW_MS });
  const r9 = nextRetryAt({ attempts: 9, nowMs: NOW_MS });
  assert.equal(r3, r9);
});

// ── buildRetryPatch ──────────────────────────────────────────────────────────

test("buildRetryPatch after 0 prior attempts → FAILED with nextRetryAt in 30s", () => {
  const patch = buildRetryPatch({ attempts: 0, errorCode: null, errorReason: "SMTP error", nowMs: NOW_MS });
  assert.equal(patch.status, "FAILED");
  assert.equal(patch.attempts, 1);
  assert.ok(patch.nextRetryAt);
  assert.equal(patch.errorReason, "SMTP error");
  const expectedNext = new Date(NOW_MS + BACKOFF_MS[0]).toISOString();
  assert.equal(patch.nextRetryAt, expectedNext);
});

test("buildRetryPatch after 2 prior attempts → FAILED with 30min backoff", () => {
  const patch = buildRetryPatch({ attempts: 2, errorCode: null, errorReason: "timeout", nowMs: NOW_MS });
  assert.equal(patch.status, "FAILED");
  assert.equal(patch.attempts, 3);
  const expectedNext = new Date(NOW_MS + BACKOFF_MS[2]).toISOString();
  assert.equal(patch.nextRetryAt, expectedNext);
});

test("buildRetryPatch after 3 prior attempts → FAILED_PERMANENT", () => {
  const patch = buildRetryPatch({ attempts: 3, errorCode: null, errorReason: "timeout", nowMs: NOW_MS });
  assert.equal(patch.status, "FAILED_PERMANENT");
  assert.equal(patch.attempts, 4);
  assert.equal(patch.nextRetryAt, null);
});

test("buildRetryPatch with non-recoverable error → FAILED_PERMANENT immediately", () => {
  const patch = buildRetryPatch({ attempts: 0, errorCode: "UNKNOWN_TEMPLATE", errorReason: "bad id", nowMs: NOW_MS });
  assert.equal(patch.status, "FAILED_PERMANENT");
  assert.equal(patch.nextRetryAt, null);
});

test("buildRetryPatch errorReason defaults to null when not provided", () => {
  const patch = buildRetryPatch({ attempts: 0, nowMs: NOW_MS });
  assert.equal(patch.errorReason, null);
});

// ── buildSuccessPatch ────────────────────────────────────────────────────────

test("buildSuccessPatch returns SENT with sentAt and null nextRetryAt", () => {
  const patch = buildSuccessPatch({ nowMs: NOW_MS });
  assert.equal(patch.status, "SENT");
  assert.equal(patch.sentAt, new Date(NOW_MS).toISOString());
  assert.equal(patch.nextRetryAt, null);
  assert.equal(patch.errorReason, null);
  assert.ok(patch.updatedAt);
});

test("buildSuccessPatch sentAt equals updatedAt", () => {
  const patch = buildSuccessPatch({ nowMs: NOW_MS });
  assert.equal(patch.sentAt, patch.updatedAt);
});

// ── buildDeduplicationKey ─────────────────────────────────────────────────────

test("buildDeduplicationKey produces deterministic pipe-delimited string", () => {
  const key = buildDeduplicationKey({
    correlationId: "corr-1",
    templateId:    "EMAIL_REGISTRATION_CONFIRMED",
    recipientId:   "user-abc",
    channel:       "EMAIL"
  });
  assert.equal(key, "corr-1|EMAIL_REGISTRATION_CONFIRMED|user-abc|EMAIL");
});

test("buildDeduplicationKey differs for different channels", () => {
  const email = buildDeduplicationKey({ correlationId: "c", templateId: "t", recipientId: "u", channel: "EMAIL" });
  const sms   = buildDeduplicationKey({ correlationId: "c", templateId: "t", recipientId: "u", channel: "SMS" });
  assert.notEqual(email, sms);
});

// ── isAlreadySent ─────────────────────────────────────────────────────────────

test("isAlreadySent returns true when statuses include SENT", () => {
  assert.ok(isAlreadySent(["FAILED", "SENT"]));
});

test("isAlreadySent returns true when statuses include SIMULATED", () => {
  assert.ok(isAlreadySent(["SIMULATED"]));
});

test("isAlreadySent returns false for only FAILED statuses", () => {
  assert.equal(isAlreadySent(["FAILED", "FAILED_PERMANENT"]), false);
});

test("isAlreadySent returns false for empty array", () => {
  assert.equal(isAlreadySent([]), false);
});
