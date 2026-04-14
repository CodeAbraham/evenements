import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSmsNotificationMessage,
  isValidSmsTemplateId,
  renderSmsBody,
  simulateSms,
  SMS_TEMPLATE_IDS,
  validateSmsTemplateVariables
} from "../services/shared/notificationSmsSimulator.js";

const BASE_VARS = {
  recipientUserId: "user-111",
  eventId:         "evt-aaa",
  eventTitle:      "Tech Summit 2026",
  correlationId:   "corr-xyz",
  participantName: "Alice",
  eventDate:       "2026-06-15T09:00:00Z"
};

// ── SMS_TEMPLATE_IDS ─────────────────────────────────────────────────────────

test("SMS_TEMPLATE_IDS exposes the 2 canonical SMS template keys", () => {
  assert.equal(SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED, "SMS_REGISTRATION_CONFIRMED");
  assert.equal(SMS_TEMPLATE_IDS.EVENT_REMINDER,         "SMS_EVENT_REMINDER");
});

test("SMS_TEMPLATE_IDS is frozen", () => {
  assert.throws(() => { SMS_TEMPLATE_IDS.NEW_KEY = "x"; }, TypeError);
});

// ── isValidSmsTemplateId ─────────────────────────────────────────────────────

test("isValidSmsTemplateId returns true for all known SMS templates", () => {
  for (const id of Object.values(SMS_TEMPLATE_IDS)) {
    assert.ok(isValidSmsTemplateId(id), `should accept ${id}`);
  }
});

test("isValidSmsTemplateId returns false for email templates", () => {
  assert.equal(isValidSmsTemplateId("EMAIL_REGISTRATION_CONFIRMED"), false);
});

test("isValidSmsTemplateId returns false for unknown strings", () => {
  assert.equal(isValidSmsTemplateId("SMS_UNKNOWN"), false);
  assert.equal(isValidSmsTemplateId(""), false);
  assert.equal(isValidSmsTemplateId(null), false);
});

// ── validateSmsTemplateVariables ─────────────────────────────────────────────

test("validateSmsTemplateVariables passes for REGISTRATION_CONFIRMED with full vars", () => {
  const { valid, missing } = validateSmsTemplateVariables(
    SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED,
    BASE_VARS
  );
  assert.ok(valid);
  assert.deepEqual(missing, []);
});

test("validateSmsTemplateVariables passes for EVENT_REMINDER with full vars", () => {
  const { valid, missing } = validateSmsTemplateVariables(
    SMS_TEMPLATE_IDS.EVENT_REMINDER,
    BASE_VARS
  );
  assert.ok(valid);
  assert.deepEqual(missing, []);
});

test("validateSmsTemplateVariables reports missing common fields", () => {
  const { valid, missing } = validateSmsTemplateVariables(
    SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED,
    { participantName: "Alice", eventDate: "2026-06-15" }
  );
  assert.equal(valid, false);
  assert.ok(missing.includes("recipientUserId"));
  assert.ok(missing.includes("eventId"));
  assert.ok(missing.includes("eventTitle"));
  assert.ok(missing.includes("correlationId"));
});

test("validateSmsTemplateVariables reports missing participantName for REGISTRATION_CONFIRMED", () => {
  const vars = { ...BASE_VARS };
  delete vars.participantName;
  const { valid, missing } = validateSmsTemplateVariables(
    SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED,
    vars
  );
  assert.equal(valid, false);
  assert.ok(missing.includes("participantName"));
});

test("validateSmsTemplateVariables reports missing eventDate for EVENT_REMINDER", () => {
  const vars = { ...BASE_VARS };
  delete vars.eventDate;
  const { valid, missing } = validateSmsTemplateVariables(
    SMS_TEMPLATE_IDS.EVENT_REMINDER,
    vars
  );
  assert.equal(valid, false);
  assert.ok(missing.includes("eventDate"));
});

// ── renderSmsBody ────────────────────────────────────────────────────────────

test("renderSmsBody for REGISTRATION_CONFIRMED contains name, title, date", () => {
  const body = renderSmsBody(SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED, BASE_VARS);
  assert.ok(body.includes("Alice"), "should contain participant name");
  assert.ok(body.includes("Tech Summit 2026"), "should contain event title");
  assert.ok(body.includes("2026-06-15"), "should contain event date");
  assert.ok(body.length <= 200, "should be short enough for SMS");
});

test("renderSmsBody for EVENT_REMINDER contains name, title, date, venue", () => {
  const vars = { ...BASE_VARS, venueName: "Centre de conferences" };
  const body = renderSmsBody(SMS_TEMPLATE_IDS.EVENT_REMINDER, vars);
  assert.ok(body.includes("Alice"));
  assert.ok(body.includes("Tech Summit 2026"));
  assert.ok(body.includes("Centre de conferences"));
});

