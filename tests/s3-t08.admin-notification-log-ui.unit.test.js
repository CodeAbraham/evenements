import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAdminNotificationLogViewModel,
  mapLogEntryToAdminRow,
  normalizeChannel,
  normalizeNotificationLogFilters,
  normalizeNotificationStatus
} from "../services/shared/adminNotificationLogUi.js";

// ── normalizeNotificationStatus ───────────────────────────────────────────────

test("normalizeNotificationStatus uppercases and accepts valid statuses", () => {
  assert.equal(normalizeNotificationStatus("sent"),             "SENT");
  assert.equal(normalizeNotificationStatus("SENT"),             "SENT");
  assert.equal(normalizeNotificationStatus("FAILED"),           "FAILED");
  assert.equal(normalizeNotificationStatus("FAILED_PERMANENT"), "FAILED_PERMANENT");
  assert.equal(normalizeNotificationStatus("SIMULATED"),        "SIMULATED");
  assert.equal(normalizeNotificationStatus("PENDING"),          "PENDING");
});

test("normalizeNotificationStatus falls back to PENDING for unknown values", () => {
  assert.equal(normalizeNotificationStatus("BOUNCED"),   "PENDING");
  assert.equal(normalizeNotificationStatus(null),        "PENDING");
  assert.equal(normalizeNotificationStatus(undefined),   "PENDING");
  assert.equal(normalizeNotificationStatus(""),          "PENDING");
});

// ── normalizeChannel ──────────────────────────────────────────────────────────

test("normalizeChannel returns EMAIL or SMS for valid inputs", () => {
  assert.equal(normalizeChannel("EMAIL"), "EMAIL");
  assert.equal(normalizeChannel("email"), "EMAIL");
  assert.equal(normalizeChannel("SMS"),   "SMS");
  assert.equal(normalizeChannel("sms"),   "SMS");
});

test("normalizeChannel returns null for unknown channel", () => {
  assert.equal(normalizeChannel("PUSH"),    null);
  assert.equal(normalizeChannel(""),        null);
  assert.equal(normalizeChannel(null),      null);
  assert.equal(normalizeChannel(undefined), null);
});

// ── normalizeNotificationLogFilters ──────────────────────────────────────────

test("normalizeNotificationLogFilters returns valid defaults for empty input", () => {
  const result = normalizeNotificationLogFilters({});
  assert.ok(result.isValid);
  assert.deepEqual(result.errors, []);
  assert.equal(result.data.status,    null);
  assert.equal(result.data.channel,   null);
  assert.equal(result.data.eventId,   null);
  assert.equal(result.data.userId,    null);
  assert.equal(result.data.from,      null);
  assert.equal(result.data.to,        null);
  assert.equal(result.data.page,      1);
  assert.equal(result.data.pageSize,  20);
  assert.equal(result.data.sortBy,    "createdAt");
  assert.equal(result.data.sortDir,   "desc");
});

test("normalizeNotificationLogFilters accepts valid status", () => {
  const result = normalizeNotificationLogFilters({ status: "SENT" });
  assert.ok(result.isValid);
  assert.equal(result.data.status, "SENT");
});

test("normalizeNotificationLogFilters normalises lowercase status", () => {
  const result = normalizeNotificationLogFilters({ status: "failed_permanent" });
  assert.ok(result.isValid);
  assert.equal(result.data.status, "FAILED_PERMANENT");
});

