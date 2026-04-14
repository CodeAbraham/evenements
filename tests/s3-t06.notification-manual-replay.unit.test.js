import assert from "node:assert/strict";
import test from "node:test";

import {
  BLOCKED_EVENT_STATUSES,
  BLOCKED_USER_STATUSES,
  buildReplayAuditEntry,
  buildReplayEntry,
  buildReplayErrorResponse,
  buildReplayResponse,
  isEligibleForReplay,
  validateReplayRequest
} from "../services/shared/notificationManualReplay.js";

// ── isEligibleForReplay ───────────────────────────────────────────────────────

test("isEligibleForReplay returns eligible for FAILED_PERMANENT with active context", () => {
  const result = isEligibleForReplay({
    status: "FAILED_PERMANENT",
    eventStatus: "PUBLISHED",
    recipientUserStatus: "ACTIVE"
  });
  assert.ok(result.eligible);
  assert.equal(result.reason, "ok");
});

test("isEligibleForReplay rejects FAILED (not permanent)", () => {
  const result = isEligibleForReplay({ status: "FAILED" });
  assert.equal(result.eligible, false);
  assert.equal(result.reason, "only_failed_permanent_can_be_replayed");
});

test("isEligibleForReplay rejects SENT status", () => {
  const result = isEligibleForReplay({ status: "SENT" });
  assert.equal(result.eligible, false);
});

test("isEligibleForReplay rejects PENDING status", () => {
  const result = isEligibleForReplay({ status: "PENDING" });
  assert.equal(result.eligible, false);
});

test("isEligibleForReplay rejects when eventStatus is CANCELLED", () => {
  const result = isEligibleForReplay({
    status: "FAILED_PERMANENT",
    eventStatus: "CANCELLED"
  });
  assert.equal(result.eligible, false);
  assert.equal(result.reason, "event_cancelled_or_deleted");
});

test("isEligibleForReplay rejects when eventStatus is DELETED", () => {
  const result = isEligibleForReplay({
    status: "FAILED_PERMANENT",
    eventStatus: "DELETED"
  });
  assert.equal(result.eligible, false);
  assert.equal(result.reason, "event_cancelled_or_deleted");
});

test("isEligibleForReplay rejects when recipientUserStatus is DISABLED", () => {
  const result = isEligibleForReplay({
    status: "FAILED_PERMANENT",
    recipientUserStatus: "DISABLED"
  });
  assert.equal(result.eligible, false);
  assert.equal(result.reason, "recipient_not_active");
});

test("isEligibleForReplay rejects LOCKED user", () => {
  const result = isEligibleForReplay({
    status: "FAILED_PERMANENT",
    recipientUserStatus: "LOCKED"
  });
  assert.equal(result.eligible, false);
});

test("isEligibleForReplay rejects PENDING user", () => {
  const result = isEligibleForReplay({
    status: "FAILED_PERMANENT",
    recipientUserStatus: "PENDING"
  });
  assert.equal(result.eligible, false);
});

test("isEligibleForReplay allows null eventStatus (no event context)", () => {
  const result = isEligibleForReplay({ status: "FAILED_PERMANENT", eventStatus: null });
  assert.ok(result.eligible);
});

test("isEligibleForReplay allows null recipientUserStatus (unknown)", () => {
  const result = isEligibleForReplay({ status: "FAILED_PERMANENT", recipientUserStatus: null });
  assert.ok(result.eligible);
});

// ── BLOCKED_EVENT_STATUSES / BLOCKED_USER_STATUSES exports ───────────────────

test("BLOCKED_EVENT_STATUSES contains CANCELLED and DELETED", () => {
  assert.ok(BLOCKED_EVENT_STATUSES.has("CANCELLED"));
  assert.ok(BLOCKED_EVENT_STATUSES.has("DELETED"));
});

