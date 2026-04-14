# Workflow notification - SMS simulation contract (`N03.1`)

Ce document definit le contrat de simulation SMS pour le MVP.

Dependances:

- `N01.1` catalogue des templates transactionnels
- `N02.1` contrat des consumers async

## 1. Objectif

Poser le cadre du canal SMS en mode **simulation** : aucun message reel n'est
envoye. Chaque demande SMS est journalisee localement pour permettre de tester
les flux end-to-end sans fournisseur externe.

Le contrat fixe :

- les champs du payload SMS normalise
- les cas d'usage couverts (rappel, confirmation)
- le comportement attendu du simulateur
- le statut `SIMULATED` dans `NotificationLog`

## 2. Payload SMS normalise

```json
{
  "channel": "SMS",
  "recipient": {
    "userId": "<uuid>",
    "phone": "<e.164 ou null>"
  },
  "templateId": "SMS_REGISTRATION_CONFIRMED | SMS_EVENT_REMINDER",
  "variables": {
    "participantName": "string",
    "eventTitle": "string",
    "eventDate": "ISO-8601",
    "venueName": "string | null"
  },
  "correlationId": "<uuid>",
  "requestedAt": "ISO-8601"
}
```

Regles :

- `phone` peut etre `null` en simulation — le simulateur trace quand meme
- `templateId` SMS est distinct des IDs email (`SMS_*` vs `EMAIL_*`)
- `correlationId` relie le log SMS a l'evenement source

## 3. Templates SMS couverts

| templateId | Declencheur | Variables requises |
|---|---|---|
| `SMS_REGISTRATION_CONFIRMED` | `registration.confirmed` | participantName, eventTitle, eventDate |
| `SMS_EVENT_REMINDER` | rappel planifie (N05) | participantName, eventTitle, eventDate, venueName |

Les autres templates email (`WAITLISTED`, `PROMOTED`, `CANCELLED`) n'ont pas
d'equivalent SMS en MVP — ils restent EMAIL uniquement.

## 4. Comportement du simulateur

Le simulateur (`N03.2`) doit :

1. Recevoir un payload `channel: "SMS"`
2. **Ne pas appeler de fournisseur externe**
3. Ecrire un enregistrement dans `NotificationLog` avec :
   - `channel = "SMS"`
   - `status = "SIMULATED"`
   - `sentAt = now()`
   - `errorReason = null`
4. Retourner un `logId` exploitable

Aucun retry n'est effectue sur le canal SMS en simulation — un echec logique
(template inconnu, variables manquantes) produit `status = "FAILED"` directement.

## 5. Statut `SIMULATED` dans `NotificationLog`

| Statut | Signification |
|---|---|
| `PENDING` | En attente d'envoi (EMAIL) |
| `SENT` | Envoye avec succes (EMAIL) |
| `FAILED` | Echec definitif (tous canaux) |
| `SIMULATED` | Trace SMS sans envoi reel |

Le statut `SIMULATED` est final — il ne transite pas vers `SENT`.

## 6. Acces aux traces SMS

Les traces `SIMULATED` sont accessibles via le futur endpoint `N06.*` avec
le filtre `channel=SMS&status=SIMULATED`. Aucune UI dediee n'est requise en
MVP ; la table admin de logs suffit (`N06.3`).

## 7. Hors scope MVP

- Envoi SMS reel via Twilio ou autre fournisseur
- Gestion du `phone` invalide ou injoignable
- Retry automatique sur SMS
- Accusé de lecture ou statut de livraison operateur
