# Workflow notification - Reminder rules (`N05.1`)

Ce document definit les regles de rappel evenement pour le pipeline de
notification : fenetres d'envoi, conditions d'eligibilite et exclusions.

Dependances:

- `N01.1` catalogue des templates (template `EVENT_REMINDER`)
- `N02.1` contrat des consumers async
- `E03.2` contrat de publication evenement (champ `startAt`)

## 1. Objectif

Planifier l'envoi automatique de rappels aux participants inscrits avant le
debut d'un evenement, sans doublon et avec des conditions d'exclusion claires.

## 2. Fenetres de rappel

Deux rappels sont programmes par evenement publie :

| Rappel | Delai avant `startAt` | Condition complementaire |
|---|---|---|
| R1 (avance) | 48 heures | `startAt - now >= 48h` |
| R2 (veille) | 24 heures | `startAt - now >= 24h` |

Si `startAt - now < 48h` au moment de la publication, seul R2 est programme.
Si `startAt - now < 24h`, aucun rappel n'est programme.

## 3. Eligibilite d'un participant

Un participant recoit un rappel si, au moment de l'envoi :

- Son inscription est `status = "CONFIRMED"` (pas `WAITLISTED` ni `CANCELLED`)
- L'evenement est `status = "PUBLISHED"` ou `"FULL"`
- L'evenement n'est pas `"CANCELLED"`
- Le participant n'a pas desactive les notifications (futur champ `notificationsOptOut`)

## 4. Planification

Le scheduler (`N05.2`) s'execute toutes les **5 minutes** et cherche les
rappels dont `scheduledAt <= now` et `status = "PENDING"`.

Chaque rappel planifie est une entree dans une table `NotificationSchedule` :

```json
{
  "scheduleId": "<uuid>",
  "eventId": "<uuid>",
  "templateId": "EVENT_REMINDER",
  "scheduledAt": "ISO-8601",
  "status": "PENDING | SENT | CANCELLED",
  "createdAt": "ISO-8601"
}
```

## 5. Annulation des rappels

Les rappels `PENDING` sont mis a `CANCELLED` automatiquement si :
- L'evenement passe en `status = "CANCELLED"`
- L'evenement est supprime (`deleted_at IS NOT NULL`)

Les rappels deja `SENT` ne sont pas annules — ils ont deja ete envoyes.

## 6. Variables du template `EVENT_REMINDER`

| Variable | Source | Requis |
|---|---|---|
| `participantName` | profil participant | oui |
| `eventTitle` | events.title | oui |
| `eventDate` | events.start_at | oui |
| `venueName` | events.venue_name | non (fallback: "lieu a confirmer") |
| `eventUrl` | construit par le service | non |

## 7. Deduplication

Avant chaque envoi, le scheduler verifie qu'aucun `NotificationLog` avec
`(eventId, recipientId, templateId, channel) = (x, x, "EVENT_REMINDER", "EMAIL")`
n'existe en `SENT`. Si oui : abandon silencieux, statut `NotificationSchedule` = `SENT`.

## 8. Hors scope MVP

- Rappels configurables par l'organisateur (fenetres personnalisees)
- Canal SMS pour les rappels (couvert par `N03.2` en simulation uniquement)
- Push notification mobile
- Rappels pour les evenements en `PENDING_REVIEW` (pas encore publies)
