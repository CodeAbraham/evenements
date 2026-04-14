/**
 * notificationLogEndpoint.js
 *
 * Pure HTTP-layer adapter for the notification log query endpoint (ticket N06.2).
 * Parses and validates raw HTTP query parameters per the N06.1 contract,
 * then returns a canonical API response shape.
 *
 * No I/O, no DB — safe to unit-test in isolation.
 * Companion to notificationDeliveryLog.js (store + query layer).
 */

const ALLOWED_CHANNELS = new Set(["EMAIL", "SMS"]);
const ALLOWED_STATUSES = new Set([
  "PENDING",
  "SENT",
  "FAILED",
  "FAILED_PERMANENT",
  "SIMULATED"
]);
const MAX_PAGE_SIZE = 100;

/**
 * Parse and validate HTTP query parameters for GET /notifications/logs.
 *
 * @param {Record<string, string | string[] | undefined>} rawQuery
 * @returns {{
 *   ok: boolean,
 *   errors?: string[],
 *   params?: {
 *     eventId: string | null,
 *     userId: string | null,
 *     channel: string | null,
 *     status: string | null,
 *     from: string | null,
 *     to: string | null,
 *     page: number,
 *     pageSize: number
 *   }
 * }}
 */
export function parseNotificationLogQuery(rawQuery = {}) {
  const errors = [];

  // page
  const rawPage = rawQuery.page !== undefined ? Number(rawQuery.page) : 1;
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : null;
  if (page === null) errors.push("page must be a positive integer");

  // pageSize
  const rawPageSize = rawQuery.pageSize !== undefined ? Number(rawQuery.pageSize) : 20;
  const pageSize = Number.isInteger(rawPageSize) && rawPageSize >= 1 && rawPageSize <= MAX_PAGE_SIZE
    ? rawPageSize
    : null;
  if (pageSize === null) {
    errors.push(`pageSize must be an integer between 1 and ${MAX_PAGE_SIZE}`);
  }

  // channel (optional, case-insensitive)
  let channel = null;
  if (rawQuery.channel !== undefined && rawQuery.channel !== "") {
    const upper = String(rawQuery.channel).toUpperCase();
    if (ALLOWED_CHANNELS.has(upper)) {
      channel = upper;
    } else {
      errors.push(`channel must be one of: ${[...ALLOWED_CHANNELS].join(", ")}`);
    }
  }

  // status (optional, case-insensitive)
  let status = null;
  if (rawQuery.status !== undefined && rawQuery.status !== "") {
    const upper = String(rawQuery.status).toUpperCase();
    if (ALLOWED_STATUSES.has(upper)) {
      status = upper;
    } else {
      errors.push(`status must be one of: ${[...ALLOWED_STATUSES].join(", ")}`);
    }
  }

  // from (optional, must be valid ISO date)
  let from = null;
  if (rawQuery.from !== undefined && rawQuery.from !== "") {
    const parsed = Date.parse(String(rawQuery.from));
    if (isNaN(parsed)) {
      errors.push("from must be a valid ISO-8601 datetime");
    } else {
      from = new Date(parsed).toISOString();
    }
  }

  // to (optional, must be valid ISO date)
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

  // eventId and userId — accept any non-empty string (UUID format not enforced at this layer)
  const eventId = rawQuery.eventId ? String(rawQuery.eventId).trim() || null : null;
  const userId  = rawQuery.userId  ? String(rawQuery.userId).trim()  || null : null;

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    params: { eventId, userId, channel, status, from, to, page, pageSize }
  };
}

/**
 * Build the canonical success response for GET /notifications/logs.
 *
 * @param {{
 *   items: object[],
 *   page: number,
 *   pageSize: number,
 *   total: number
 * }} data
 * @returns {{ success: true, data: object }}
 */
export function buildLogQueryResponse({ items, page, pageSize, total }) {
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
 * Build the canonical error response for GET /notifications/logs.
 *
 * @param {string} message
 * @param {string} code
 * @param {string[]} [details]
 * @returns {{ success: false, error: string, code: string, details?: string[] }}
 */
export function buildLogQueryErrorResponse(message, code, details) {
  const res = { success: false, error: message, code };
  if (details && details.length > 0) res.details = details;
  return res;
}

/**
 * Map a notification log entry from the store format to the API response format.
 *
 * @param {object} entry
 * @returns {object}
 */
export function mapLogEntryToResponse(entry) {
  return {
    logId:           entry.notificationId ?? entry.logId ?? null,
    eventId:         entry.eventId        ?? null,
    recipientId:     entry.recipientUserId ?? null,
    channel:         entry.channel        ?? null,
    templateId:      entry.templateId     ?? null,
    status:          entry.status         ?? null,
    attempts:        entry.attemptNumber  ?? entry.attempts ?? null,
    errorReason:     entry.errorMessage   ?? entry.errorReason ?? null,
    sentAt:          entry.processedAt    ?? entry.sentAt ?? null,
    createdAt:       entry.createdAt      ?? null,
    updatedAt:       entry.updatedAt      ?? null
  };
}
