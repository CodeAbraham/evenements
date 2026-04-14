import assert from "node:assert/strict";
import test from "node:test";

import {
  KNOWN_SERVICES,
  SERVICE_STATUSES,
  buildHealthAggregateErrorResponse,
  buildHealthAggregateResponse,
  buildServiceHealthEntry,
  computeOverallStatus,
  getServicesRequiringAttention,
  normalizeServiceStatus,
  statusToBadgeVariant
} from "../services/shared/monitoringHealthAggregation.js";

// ── normalizeServiceStatus ────────────────────────────────────────────────────

test("normalizeServiceStatus returns UP for 'UP'", () => {
  assert.equal(normalizeServiceStatus("UP"),   "UP");
  assert.equal(normalizeServiceStatus("up"),   "UP");
  assert.equal(normalizeServiceStatus("  UP"), "UP");
});

test("normalizeServiceStatus returns DOWN for 'DOWN'", () => {
  assert.equal(normalizeServiceStatus("DOWN"), "DOWN");
  assert.equal(normalizeServiceStatus("down"), "DOWN");
});

test("normalizeServiceStatus returns DEGRADED for 'DEGRADED'", () => {
  assert.equal(normalizeServiceStatus("DEGRADED"), "DEGRADED");
  assert.equal(normalizeServiceStatus("degraded"), "DEGRADED");
});

test("normalizeServiceStatus returns UNKNOWN for null/undefined/unknown strings", () => {
  assert.equal(normalizeServiceStatus(null),      "UNKNOWN");
  assert.equal(normalizeServiceStatus(undefined),  "UNKNOWN");
  assert.equal(normalizeServiceStatus(""),         "UNKNOWN");
  assert.equal(normalizeServiceStatus("STARTING"), "UNKNOWN");
  assert.equal(normalizeServiceStatus(42),         "UNKNOWN");
});

// ── computeOverallStatus ──────────────────────────────────────────────────────

test("computeOverallStatus returns UP when all services are UP", () => {
  assert.equal(computeOverallStatus(["UP", "UP", "UP"]), "UP");
});

test("computeOverallStatus returns DOWN when any service is DOWN", () => {
  assert.equal(computeOverallStatus(["UP", "DOWN", "UP"]),      "DOWN");
  assert.equal(computeOverallStatus(["DEGRADED", "DOWN", "UP"]), "DOWN");
});

test("computeOverallStatus returns DEGRADED when any service is DEGRADED (no DOWN)", () => {
  assert.equal(computeOverallStatus(["UP", "DEGRADED", "UP"]),        "DEGRADED");
  assert.equal(computeOverallStatus(["UP", "UNKNOWN", "DEGRADED"]),    "DEGRADED");
});

test("computeOverallStatus returns UNKNOWN when any service is UNKNOWN (no worse)", () => {
  assert.equal(computeOverallStatus(["UP", "UNKNOWN", "UP"]), "UNKNOWN");
});

test("computeOverallStatus returns UNKNOWN for empty array", () => {
  assert.equal(computeOverallStatus([]), "UNKNOWN");
});

test("computeOverallStatus returns UNKNOWN for non-array input", () => {
  assert.equal(computeOverallStatus(null), "UNKNOWN");
});

test("computeOverallStatus single DOWN beats DEGRADED", () => {
  assert.equal(computeOverallStatus(["DEGRADED", "DOWN"]), "DOWN");
});

// ── buildServiceHealthEntry ───────────────────────────────────────────────────

test("buildServiceHealthEntry normalises rawStatus and returns all fields", () => {
  const entry = buildServiceHealthEntry({
    name:      "api-gateway",
    rawStatus: "up",
    latencyMs: 12,
    uptime:    3600,
    checkedAt: "2026-01-01T00:00:00Z",
    error:     null
  });
  assert.equal(entry.name,      "api-gateway");
  assert.equal(entry.status,    "UP");
  assert.equal(entry.latencyMs, 12);
  assert.equal(entry.uptime,    3600);
  assert.equal(entry.checkedAt, "2026-01-01T00:00:00Z");
  assert.equal(entry.error,     null);
});

test("buildServiceHealthEntry defaults optional fields to null", () => {
  const entry = buildServiceHealthEntry({ name: "event-management-service", rawStatus: "DOWN" });
  assert.equal(entry.latencyMs, null);
  assert.equal(entry.uptime,    null);
  assert.equal(entry.checkedAt, null);
  assert.equal(entry.error,     null);
});

test("buildServiceHealthEntry captures error string", () => {
  const entry = buildServiceHealthEntry({
    name:     "registration-service",
    rawStatus: "DOWN",
    error:     "connection refused"
  });
  assert.equal(entry.error, "connection refused");
  assert.equal(entry.status, "DOWN");
});

// ── buildHealthAggregateResponse ──────────────────────────────────────────────

const SAMPLE_SERVICES = [
  { name: "api-gateway",              status: "UP" },
  { name: "identity-access-service",  status: "UP" },
  { name: "event-management-service", status: "DEGRADED" },
  { name: "registration-service",     status: "DOWN" }
];

