import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLogQueryErrorResponse,
  buildLogQueryResponse,
  mapLogEntryToResponse,
  parseNotificationLogQuery
} from "../services/shared/notificationLogEndpoint.js";

// ── parseNotificationLogQuery — defaults ──────────────────────────────────────

test("parseNotificationLogQuery accepts empty query with defaults", () => {
  const result = parseNotificationLogQuery({});
  assert.ok(result.ok);
  assert.equal(result.params.page,     1);
  assert.equal(result.params.pageSize, 20);
  assert.equal(result.params.channel,  null);
  assert.equal(result.params.status,   null);
  assert.equal(result.params.from,     null);
  assert.equal(result.params.to,       null);
  assert.equal(result.params.eventId,  null);
  assert.equal(result.params.userId,   null);
});

// ── page / pageSize ───────────────────────────────────────────────────────────

test("parseNotificationLogQuery accepts valid page and pageSize", () => {
  const result = parseNotificationLogQuery({ page: "2", pageSize: "50" });
  assert.ok(result.ok);
  assert.equal(result.params.page,     2);
  assert.equal(result.params.pageSize, 50);
});

test("parseNotificationLogQuery rejects page = 0", () => {
  const result = parseNotificationLogQuery({ page: "0" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("page")));
});

test("parseNotificationLogQuery rejects page = -1", () => {
  const result = parseNotificationLogQuery({ page: "-1" });
  assert.equal(result.ok, false);
});

test("parseNotificationLogQuery rejects pageSize > 100", () => {
  const result = parseNotificationLogQuery({ pageSize: "101" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("pageSize")));
});

test("parseNotificationLogQuery rejects pageSize = 0", () => {
  const result = parseNotificationLogQuery({ pageSize: "0" });
  assert.equal(result.ok, false);
});

test("parseNotificationLogQuery accepts pageSize = 100 (boundary)", () => {
  const result = parseNotificationLogQuery({ pageSize: "100" });
  assert.ok(result.ok);
  assert.equal(result.params.pageSize, 100);
});

// ── channel ───────────────────────────────────────────────────────────────────

test("parseNotificationLogQuery accepts EMAIL channel", () => {
  const result = parseNotificationLogQuery({ channel: "EMAIL" });
  assert.ok(result.ok);
  assert.equal(result.params.channel, "EMAIL");
});

test("parseNotificationLogQuery accepts SMS channel", () => {
  const result = parseNotificationLogQuery({ channel: "SMS" });
  assert.ok(result.ok);
  assert.equal(result.params.channel, "SMS");
});

test("parseNotificationLogQuery normalises channel to uppercase", () => {
  const result = parseNotificationLogQuery({ channel: "email" });
  assert.ok(result.ok);
  assert.equal(result.params.channel, "EMAIL");
});

test("parseNotificationLogQuery rejects unknown channel", () => {
  const result = parseNotificationLogQuery({ channel: "PUSH" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("channel")));
});

// ── status ────────────────────────────────────────────────────────────────────

test("parseNotificationLogQuery accepts all valid statuses", () => {
  for (const s of ["PENDING", "SENT", "FAILED", "FAILED_PERMANENT", "SIMULATED"]) {
    const result = parseNotificationLogQuery({ status: s });
    assert.ok(result.ok, `should accept status ${s}`);
    assert.equal(result.params.status, s);
  }
});

test("parseNotificationLogQuery rejects unknown status", () => {
  const result = parseNotificationLogQuery({ status: "BOUNCED" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("status")));
});

// ── from / to ─────────────────────────────────────────────────────────────────

test("parseNotificationLogQuery accepts valid ISO dates for from and to", () => {
  const result = parseNotificationLogQuery({
    from: "2026-01-01T00:00:00Z",
    to:   "2026-12-31T23:59:59Z"
  });
  assert.ok(result.ok);
  assert.ok(result.params.from);
  assert.ok(result.params.to);
});

test("parseNotificationLogQuery rejects malformed from", () => {
  const result = parseNotificationLogQuery({ from: "not-a-date" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("from")));
});

test("parseNotificationLogQuery rejects malformed to", () => {
  const result = parseNotificationLogQuery({ to: "not-a-date" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("to")));
});

