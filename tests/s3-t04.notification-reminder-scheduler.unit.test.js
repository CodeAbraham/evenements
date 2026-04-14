import assert from "node:assert/strict";
import test from "node:test";

import {
  buildEventReminderSchedule,
  buildReminderNotificationMessage,
  buildScheduleEntry,
  computeSchedulableReminders,
  isEligibleForReminder,
  REMINDER_WINDOWS_MS,
  shouldCancelReminder
} from "../services/shared/notificationReminderScheduler.js";
import { TEMPLATE_IDS } from "../services/shared/notificationEmailTemplates.js";

// Fixed reference: event starts in exactly 72 hours from NOW_MS
const NOW_MS      = 1700000000000;
const START_AT_MS = NOW_MS + 72 * 60 * 60 * 1000; // +72h

// ── REMINDER_WINDOWS_MS ──────────────────────────────────────────────────────

test("REMINDER_WINDOWS_MS defines R1 (48h) and R2 (24h)", () => {
  assert.equal(REMINDER_WINDOWS_MS.length, 2);
  assert.equal(REMINDER_WINDOWS_MS[0].label, "R1");
  assert.equal(REMINDER_WINDOWS_MS[0].offsetMs, 48 * 60 * 60 * 1000);
  assert.equal(REMINDER_WINDOWS_MS[1].label, "R2");
  assert.equal(REMINDER_WINDOWS_MS[1].offsetMs, 24 * 60 * 60 * 1000);
});

// ── computeSchedulableReminders ──────────────────────────────────────────────

test("computeSchedulableReminders returns both R1 and R2 when event is 72h away", () => {
  const reminders = computeSchedulableReminders({ startAtMs: START_AT_MS, nowMs: NOW_MS });
  assert.equal(reminders.length, 2);
  assert.equal(reminders[0].label, "R1");
  assert.equal(reminders[1].label, "R2");
});

test("computeSchedulableReminders scheduledAtMs for R1 = startAt - 48h", () => {
  const [r1] = computeSchedulableReminders({ startAtMs: START_AT_MS, nowMs: NOW_MS });
  assert.equal(r1.scheduledAtMs, START_AT_MS - 48 * 60 * 60 * 1000);
});

test("computeSchedulableReminders scheduledAtMs for R2 = startAt - 24h", () => {
  const [, r2] = computeSchedulableReminders({ startAtMs: START_AT_MS, nowMs: NOW_MS });
  assert.equal(r2.scheduledAtMs, START_AT_MS - 24 * 60 * 60 * 1000);
});

test("computeSchedulableReminders returns only R2 when event is 36h away", () => {
  const startAt36h = NOW_MS + 36 * 60 * 60 * 1000;
  const reminders = computeSchedulableReminders({ startAtMs: startAt36h, nowMs: NOW_MS });
  assert.equal(reminders.length, 1);
  assert.equal(reminders[0].label, "R2");
});

test("computeSchedulableReminders returns empty when event is < 24h away", () => {
  const startAt20h = NOW_MS + 20 * 60 * 60 * 1000;
  const reminders = computeSchedulableReminders({ startAtMs: startAt20h, nowMs: NOW_MS });
  assert.equal(reminders.length, 0);
});

test("computeSchedulableReminders returns empty when event is in the past", () => {
  const pastMs = NOW_MS - 1000;
  const reminders = computeSchedulableReminders({ startAtMs: pastMs, nowMs: NOW_MS });
  assert.equal(reminders.length, 0);
});

test("computeSchedulableReminders scheduledAt is valid ISO string", () => {
  const [r1] = computeSchedulableReminders({ startAtMs: START_AT_MS, nowMs: NOW_MS });
  assert.ok(!isNaN(Date.parse(r1.scheduledAt)));
});

// ── isEligibleForReminder ─────────────────────────────────────────────────────

test("isEligibleForReminder returns true for CONFIRMED + PUBLISHED", () => {
  assert.ok(isEligibleForReminder({ registrationStatus: "CONFIRMED", eventStatus: "PUBLISHED" }));
});

test("isEligibleForReminder returns true for CONFIRMED + FULL", () => {
  assert.ok(isEligibleForReminder({ registrationStatus: "CONFIRMED", eventStatus: "FULL" }));
});

test("isEligibleForReminder returns false for WAITLISTED participant", () => {
  assert.equal(isEligibleForReminder({ registrationStatus: "WAITLISTED", eventStatus: "PUBLISHED" }), false);
});

test("isEligibleForReminder returns false for CANCELLED event", () => {
  assert.equal(isEligibleForReminder({ registrationStatus: "CONFIRMED", eventStatus: "CANCELLED" }), false);
});

test("isEligibleForReminder returns false for CANCELLED registration", () => {
  assert.equal(isEligibleForReminder({ registrationStatus: "CANCELLED", eventStatus: "PUBLISHED" }), false);
});

// ── buildScheduleEntry ────────────────────────────────────────────────────────

test("buildScheduleEntry returns PENDING entry with correct templateId", () => {
  const entry = buildScheduleEntry({ eventId: "evt-1", label: "R1", scheduledAt: "2026-06-14T10:00:00Z", nowMs: NOW_MS });
  assert.equal(entry.templateId, TEMPLATE_IDS.EVENT_REMINDER);
  assert.equal(entry.eventId, "evt-1");
  assert.equal(entry.reminderLabel, "R1");
  assert.equal(entry.status, "PENDING");
  assert.ok(entry.createdAt);
});

