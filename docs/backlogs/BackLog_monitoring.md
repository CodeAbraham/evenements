---
title: Backlog Monitoring
description: Backlog observabilite, health checks, logs et readiness.
docKind: backlog
domain: monitoring
phase: P1-P5
owner: Mourad
status: PARTIAL
priority: P1
tags:
  - monitoring
  - logs
  - readiness
slug: monitoring
---

# BackLog Monitoring & Exploitation

Ce backlog couvre l'observabilite, les health checks, les traces, les
alertes et les mecanismes de reprise sur incident.

## Meta

- Statut global: `TODO`
- Date debut: `2026-03-07`
- Priorite produit: `P3/P5`
- Lead: `Mourad`
- Support: `Ibrahim`

## Taches

### M01 - Standardiser health checks et readiness probes

- Status: `DONE`
- Priority: `P0` · Difficulty: `S` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US13`
- Livrables:
  - `/health` et `/ready` par service
  - dependances critiques visibles

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M01.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | none | Contrat `/health`, `/ready` | Standard health/readiness documente | Chaque service MVP connait ses endpoints de sante et ses dependances critiquees | `docs/monitoring-health-contract` |
| M01.2 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | M01.1 | Services P1 | Endpoints de sante implementables | Les services `P1` exposent tous `/health` et `/ready` selon le meme format | `feature/monitoring-health-endpoints` |
| M01.3 | TODO | P1 | Mourad | Ibrahim | Sprint 3 | M01.2 | Gateway, admin | Vue agregee de sante | La Gateway ou la console admin peut afficher l'etat consolide des services critiques | `feature/monitoring-health-aggregation` |

### M02 - Poser correlation-id et logs structures

- Status: `DONE`
- Priority: `P0` · Difficulty: `S` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US13`
- Livrables:
  - propagation gateway -> services
  - format de log partage

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M02.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | none | Correlation-id, logs JSON | Standard de logs documente | Le format de log, les champs obligatoires et la regle correlation-id sont stabilises | `docs/monitoring-log-standard` |
| M02.2 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | M02.1, I03.3 | Gateway + services | Propagation correlation-id implementable | Le correlation-id traverse la Gateway et les services `P1` sans etre perdu | `feature/monitoring-correlation-propagation` |
| M02.3 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | M02.2 | Flux publication, inscription | Validation logs critiques | Les flux MVP peuvent etre suivis dans les logs avec un identifiant commun | `test/monitoring-log-traceability` |

### M03 - Exposer les metriques techniques et metier

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US13`
- Livrables:
  - taux inscription confirmee / waitlist
  - delais ticketing / notification
  - erreurs par service

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M03.1 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | R01.1, R04.1, N02.1 | Catalogue metriques | Liste des metriques cible documentee | Les metriques techniques et metier ont une definition et une source identifiees | `docs/monitoring-metric-catalog` |
| M03.2 | DONE | P1 | Mourad | Ibrahim | Sprint 3 | M03.1 | Services backend | Emission de metriques implementable | Les metriques prioritaires sont exposees sur les services attendus | `feature/monitoring-metrics-emission` |
| M03.3 | DONE | P1 | Ibrahim | Mourad | Sprint 3 | M03.2, A05.1 | Dashboard admin | Panels KPI/ops implementables | Les metriques critiques peuvent etre lues dans des cartes ou graphs admin | `feature/monitoring-dashboard-panels` |

### M04 - Ajouter traces distribuees sur les flux critiques

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `M`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US13`
- Livrables:
  - publication evenement
  - inscription -> ticket -> notification

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M04.1 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | M02.1 | Points de trace | Carte des traces critiques documentee | Les etapes du flux publication et inscription sont listees avec leurs spans attendus | `docs/monitoring-trace-map` |
| M04.2 | DONE | P1 | Mourad | Ibrahim | Sprint 3 | M04.1, M02.2 | Instrumentation de traces | Tracing distribue implementable | Les flux critiques produisent une chronologie cross-service exploitable | `feature/monitoring-distributed-tracing` |
| M04.3 | DONE | P1 | Mourad | Ibrahim | Sprint 3 | M04.2 | Validation traces | Jeux de validation traces | Un incident de test peut etre suivi de la Gateway jusqu'au dernier service concerne | `test/monitoring-trace-validation` |

### M05 - Definir alertes et runbooks

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `M`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US13`
- Livrables:
  - alertes erreurs notification
  - alertes generation billet
  - runbook incident de capacite

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M05.1 | DONE | P1 | Mourad | Ibrahim | Sprint 3 | M03.1, M04.1 | Matrice alertes/runbooks | Plan d'alerte documente | Les incidents critiques ont chacun un seuil, une alerte et un runbook associe | `docs/monitoring-alert-runbook-matrix` |
| M05.2 | DONE | P1 | Mourad | Ibrahim | Sprint 5 | M05.1, M03.2 | Regles d'alerte | Alertes implementables | Les alertes notification, ticketing et capacite peuvent etre declenchees automatiquement | `feature/monitoring-alert-rules` |
| M05.3 | DONE | P1 | Mourad | Ibrahim | Sprint 5 | M05.1 | Runbooks ops | Runbooks exploitables | Chaque incident critique a une procedure pas a pas lisible par l'equipe | `docs/monitoring-runbooks` |

### M06 - Tester backup et restauration

- Status: `DONE`
- Priority: `P2` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US13`
- Livrables:
  - procedure de sauvegarde
  - test de restauration
  - trace d'execution

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M06.1 | DONE | P2 | Mourad | Ibrahim | Sprint 3 | M01.1 | Strategie backup/restore | Politique de sauvegarde documentee | Les donnees critiques, periodicites et objectifs de restauration sont connus | `docs/monitoring-backup-strategy` |
| M06.2 | DONE | P2 | Mourad | Ibrahim | Sprint 5 | M06.1 | Procedure technique | Procedure de backup/restauration implementable | Une procedure pas a pas permet de sauvegarder puis restaurer l'environnement cible | `feature/monitoring-backup-restore-procedure` |
| M06.3 | DONE | P2 | Mourad | Ibrahim | Sprint 5 | M06.2 | Validation restore | Preuve de restauration | Un exercice de restauration est execute et documente avec resultat attendu | `docs/monitoring-restore-drill` |
