/**
 * notificationSmsSimulator.js
 *
 * Pure SMS simulation module for transactional SMS notifications (ticket N03.2).
 * No I/O, no external provider — safe to unit-test in isolation.
 *
 * Supported SMS templateIds (defined in N03.1 contract):
 *   SMS_REGISTRATION_CONFIRMED
 *   SMS_EVENT_REMINDER
 *
 * Behaviour:
 *   - Never calls an external SMS provider
 *   - Returns a simulated log entry with status "SIMULATED"
 *   - Validates payload before simulation
 */

export const SMS_TEMPLATE_IDS = Object.freeze({
  REGISTRATION_CONFIRMED: "SMS_REGISTRATION_CONFIRMED",
  EVENT_REMINDER:         "SMS_EVENT_REMINDER"
});

const VALID_SMS_TEMPLATE_IDS = new Set(Object.values(SMS_TEMPLATE_IDS));

/**
 * Check that a templateId is a known SMS template.
 *
 * @param {string} templateId
 * @returns {boolean}
 */
export function isValidSmsTemplateId(templateId) {
  return VALID_SMS_TEMPLATE_IDS.has(templateId);
}

/**
 * Validate that all required variables are present for a given SMS templateId.
 *
 * @param {string} templateId
 * @param {object} variables
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateSmsTemplateVariables(templateId, variables) {
  const vars = variables || {};
  const missing = [];

  // Common required fields for all SMS templates
  const common = ["recipientUserId", "eventId", "eventTitle", "correlationId"];
  for (const field of common) {
    if (!vars[field]) missing.push(field);
  }

  // Template-specific required fields
  switch (templateId) {
    case SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED:
      if (!vars.participantName) missing.push("participantName");
      if (!vars.eventDate)       missing.push("eventDate");
      break;
    case SMS_TEMPLATE_IDS.EVENT_REMINDER:
      if (!vars.participantName) missing.push("participantName");
      if (!vars.eventDate)       missing.push("eventDate");
      break;
    default:
      break;
  }

  return { valid: missing.length === 0, missing };
}

/**
 * Render the SMS body text for a given templateId and variables.
 * Returns a short single-line message suitable for SMS (<=160 chars target).
 *
 * @param {string} templateId
 * @param {object} variables
 * @returns {string}
 */
export function renderSmsBody(templateId, variables) {
  const vars = variables || {};
  const name  = vars.participantName || "Participant";
  const title = vars.eventTitle      || "l'evenement";
  const date  = vars.eventDate       || "date a confirmer";
  const venue = vars.venueName       || "lieu a confirmer";

  switch (templateId) {
    case SMS_TEMPLATE_IDS.REGISTRATION_CONFIRMED:
      return `Bonjour ${name}, votre inscription a "${title}" le ${date} est confirmee.`;

    case SMS_TEMPLATE_IDS.EVENT_REMINDER:
      return `Rappel: "${title}" a lieu le ${date} - ${venue}. Bonne participation, ${name} !`;

    default:
      return `Notification concernant "${title}".`;
  }
}

/**
 * Simulate sending an SMS: validates the payload then returns a log entry
 * with status "SIMULATED" — no external call is made.
 *
 * @param {{
 *   templateId: string,
 *   recipient: { userId: string, phone: string|null },
 *   variables: object,
 *   correlationId: string,
 *   nowMs?: number
 * }} params
 * @returns {{
 *   success: boolean,
 *   logEntry?: {
 *     channel: "SMS",
 *     templateId: string,
 *     recipientUserId: string,
 *     phone: string|null,
 *     body: string,
 *     status: "SIMULATED",
 *     correlationId: string,
 *     simulatedAt: string,
 *     errorReason: null
 *   },
 *   error?: string,
 *   code?: string
 * }}
 */
export function simulateSms({ templateId, recipient, variables, correlationId, nowMs }) {
  // Validate templateId
  if (!isValidSmsTemplateId(templateId)) {
    return {
      success: false,
      error: `Unknown SMS templateId: ${templateId}`,
      code: "UNKNOWN_TEMPLATE"
    };
  }

  // Validate required variables
  const merged = { ...(variables || {}), correlationId };
  const validation = validateSmsTemplateVariables(templateId, merged);
  if (!validation.valid) {
    return {
      success: false,
      error: `Missing required variables: ${validation.missing.join(", ")}`,
      code: "MISSING_VARIABLES"
    };
  }

  const body = renderSmsBody(templateId, variables || {});
  const simulatedAt = new Date(nowMs ?? Date.now()).toISOString();

  return {
    success: true,
    logEntry: {
      channel:         "SMS",
      templateId,
      recipientUserId: recipient?.userId ?? null,
      phone:           recipient?.phone  ?? null,
      body,
      status:          "SIMULATED",
      correlationId,
      simulatedAt,
      errorReason:     null
    }
  };
}

/**
 * Build a canonical SMS notification message (for use with async pipeline).
 *
 * @param {string} templateId
 * @param {object} variables
 * @returns {{
 *   channel: "SMS",
 *   templateId: string,
 *   variables: object,
 *   status: "PENDING",
 *   requestedAt: string
 * }}
 */
export function buildSmsNotificationMessage(templateId, variables) {
  return {
    channel:     "SMS",
    templateId,
    variables:   variables || {},
    status:      "PENDING",
    requestedAt: new Date().toISOString()
  };
}
