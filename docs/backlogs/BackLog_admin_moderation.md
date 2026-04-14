---
title: Backlog Admin & Moderation
description: Backlog moderation, audit, supervision et recherche transverse.
docKind: backlog
domain: admin-moderation
phase: P3
owner: Ibrahim
status: DONE
priority: P1
tags:
  - admin
  - moderation
  - audit
slug: admin-moderation
---

# BackLog Admin & Moderation

Ce backlog couvre la console d'administration, la moderation des
evenements, l'audit et les indicateurs de pilotage.

## Meta

- Statut global: `DONE`
- Date debut: `2026-03-07`
- Priorite produit: `P3`
- Leads: `Mourad (backend/audit)` + `Ibrahim (console/UI)`

## Taches

### A01 - Construire le shell de console admin

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US11`, `US12`, `US13`
- Livrables:
  - navigation admin
  - guards de role `ADMIN`
  - dashboard vide structure

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A01.1 | DONE | P0 | Ibrahim | Mourad | Sprint 0 | F04.1 | Routes console admin | Shell admin documente | Les routes moderation, audit, KPI et incident sont stabilisees | `docs/admin-shell-routes` |
| A01.2 | DONE | P0 | Ibrahim | Mourad | Sprint 3 | A01.1 | Console admin | Shell admin implementable | L'admin dispose d'un layout, d'une navigation et d'etats standards reutilisables | `feature/admin-shell-ui` |
| A01.3 | DONE | P0 | Ibrahim | Mourad | Sprint 3 | A01.1, F04.2 | Guard admin | Guard de role admin implementable | Un non-admin ne peut pas ouvrir les ecrans admin et recoit un message explicite | `feature/admin-route-guards` |

### A02 - Mettre en place la file de moderation evenement

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US11`
- Livrables:
  - liste evenements a valider / signales
  - action `approve/reject/request-changes`
  - motif et audit associes

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A02.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | E06.3 | Modele `ModerationCase` | Contrat de moderation documente | Les etats, actions et motifs de moderation sont stabilises | `docs/admin-moderation-contract` |
| A02.2 | DONE | P0 | Mourad | Ibrahim | Sprint 3 | A02.1 | Backend moderation | File de moderation implementable | Les admins peuvent lister les cas et executer `approve`, `reject`, `request-changes` | `feature/admin-moderation-backend` |
| A02.3 | DONE | P0 | Ibrahim | Mourad | Sprint 3 | A02.1, A02.2 | UI moderation | Vue moderation implementable | Les actions admin affichent le bon etat, le motif et le resultat de moderation | `feature/admin-moderation-ui` |

### A03 - Exposer l'audit des actions sensibles

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US11`, `US13`
- Livrables:
  - recherche par acteur, action, cible, date
  - logs publication, annulation, moderation, notification

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A03.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | I05.1 | Schema audit transverse | Contrat d'audit admin documente | Les filtres et champs obligatoires d'audit sont stabilises | `docs/admin-audit-contract` |
| A03.2 | DONE | P0 | Mourad | Ibrahim | Sprint 3 | A03.1, I05.2, E06.2, N06.2 | Audit storage/query | Capture d'audit implementable | Les actions critiques sur evenement, inscription et notification ecrivent toutes une trace consultable | `feature/admin-audit-backend` |
| A03.3 | DONE | P0 | Ibrahim | Mourad | Sprint 3 | A03.2, A01.2 | UI audit | Vue de recherche audit implementable | Un admin peut filtrer par acteur, action, cible et date avec pagination | `feature/admin-audit-ui` |

### A04 - Recherche multicriteres utilisateurs et evenements

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `M`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US12`
- Livrables:
  - recherche texte + filtres
  - navigation vers fiche cible

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A04.1 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | A01.1 | Contrat recherche globale | Contrat search admin documente | Les criteres de recherche utilisateur/evenement et le format de resultat sont figes | `docs/admin-global-search-contract` |
| A04.2 | DONE | P1 | Mourad | Ibrahim | Sprint 3 | A04.1 | Backend search | Recherche multicriteres implementable | Les recherches sur evenements et utilisateurs renvoient des resultats navigables avec filtres | `feature/admin-global-search-backend` |
| A04.3 | DONE | P1 | Ibrahim | Mourad | Sprint 3 | A04.2, A01.2 | UI search | Recherche admin integree | Un admin peut ouvrir une fiche cible depuis la liste de resultats | `feature/admin-global-search-ui` |

### A05 - Definir les KPI de pilotage

- Status: `DONE`
- Priority: `P1` · Difficulty: `S` · Impact: `M`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US13`
- Livrables:
  - evenements publies
  - taux de remplissage
  - attente / promotions
  - notifications en echec

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A05.1 | DONE | P1 | Ibrahim | Mourad | Sprint 0 | A01.1, M03.1 | Catalogue KPI | Liste des KPI admin documentee | Les KPI MVP ont une definition fonctionnelle, une source et une periodicite connues | `docs/admin-kpi-catalog` |
| A05.2 | DONE | P1 | Mourad | Ibrahim | Sprint 3 | A05.1, M03.2 | Backend KPI | Agregations KPI implementables | Les KPI retenus sont exposes via une API ou vue de lecture stable | `feature/admin-kpi-backend` |
| A05.3 | DONE | P1 | Ibrahim | Mourad | Sprint 3 | A05.2, A01.2 | Dashboard admin | KPI cards implementables | Les cartes KPI affichent correctement les valeurs et leurs etats de chargement/erreur | `feature/admin-kpi-dashboard` |

### A06 - Vue incident bout en bout

- Status: `DONE`
- Priority: `P2` · Difficulty: `M` · Impact: `M`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US13`
- Livrables:
  - correlation-id
  - chronologie inter-services
  - support a l'investigation

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A06.1 | DONE | P2 | Mourad | Ibrahim | Sprint 0 | M02.1 | Contrat incident trace | Format de chronologie d'incident documente | Les liens entre correlation-id, audit et logs techniques sont explicites | `docs/admin-incident-trace-contract` |
| A06.2 | DONE | P2 | Mourad | Ibrahim | Sprint 3 | A06.1, M04.2 | Backend incident trace | Chronologie incident implementable | Un admin peut retrouver les etapes d'un incident sur un flux critique | `feature/admin-incident-trace-backend` |
| A06.3 | DONE | P2 | Ibrahim | Mourad | Sprint 3 | A06.2, A01.2 | UI incident | Vue incident implementable | La vue affiche l'ordre des evenements et les principaux statuts inter-services | `feature/admin-incident-trace-ui` |

