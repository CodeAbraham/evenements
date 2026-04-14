import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAuditLogErrorResponse,
  buildAuditLogResponse,
  isAuthDomainAction,
  mapAuditRecordToResponse,
  parseAuditLogQuery
} from "../services/shared/authAuditQuery.js";

// ── parseAuditLogQuery — defaults ─────────────────────────────────────────────

test("parseAuditLogQuery accepts empty query with defaults", () => {
  const result = parseAuditLogQuery({});
  assert.ok(result.ok);
  assert.equal(result.params.page,          1);
  assert.equal(result.params.pageSize,      20);
  assert.equal(result.params.actorId,       null);
  assert.equal(result.params.actorRole,     null);
  assert.equal(result.params.action,        null);
  assert.equal(result.params.result,        null);
  assert.equal(result.params.correlationId, null);
  assert.equal(result.params.from,          null);
  assert.equal(result.params.to,            null);
  assert.equal(result.params.sortBy,        "occurredAt");
  assert.equal(result.params.sortOrder,     "desc");
});

// ── page / pageSize ───────────────────────────────────────────────────────────

test("parseAuditLogQuery accepts valid page and pageSize", () => {
  const result = parseAuditLogQuery({ page: "3", pageSize: "50" });
  assert.ok(result.ok);
  assert.equal(result.params.page,     3);
  assert.equal(result.params.pageSize, 50);
});

test("parseAuditLogQuery rejects page = 0", () => {
  const result = parseAuditLogQuery({ page: "0" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("page")));
});

test("parseAuditLogQuery rejects page = -1", () => {
  const result = parseAuditLogQuery({ page: "-1" });
  assert.equal(result.ok, false);
});

test("parseAuditLogQuery rejects pageSize > 100", () => {
  const result = parseAuditLogQuery({ pageSize: "101" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("pageSize")));
});

test("parseAuditLogQuery accepts pageSize = 100 (boundary)", () => {
  const result = parseAuditLogQuery({ pageSize: "100" });
  assert.ok(result.ok);
  assert.equal(result.params.pageSize, 100);
});

// ── actorRole ─────────────────────────────────────────────────────────────────

test("parseAuditLogQuery accepts all valid actorRoles", () => {
  for (const role of ["PARTICIPANT", "ORGANIZER", "ADMIN", "SYSTEM"]) {
    const result = parseAuditLogQuery({ actorRole: role });
    assert.ok(result.ok, `should accept role ${role}`);
    assert.equal(result.params.actorRole, role);
  }
});

test("parseAuditLogQuery normalises actorRole to uppercase", () => {
  const result = parseAuditLogQuery({ actorRole: "admin" });
  assert.ok(result.ok);
  assert.equal(result.params.actorRole, "ADMIN");
});

test("parseAuditLogQuery rejects unknown actorRole", () => {
  const result = parseAuditLogQuery({ actorRole: "SUPERUSER" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("actorRole")));
});

// ── result ────────────────────────────────────────────────────────────────────

test("parseAuditLogQuery accepts valid result values", () => {
  for (const r of ["SUCCESS", "FAILURE", "DENIED"]) {
    const result = parseAuditLogQuery({ result: r });
    assert.ok(result.ok, `should accept result ${r}`);
    assert.equal(result.params.result, r);
  }
});

test("parseAuditLogQuery normalises result to uppercase", () => {
  const result = parseAuditLogQuery({ result: "success" });
  assert.ok(result.ok);
  assert.equal(result.params.result, "SUCCESS");
});

test("parseAuditLogQuery rejects unknown result", () => {
  const result = parseAuditLogQuery({ result: "SKIPPED" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("result")));
});

// ── from / to ─────────────────────────────────────────────────────────────────

test("parseAuditLogQuery accepts valid ISO dates for from and to", () => {
  const result = parseAuditLogQuery({
    from: "2026-01-01T00:00:00Z",
    to:   "2026-12-31T23:59:59Z"
  });
  assert.ok(result.ok);
  assert.ok(result.params.from);
  assert.ok(result.params.to);
});

test("parseAuditLogQuery rejects malformed from", () => {
  const result = parseAuditLogQuery({ from: "not-a-date" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("from")));
});

test("parseAuditLogQuery rejects to < from", () => {
  const result = parseAuditLogQuery({
    from: "2026-12-01T00:00:00Z",
    to:   "2026-01-01T00:00:00Z"
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("to")));
});

test("parseAuditLogQuery accepts to === from (same instant)", () => {
  const result = parseAuditLogQuery({
    from: "2026-06-01T00:00:00Z",
    to:   "2026-06-01T00:00:00Z"
  });
  assert.ok(result.ok);
});

// ── sortBy / sortOrder ────────────────────────────────────────────────────────

test("parseAuditLogQuery defaults sortBy to occurredAt and sortOrder to desc", () => {
  const result = parseAuditLogQuery({});
  assert.equal(result.params.sortBy,    "occurredAt");
  assert.equal(result.params.sortOrder, "desc");
});

test("parseAuditLogQuery accepts sortOrder asc", () => {
  const result = parseAuditLogQuery({ sortOrder: "asc" });
  assert.ok(result.ok);
  assert.equal(result.params.sortOrder, "asc");
});

test("parseAuditLogQuery rejects invalid sortBy", () => {
  const result = parseAuditLogQuery({ sortBy: "actorId" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("sortBy")));
});

test("parseAuditLogQuery rejects invalid sortOrder", () => {
  const result = parseAuditLogQuery({ sortOrder: "random" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("sortOrder")));
});

// ── actorId / action / correlationId ─────────────────────────────────────────