test("normalizeNotificationLogFilters rejects unknown status", () => {
  const result = normalizeNotificationLogFilters({ status: "BOUNCED" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.includes("INVALID_STATUS"));
});

test("normalizeNotificationLogFilters accepts EMAIL and SMS channels", () => {
  assert.equal(normalizeNotificationLogFilters({ channel: "EMAIL" }).data.channel, "EMAIL");
  assert.equal(normalizeNotificationLogFilters({ channel: "sms"   }).data.channel, "SMS");
});

test("normalizeNotificationLogFilters rejects unknown channel", () => {
  const result = normalizeNotificationLogFilters({ channel: "PUSH" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.includes("INVALID_CHANNEL"));
});

test("normalizeNotificationLogFilters passes eventId and userId through", () => {
  const result = normalizeNotificationLogFilters({ eventId: "evt-1", userId: "user-2" });
  assert.ok(result.isValid);
  assert.equal(result.data.eventId, "evt-1");
  assert.equal(result.data.userId,  "user-2");
});

test("normalizeNotificationLogFilters accepts valid ISO date range", () => {
  const result = normalizeNotificationLogFilters({
    from: "2026-01-01T00:00:00Z",
    to:   "2026-12-31T23:59:59Z"
  });
  assert.ok(result.isValid);
  assert.ok(result.data.from);
  assert.ok(result.data.to);
});

test("normalizeNotificationLogFilters rejects invalid from date", () => {
  const result = normalizeNotificationLogFilters({ from: "not-a-date" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.includes("INVALID_FROM_DATE"));
});

test("normalizeNotificationLogFilters rejects to < from", () => {
  const result = normalizeNotificationLogFilters({
    from: "2026-12-01T00:00:00Z",
    to:   "2026-01-01T00:00:00Z"
  });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.includes("INVALID_DATE_RANGE"));
});

test("normalizeNotificationLogFilters accepts valid pageSize values", () => {
  for (const ps of [10, 20, 50, 100]) {
    const result = normalizeNotificationLogFilters({ pageSize: ps });
    assert.equal(result.data.pageSize, ps, `should accept pageSize ${ps}`);
  }
});

test("normalizeNotificationLogFilters defaults invalid pageSize to 20", () => {
  const result = normalizeNotificationLogFilters({ pageSize: 999 });
  assert.equal(result.data.pageSize, 20);
});

test("normalizeNotificationLogFilters accepts sortBy = sentAt", () => {
  const result = normalizeNotificationLogFilters({ sortBy: "sentAt" });
  assert.ok(result.isValid);
  assert.equal(result.data.sortBy, "sentAt");
});

test("normalizeNotificationLogFilters accepts sortDir = asc", () => {
  const result = normalizeNotificationLogFilters({ sortDir: "asc" });
  assert.ok(result.isValid);
  assert.equal(result.data.sortDir, "asc");
});

test("normalizeNotificationLogFilters defaults invalid sortBy to createdAt", () => {
  const result = normalizeNotificationLogFilters({ sortBy: "unknown_field" });
  assert.equal(result.data.sortBy, "createdAt");
});

test("normalizeNotificationLogFilters collects multiple errors", () => {
  const result = normalizeNotificationLogFilters({
    status:  "BOUNCED",
    channel: "PUSH",
    from:    "not-a-date"
  });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.length >= 3);
});

// ── mapLogEntryToAdminRow ─────────────────────────────────────────────────────

const SAMPLE_ENTRY = {
  logId:       "log-001",
  eventId:     "evt-001",
  recipientId: "user-123",
  channel:     "EMAIL",
  templateId:  "CONFIRMATION",
  status:      "SENT",
  attempts:    1,
  errorReason: null,
  sentAt:      "2026-01-01T12:00:00Z",
  createdAt:   "2026-01-01T11:50:00Z"
};

test("mapLogEntryToAdminRow adds statusLabel and statusTone for SENT", () => {
  const row = mapLogEntryToAdminRow(SAMPLE_ENTRY);
  assert.equal(row.status,      "SENT");
  assert.equal(row.statusLabel, "Sent");
  assert.equal(row.statusTone,  "success");
});

test("mapLogEntryToAdminRow adds channelLabel and channelIcon for EMAIL", () => {
  const row = mapLogEntryToAdminRow(SAMPLE_ENTRY);
  assert.equal(row.channel,      "EMAIL");
  assert.equal(row.channelLabel, "Email");
  assert.ok(row.channelIcon);
});

test("mapLogEntryToAdminRow adds channelLabel and channelIcon for SMS", () => {
  const row = mapLogEntryToAdminRow({ ...SAMPLE_ENTRY, channel: "SMS", status: "SIMULATED" });
  assert.equal(row.channel,      "SMS");
  assert.equal(row.channelLabel, "SMS");
  assert.ok(row.channelIcon);
});

test("mapLogEntryToAdminRow sets canReplay true only for FAILED_PERMANENT", () => {
  assert.equal(mapLogEntryToAdminRow({ ...SAMPLE_ENTRY, status: "FAILED_PERMANENT" }).canReplay, true);
  assert.equal(mapLogEntryToAdminRow({ ...SAMPLE_ENTRY, status: "FAILED"           }).canReplay, false);
  assert.equal(mapLogEntryToAdminRow({ ...SAMPLE_ENTRY, status: "SENT"             }).canReplay, false);
  assert.equal(mapLogEntryToAdminRow({ ...SAMPLE_ENTRY, status: "SIMULATED"        }).canReplay, false);
});

test("mapLogEntryToAdminRow statusTone matches status severity", () => {
  assert.equal(mapLogEntryToAdminRow({ ...SAMPLE_ENTRY, status: "FAILED_PERMANENT" }).statusTone, "danger");
  assert.equal(mapLogEntryToAdminRow({ ...SAMPLE_ENTRY, status: "FAILED"           }).statusTone, "warning");
  assert.equal(mapLogEntryToAdminRow({ ...SAMPLE_ENTRY, status: "SIMULATED"        }).statusTone, "info");
  assert.equal(mapLogEntryToAdminRow({ ...SAMPLE_ENTRY, status: "PENDING"          }).statusTone, "muted");
});

test("mapLogEntryToAdminRow falls back to null for missing fields", () => {
  const row = mapLogEntryToAdminRow({});
  assert.equal(row.logId,       null);
  assert.equal(row.channel,     null);
  assert.equal(row.channelLabel, null);
  assert.equal(row.recipientId, null);
  assert.equal(row.attempts,    null);
});

// ── buildAdminNotificationLogViewModel ───────────────────────────────────────

const SAMPLE_ITEMS = [
  { logId: "l1", channel: "EMAIL", status: "SENT",             attempts: 1 },
  { logId: "l2", channel: "EMAIL", status: "FAILED_PERMANENT", attempts: 3 },
  { logId: "l3", channel: "SMS",   status: "SIMULATED",        attempts: 1 },
  { logId: "l4", channel: "EMAIL", status: "FAILED",           attempts: 2 },
  { logId: "l5", channel: "EMAIL", status: "PENDING",          attempts: 0 }
];

test("buildAdminNotificationLogViewModel returns rows, pagination, summary, activeFilters", () => {
  const vm = buildAdminNotificationLogViewModel({
    items: SAMPLE_ITEMS, page: 1, pageSize: 20, total: 5
  });
  assert.ok(Array.isArray(vm.rows));
  assert.ok(vm.pagination);
  assert.ok(vm.summary);
  assert.ok(vm.activeFilters);
});

test("buildAdminNotificationLogViewModel summary counts are correct", () => {
  const vm = buildAdminNotificationLogViewModel({
    items: SAMPLE_ITEMS, page: 1, pageSize: 20, total: 5
  });
  assert.equal(vm.summary.sentCount,            1);
  assert.equal(vm.summary.failedCount,          1);
  assert.equal(vm.summary.failedPermanentCount, 1);
  assert.equal(vm.summary.simulatedCount,       1);
  assert.equal(vm.summary.pendingCount,         1);
  assert.equal(vm.summary.replayableCount,      1);
  assert.equal(vm.summary.totalEntries,         5);
});

test("buildAdminNotificationLogViewModel pagination is correct", () => {
  const vm = buildAdminNotificationLogViewModel({
    items: SAMPLE_ITEMS, page: 2, pageSize: 20, total: 45
  });
  assert.equal(vm.pagination.page,       2);
  assert.equal(vm.pagination.pageSize,   20);
  assert.equal(vm.pagination.total,      45);
  assert.equal(vm.pagination.totalPages, 3);
  assert.ok(vm.pagination.hasPrev);
  assert.ok(vm.pagination.hasNext);
});

test("buildAdminNotificationLogViewModel hasPrev = false on first page", () => {
  const vm = buildAdminNotificationLogViewModel({
    items: SAMPLE_ITEMS, page: 1, pageSize: 20, total: 5
  });
  assert.equal(vm.pagination.hasPrev, false);
});

test("buildAdminNotificationLogViewModel hasNext = false on last page", () => {
  const vm = buildAdminNotificationLogViewModel({
    items: SAMPLE_ITEMS, page: 1, pageSize: 20, total: 5
  });
  assert.equal(vm.pagination.hasNext, false);
});

test("buildAdminNotificationLogViewModel isEmpty = true when items empty", () => {
  const vm = buildAdminNotificationLogViewModel({
    items: [], page: 1, pageSize: 20, total: 0
  });
  assert.ok(vm.isEmpty);
  assert.deepEqual(vm.rows, []);
});

test("buildAdminNotificationLogViewModel maps rows via mapLogEntryToAdminRow", () => {
  const vm = buildAdminNotificationLogViewModel({
    items: SAMPLE_ITEMS, page: 1, pageSize: 20, total: 5
  });
  assert.ok(vm.rows[0].statusLabel);
  assert.ok(vm.rows[0].statusTone);
});
