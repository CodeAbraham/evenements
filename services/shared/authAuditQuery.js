/**
 * authAuditQuery.js
 *
 * Pure HTTP-layer adapter for the auth audit log query endpoint (ticket I05.3).
 * Parses and validates raw HTTP query parameters per the A03.1 / I05.1 contract,
 * then returns canonical API response shapes.
 *
 * No I/O, no DB — safe to unit-test in isolation.
 * Companion to the admin audit store (A03.2).
 */

const ALLOWED_ACTOR_ROLES = new Set(["PARTICIPANT", "ORGANIZER", "ADMIN", "SYSTEM"]);
const ALLOWED_RESULTS      = new Set(["SUCCESS", "FAILURE", "DENIED"]);
const ALLOWED_SORT_BY      = new Set(["occurredAt"]);
const ALLOWED_SORT_ORDERS  = new Set(["asc", "desc"]);

/**
 * Auth-domain action prefixes that this endpoint filters on.
 * Allows filtering to auth events only (USER_LOGIN_*, USER_REGISTERED, etc.)
 */
const AUTH_ACTION_PREFIXES = ["USER_", "SESSION_", "PASSWORD_"];

const MAX_PAGE_SIZE = 100;

/**
 * Parse and validate HTTP query parameters for GET /api/admin/audit/logs
 * filtered to auth domain events.
 *
 * @param {Record<string, string | undefined>} rawQuery
 * @returns {{
 *   ok: boolean,
 *   errors?: string[],
 *   params?: {
 *     actorId: string | null,
 *     actorRole: string | null,
 *     action: string | null,
 *     result: string | null,
 *     from: string | null,
 *     to: string | null,
 *     correlationId: string | null,
 *     page: number,
 *     pageSize: number,
 *     sortBy: string,
 *     sortOrder: string
 *   }
 * }}
 */
export function parseAuditLogQuery(rawQuery = {}) {
  const errors = [];

  // page
  const rawPage = rawQuery.page !== undefined ? Number(rawQuery.page) : 1;
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : null;
  if (page === null) errors.push("page must be a positive integer");

  // pageSize
  const rawPageSize = rawQuery.pageSize !== undefined ? Number(rawQuery.pageSize) : 20;
  const pageSize =
    Number.isInteger(rawPageSize) && rawPageSize >= 1 && rawPageSize <= MAX_PAGE_SIZE
      ? rawPageSize
      : null;
  if (pageSize === null) {
    errors.push(`pageSize must be an integer between 1 and ${MAX_PAGE_SIZE}`);
  }

  // actorId (optional free string)
  const actorId = rawQuery.actorId ? String(rawQuery.actorId).trim() || null : null;

  // actorRole (optional enum)
  let actorRole = null;
  if (rawQuery.actorRole !== undefined && rawQuery.actorRole !== "") {
    const upper = String(rawQuery.actorRole).toUpperCase();
    if (ALLOWED_ACTOR_ROLES.has(upper)) {
      actorRole = upper;
    } else {
      errors.push(`actorRole must be one of: ${[...ALLOWED_ACTOR_ROLES].join(", ")}`);
    }
  }

  // action (optional free string — not validated against enum to allow future actions)
  const action = rawQuery.action ? String(rawQuery.action).trim() || null : null;

  // result (optional enum)
  let result = null;
  if (rawQuery.result !== undefined && rawQuery.result !== "") {
    const upper = String(rawQuery.result).toUpperCase();
    if (ALLOWED_RESULTS.has(upper)) {
      result = upper;
    } else {
      errors.push(`result must be one of: ${[...ALLOWED_RESULTS].join(", ")}`);
    }
  }

  // correlationId (optional free string)
  const correlationId = rawQuery.correlationId
    ? String(rawQuery.correlationId).trim() || null
    : null;

  // from (optional, valid ISO date)
  let from = null;
  if (rawQuery.from !== undefined && rawQuery.from !== "") {
    const parsed = Date.parse(String(rawQuery.from));
    if (isNaN(parsed)) {
      errors.push("from must be a valid ISO-8601 datetime");
    } else {
      from = new Date(parsed).toISOString();
    }
  }

  // to (optional, valid ISO date)
  let to = null;
  if (rawQuery.to !== undefined && rawQuery.to !== "") {
    const parsed = Date.parse(String(rawQuery.to));
    if (isNaN(parsed)) {
      errors.push("to must be a valid ISO-8601 datetime");
    } else {
      to = new Date(parsed).toISOString();
    }
  }

  // date range coherence
  if (from && to && Date.parse(to) < Date.parse(from)) {
    errors.push("to must be greater than or equal to from");
  }

  // sortBy
  const rawSortBy = rawQuery.sortBy ? String(rawQuery.sortBy).trim() : "occurredAt";
  const sortBy = ALLOWED_SORT_BY.has(rawSortBy) ? rawSortBy : null;
  if (sortBy === null) {
    errors.push(`sortBy must be one of: ${[...ALLOWED_SORT_BY].join(", ")}`);
  }

  // sortOrder
  const rawSortOrder = rawQuery.sortOrder
    ? String(rawQuery.sortOrder).toLowerCase().trim()
    : "desc";
  const sortOrder = ALLOWED_SORT_ORDERS.has(rawSortOrder) ? rawSortOrder : null;
  if (sortOrder === null) {
    errors.push(`sortOrder must be one of: ${[...ALLOWED_SORT_ORDERS].join(", ")}`);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    params: {
      actorId,
      actorRole,
      action,
      result,
      correlationId,
      from,
      to,
      page,
      pageSize,
      sortBy:    sortBy    ?? "occurredAt",
      sortOrder: sortOrder ?? "desc"
    }
  };
}

/**
 * Determine whether an audit record action belongs to the auth domain.
 * Used as a lightweight filter when a full DB query filter is not available.
 *
 * @param {string} action
 * @returns {boolean}
 */
export function isAuthDomainAction(action) {
  if (!action || typeof action !== "string") return false;
  const upper = action.toUpperCase();
  return AUTH_ACTION_PREFIXES.some(prefix => upper.startsWith(prefix));
}

/**
 * Map a raw audit store record to the canonical API response shape.
 *
 * @param {object} record
 * @returns {object}
 */
export function mapAuditRecordToResponse(record) {
  return {
    auditId:         record.auditId         ?? null,
    occurredAt:      record.occurredAt       ?? null,
    sourceService:   record.sourceService    ?? null,
    actorId:         record.actorId          ?? null,
    actorRole:       record.actorRole        ?? null,
    action:          record.action           ?? null,
    targetType:      record.targetType       ?? null,
    targetId:        record.targetId         ?? null,
    result:          record.result           ?? null,
    correlationId:   record.correlationId    ?? null,
    reasonCode:      record.reasonCode       ?? null,
    reasonNote:      record.reasonNote       ?? null,
    ipAddress:       record.ipAddress        ?? null
  };
}

/**
 * Build the canonical success response for GET /api/admin/audit/logs.
 *
 * @param {{ items: object[], page: number, pageSize: number, total: number }} data
 * @returns {{ success: true, data: object }}
 */
export function buildAuditLogResponse({ items, page, pageSize, total }) {
  return {
    success: true,
    data: {
      items,
      page,
      pageSize,
      total
    }
  };
}

/**
 * Build the canonical error response for the audit query endpoint.
 *
 * @param {string} message
 * @param {string} code
 * @param {string[]} [details]
 * @returns {{ success: false, error: string, code: string, details?: string[] }}
 */
export function buildAuditLogErrorResponse(message, code, details) {
  const res = { success: false, error: message, code };
  if (details && details.length > 0) res.details = details;
  return res;
}