test("buildHealthAggregateResponse sets overallStatus to most severe (DOWN)", () => {
  const res = buildHealthAggregateResponse({ services: SAMPLE_SERVICES, aggregatedAt: "2026-01-01T00:00:00Z" });
  assert.equal(res.overallStatus, "DOWN");
});

test("buildHealthAggregateResponse counts healthy, degraded, down, unknown", () => {
  const res = buildHealthAggregateResponse({ services: SAMPLE_SERVICES, aggregatedAt: "2026-01-01T00:00:00Z" });
  assert.equal(res.healthyCount,  2);
  assert.equal(res.degradedCount, 1);
  assert.equal(res.downCount,     1);
  assert.equal(res.unknownCount,  0);
});

test("buildHealthAggregateResponse includes all services list", () => {
  const res = buildHealthAggregateResponse({ services: SAMPLE_SERVICES, aggregatedAt: "2026-01-01T00:00:00Z" });
  assert.equal(res.services.length, 4);
});

test("buildHealthAggregateResponse uses aggregatedAt from params", () => {
  const res = buildHealthAggregateResponse({
    services:     SAMPLE_SERVICES,
    aggregatedAt: "2026-06-01T12:00:00Z"
  });
  assert.equal(res.aggregatedAt, "2026-06-01T12:00:00Z");
});

test("buildHealthAggregateResponse all UP yields UP overall", () => {
  const all_up = SAMPLE_SERVICES.map(s => ({ ...s, status: "UP" }));
  const res = buildHealthAggregateResponse({ services: all_up });
  assert.equal(res.overallStatus, "UP");
  assert.equal(res.healthyCount,  4);
  assert.equal(res.downCount,     0);
});

test("buildHealthAggregateResponse single UNKNOWN yields UNKNOWN overall when others UP", () => {
  const services = [
    { name: "api-gateway",  status: "UP" },
    { name: "registration", status: "UNKNOWN" }
  ];
  const res = buildHealthAggregateResponse({ services });
  assert.equal(res.overallStatus, "UNKNOWN");
  assert.equal(res.unknownCount,  1);
});

// ── statusToBadgeVariant ──────────────────────────────────────────────────────

test("statusToBadgeVariant maps UP to success", () => {
  assert.equal(statusToBadgeVariant("UP"), "success");
});

test("statusToBadgeVariant maps DOWN to danger", () => {
  assert.equal(statusToBadgeVariant("DOWN"), "danger");
});

test("statusToBadgeVariant maps DEGRADED to warning", () => {
  assert.equal(statusToBadgeVariant("DEGRADED"), "warning");
});

test("statusToBadgeVariant maps UNKNOWN and unknown values to muted", () => {
  assert.equal(statusToBadgeVariant("UNKNOWN"), "muted");
  assert.equal(statusToBadgeVariant("STARTING"), "muted");
  assert.equal(statusToBadgeVariant(null), "muted");
});

// ── getServicesRequiringAttention ─────────────────────────────────────────────

test("getServicesRequiringAttention returns DOWN and DEGRADED services only", () => {
  const result = getServicesRequiringAttention(SAMPLE_SERVICES);
  assert.equal(result.length, 2);
  assert.ok(result.some(s => s.name === "event-management-service" && s.status === "DEGRADED"));
  assert.ok(result.some(s => s.name === "registration-service"     && s.status === "DOWN"));
});

test("getServicesRequiringAttention returns empty when all are UP", () => {
  const all_up = SAMPLE_SERVICES.map(s => ({ ...s, status: "UP" }));
  const result = getServicesRequiringAttention(all_up);
  assert.deepEqual(result, []);
});

test("getServicesRequiringAttention excludes UNKNOWN services", () => {
  const services = [
    { name: "svc-a", status: "UNKNOWN" },
    { name: "svc-b", status: "DOWN" }
  ];
  const result = getServicesRequiringAttention(services);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "svc-b");
});

// ── KNOWN_SERVICES / SERVICE_STATUSES exports ─────────────────────────────────

test("KNOWN_SERVICES includes the four core services", () => {
  assert.ok(KNOWN_SERVICES.includes("identity-access-service"));
  assert.ok(KNOWN_SERVICES.includes("event-management-service"));
  assert.ok(KNOWN_SERVICES.includes("registration-service"));
  assert.ok(KNOWN_SERVICES.includes("api-gateway"));
});

test("SERVICE_STATUSES exports canonical status strings", () => {
  assert.equal(SERVICE_STATUSES.UP,       "UP");
  assert.equal(SERVICE_STATUSES.DOWN,     "DOWN");
  assert.equal(SERVICE_STATUSES.DEGRADED, "DEGRADED");
  assert.equal(SERVICE_STATUSES.UNKNOWN,  "UNKNOWN");
});

// ── buildHealthAggregateErrorResponse ─────────────────────────────────────────

test("buildHealthAggregateErrorResponse returns error shape", () => {
  const res = buildHealthAggregateErrorResponse("Gateway unreachable", "GATEWAY_ERROR");
  assert.equal(res.success, false);
  assert.equal(res.code,    "GATEWAY_ERROR");
  assert.ok(res.error);
});
