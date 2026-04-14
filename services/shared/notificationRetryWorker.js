/**
 * notificationRetryWorker.js
 *
 * Pure retry-decision module for the notification pipeline (ticket N04.2).
 * No I/O, no DB — safe to unit-test in isolation.
 *
 * Implements the retry policy defined in N04.1:
 *   - Max 3 attempts
 *   - Exponential backoff: 30s → 5min → 30min
 *   - Deduplication key: (correlationId, templateId, recipientId, channel)
 *   - FAILED_PERMANENT after maxAttempts exhausted or non-recoverable error
 */

export const MAX_ATTEMPTS = 3;

/** Backoff delays in milliseconds for attempts 1, 2, 3 */
export const BACKOFF_MS = [
  30 * 1000,        // attempt 1 → 30s
  5 * 60 * 1000,    // attempt 2 → 5min
  30 * 60 * 1000    // attempt 3 → 30min
];

/**
 * Error codes considered non-recoverable — go straight to FAILED_PERMANENT.
 */
export const NON_RECOVERABLE_CODES = new Set([
  "UNKNOWN_TEMPLATE",
  "MISSING_VARIABLES",
  "INVALID_RECIPIENT"
]);

/**
 * Decide whether a failed notification should be retried.
 *
 * @param {{
 *   attempts: number,
 *   errorCode?: string|null
 * }} log
 * @returns {{ shouldRetry: boolean, reason: string }}
 */
export function shouldRetry({ attempts, errorCode }) {
  if (NON_RECOVERABLE_CODES.has(errorCode)) {
    return { shouldRetry: false, reason: "non_recoverable_error" };
  }
  if (attempts >= MAX_ATTEMPTS) {
    return { shouldRetry: false, reason: "max_attempts_reached" };
  }
  return { shouldRetry: true, reason: "transient_error" };
}

/**
 * Compute the timestamp of the next retry attempt.
 *
 * @param {{ attempts: number, nowMs?: number }} params
 *   attempts — number of attempts already made (0-based index into BACKOFF_MS)
 * @returns {string} ISO-8601 datetime of the next retry
 */
export function nextRetryAt({ attempts, nowMs }) {
  const now = nowMs ?? Date.now();
  // attempts is 1-based (1st retry → index 0, 2nd → index 1, 3rd → index 2)
  const backoffIndex = Math.min(Math.max(attempts - 1, 0), BACKOFF_MS.length - 1);
  return new Date(now + BACKOFF_MS[backoffIndex]).toISOString();
}

/**
 * Build the patch to apply to a NotificationLog entry after a failed attempt.
 *
 * @param {{
 *   attempts: number,
 *   errorCode?: string|null,
 *   errorReason?: string|null,
 *   nowMs?: number
 * }} params
 * @returns {{
 *   status: "FAILED" | "FAILED_PERMANENT",
 *   attempts: number,
 *   nextRetryAt: string | null,
 *   errorReason: string | null,
 *   updatedAt: string
 * }}
 */
export function buildRetryPatch({ attempts, errorCode, errorReason, nowMs }) {
  const newAttempts = attempts + 1;
  const now = nowMs ?? Date.now();
  const updatedAt = new Date(now).toISOString();

  // Check against pre-incremented count: "can we do another attempt after this one?"
  const { shouldRetry: retry } = shouldRetry({ attempts, errorCode });

  if (!retry) {
    return {
      status:       "FAILED_PERMANENT",
      attempts:     newAttempts,
      nextRetryAt:  null,
      errorReason:  errorReason ?? null,
      updatedAt
    };
  }

  return {
    status:       "FAILED",
    attempts:     newAttempts,
    nextRetryAt:  nextRetryAt({ attempts: newAttempts, nowMs: now }),
    errorReason:  errorReason ?? null,
    updatedAt
  };
}

/**
 * Build the patch to apply after a successful send.
 *
 * @param {{ nowMs?: number }} params
 * @returns {{
 *   status: "SENT",
 *   sentAt: string,
 *   nextRetryAt: null,
 *   errorReason: null,
 *   updatedAt: string
 * }}
 */
export function buildSuccessPatch({ nowMs } = {}) {
  const now = nowMs ?? Date.now();
  const ts = new Date(now).toISOString();
  return {
    status:      "SENT",
    sentAt:      ts,
    nextRetryAt: null,
    errorReason: null,
    updatedAt:   ts
  };
}

/**
 * Build the deduplication key for a notification log entry.
 * Used to prevent duplicate sends across retry cycles.
 *
 * @param {{
 *   correlationId: string,
 *   templateId: string,
 *   recipientId: string,
 *   channel: string
 * }} params
 * @returns {string}
 */
export function buildDeduplicationKey({ correlationId, templateId, recipientId, channel }) {
  return `${correlationId}|${templateId}|${recipientId}|${channel}`;
}

/**
 * Check whether a notification has already been successfully sent,
 * given a list of existing log statuses for the same deduplication key.
 *
 * @param {string[]} existingStatuses  e.g. ["FAILED", "FAILED"]
 * @returns {boolean}
 */
export function isAlreadySent(existingStatuses) {
  return existingStatuses.some(s => s === "SENT" || s === "SIMULATED");
}