test("BLOCKED_USER_STATUSES contains DISABLED, LOCKED, PENDING", () => {
  assert.ok(BLOCKED_USER_STATUSES.has("DISABLED"));
  assert.ok(BLOCKED_USER_STATUSES.has("LOCKED"));
  assert.ok(BLOCKED_USER_STATUSES.has("PENDING"));
});

// ── buildReplayEntry ──────────────────────────────────────────────────────────

const BASE_LOG = {
  notificationId:  "orig-001",
  channel:         "EMAIL",
  templateId:      "CONFIRMATION",
  recipientUserId: "user-123",
  eventId:         "evt-456",
  correlationId:   "corr-789",
  variables:       { eventTitle: "Conf 2026" }
};

test("buildReplayEntry creates a new entry with PENDING status and attempts=0", () => {
  const entry = buildReplayEntry({
    originalLog: BASE_LOG,
    adminUserId: "admin-001",
    nowMs: 1700000000000,
    idFactory: () => "new-uuid"
  });
  assert.equal(entry.status,          "PENDING");
  assert.equal(entry.attempts,        0);
  assert.equal(entry.triggeredBy,     "admin");
  assert.equal(entry.adminUserId,     "admin-001");
  assert.equal(entry.nextRetryAt,     null);
  assert.equal(entry.errorReason,     null);
});

test("buildReplayEntry sets parentLogId from original notificationId", () => {
  const entry = buildReplayEntry({
    originalLog: BASE_LOG,
    adminUserId: "admin-001",
    idFactory: () => "new-uuid"
  });
  assert.equal(entry.parentLogId, "orig-001");
});

test("buildReplayEntry falls back to logId if notificationId absent", () => {
  const log = { logId: "log-999", channel: "EMAIL", templateId: "T1", recipientUserId: "u1" };
  const entry = buildReplayEntry({ originalLog: log, adminUserId: "admin-001", idFactory: () => "x" });
  assert.equal(entry.parentLogId, "log-999");
});

test("buildReplayEntry copies channel, templateId, recipientUserId, eventId", () => {
  const entry = buildReplayEntry({
    originalLog: BASE_LOG,
    adminUserId: "admin-001",
    idFactory: () => "x"
  });
  assert.equal(entry.channel,         "EMAIL");
  assert.equal(entry.templateId,      "CONFIRMATION");
  assert.equal(entry.recipientUserId, "user-123");
  assert.equal(entry.eventId,         "evt-456");
  assert.equal(entry.correlationId,   "corr-789");
});

test("buildReplayEntry assigns fresh notificationId from idFactory", () => {
  let callCount = 0;
  const entry = buildReplayEntry({
    originalLog: BASE_LOG,
    adminUserId: "admin-001",
    idFactory: () => `gen-${++callCount}`
  });
  assert.equal(entry.notificationId, "gen-1");
});

test("buildReplayEntry sets createdAt and updatedAt from nowMs", () => {
  const nowMs = 1700000000000;
  const entry = buildReplayEntry({
    originalLog: BASE_LOG,
    adminUserId: "admin-001",
    nowMs,
    idFactory: () => "x"
  });
  const expected = new Date(nowMs).toISOString();
  assert.equal(entry.createdAt, expected);
  assert.equal(entry.updatedAt, expected);
});

test("buildReplayEntry copies variables from original log", () => {
  const entry = buildReplayEntry({
    originalLog: BASE_LOG,
    adminUserId: "admin-001",
    idFactory: () => "x"
  });
  assert.deepEqual(entry.variables, { eventTitle: "Conf 2026" });
});

test("buildReplayEntry defaults variables to null when absent", () => {
  const log = { notificationId: "n1", channel: "SMS", templateId: "T1", recipientUserId: "u1" };
  const entry = buildReplayEntry({ originalLog: log, adminUserId: "a1", idFactory: () => "x" });
  assert.equal(entry.variables, null);
});

// ── buildReplayAuditEntry ─────────────────────────────────────────────────────

