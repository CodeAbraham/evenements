/**
 * adminNotificationLogUi.js
 *
 * Pure UI-layer module for the admin notification log view (ticket N06.3).
 * No I/O, no DB — safe to unit-test in isolation.
 *
 * Provides view-model helpers for the admin console panel that lists and
 * filters notification log entries. Complements notificationLogEndpoint.js
 * (HTTP query parsing) and notificationDeliveryLog.js (store layer).
 */

const STATUS_META = {
  PENDING:          { label: "Pending",          tone: "muted"   },
  SENT:             { label: "Sent",             tone: "success" },
  FAILED:           { label: "Failed",           tone: "warning" },
  FAILED_PERMANENT: { label: "Failed permanently", tone: "danger"  },
  SIMULATED:        { label: "Simulated (SMS)",  tone: "info"    }
};

const CHANNEL_META = {
  EMAIL: { label: "Email", icon: "envelope" },
  SMS:   { label: "SMS",   icon: "phone"    }
};

const ALLOWED_SORT_BY  = new Set(["sentAt", "createdAt", "attempts"]);
const ALLOWED_SORT_DIR = new Set(["asc", "desc"]);
const ALLOWED_PAGE_SIZES = new Set([10, 20, 50, 100]);

/**
 * Normalise a raw notification status string to its canonical uppercase form.
 *
 * @param {unknown} raw
 * @returns {string}  One of STATUS_META keys, or "PENDING" as fallback.
 */
export function normalizeNotificationStatus(raw) {
  const upper = String(raw || "").trim().toUpperCase().replace(/-/g, "_");
  return STATUS_META[upper] ? upper : "PENDING";
}

/**
 * Normalise a raw channel string.
 *
 * @param {unknown} raw
 * @returns {"EMAIL"|"SMS"|null}
 */
export function normalizeChannel(raw) {
  const upper = String(raw || "").trim().toUpperCase();
  return CHANNEL_META[upper] ? upper : null;
}

/**
 * Normalise the admin console filter bar state.
 * Accepts raw UI input and returns a validated, canonical filter object
 * ready to be serialised into query parameters for the log endpoint.
 *
 * @param {object} filters
 * @returns {{ isValid: boolean, errors: string[], data: object }}
 */
export function normalizeNotificationLogFilters(filters = {}) {
  const errors = [];

  // status
  const rawStatus = filters.status ? String(filters.status).trim().toUpperCase().replace(/-/g, "_") : null;
  const status = rawStatus && STATUS_META[rawStatus] ? rawStatus : null;
  if (filters.status && !status) errors.push("INVALID_STATUS");

  // channel
  const rawChannel = filters.channel ? String(filters.channel).trim().toUpperCase() : null;
  const channel = rawChannel && CHANNEL_META[rawChannel] ? rawChannel : null;
  if (filters.channel && !channel) errors.push("INVALID_CHANNEL");

  // eventId / userId — free strings, just trim
  const eventId = filters.eventId ? String(filters.eventId).trim() || null : null;
  const userId  = filters.userId  ? String(filters.userId).trim()  || null : null;

  // date range
  const from = normalizeDateOrNull(filters.from);
  const to   = normalizeDateOrNull(filters.to);
  if (filters.from && !from) errors.push("INVALID_FROM_DATE");
  if (filters.to   && !to)   errors.push("INVALID_TO_DATE");
  if (from && to && new Date(from) > new Date(to)) errors.push("INVALID_DATE_RANGE");

  // pagination
  const page     = normalizePositiveInt(filters.page, 1);
  const pageSize = ALLOWED_PAGE_SIZES.has(Number(filters.pageSize))
    ? Number(filters.pageSize)
    : 20;

  // sort
  const sortBy  = ALLOWED_SORT_BY.has(filters.sortBy)   ? filters.sortBy   : "createdAt";
  const sortDir = ALLOWED_SORT_DIR.has(filters.sortDir)  ? filters.sortDir  : "desc";

  return {
    isValid: errors.length === 0,
    errors,
    data: { status, channel, eventId, userId, from, to, page, pageSize, sortBy, sortDir }
  };
}

/**
 * Map a raw notification log entry from the API response to the
 * admin console row shape, adding UI metadata (labels, tones, badges).
 *
 * @param {object} entry  API response item (shape from mapLogEntryToResponse)
 * @returns {object}
 */
export function mapLogEntryToAdminRow(entry) {
  const status  = normalizeNotificationStatus(entry.status);
  const channel = normalizeChannel(entry.channel);

  const statusMeta  = STATUS_META[status]           ?? STATUS_META.PENDING;
  const channelMeta = channel ? CHANNEL_META[channel] : null;

  return {
    logId:            entry.logId          ?? null,
    eventId:          entry.eventId        ?? null,
    recipientId:      entry.recipientId    ?? null,
    channel:          channel,
    channelLabel:     channelMeta?.label   ?? null,
    channelIcon:      channelMeta?.icon    ?? null,
    templateId:       entry.templateId     ?? null,
    status,
    statusLabel:      statusMeta.label,
    statusTone:       statusMeta.tone,
    attempts:         entry.attempts       ?? null,
    errorReason:      entry.errorReason    ?? null,
    sentAt:           entry.sentAt         ?? null,
    createdAt:        entry.createdAt      ?? null,
    // Derived: whether this entry can be manually replayed
    canReplay: status === "FAILED_PERMANENT"
  };
}

/**
 * Build the complete admin console view-model for the notification log panel.
 *
 * @param {{
 *   items: object[],
 *   page: number,
 *   pageSize: number,
 *   total: number,
 *   filters: object
 * }} params
 * @returns {{
 *   rows: object[],
 *   pagination: object,
 *   summary: object,
 *   activeFilters: object,
 *   isEmpty: boolean
 * }}
 */
export function buildAdminNotificationLogViewModel({ items, page, pageSize, total, filters = {} }) {
  const rows = items.map(mapLogEntryToAdminRow);

  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;

  // Summary counts by status
  const summary = {
    totalEntries:         total,
    sentCount:            rows.filter(r => r.status === "SENT").length,
    failedCount:          rows.filter(r => r.status === "FAILED").length,
    failedPermanentCount: rows.filter(r => r.status === "FAILED_PERMANENT").length,
    simulatedCount:       rows.filter(r => r.status === "SIMULATED").length,
    pendingCount:         rows.filter(r => r.status === "PENDING").length,
    replayableCount:      rows.filter(r => r.canReplay).length
  };

  return {
    rows,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasPrev: page > 1,
      hasNext: page < totalPages
    },
    summary,
    activeFilters: normalizeNotificationLogFilters(filters).data,
    isEmpty: rows.length === 0
  };
}

// ── internal helpers ──────────────────────────────────────────────────────────

function normalizePositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n >= 1 ? n : fallback;
}

function normalizeDateOrNull(value) {
  if (!value) return null;
  const parsed = Date.parse(String(value));
  return isNaN(parsed) ? null : new Date(parsed).toISOString();
}
