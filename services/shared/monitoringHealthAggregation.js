/**
 * monitoringHealthAggregation.js
 *
 * Pure aggregation logic for the health consolidation view (ticket M01.3).
 * No I/O, no HTTP fetching — safe to unit-test in isolation.
 *
 * Computes the consolidated health state for GET /admin/health/aggregate,
 * which the Gateway (or admin console) calls to aggregate per-service /health
 * responses into a single dashboard-ready payload.
 *
 * Each service is expected to return a response compatible with:
 *   { status: "UP" | "DOWN" | "DEGRADED", uptime?: number, latencyMs?: number }
 */

export const KNOWN_SERVICES = Object.freeze([
  "identity-access-service",
  "event-management-service",
  "registration-service",
  "api-gateway"
]);

export const SERVICE_STATUSES = Object.freeze({
  UP:       "UP",
  DOWN:     "DOWN",
  DEGRADED: "DEGRADED",
  UNKNOWN:  "UNKNOWN"
});

/**
 * Priority order for computing the overall system status.
 * Higher index = higher severity.
 */
const STATUS_SEVERITY = {
  UP:       0,
  UNKNOWN:  1,
  DEGRADED: 2,
  DOWN:     3
};

/**
 * Normalise a raw status string from a service /health response.
 * Returns one of UP | DOWN | DEGRADED | UNKNOWN.
 *
 * @param {unknown} raw
 * @returns {"UP"|"DOWN"|"DEGRADED"|"UNKNOWN"}
 */
export function normalizeServiceStatus(raw) {
  if (!raw || typeof raw !== "string") return SERVICE_STATUSES.UNKNOWN;
  const upper = raw.toUpperCase().trim();
  if (upper === "UP")       return SERVICE_STATUSES.UP;
  if (upper === "DOWN")     return SERVICE_STATUSES.DOWN;
  if (upper === "DEGRADED") return SERVICE_STATUSES.DEGRADED;
  return SERVICE_STATUSES.UNKNOWN;
}

/**
 * Compute the overall system health status from an array of service statuses.
 * Returns the most severe status across all services.
 *
 * @param {Array<"UP"|"DOWN"|"DEGRADED"|"UNKNOWN">} statuses
 * @returns {"UP"|"DOWN"|"DEGRADED"|"UNKNOWN"}
 */
export function computeOverallStatus(statuses) {
  if (!Array.isArray(statuses) || statuses.length === 0) {
    return SERVICE_STATUSES.UNKNOWN;
  }
  return statuses.reduce((worst, current) => {
    const worstSeverity   = STATUS_SEVERITY[worst]   ?? 0;
    const currentSeverity = STATUS_SEVERITY[current] ?? 1;
    return currentSeverity > worstSeverity ? current : worst;
  }, SERVICE_STATUSES.UP);
}

/**
 * Build one service entry in the aggregated health response.
 *
 * @param {{
 *   name: string,
 *   rawStatus?: unknown,
 *   latencyMs?: number | null,
 *   uptime?: number | null,
 *   checkedAt?: string | null,
 *   error?: string | null
 * }} params
 * @returns {{
 *   name: string,
 *   status: "UP"|"DOWN"|"DEGRADED"|"UNKNOWN",
 *   latencyMs: number | null,
 *   uptime: number | null,
 *   checkedAt: string | null,
 *   error: string | null
 * }}
 */
export function buildServiceHealthEntry({ name, rawStatus, latencyMs, uptime, checkedAt, error }) {
  return {
    name,
    status:    normalizeServiceStatus(rawStatus),
    latencyMs: latencyMs ?? null,
    uptime:    uptime    ?? null,
    checkedAt: checkedAt ?? null,
    error:     error     ?? null
  };
}

/**
 * Aggregate multiple per-service health entries into a single dashboard payload.
 *
 * @param {{
 *   services: Array<{
 *     name: string,
 *     status: "UP"|"DOWN"|"DEGRADED"|"UNKNOWN",
 *     latencyMs?: number | null,
 *     uptime?: number | null,
 *     checkedAt?: string | null,
 *     error?: string | null
 *   }>,
 *   aggregatedAt?: string
 * }} params
 * @returns {{
 *   overallStatus: "UP"|"DOWN"|"DEGRADED"|"UNKNOWN",
 *   services: object[],
 *   aggregatedAt: string,
 *   healthyCount: number,
 *   degradedCount: number,
 *   downCount: number,
 *   unknownCount: number
 * }}
 */
export function buildHealthAggregateResponse({ services, aggregatedAt }) {
  const statuses = services.map(s => s.status ?? SERVICE_STATUSES.UNKNOWN);

  const healthyCount  = statuses.filter(s => s === "UP").length;
  const degradedCount = statuses.filter(s => s === "DEGRADED").length;
  const downCount     = statuses.filter(s => s === "DOWN").length;
  const unknownCount  = statuses.filter(s => s === "UNKNOWN").length;

  return {
    overallStatus: computeOverallStatus(statuses),
    services,
    aggregatedAt:  aggregatedAt ?? new Date().toISOString(),
    healthyCount,
    degradedCount,
    downCount,
    unknownCount
  };
}

/**
 * Determine the dashboard badge variant for a given service status.
 * Maps to a semantic UI intent for the admin console panel.
 *
 * @param {"UP"|"DOWN"|"DEGRADED"|"UNKNOWN"} status
 * @returns {"success"|"danger"|"warning"|"muted"}
 */
export function statusToBadgeVariant(status) {
  switch (status) {
    case "UP":       return "success";
    case "DOWN":     return "danger";
    case "DEGRADED": return "warning";
    default:         return "muted";
  }
}

/**
 * Filter services that require attention (DOWN or DEGRADED).
 *
 * @param {Array<{ name: string, status: string }>} services
 * @returns {Array<{ name: string, status: string }>}
 */
export function getServicesRequiringAttention(services) {
  return services.filter(
    s => s.status === SERVICE_STATUSES.DOWN || s.status === SERVICE_STATUSES.DEGRADED
  );
}

/**
 * Build a canonical error response for the health aggregate endpoint.
 *
 * @param {string} message
 * @param {string} code
 * @returns {{ success: false, error: string, code: string }}
 */
export function buildHealthAggregateErrorResponse(message, code) {
  return { success: false, error: message, code };
}