test("buildReplayAuditEntry returns correct action and actor fields", () => {
  const audit = buildReplayAuditEntry({
    adminUserId:     "admin-001",
    originalLogId:   "orig-001",
    newLogId:        "new-uuid",
    channel:         "EMAIL",
    templateId:      "CONFIRMATION",
    recipientUserId: "user-123",
    nowMs:           1700000000000
  });
  assert.equal(audit.action,    "NOTIFICATION_MANUALLY_REPLAYED");
  assert.equal(audit.actorId,   "admin-001");
  assert.equal(audit.actorRole, "ADMIN");
  assert.equal(audit.targetType, "NOTIFICATION");
  assert.equal(audit.targetId,  "orig-001");
  assert.equal(audit.result,    "SUCCESS");
});

test("buildReplayAuditEntry metadata contains newLogId, channel, templateId, recipientUserId", () => {
  const audit = buildReplayAuditEntry({
    adminUserId:     "admin-001",
    originalLogId:   "orig-001",
    newLogId:        "new-uuid",
    channel:         "EMAIL",
    templateId:      "CONF",
    recipientUserId: "u1",
    nowMs:           1700000000000
  });
  assert.equal(audit.metadata.newLogId,        "new-uuid");
  assert.equal(audit.metadata.channel,         "EMAIL");
  assert.equal(audit.metadata.templateId,      "CONF");
  assert.equal(audit.metadata.recipientUserId, "u1");
});

test("buildReplayAuditEntry occurredAt is ISO string from nowMs", () => {
  const nowMs = 1700000000000;
  const audit = buildReplayAuditEntry({
    adminUserId: "a1", originalLogId: "o1", newLogId: "n1",
    channel: "EMAIL", templateId: "T1", recipientUserId: "u1", nowMs
  });
  assert.equal(audit.occurredAt, new Date(nowMs).toISOString());
});

// ── validateReplayRequest ─────────────────────────────────────────────────────

test("validateReplayRequest accepts valid adminUserId and logId", () => {
  const result = validateReplayRequest({ adminUserId: "admin-001", logId: "log-123" });
  assert.ok(result.ok);
});

test("validateReplayRequest rejects missing adminUserId", () => {
  const result = validateReplayRequest({ logId: "log-123" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("adminUserId")));
});

test("validateReplayRequest rejects missing logId", () => {
  const result = validateReplayRequest({ adminUserId: "admin-001" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("logId")));
});

test("validateReplayRequest rejects empty string adminUserId", () => {
  const result = validateReplayRequest({ adminUserId: "  ", logId: "log-123" });
  assert.equal(result.ok, false);
});

test("validateReplayRequest rejects empty body", () => {
  const result = validateReplayRequest({});
  assert.equal(result.ok, false);
  assert.ok(result.errors.length >= 2);
});

// ── buildReplayResponse / buildReplayErrorResponse ────────────────────────────

test("buildReplayResponse returns success shape", () => {
  const res = buildReplayResponse({ newLogId: "new-001", originalLogId: "orig-001" });
  assert.ok(res.success);
  assert.equal(res.data.newLogId,      "new-001");
  assert.equal(res.data.originalLogId, "orig-001");
  assert.equal(res.data.status,        "PENDING");
  assert.ok(res.data.message);
});

test("buildReplayErrorResponse returns error shape with code", () => {
  const res = buildReplayErrorResponse("Not eligible", "NOT_ELIGIBLE", ["event is cancelled"]);
  assert.equal(res.success, false);
  assert.equal(res.code,    "NOT_ELIGIBLE");
  assert.ok(res.error);
  assert.ok(res.details.includes("event is cancelled"));
});

test("buildReplayErrorResponse omits details when absent", () => {
  const res = buildReplayErrorResponse("Forbidden", "FORBIDDEN");
  assert.equal(res.success, false);
  assert.equal(res.details, undefined);
});
