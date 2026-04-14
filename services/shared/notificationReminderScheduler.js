/**
 * notificationReminderScheduler.js
 *
 * Pure reminder-scheduling module for the notification pipeline (N05.2 + N05.3).
 * No I/O, no DB — safe to unit-test in isolation.
 *
 * Implements the reminder rules defined in N05.1:
 *   - R1: 48h before startAt (if startAt - now >= 48h)
 *   - R2: 24h before startAt (if startAt - now >= 24h)
 *   - Template: EMAIL_EVENT_REMINDER
 *   - Deduplication before send
 */

import { TEMPLATE_IDS } from "./notificationEmailTemplates.js";

export const REMINDER_WINDOWS_MS = [
  { label: "R1", offsetMs: 48 * 60 * 60 * 1000 }, // 48h before start
  { label: "R2", offsetMs: 24 * 60 * 60 * 1000 }  // 24h before start
];

/**
 * Compute which reminder windows are still schedulable for an event.
 *
 * @param {{
 *   startAtMs: number,   ISO or epoch ms of event start
 *   nowMs?: number
 * }} params
 * @returns {{
 *   label: string,
 *   scheduledAtMs: number,
 *   scheduledAt: string
 * }[]}
 */
export function computeSchedulableReminders({ startAtMs, nowMs }) {
  const now = nowMs ?? Date.now();
  return REMINDER_WINDOWS_MS
    .map(({ label, offsetMs }) => ({
      label,
      scheduledAtMs: startAtMs - offsetMs,
      scheduledAt:   new Date(startAtMs - offsetMs).toISOString()
    }))
    .filter(({ scheduledAtMs }) => scheduledAtMs > now);
}

/**
 * Check whether a participant is eligible to receive a reminder.
 *
 * @param {{
 *   registrationStatus: string,
 *   eventStatus: string
 * }} params
 * @returns {boolean}
 */
export function isEligibleForReminder({ registrationStatus, eventStatus }) {
  const eligibleRegistration = registrationStatus === "CONFIRMED";
  const eligibleEvent = eventStatus === "PUBLISHED" || eventStatus === "FULL";
  return eligibleRegistration && eligibleEvent;
}

/**
 * Build a NotificationSchedule entry for a reminder.
 *
 * @param {{
 *   eventId: string,
 *   label: string,
 *   scheduledAt: string,
 *   nowMs?: number
 * }} params
 * @returns {{
 *   templateId: string,
 *   eventId: string,
 *   reminderLabel: string,
 *   scheduledAt: string,
 *   status: "PENDING",
 *   createdAt: string
 * }}
 */
export function buildScheduleEntry({ eventId, label, scheduledAt, nowMs }) {
  return {
    templateId:    TEMPLATE_IDS.EVENT_REMINDER,
    eventId,
    reminderLabel: label,
    scheduledAt,
    status:        "PENDING",
    createdAt:     new Date(nowMs ?? Date.now()).toISOString()
  };
}

/**
 * Build all schedule entries for an event from scratch.
 * Returns only the windows that are still in the future.
 *
 * @param {{
 *   eventId: string,
 *   startAtMs: number,
 *   nowMs?: number
 * }} params
 * @returns {ReturnType<typeof buildScheduleEntry>[]}
 */
export function buildEventReminderSchedule({ eventId, startAtMs, nowMs }) {
  const windows = computeSchedulableReminders({ startAtMs, nowMs });
  return windows.map(({ label, scheduledAt }) =>
    buildScheduleEntry({ eventId, label, scheduledAt, nowMs })
  );
}

/**
 * Map a reminder schedule entry to a notification message payload (N05.3).
 * Applies the correct template and merges event + participant variables.
 *
 * @param {{
 *   scheduleEntry: ReturnType<typeof buildScheduleEntry>,
 *   participant: {
 *     userId: string,
 *     email: string,
 *     firstName?: string
 *   },
 *   event: {
 *     title: string,
 *     startAt: string,
 *     venueName?: string
 *   },
 *   correlationId: string
 * }} params
 * @returns {{
 *   channel: "EMAIL",
 *   templateId: string,
 *   variables: object,
 *   status: "PENDING",
 *   requestedAt: string
 * }}
 */
export function buildReminderNotificationMessage({ scheduleEntry, participant, event, correlationId }) {
  return {
    channel:    "EMAIL",
    templateId: TEMPLATE_IDS.EVENT_REMINDER,
    variables: {
      recipientUserId: participant.userId,
      recipientEmail:  participant.email,
      participantName: participant.firstName || participant.email,
      eventId:         scheduleEntry.eventId,
      eventTitle:      event.title,
      eventDate:       event.startAt,
      venueName:       event.venueName ?? null,
      correlationId
    },
    status:      "PENDING",
    requestedAt: new Date().toISOString()
  };
}

/**
 * Determine whether a pending schedule entry should be cancelled,
 * based on the current event status.
 *
 * @param {{ eventStatus: string, scheduleStatus: string }} params
 * @returns {boolean}
 */
export function shouldCancelReminder({ eventStatus, scheduleStatus }) {
  if (scheduleStatus === "SENT" || scheduleStatus === "CANCELLED") return false;
  return eventStatus === "CANCELLED" || eventStatus === "DELETED";
}
