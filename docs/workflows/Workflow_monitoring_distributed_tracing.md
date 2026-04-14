# Workflow monitoring - Distributed tracing instrumentation (`M04.2`)

Ce document definit comment instrumenter les traces distribuees dans les
services du projet Evenements, en s'appuyant sur la carte des spans (`M04.1`).

Dependances:

- `M04.1` carte des spans et convention de nommage
- `M02.1` standard de logs / correlation-id
- `M02.2` propagation correlation-id Gateway → services

## 1. Objectif

Rendre les flux critiques (publication, inscription) tracables de la Gateway
jusqu'au dernier service, de sorte qu'un incident puisse etre diagnostique
via une chronologie cross-service exploitable.

## 2. Approche MVP : correlation-id seul

En MVP, le tracing distribue est **base sur le `correlationId`** propague
via header HTTP `x-correlation-id`. Pas d'OpenTelemetry ni de Jaeger requis
avant Sprint 6.

Chaque service :
1. Lit `x-correlation-id` en entree (genere un UUID si absent)
2. Loge chaque operation avec `correlationId` dans le payload JSON
3. Propage `x-correlation-id` dans tous les appels HTTP sortants
4. Inclut `correlationId` dans les evenements metier emis

## 3. Points d'instrumentation par service

### 3.1 api-gateway

| Point | Action | Log fields |
|---|---|---|
| Reception requete | Log `gateway.request.received` | method, path, correlationId, userId |
| Verification JWT | Log `gateway.auth.verify` + duree | correlationId, userId, role, valid |
| Proxy upstream | Log `gateway.proxy.forward` | correlationId, targetService, targetPath |
| Reponse envoyee | Log `gateway.request.completed` | correlationId, status, durationMs |

### 3.2 event-management-service

| Point | Action | Log fields |
|---|---|---|
| Publication draft | Log `event-management.draft.publish` | correlationId, eventId, organizerId |
| Appel registration-service | Log `event-management.registration.notify` | correlationId, eventId |
| Upload media | Log `event-management.media.upload` | correlationId, eventId, mimeType, sizeBytes |
| Erreur DB | Log `event-management.db.error` | correlationId, operation, error |

### 3.3 registration-service

| Point | Action | Log fields |
|---|---|---|
| Reservation siege | Log `registration.seat.reserve` | correlationId, eventId, userId, attempt |
| Confirmation inscription | Log `registration.confirmed` | correlationId, registrationId |
| Passage en attente | Log `registration.waitlisted` | correlationId, registrationId |
| Emission ticket | Log `registration.ticket.emit` | correlationId, ticketId |

### 3.4 identity-access-service

| Point | Action | Log fields |
|---|---|---|
| Login | Log `identity.login.attempt` + `identity.login.success/failure` | correlationId, userId, ip |
| Refresh token | Log `identity.token.refresh` | correlationId, userId |
| Audit auth | Log `identity.audit.write` | correlationId, action, userId |

## 4. Format de log de span

Chaque span est un log JSON conforme au standard `M02.1` :

```json
{
  "timestamp": "ISO-8601",
  "level": "info",
  "service": "event-management-service",
  "event": "event-management.draft.publish",
  "correlationId": "uuid",
  "durationMs": 42,
  "eventId": "uuid",
  "organizerId": "uuid",
  "success": true
}
```

Champs obligatoires : `timestamp`, `level`, `service`, `event`, `correlationId`.
`durationMs` obligatoire pour les operations DB et appels HTTP sortants.

## 5. Propagation du correlationId

```
Client
  → api-gateway          [genere correlationId si absent]
    → x-correlation-id header
      → event-management-service
        → x-correlation-id header
          → registration-service
```

Implementation : middleware `createCorrelationIdMiddleware()` dans `shared/observability.js`
deja deploye sur `event-management-service`. A repliquer sur `registration-service`
et `identity-access-service`.

## 6. Validation d'une trace complete

Pour valider qu'un flux est traçable end-to-end :

1. Effectuer une publication (`POST /events/drafts/:id/publish`)
2. Relever le `correlationId` dans la reponse ou les logs gateway
3. Rechercher ce `correlationId` dans les logs de tous les services :
   ```bash
   grep "correlationId" logs/*.json | grep "<uuid>"
   ```
4. Verifier la presence des spans attendus (§3.1 et §3.2)

Si un span est absent : le middleware de ce service ne propage pas le header.

## 7. Mise en oeuvre progressive

| Sprint | Objectif |
|---|---|
| Sprint 3 (maintenant) | Instrumentation api-gateway + event-management-service |
| Sprint 4 | Replication sur registration-service + identity |
| Sprint 6 | Migration OpenTelemetry + Jaeger (hors scope MVP) |

## 8. Hors scope MVP

- OpenTelemetry SDK (spans, traces, context propagation W3C)
- Jaeger / Tempo / Zipkin
- Sampling des traces
- Alertes sur latence de span
