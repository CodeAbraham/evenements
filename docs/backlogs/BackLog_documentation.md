---
title: Backlog Documentation
description: Backlog de gouvernance documentaire, diagrammes, matrices et plans de test.
docKind: backlog
domain: documentation
phase: P0-P1
owner: Mourad
status: DONE
priority: P1
tags:
  - documentation
  - diagrams
  - governance
slug: documentation
---

# BackLog Documentation

Ce backlog suit les travaux transverses de documentation et de gouvernance
du projet evenements.

## Meta

- Statut global: `DONE`
- Date debut: `2026-03-07`
- Derniere mise a jour: `2026-03-11`
- Lead: `Mourad`
- Reviewer: `Ibrahim`

## Taches

### D01 - Structurer le dossier `docs/` sur le modele du projet source

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `none`
- Notes:
  - README, index, quick start, planning, sprints, backlogs, releases,
    workflows et templates ajoutes.

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D01.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | none | Arborescence `docs/` | Structure documentaire creee | Les dossiers et fichiers de base existent et sont navigables | `docs/bootstrap-docs-structure` |
| D01.2 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | D01.1 | Guides d'entree | README, index et quick start rediges | Un nouveau lecteur peut se reperer dans la documentation sans aide externe | `docs/bootstrap-docs-entrypoints` |
| D01.3 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | D01.1 | Workflows et templates | Gabarits transverses disponibles | Les workflows et templates couvrent deja les besoins de cadrage MVP | `docs/bootstrap-docs-workflows` |

### D02 - Adapter le contenu au domaine evenement

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `none`
- Notes:
  - perimetre P1 -> P4 formalise a partir du PDF.
  - backlog et user stories recrees autour des domaines evenements.

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D02.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | D01.1 | `mvp_scope.md` | Scope projet aligne au PDF | Le decoupage `P1` a `P4` est coherent avec le cahier des charges | `docs/align-mvp-scope` |
| D02.2 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | D01.1 | Backlogs et user stories | Backlogs initiaux crees | Les domaines principaux ont chacun un backlog et les user stories existent | `docs/align-backlogs-user-stories` |
| D02.3 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | D01.1 | Planning equipe | Roadmap et repartition equipe ajoutees | Le planning et la repartition Mourad/Ibrahim sont explicites | `docs/align-roadmap-team-split` |

### D03 - Completer les diagrammes d'architecture et de flux

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `H`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US03`, `US05`, `US06`
- Livrables:
  - macro architecture
  - flux publication
  - flux inscription / waitlist / notification
- Notes:
  - sources Mermaid `Sprint 0` creees dans `docs/diagrams/`.

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D03.1 | DONE | P1 | Ibrahim | Mourad | Sprint 0 | S0-I03 | `docs/diagrams/` | Diagramme macro d'architecture | Les services, flux sync/async et composants transverses sont visibles | `docs/diagram-architecture-global` |
| D03.2 | DONE | P1 | Ibrahim | Mourad | Sprint 0 | E03.1 | `docs/diagrams/` | Diagramme publication evenement | Le flux organisateur -> Event Management -> Catalog est documente | `docs/diagram-event-publication` |
| D03.3 | DONE | P1 | Ibrahim | Mourad | Sprint 0 | R03.1, N02.1 | `docs/diagrams/` | Diagramme inscription/waitlist/notification | Le flux participant -> Registration -> Ticketing/Notification est explicite | `docs/diagram-registration-waitlist` |

### D04 - Produire un dictionnaire de donnees et des contrats API

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US01`, `US02`, `US03`, `US05`, `US06`
- Livrables:
  - schema logique par service
  - endpoints REST et evenements asynchrones

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D04.1 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | I01.1, E01.1, R01.1 | Dictionnaire de donnees | Dictionnaire P1 documente | Les entites clefs auth, event et registration ont leur schema logique minimal | `docs/data-dictionary-p1` |
| D04.2 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | I02.1, E02.1, R01.1 | REST P1 | Catalogue REST MVP documente | Les endpoints `P1` ont methode, route, payload et erreurs principales | `docs/api-contracts-p1` |
| D04.3 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | E03.1, R03.1, N02.1 | Events async P1 | Catalogue d'evenements documente | Les producteurs, consommateurs et payloads minimaux des events critiques sont listes | `docs/async-events-p1` |

### D05 - Rediger le plan de tests et les criteres de recette detailles

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US01`, `US03`, `US05`, `US06`, `US10`, `US13`
- Livrables:
  - scenarios de recette P1/P2/P3/P4
  - smoke checks et non-regressions
- Notes:
  - matrice d'acceptation et plan ACL ajoutes pour fermer le lot
    documentaire de tests.

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D05.1 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | docs/user_stories/user_stories_table.md | Recette produit | Matrice de recette par phase documentee | Chaque phase `P1` a `P4` a des criteres de recette relies aux user stories | `docs/test-plan-acceptance-matrix` |
| D05.2 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | D04.2 | Smoke backend | Checklist smoke MVP documentee | Les endpoints critiques auth, event, catalog et registration ont un scenario smoke clair | `docs/test-plan-smoke-mvp` |
| D05.3 | DONE | P1 | Mourad | Ibrahim | Sprint 1 | F04.1, A03.1 | ACL et non-regression | Scenarios de non-regression roles documentes | Les cas `401`, `403` et succes par role sont listes pour les parcours critiques | `docs/test-plan-role-regression` |

### D06 - Maintenir releases et task history au fil du delivery

- Status: `DONE`
- Priority: `P2` · Difficulty: `S` · Impact: `M`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `none`
- Notes:
  - activer le suivi `releases/` et `deployments/` uniquement quand une
    version deployable existera.

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D06.1 | DONE | P2 | Mourad | Ibrahim | Sprint 0 | docs/task_history.md | Historique livrables | Routine `task_history` documentee | Les mises a jour majeures du cadrage ou du code ont une place claire dans l'historique | `docs/task-history-routine` |
| D06.2 | DONE | P2 | Mourad | Ibrahim | Sprint 0 | docs/README.md | Activation releases/deployments | Regle d'activation deja formalisee | La doc explique clairement quand activer `releases/` et `deployments/` | `docs/release-activation-rule` |
| D06.3 | DONE | P2 | Mourad | Ibrahim | Sprint 1 | docs/planning/team_work_split.md | Gouvernance documentaire | Rituel de revue doc defini | L'equipe a une regle simple de revue et mise a jour documentaire a chaque sprint | `docs/documentation-review-cadence` |