test("renderSmsBody for EVENT_REMINDER uses fallback venue when missing", () => {
  const body = renderSmsBody(SMS_TEMPLATE_IDS.EVENT_REMINDER, BASE_VARS);
  assert.ok(body.includes("lieu a confirmer"), "should use venue fallback");
});

test("renderSmsBody returns generic fallback for unknown templateId", () => {
  const body = renderSmsBody("SMS_UNKNOWN", BASE_VARS);
  assert.ok(typeof body === "string");
  assert.ok(body.length > 0);
});

// ── simulateSms ──────────────────────────────────────────────────────────────

test("simulateSms returns SIMULATED log entry for valid REGISTRATION_CONFIRMED", () => {
  const result = simulateSms({
    templateId:    SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED,
    recipient:     { userId: "user-111", phone: "+212612345678" },
    variables:     BASE_VARS,
    correlationId: "corr-xyz",
    nowMs:         1700000000000
  });
  assert.ok(result.success);
  assert.equal(result.logEntry.channel,         "SMS");
  assert.equal(result.logEntry.templateId,      SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED);
  assert.equal(result.logEntry.status,          "SIMULATED");
  assert.equal(result.logEntry.recipientUserId, "user-111");
  assert.equal(result.logEntry.phone,           "+212612345678");
  assert.equal(result.logEntry.errorReason,     null);
  assert.ok(result.logEntry.simulatedAt);
  assert.ok(result.logEntry.body.length > 0);
});

test("simulateSms accepts null phone — still produces SIMULATED", () => {
  const result = simulateSms({
    templateId:    SMS_TEMPLATE_IDS.EVENT_REMINDER,
    recipient:     { userId: "user-111", phone: null },
    variables:     BASE_VARS,
    correlationId: "corr-xyz"
  });
  assert.ok(result.success);
  assert.equal(result.logEntry.phone, null);
  assert.equal(result.logEntry.status, "SIMULATED");
});

test("simulateSms fails for unknown templateId", () => {
  const result = simulateSms({
    templateId:    "SMS_UNKNOWN",
    recipient:     { userId: "user-111", phone: null },
    variables:     BASE_VARS,
    correlationId: "corr-xyz"
  });
  assert.equal(result.success, false);
  assert.equal(result.code,    "UNKNOWN_TEMPLATE");
  assert.ok(result.error);
});

test("simulateSms fails when required variables are missing", () => {
  const result = simulateSms({
    templateId:    SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED,
    recipient:     { userId: "user-111", phone: null },
    variables:     { eventTitle: "Test" }, // missing most required fields
    correlationId: "corr-xyz"
  });
  assert.equal(result.success, false);
  assert.equal(result.code, "MISSING_VARIABLES");
  assert.ok(result.error.includes("Missing"));
});

test("simulateSms simulatedAt uses nowMs when provided", () => {
  const nowMs = 1700000000000;
  const result = simulateSms({
    templateId:    SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED,
    recipient:     { userId: "u1", phone: null },
    variables:     BASE_VARS,
    correlationId: "c1",
    nowMs
  });
  assert.ok(result.success);
  assert.equal(result.logEntry.simulatedAt, new Date(nowMs).toISOString());
});

test("simulateSms does not have external call side effects (pure function)", () => {
  // Call twice with same params → same shape, no state mutation
  const params = {
    templateId:    SMS_TEMPLATE_IDS.EVENT_REMINDER,
    recipient:     { userId: "u2", phone: "+33612345678" },
    variables:     BASE_VARS,
    correlationId: "c2",
    nowMs:         1700000001000
  };
  const r1 = simulateSms(params);
  const r2 = simulateSms(params);
  assert.deepEqual(r1.logEntry.templateId, r2.logEntry.templateId);
  assert.deepEqual(r1.logEntry.status,     r2.logEntry.status);
  assert.deepEqual(r1.logEntry.body,       r2.logEntry.body);
});

// ── buildSmsNotificationMessage ──────────────────────────────────────────────

test("buildSmsNotificationMessage returns channel SMS and status PENDING", () => {
  const msg = buildSmsNotificationMessage(
    SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED,
    BASE_VARS
  );
  assert.equal(msg.channel,    "SMS");
  assert.equal(msg.templateId, SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED);
  assert.equal(msg.status,     "PENDING");
  assert.ok(msg.requestedAt);
  assert.deepEqual(msg.variables, BASE_VARS);
});

test("buildSmsNotificationMessage uses empty object when variables is null", () => {
  const msg = buildSmsNotificationMessage(SMS_TEMPLATE_IDS.EVENT_REMINDER, null);
  assert.deepEqual(msg.variables, {});
});