test("parseNotificationLogQuery rejects to < from", () => {
  const result = parseNotificationLogQuery({
    from: "2026-12-01T00:00:00Z",
    to:   "2026-01-01T00:00:00Z"
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("to") && e.includes("from")));
});

test("parseNotificationLogQuery accepts to === from (same instant)", () => {
  const result = parseNotificationLogQuery({
    from: "2026-06-01T00:00:00Z",
    to:   "2026-06-01T00:00:00Z"
  });
  assert.ok(result.ok);
});

// ── eventId / userId ──────────────────────────────────────────────────────────

test("parseNotificationLogQuery passes eventId and userId through", () => {
  const result = parseNotificationLogQuery({ eventId: "evt-123", userId: "user-456" });
  assert.ok(result.ok);
  assert.equal(result.params.eventId, "evt-123");
  assert.equal(result.params.userId,  "user-456");
});

// ── combined filters ──────────────────────────────────────────────────────────

test("parseNotificationLogQuery accepts all filters together", () => {
  const result = parseNotificationLogQuery({
    eventId:  "evt-1",
    userId:   "user-1",
    channel:  "EMAIL",
    status:   "SENT",
    from:     "2026-01-01T00:00:00Z",
    to:       "2026-12-31T23:59:59Z",
    page:     "2",
    pageSize: "10"
  });
  assert.ok(result.ok);
  assert.equal(result.params.channel,  "EMAIL");
  assert.equal(result.params.status,   "SENT");
  assert.equal(result.params.page,     2);
  assert.equal(result.params.pageSize, 10);
});

test("parseNotificationLogQuery collects multiple errors", () => {
  const result = parseNotificationLogQuery({ channel: "PUSH", status: "BOUNCED", page: "0" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.length >= 3);
});

// ── buildLogQueryResponse ─────────────────────────────────────────────────────

test("buildLogQueryResponse returns success shape with data", () => {
  const res = buildLogQueryResponse({ items: [{ logId: "l1" }], page: 1, pageSize: 20, total: 1 });
  assert.ok(res.success);
  assert.equal(res.data.page,     1);
  assert.equal(res.data.pageSize, 20);
  assert.equal(res.data.total,    1);
  assert.equal(res.data.items.length, 1);
});

test("buildLogQueryResponse empty items list", () => {
  const res = buildLogQueryResponse({ items: [], page: 1, pageSize: 20, total: 0 });
  assert.ok(res.success);
  assert.equal(res.data.total, 0);
  assert.deepEqual(res.data.items, []);
});

// ── buildLogQueryErrorResponse ────────────────────────────────────────────────

test("buildLogQueryErrorResponse returns error shape", () => {
  const res = buildLogQueryErrorResponse("Validation failed", "VALIDATION_ERROR", ["page must be positive"]);
  assert.equal(res.success, false);
  assert.equal(res.code,    "VALIDATION_ERROR");
  assert.ok(res.error);
  assert.ok(res.details.includes("page must be positive"));
});

test("buildLogQueryErrorResponse omits details when empty", () => {
  const res = buildLogQueryErrorResponse("Forbidden", "FORBIDDEN");
  assert.equal(res.success, false);
  assert.equal(res.details, undefined);
});

// ── mapLogEntryToResponse ─────────────────────────────────────────────────────

test("mapLogEntryToResponse maps notificationId to logId", () => {
  const entry = { notificationId: "n1", channel: "EMAIL", status: "SENT", attemptNumber: 1, processedAt: "2026-01-01T00:00:00Z", recipientUserId: "u1" };
  const mapped = mapLogEntryToResponse(entry);
  assert.equal(mapped.logId,      "n1");
  assert.equal(mapped.channel,    "EMAIL");
  assert.equal(mapped.status,     "SENT");
  assert.equal(mapped.attempts,   1);
  assert.equal(mapped.sentAt,     "2026-01-01T00:00:00Z");
  assert.equal(mapped.recipientId, "u1");
});

test("mapLogEntryToResponse falls back to null for missing fields", () => {
  const mapped = mapLogEntryToResponse({});
  assert.equal(mapped.logId,      null);
  assert.equal(mapped.channel,    null);
  assert.equal(mapped.status,     null);
  assert.equal(mapped.attempts,   null);
});
