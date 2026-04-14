---
title: Backlog Notification
description: Backlog des emails, retries, templates et logs de notification.
docKind: backlog
domain: notification
phase: P2
owner: Mourad
status: PARTIAL
priority: P1
tags:
  - notification
  - email
  - retries
slug: notification
---

# BackLog Notification

Ce backlog couvre les notifications email, la simulation SMS, les rappels,
les retries et la journalisation des envois.

## Meta

- Statut global: `PARTIAL`
- Date debut: `2026-03-07`
- Priorite produit: `P2`
- Lead: `Mourad`
- Support: `Ibrahim`

## Taches

### N01 - Definir les templates transactionnels

- Status: `DONE`
- Priority: `P0` · Difficulty: `S` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US10`
- Livrables:
  - templates confirmation
  - attente
  - promotion
  - rappel
  - annulation

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| N01.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | R01.1, R03.1 | Catalogue de templates | Liste des templates transactionnels documentee | Chaque evenement metier critique a un template email et un set de variables associees | `docs/notification-template-catalog` |
| N01.2 | DONE | P0 | Mourad | Ibrahim | Sprint 2 | N01.1 | Templates email | Templates implementables | Les templates confirmation, attente, promotion, rappel et annulation sont redigeables sans question ouverte | `feature/notification-email-templates` |
| N01.3 | DONE | P1 | Ibrahim | Mourad | Sprint 2 | N01.1 | Copywriting et fallback UI | Regles de contenu documentees | Les templates definissent objet, corps, ton, placeholders et fallback en cas de donnees manquantes | `docs/notification-template-copy-rules` |

### N02 - Construire le pipeline asynchrone d'envoi

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US10`, `US13`
- Livrables:
  - consommation des evenements metier
  - envoi email
  - statut technique par message

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| N02.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | N01.1, E03.1, R03.1 | Events async -> notification | Contrat des consumers async documente | Les evenements sources, le mapping template et les statuts `PENDING/SENT/FAILED` sont valides | `docs/notification-consumer-contract` |
| N02.2 | DONE | P0 | Mourad | Ibrahim | Sprint 2 | N02.1 | Worker email | Pipeline d'envoi implementable | Le worker consomme les evenements attendus et cree un envoi tracable | `feature/notification-email-worker` |
| N02.3 | DONE | P0 | Mourad | Ibrahim | Sprint 2 | N02.1, N02.2 | Journal `NotificationLog` | Persistence des statuts implementable | Chaque tentative d'envoi ecrit un statut technique, une date et un motif d'erreur si applicable | `feature/notification-delivery-log` |

### N03 - Simuler le canal SMS en premiere version

- Status: `DONE`
- Priority: `P1` · Difficulty: `S` · Impact: `M`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US10`
- Livrables:
  - payload SMS normalise
  - mode simulation trace en logs / base

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| N03.1 | DONE | P1 | Mourad | Ibrahim | Sprint 2 | N01.1 | Payload SMS simule | Contrat SMS simulation documente | Les champs utiles, le canal et les cas d'usage rappels/confirmations sont definis | `docs/notification-sms-sim-contract` |
| N03.2 | DONE | P1 | Mourad | Ibrahim | Sprint 2 | N03.1 | Service notification | Simulation SMS implementable | Une demande SMS n'envoie rien au monde exterieur mais genere un log exploitable | `feature/notification-sms-simulator` |
| N03.3 | DONE | P1 | Ibrahim | Mourad | Sprint 2 | N03.2 | Lecture d'etat UI/admin | Traces SMS visibles | Le statut `SIMULATED` est affichable ou filtrable dans les vues admin prevues | `feature/notification-sms-status-ui` |

### N04 - Gerer retries, dead-letter et reprise manuelle

- Status: `PARTIAL`
- Priority: `P1` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US10`, `US13`
- Livrables:
  - politique de retry
  - gestion des echecs permanents
  - exploitation simple cote admin

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| N04.1 | DONE | P1 | Mourad | Ibrahim | Sprint 2 | N02.1 | Retry, DLQ | Politique de reprise documentee | Le nombre d'essais, le backoff et le passage en echec permanent sont definis | `docs/notification-retry-policy` |
| N04.2 | TODO | P1 | Mourad | Ibrahim | Sprint 2 | N04.1, N02.2 | Worker notification | Retry automatique implementable | Un envoi temporairement echoue est retente sans produire de doublon logique | `feature/notification-retry-worker` |
| N04.3 | TODO | P1 | Mourad | Ibrahim | Sprint 3 | N04.1, A01.2 | Outil reprise manuelle | Rejeu manuel implementable | Un admin peut relancer un message en echec permanent selon des regles documentees | `feature/notification-manual-replay` |

### N05 - Planifier les rappels evenement

- Status: `PARTIAL`
- Priority: `P1` · Difficulty: `M` · Impact: `M`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US10`
- Livrables:
  - scheduler des rappels
  - fenetres de rappel configurables

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| N05.1 | DONE | P1 | Mourad | Ibrahim | Sprint 2 | N01.1, E03.2 | Regles de rappel | Politique de rappel documentee | Les fenetres de rappel, conditions d'envoi et exclusions sont definies | `docs/notification-reminder-rules` |
| N05.2 | TODO | P1 | Mourad | Ibrahim | Sprint 2 | N05.1, N02.2 | Scheduler | Rappels programmes implementables | Les rappels sont emis pour les participants eligibles a la bonne date | `feature/notification-reminder-scheduler` |
| N05.3 | TODO | P1 | Mourad | Ibrahim | Sprint 2 | N05.2, N01.2 | Mapping template/rappel | Flux rappel complet | Chaque rappel utilise le bon template et ecrit son statut dans les logs | `feature/notification-reminder-flow` |

### N06 - Exposer les journaux d'envoi

- Status: `PARTIAL`
- Priority: `P2` · Difficulty: `S` · Impact: `M`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US10`, `US13`
- Livrables:
  - recherche des notifications par evenement ou utilisateur
  - statut `SENT/FAILED/SIMULATED`

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| N06.1 | DONE | P2 | Mourad | Ibrahim | Sprint 2 | N02.3 | REST logs notification | Contrat de consultation des logs documente | Les filtres evenement, utilisateur, canal et statut sont fixes | `docs/notification-log-query-contract` |
| N06.2 | TODO | P2 | Mourad | Ibrahim | Sprint 2 | N06.1, N02.3 | Endpoint logs notification | Journal d'envoi implementable | Les logs sont consultables avec pagination et filtres coherents | `feature/notification-log-endpoint` |
| N06.3 | TODO | P2 | Ibrahim | Mourad | Sprint 3 | N06.2, A01.2 | Console admin | Vue logs notification implementable | Un admin peut filtrer les notifications et comprendre rapidement leur etat technique | `feature/admin-notification-log-ui` |