// ── buildEventReminderSchedule ────────────────────────────────────────────────

test("buildEventReminderSchedule returns 2 entries for event 72h away", () => {
  const schedule = buildEventReminderSchedule({ eventId: "evt-1", startAtMs: START_AT_MS, nowMs: NOW_MS });
  assert.equal(schedule.length, 2);
  assert.equal(schedule[0].reminderLabel, "R1");
  assert.equal(schedule[1].reminderLabel, "R2");
});

test("buildEventReminderSchedule entries all have status PENDING", () => {
  const schedule = buildEventReminderSchedule({ eventId: "evt-1", startAtMs: START_AT_MS, nowMs: NOW_MS });
  for (const entry of schedule) {
    assert.equal(entry.status, "PENDING");
  }
});

test("buildEventReminderSchedule returns 0 entries for past event", () => {
  const schedule = buildEventReminderSchedule({ eventId: "evt-1", startAtMs: NOW_MS - 1, nowMs: NOW_MS });
  assert.equal(schedule.length, 0);
});

test("buildEventReminderSchedule entries all carry the correct eventId", () => {
  const schedule = buildEventReminderSchedule({ eventId: "evt-xyz", startAtMs: START_AT_MS, nowMs: NOW_MS });
  for (const entry of schedule) {
    assert.equal(entry.eventId, "evt-xyz");
  }
});

// ── buildReminderNotificationMessage ──────────────────────────────────────────

const ENTRY = buildScheduleEntry({ eventId: "evt-1", label: "R1", scheduledAt: "2026-06-14T10:00:00Z", nowMs: NOW_MS });

const PARTICIPANT = { userId: "user-111", email: "alice@example.com", firstName: "Alice" };
const EVENT       = { title: "Tech Summit", startAt: "2026-06-15T09:00:00Z", venueName: "Centre de conferences" };

test("buildReminderNotificationMessage produces EMAIL channel PENDING message", () => {
  const msg = buildReminderNotificationMessage({
    scheduleEntry: ENTRY,
    participant: PARTICIPANT,
    event: EVENT,
    correlationId: "corr-abc"
  });
  assert.equal(msg.channel,    "EMAIL");
  assert.equal(msg.templateId, TEMPLATE_IDS.EVENT_REMINDER);
  assert.equal(msg.status,     "PENDING");
  assert.ok(msg.requestedAt);
});

test("buildReminderNotificationMessage variables include all required fields", () => {
  const msg = buildReminderNotificationMessage({
    scheduleEntry: ENTRY,
    participant: PARTICIPANT,
    event: EVENT,
    correlationId: "corr-abc"
  });
  const v = msg.variables;
  assert.equal(v.recipientUserId, "user-111");
  assert.equal(v.recipientEmail,  "alice@example.com");
  assert.equal(v.participantName, "Alice");
  assert.equal(v.eventId,         "evt-1");
  assert.equal(v.eventTitle,      "Tech Summit");
  assert.equal(v.eventDate,       "2026-06-15T09:00:00Z");
  assert.equal(v.venueName,       "Centre de conferences");
  assert.equal(v.correlationId,   "corr-abc");
});

test("buildReminderNotificationMessage uses email as participantName fallback", () => {
  const msg = buildReminderNotificationMessage({
    scheduleEntry: ENTRY,
    participant: { userId: "u2", email: "bob@example.com" },
    event: EVENT,
    correlationId: "c2"
  });
  assert.equal(msg.variables.participantName, "bob@example.com");
});

test("buildReminderNotificationMessage venueName is null when event has none", () => {
  const msg = buildReminderNotificationMessage({
    scheduleEntry: ENTRY,
    participant: PARTICIPANT,
    event: { title: "Test", startAt: "2026-06-15T09:00:00Z" },
    correlationId: "c3"
  });
  assert.equal(msg.variables.venueName, null);
});

// ── shouldCancelReminder ──────────────────────────────────────────────────────

test("shouldCancelReminder returns true for CANCELLED event with PENDING schedule", () => {
  assert.ok(shouldCancelReminder({ eventStatus: "CANCELLED", scheduleStatus: "PENDING" }));
});

test("shouldCancelReminder returns true for DELETED event with PENDING schedule", () => {
  assert.ok(shouldCancelReminder({ eventStatus: "DELETED", scheduleStatus: "PENDING" }));
});

test("shouldCancelReminder returns false if schedule already SENT", () => {
  assert.equal(shouldCancelReminder({ eventStatus: "CANCELLED", scheduleStatus: "SENT" }), false);
});

test("shouldCancelReminder returns false if schedule already CANCELLED", () => {
  assert.equal(shouldCancelReminder({ eventStatus: "CANCELLED", scheduleStatus: "CANCELLED" }), false);
});

test("shouldCancelReminder returns false for active PUBLISHED event", () => {
  assert.equal(shouldCancelReminder({ eventStatus: "PUBLISHED", scheduleStatus: "PENDING" }), false);
});
