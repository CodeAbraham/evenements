# Workflow notification - Log query contract (`N06.1`)

Ce document fixe les filtres, la pagination et le format de reponse pour
la consultation des journaux de notification.

Dependances:

- `N02.3` journal `NotificationLog`
- `N03.1` contrat SMS simulation (statut `SIMULATED`)

## 1. Objectif

Permettre a un admin (et potentiellement a un organisateur) de consulter
les logs de notification avec des filtres coherents et une pagination stable.

## 2. Endpoint

```
GET /notifications/logs
```

Acces : `role = ADMIN` uniquement en MVP.

## 3. Parametres de requete

| Parametre | Type | Description | Exemple |
|---|---|---|---|
| `eventId` | uuid | Filtre par evenement | `?eventId=abc` |
| `userId` | uuid | Filtre par destinataire | `?userId=xyz` |
| `channel` | enum | `EMAIL` ou `SMS` | `?channel=EMAIL` |
| `status` | enum | `PENDING`, `SENT`, `FAILED`, `FAILED_PERMANENT`, `SIMULATED` | `?status=FAILED` |
| `from` | ISO-8601 | Date d'envoi >= | `?from=2026-01-01T00:00:00Z` |
| `to` | ISO-8601 | Date d'envoi <= | `?to=2026-12-31T23:59:59Z` |
| `page` | int >= 1 | Page courante | `?page=1` |
| `pageSize` | int 1-100 | Taille de page | `?pageSize=20` |

Tous les parametres sont optionnels sauf `page` et `pageSize`.

## 4. Reponse

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "logId": "uuid",
        "eventId": "uuid | null",
        "recipientId": "uuid",
        "channel": "EMAIL | SMS",
        "templateId": "string",
        "status": "PENDING | SENT | FAILED | FAILED_PERMANENT | SIMULATED",
        "attempts": 1,
        "errorReason": "string | null",
        "sentAt": "ISO-8601 | null",
        "createdAt": "ISO-8601",
        "updatedAt": "ISO-8601"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 42
  }
}
```

Tri par defaut : `createdAt DESC`.

## 5. Codes d'erreur

| Code HTTP | Code metier | Cas |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Parametre invalide (page < 1, channel inconnu, date malformee) |
| 401 | `UNAUTHORIZED` | Token manquant ou invalide |
| 403 | `FORBIDDEN` | Role insuffisant (non-ADMIN) |

## 6. Contraintes d'implementation

- Les logs sont en lecture seule via cet endpoint
- `pageSize` max = 100 ; au-dela, reponse 400
- `from` / `to` filtrent sur `createdAt` (date de creation du log)
- Les filtres sont combines en `AND`

## 7. Hors scope MVP

- Filtrage par `templateId`
- Export CSV des logs
- Acces par un organisateur a ses propres logs
- Tri configurable par l'appelant
