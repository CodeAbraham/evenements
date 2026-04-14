/**
 * notificationManualReplay.js
 *
 * Pure replay-decision module for the notification pipeline (ticket N04.3).
 * No I/O, no DB — safe to unit-test in isolation.
 *
 * Implements the manual replay rules defined in N04.1:
 *   - Only FAILED_PERMANENT entries are eligible for replay
 *   - The destination event must not be CANCELLED or DELETED
 *   - The recipient user must be active (status ACTIVE)
 *   - Replay creates a NEW NotificationLog entry; the original is never mutated
 *   - The new entry carries parentLogId + triggeredBy = "admin"
 */

import { randomUUID } from "node:crypto";

/**
 * Event statuses that block replay.
 */
export const BLOCKED_EVENT_STATUSES = new Set(["CANCELLED", "DELETED"]);

/**
 * User account statuses that block replay.
 */
export const BLOCKED_USER_STATUSES = new Set(["DISABLED", "LOCKED", "PENDING"]);

/**
 * Check whether a FAILED_PERMANENT log entry is eligible for manual replay.
 *
 * @param {{
 *   status: string,
 *   eventStatus?: string | null,
 *   recipientUserStatus?: string | null
 * }} params
 * @returns {{ eligible: boolean, reason: string }}
 */
export function isEligibleForReplay({ status, eventStatus, recipientUserStatus }) {
  if (status !== "FAILED_PERMANENT") {
    return { eligible: false, reason: "only_failed_permanent_can_be_replayed" };
  }
  if (eventStatus && BLOCKED_EVENT_STATUSES.has(eventStatus)) {
    return { eligible: false, reason: "event_cancelled_or_deleted" };
  }
  if (recipientUserStatus && BLOCKED_USER_STATUSES.has(recipientUserStatus)) {
    return { eligible: false, reason: "recipient_not_active" };
  }
  return { eligible: true, reason: "ok" };
}

/**
 * Build the new NotificationLog entry that represents a manual replay.
 * The original entry is not mutated — this produces a fresh entry that
 * references the original via parentLogId.
 *
 * @param {{
 *   originalLog: {
 *     notificationId?: string,
 *     logId?: string,
 *     channel: string,
 *     templateId: string,
 *     recipientUserId: string,
 *     eventId?: string | null,
 *     correlationId?: string | null,
 *     variables?: object | null
 *   },
 *   adminUserId: string,
 *   nowMs?: number,
 *   idFactory?: () => string
 * }} params
 * @returns {{
 *   notificationId: string,
 *   parentLogId: string,
 *   channel: string,
 *   templateId: string,
 *   recipientUserId: string,
 *   eventId: string | null,
 *   correlationId: string,
 *   variables: object | null,
 *   status: "PENDING",
 *   attempts: 0,
 *   triggeredBy: "admin",
 *   adminUserId: string,
 *   createdAt: string,
 *   updatedAt: string,
 *   nextRetryAt: null,
 *   errorReason: null
 * }}
 */
export function buildReplayEntry({ originalLog, adminUserId, nowMs, idFactory = randomUUID }) {
  const parentLogId = originalLog.notificationId ?? originalLog.logId;
  const now = nowMs ?? Date.now();
  const ts = new Date(now).toISOString();

  return {
    notificationId:  idFactory(),
    parentLogId,
    channel:         originalLog.channel,
    templateId:      originalLog.templateId,
    recipientUserId: originalLog.recipientUserId,
    eventId:         originalLog.eventId         ?? null,
    correlationId:   originalLog.correlationId   ?? idFactory(),
    variables:       originalLog.variables        ?? null,
    status:          "PENDING",
    attempts:        0,
    triggeredBy:     "admin",
    adminUserId,
    createdAt:       ts,
    updatedAt:       ts,
    nextRetryAt:     null,
    errorReason:     null
  };
}

/**
 * Build the audit trail record for a manual replay action.
 *
 * @param {{
 *   adminUserId: string,
 *   originalLogId: string,
 *   newLogId: string,
 *   channel: string,
 *   templateId: string,
 *   recipientUserId: string,
 *   nowMs?: number
 * }} params
 * @returns {{
 *   action: "NOTIFICATION_MANUALLY_REPLAYED",
 *   actorId: string,
 *   actorRole: "ADMIN",
 *   targetType: "NOTIFICATION",
 *   targetId: string,
 *   result: "SUCCESS",
 *   metadata: object,
 *   occurredAt: string
 * }}
 */
export function buildReplayAuditEntry({
  adminUserId,
  originalLogId,
  newLogId,
  channel,
  templateId,
  recipientUserId,
  nowMs
}) {
  return {
    action:          "NOTIFICATION_MANUALLY_REPLAYED",
    actorId:         adminUserId,
    actorRole:       "ADMIN",
    targetType:      "NOTIFICATION",
    targetId:        originalLogId,
    result:          "SUCCESS",
    metadata: {
      newLogId,
      channel,
      templateId,
      recipientUserId
    },
    occurredAt: new Date(nowMs ?? Date.now()).toISOString()
  };
}

/**
 * Validate the admin replay request payload (HTTP layer).
 *
 * @param {{ adminUserId?: unknown, logId?: unknown }} body
 * @returns {{ ok: boolean, errors?: string[] }}
 */
export function validateReplayRequest(body = {}) {
  const errors = [];
  if (!body.adminUserId || typeof body.adminUserId !== "string" || !body.adminUserId.trim()) {
    errors.push("adminUserId is required");
  }
  if (!body.logId || typeof body.logId !== "string" || !body.logId.trim()) {
    errors.push("logId is required");
  }
  if (errors.length > 0) return { ok: false, errors };
  return { ok: true };
}

/**
 * Build the canonical success response for a replay action.
 *
 * @param {{ newLogId: string, originalLogId: string }} params
 * @returns {{ success: true, data: object }}
 */
export function buildReplayResponse({ newLogId, originalLogId }) {
  return {
    success: true,
    data: {
      newLogId,
      originalLogId,
      status: "PENDING",
      message: "Notification queued for replay"
    }
  };
}

/**
 * Build a canonical error response for a replay action.
 *
 * @param {string} message
 * @param {string} code
 * @param {string[]} [details]
 * @returns {{ success: false, error: string, code: string, details?: string[] }}
 */
export function buildReplayErrorResponse(message, code, details) {
  const res = { success: false, error: message, code };
  if (details && details.length > 0) res.details = details;
  return res;
}
