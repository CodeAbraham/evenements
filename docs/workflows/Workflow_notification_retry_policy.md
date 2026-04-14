# Workflow notification - Retry policy (`N04.1`)

Ce document definit la politique de retry, dead-letter et reprise manuelle
pour le pipeline de notification.

Dependances:

- `N02.1` contrat des consumers async
- `N02.2` worker email
- `N02.3` journal `NotificationLog`

## 1. Objectif

Garantir qu'un envoi temporairement echoue est retente sans produire de doublon,
et qu'un echec definitif est clairement identifiable et rejouable manuellement.

## 2. Politique de retry automatique

### 2.1 Parametres

| Parametre | Valeur MVP |
|---|---|
| Nombre max de tentatives | 3 |
| Backoff | exponentiel : 30s, 5min, 30min |
| Condition de retry | `status = "FAILED"` + `attempts < maxAttempts` |
| Condition d'echec definitif | `attempts >= maxAttempts` |

### 2.2 Calcul du `nextRetryAt`

```
tentative 1 → now + 30s
tentative 2 → now + 5min
tentative 3 → now + 30min
apres 3 echecs → status = "FAILED_PERMANENT", nextRetryAt = null
```

### 2.3 Eviter les doublons

Avant chaque tentative, le worker verifie que le message n'a pas deja le
statut `SENT` ou `SIMULATED`. Si oui : abandon silencieux, pas de nouvel envoi.

La cle de deduplication est `(correlationId, templateId, recipientId, channel)`.

## 3. Dead-letter (echec definitif)

Un message passe en `FAILED_PERMANENT` quand :

- `attempts >= 3` ET dernier envoi echoue, **ou**
- Erreur non-recouvrable (template inconnu, destinataire invalide)

Champs mis a jour dans `NotificationLog` :

```json
{
  "status": "FAILED_PERMANENT",
  "attempts": 3,
  "errorReason": "<message d'erreur dernier echec>",
  "nextRetryAt": null,
  "updatedAt": "<now>"
}
```

Les messages `FAILED_PERMANENT` ne sont **jamais** retraites automatiquement.

## 4. Reprise manuelle (admin)

### 4.1 Eligibilite

Un admin peut rejouer un message si :
- `status = "FAILED_PERMANENT"`
- Le destinataire est toujours actif
- L'evenement source n'est pas annule

### 4.2 Action

L'admin declenche un rejeu via l'outil `N04.3` (Sprint 3). Le rejeu :

1. Cree une **nouvelle entree** dans `NotificationLog` (pas de modification de l'ancienne)
2. Repart de `attempts = 0`
3. La nouvelle entree porte un `parentLogId` referencant l'entree `FAILED_PERMANENT`

### 4.3 Audit trail

Chaque rejeu manuel est trace avec :
- `triggeredBy = "admin"`
- `adminUserId = <uuid>`
- `replayOf = <logId original>`

## 5. Schema `NotificationLog` (champs retry)

| Champ | Type | Description |
|---|---|---|
| `attempts` | int | Nombre de tentatives effectuees |
| `maxAttempts` | int | Seuil de passage en FAILED_PERMANENT |
| `nextRetryAt` | ISO-8601 \| null | Date de prochaine tentative |
| `errorReason` | string \| null | Dernier message d'erreur |
| `parentLogId` | uuid \| null | Ref vers entree rejouee |
| `triggeredBy` | "system" \| "admin" | Origine de l'envoi |

## 6. Hors scope MVP

- Retry sur SMS simule (canal SMS = toujours SIMULATED, pas de retry)
- Interface UI de rejeu (reportee Sprint 3 via `N04.3`)
- Alertes automatiques sur accumulation de FAILED_PERMANENT
