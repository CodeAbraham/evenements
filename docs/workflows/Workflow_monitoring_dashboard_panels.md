# Workflow monitoring - Dashboard admin panels (`M03.3`)

Ce document definit les panels KPI/ops implementables dans la console admin
pour le monitoring des services.

Dependances:

- `M03.1` baseline metriques et instrumentation
- `M03.2` alertes et runbooks
- `A05.1` catalogue KPI admin

## 1. Objectif

Permettre a un admin de lire les metriques critiques dans des cartes ou
graphiques directement dans la console web, sans outil externe.

Le dashboard MVP est **read-only** — aucune action n'est declenchee depuis
ces panels.

## 2. Panels de sante des services

### Panel : Service Health

Affiche l'etat de chaque service sous forme de badge.

| Champ | Source | Refresh |
|---|---|---|
| Nom du service | config statique | — |
| Statut (`UP` / `DOWN` / `DEGRADED`) | `GET /health` de chaque service | toutes les 30s |
| Latence moyenne (ms) | dernier interval de metrics | toutes les 60s |
| Uptime | `process.uptime()` | toutes les 60s |

Source de donnees : endpoint `GET /admin/health/aggregate` sur la Gateway
(agrege les `/health` de chaque service).

### Panel : Error Rate

Taux d'erreurs HTTP >= 500 sur une fenetre glissante de 5 minutes.

| Metric | Calcul |
|---|---|
| `errorRate5m` | `count(status >= 500) / count(all requests)` sur 5 min |
| `requestCount5m` | total requetes sur 5 min |
| `p95Latency5m` | percentile 95 de latence sur 5 min |

Seuil d'alerte : `errorRate5m > 0.01` (1%) → badge rouge dans le panel.

## 3. Panels evenements

### Panel : Event Activity

| Metrique | Definition | Fenetre |
|---|---|---|
| Nouveaux brouillons | `COUNT(events WHERE status=DRAFT AND created_at >= now-D1)` | D1 |
| Publications | `COUNT(events WHERE status=PUBLISHED AND published_at >= now-D1)` | D1 |
| Annulations | `COUNT(events WHERE status=CANCELLED AND updated_at >= now-D1)` | D1 |
| Evenements actifs | `COUNT(events WHERE status IN (PUBLISHED, FULL))` | temps reel |

### Panel : Moderation Queue

Visible uniquement si `MODERATION_ENABLED=true`.

| Metrique | Definition |
|---|---|
| En attente de review | `COUNT(events WHERE status=PENDING_REVIEW)` |
| Demandes de correction | `COUNT(events WHERE status=CHANGES_REQUESTED)` |
| Age median (heures) | `MEDIAN(now - created_at) WHERE status=PENDING_REVIEW` |

## 4. Panels inscriptions

### Panel : Registration Activity

| Metrique | Definition | Fenetre |
|---|---|---|
| Nouvelles inscriptions | `COUNT(registrations WHERE created_at >= now-D1)` | D1 |
| Confirmees | `COUNT(registrations WHERE status=CONFIRMED AND updated_at >= now-D1)` | D1 |
| En liste attente | `COUNT(registrations WHERE status=WAITLISTED)` | temps reel |
| Taux de remplissage | `AVG(confirmed / capacity) WHERE events.status=PUBLISHED` | temps reel |

## 5. Panels notifications

### Panel : Notification Pipeline

| Metrique | Definition | Fenetre |
|---|---|---|
| Envoyes | `COUNT(NotificationLog WHERE status=SENT AND sentAt >= now-D1)` | D1 |
| Echecs | `COUNT(NotificationLog WHERE status=FAILED AND updatedAt >= now-D1)` | D1 |
| Echecs permanents | `COUNT(NotificationLog WHERE status=FAILED_PERMANENT)` | total |
| SMS simules | `COUNT(NotificationLog WHERE status=SIMULATED AND sentAt >= now-D1)` | D1 |

## 6. Implementation technique

### 6.1 Endpoint de donnees

```
GET /admin/dashboard/metrics
Authorization: Bearer <admin-token>
```

Reponse :
```json
{
  "success": true,
  "data": {
    "refreshedAt": "ISO-8601",
    "services": { ... },
    "events": { ... },
    "registrations": { ... },
    "notifications": { ... }
  }
}
```

### 6.2 Strategie de polling UI

- Les panels de sante : poll toutes les 30 secondes
- Les panels metier (events, registrations) : poll toutes les 60 secondes
- En cas d'erreur de l'endpoint : afficher le timestamp du dernier succes

### 6.3 Composants UI (frontend)

Chaque panel est un composant `<MetricCard>` avec :
- Titre, valeur principale, unite, variation D1 (fleche haut/bas)
- Indicateur de staleness si le dernier refresh > 2 min

## 7. Hors scope MVP

- Graphiques historiques (courbes sur D7/D30)
- Export des metriques en CSV
- Alertes push depuis le dashboard
- Dashboard configurable par l'admin