test("parseAuditLogQuery passes actorId, action, correlationId through", () => {
  const result = parseAuditLogQuery({
    actorId:       "user-123",
    action:        "USER_LOGIN_SUCCEEDED",
    correlationId: "corr-abc"
  });
  assert.ok(result.ok);
  assert.equal(result.params.actorId,       "user-123");
  assert.equal(result.params.action,        "USER_LOGIN_SUCCEEDED");
  assert.equal(result.params.correlationId, "corr-abc");
});

// ── combined + multi-error ────────────────────────────────────────────────────

test("parseAuditLogQuery accepts all filters together", () => {
  const result = parseAuditLogQuery({
    actorId:       "user-1",
    actorRole:     "ORGANIZER",
    action:        "EVENT_PUBLISHED",
    result:        "SUCCESS",
    correlationId: "c-1",
    from:          "2026-01-01T00:00:00Z",
    to:            "2026-12-31T23:59:59Z",
    page:          "2",
    pageSize:      "10",
    sortBy:        "occurredAt",
    sortOrder:     "asc"
  });
  assert.ok(result.ok);
  assert.equal(result.params.actorRole,  "ORGANIZER");
  assert.equal(result.params.result,     "SUCCESS");
  assert.equal(result.params.page,       2);
  assert.equal(result.params.pageSize,   10);
  assert.equal(result.params.sortOrder,  "asc");
});

test("parseAuditLogQuery collects multiple errors", () => {
  const result = parseAuditLogQuery({
    actorRole: "GHOST",
    result:    "MAYBE",
    page:      "0",
    sortOrder: "sideways"
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.length >= 3);
});

// ── isAuthDomainAction ────────────────────────────────────────────────────────

test("isAuthDomainAction returns true for USER_ prefixed actions", () => {
  assert.ok(isAuthDomainAction("USER_LOGIN_SUCCEEDED"));
  assert.ok(isAuthDomainAction("USER_REGISTERED"));
  assert.ok(isAuthDomainAction("USER_LOGIN_FAILED"));
});

test("isAuthDomainAction returns true for SESSION_ and PASSWORD_ prefixed actions", () => {
  assert.ok(isAuthDomainAction("SESSION_EXPIRED"));
  assert.ok(isAuthDomainAction("PASSWORD_RESET_REQUESTED"));
});

test("isAuthDomainAction returns false for non-auth actions", () => {
  assert.equal(isAuthDomainAction("EVENT_PUBLISHED"),          false);
  assert.equal(isAuthDomainAction("REGISTRATION_CREATED"),     false);
  assert.equal(isAuthDomainAction("NOTIFICATION_SENT"),        false);
});

test("isAuthDomainAction returns false for null/empty input", () => {
  assert.equal(isAuthDomainAction(null),  false);
  assert.equal(isAuthDomainAction(""),    false);
  assert.equal(isAuthDomainAction(undefined), false);
});

// ── mapAuditRecordToResponse ──────────────────────────────────────────────────

test("mapAuditRecordToResponse maps all standard fields", () => {
  const record = {
    auditId:       "a1",
    occurredAt:    "2026-01-01T00:00:00Z",
    sourceService: "identity-access-service",
    actorId:       "user-123",
    actorRole:     "ORGANIZER",
    action:        "USER_LOGIN_SUCCEEDED",
    targetType:    "SESSION",
    targetId:      "sess-456",
    result:        "SUCCESS",
    correlationId: "corr-789",
    reasonCode:    null,
    reasonNote:    null,
    ipAddress:     "192.168.1.1"
  };
  const mapped = mapAuditRecordToResponse(record);
  assert.equal(mapped.auditId,       "a1");
  assert.equal(mapped.sourceService, "identity-access-service");
  assert.equal(mapped.actorId,       "user-123");
  assert.equal(mapped.action,        "USER_LOGIN_SUCCEEDED");
  assert.equal(mapped.result,        "SUCCESS");
  assert.equal(mapped.correlationId, "corr-789");
  assert.equal(mapped.ipAddress,     "192.168.1.1");
});

test("mapAuditRecordToResponse falls back to null for missing fields", () => {
  const mapped = mapAuditRecordToResponse({});
  assert.equal(mapped.auditId,       null);
  assert.equal(mapped.actorId,       null);
  assert.equal(mapped.action,        null);
  assert.equal(mapped.result,        null);
  assert.equal(mapped.correlationId, null);
});

// ── buildAuditLogResponse ─────────────────────────────────────────────────────

test("buildAuditLogResponse returns success shape", () => {
  const res = buildAuditLogResponse({ items: [{ auditId: "a1" }], page: 1, pageSize: 20, total: 1 });
  assert.ok(res.success);
  assert.equal(res.data.page,     1);
  assert.equal(res.data.pageSize, 20);
  assert.equal(res.data.total,    1);
  assert.equal(res.data.items.length, 1);
});

test("buildAuditLogResponse empty items list", () => {
  const res = buildAuditLogResponse({ items: [], page: 1, pageSize: 20, total: 0 });
  assert.ok(res.success);
  assert.deepEqual(res.data.items, []);
  assert.equal(res.data.total, 0);
});

// ── buildAuditLogErrorResponse ────────────────────────────────────────────────

test("buildAuditLogErrorResponse returns error shape with details", () => {
  const res = buildAuditLogErrorResponse("Validation failed", "VALIDATION_ERROR", ["page must be positive"]);
  assert.equal(res.success, false);
  assert.equal(res.code,    "VALIDATION_ERROR");
  assert.ok(res.error);
  assert.ok(res.details.includes("page must be positive"));
});

test("buildAuditLogErrorResponse omits details when empty", () => {
  const res = buildAuditLogErrorResponse("Forbidden", "FORBIDDEN");
  assert.equal(res.success, false);
  assert.equal(res.details, undefined);
});
