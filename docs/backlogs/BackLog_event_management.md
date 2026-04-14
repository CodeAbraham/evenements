---
title: Backlog Event Management
description: Backlog du domaine creation, publication et gestion du cycle de vie evenement.
docKind: backlog
domain: event-management
phase: P1
owner: Mourad
status: DONE
priority: P0
tags:
  - events
  - drafts
  - publish
slug: event-management
---

# BackLog Event Management

Ce backlog couvre la creation, l'edition, la publication et le cycle de
vie des evenements par les organisateurs.

## Meta

- Statut global: `DONE`
- Date debut: `2026-03-07`
- Priorite produit: `P1`
- Lead: `Mourad`
- Support: `Ibrahim`
- Reste principal au `2026-04-12`: aucun item ouvert

## Taches

### E01 - Definir le modele evenement

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US02`, `US03`, `US15`
- Livrables:
  - entite `Event`
  - statuts `DRAFT/PUBLISHED/FULL/CLOSED/ARCHIVED/CANCELLED`
  - themes, lieu, visibilite, tarification, capacite, consignes

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E01.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | none | Modele `Event` | Schema logique evenement documente | Les attributs obligatoires et optionnels d'un evenement sont stabilises | `docs/event-model-core` |
| E01.2 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | E01.1 | Etats `Event` | Machine d'etat evenement documentee | Les transitions `DRAFT`, `PUBLISHED`, `FULL`, `CLOSED`, `ARCHIVED`, `CANCELLED` sont explicites | `docs/event-status-machine` |
| E01.3 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | E01.1 | Visibilite, tarification, eligibilite | Regles metier de visibilite et d'acces formalisees | Les cas public, prive, gratuit, payant et eligibilite speciale sont documentes | `docs/event-visibility-pricing-rules` |

### E02 - Creer le CRUD organisateur sur brouillons

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US02`
- Livrables:
  - create/update/delete draft
  - validation des champs obligatoires
  - gestion des dates et capacites

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E02.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | E01.1 | REST create/update/list drafts | Contrats CRUD brouillon documentes | Les payloads create/update/list et les erreurs de validation sont figes | `docs/event-draft-crud-contract` |
| E02.2 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | E02.1 | Service Event Management | CRUD brouillon implementable | La creation, mise a jour et consultation des brouillons sont prêtes a coder | `feature/event-draft-crud` |
| E02.3 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | E02.2 | Validation dates/capacite | Regles de validation et smoke tests | Les cas date invalide, capacite incoherente et champ manquant sont couverts | `feature/event-draft-validation` |

### E03 - Gerer publication immediate et differee

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US03`
- Livrables:
  - transition `DRAFT -> PUBLISHED`
  - planification de publication
  - emission d'un evenement `event.published`

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E03.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | E01.2 | REST publish, event `event.published` | Contrat de publication documente | Les cas publication immediate et differee ont un payload et des erreurs explicites | `docs/event-publication-contract` |
| E03.2 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | E03.1, E02.2 | Publication immediate | Publication immediate implementable | Un brouillon valide passe a `PUBLISHED` et emet `event.published` | `feature/event-publish-now` |
| E03.3 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | E03.1 | Planification differee | Publication differee implementable | Une date future de publication est acceptee et le mecanisme declenche la transition au bon moment | `feature/event-scheduled-publish` |

### E04 - Isoler la gestion media evenement

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `M`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US02`, `US04`
- Livrables:
  - upload image/asset
  - validation type/poids
  - URL ou reference d'acces pour le catalogue

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E04.1 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | E01.1 | Modele `MediaAsset`, regles upload | Contrat media evenement documente | Les formats acceptes, limites de poids et references media sont stabilises | `docs/event-media-contract` |
| E04.2 | DONE | P1 | Mourad | Ibrahim | Sprint 1 | E04.1 | Upload image/asset | Upload evenement implementable | L'organisateur peut attacher une image selon des regles de validation connues | `feature/event-media-upload` |
| E04.3 | DONE | P1 | Mourad | Ibrahim | Sprint 1 | E04.1, F01.2 | Catalogue public | References media exposees pour le portail | Le catalogue sait afficher une image evenement sans acceder a des donnees privees | `feature/event-media-catalog-link` |

### E05 - Outiller la vue "Mes evenements" organisateur

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `M`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US02`, `US03`, `US09`
- Livrables:
  - listing des evenements
  - filtres par statut/date/theme
  - compteurs brouillons/publies/complets

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E05.1 | DONE | P1 | Ibrahim | Mourad | Sprint 0 | E01.2 | Reponse liste organisateur | Contrat de listing organisateur documente | Les colonnes, filtres et compteurs de la vue "Mes evenements" sont figes | `docs/organizer-events-list-contract` |
| E05.2 | DONE | P1 | Mourad | Ibrahim | Sprint 1 | E05.1, E02.2 | REST list organizer events | Backend listing implementable | Les evenements sont filtrables par statut, date et theme avec pagination | `feature/organizer-events-list-api` |
| E05.3 | DONE | P1 | Ibrahim | Mourad | Sprint 1 | E05.1, F03.1 | Back-office organisateur | Vue "Mes evenements" implementable | Les compteurs et filtres affichent uniquement les evenements de l'organisateur courant | `feature/organizer-events-list-ui` |

### E06 - Integrer les hooks de moderation et d'annulation

- Status: `DONE`
- Priority: `P2` · Difficulty: `M` · Impact: `M`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US03`, `US11`
- Livrables:
  - evenement soumis a validation admin si besoin
  - annulation propre avec impact catalogue/inscriptions/notifications

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E06.1 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | E03.1 | REST cancel event, event `event.cancelled` | Contrat d'annulation documente | Les effets sur catalogue, inscriptions et notifications sont explicitement notes | `docs/event-cancel-contract` |
| E06.2 | DONE | P1 | Mourad | Ibrahim | Sprint 1 | E06.1, R03.2 | Flux annulation evenement | Annulation evenement implementable | Un evenement annule met a jour son statut et emet les evenements derives attendus | `feature/event-cancel-flow` |
| E06.3 | DONE | P2 | Mourad | Ibrahim | Sprint 3 | E06.1, A02.1 | Hooks moderation | Passage a validation admin documente | Les cas "publication soumise a moderation" et "demande de correction" sont specifies | `docs/event-moderation-hooks` |
