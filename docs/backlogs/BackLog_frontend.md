---
title: Backlog Frontend
description: Backlog des surfaces UI, integration front/back et experience utilisateur.
docKind: backlog
domain: frontend
phase: P1-P3
owner: Ibrahim
status: PARTIAL
priority: P0
tags:
  - frontend
  - portal
  - ux
slug: frontend
---

# BackLog Frontend - Portail public, espace participant et back-offices

## Meta

- Statut global: `PARTIAL`
- Date debut: `2026-03-07`
- Priorite produit: `P1`
- Lead: `Ibrahim`
- Support: `Mourad`
- Reste principal au `2026-03-26`: `F04.2`, `F04.3`, `F06.3`, `F07.3`

## Taches

### F01 - Poser le shell du portail public

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US04`
- Livrables:
  - home publique
  - calendrier / grille catalogue
  - fiche detail evenement

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F01.1 | DONE | P0 | Ibrahim | Mourad | Sprint 0 | S0-I01 | Routing portail public | Structure du portail documentee | Les routes home, catalogue et detail evenement sont stabilisees | `docs/frontend-public-shell` |
| F01.2 | DONE | P0 | Ibrahim | Mourad | Sprint 1 | F01.1, E04.3 | Page catalogue public | Catalogue public implementable | Le portail affiche une grille ou calendrier avec etats loading/error/empty definis | `feature/frontend-public-catalog` |
| F01.3 | DONE | P0 | Ibrahim | Mourad | Sprint 1 | F01.1, E03.2 | Page detail evenement | Detail evenement implementable | La fiche detail affiche les infos publiques et un CTA clair vers inscription | `feature/frontend-event-detail` |

### F02 - Poser l'espace participant

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US01`, `US05`, `US06`, `US07`
- Livrables:
  - inscription / connexion
  - dashboard participations
  - statut d'inscription

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F02.1 | DONE | P0 | Ibrahim | Mourad | Sprint 0 | I02.1, I03.1 | Routes participant | Structure de l'espace participant documentee | Les routes login, inscription, dashboard et mes participations sont figes | `docs/frontend-participant-shell` |
| F02.2 | DONE | P0 | Ibrahim | Mourad | Sprint 1 | F02.1, I02.3 | Ecrans auth + dashboard | Parcours auth participant implementable | Un participant peut se connecter, se deconnecter et atteindre son dashboard | `feature/frontend-participant-auth` |
| F02.3 | DONE | P0 | Ibrahim | Mourad | Sprint 1 | F02.1, R05.2 | Vue statut inscription | Tableau de bord participant implementable | Les statuts `CONFIRMED`, `WAITLISTED`, `CANCELLED` sont visibles et compréhensibles | `feature/frontend-participant-status` |

### F03 - Poser le back-office organisateur

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US02`, `US03`, `US09`
- Livrables:
  - liste "Mes evenements"
  - formulaire evenement
  - vue inscrits

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F03.1 | DONE | P0 | Ibrahim | Mourad | Sprint 0 | E05.1 | Routes organisateur | Structure du back-office documentee | Les routes liste, edition evenement et inscrits sont stabilisees | `docs/frontend-organizer-shell` |
| F03.2 | DONE | P0 | Ibrahim | Mourad | Sprint 1 | F03.1, E02.2, E03.2 | Formulaire evenement | Formulaire organisateur implementable | L'organisateur peut creer et publier un evenement depuis une UI sectionnee | `feature/frontend-organizer-event-form` |
| F03.3 | DONE | P0 | Ibrahim | Mourad | Sprint 1 | F03.1, E05.2, R06.1 | Vues liste et inscrits | Listing organisateur implementable | La vue "Mes evenements" et la vue inscrits reutilisent des contrats back valides | `feature/frontend-organizer-views` |

### F04 - Garde de routes et etats auth/ACL

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US01`, `US11`, `US12`, `US13`
- Livrables:
  - guards participant / organizer / admin
  - gestion token expire
  - ecrans acces refuse

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F04.1 | DONE | P0 | Ibrahim | Mourad | Sprint 0 | I04.1 | Contrat ACL frontend | Guards et statuts auth documentes | Les roles et redirections par route sont fixes pour public, participant, organisateur et admin | `docs/frontend-acl-contract` |
| F04.2 | DONE | P0 | Ibrahim | Mourad | Sprint 1 | F04.1, I03.2 | Guard de routes | Guards frontend implementables | Une route protegee redirige correctement sur login ou "acces refuse" selon le cas | `feature/frontend-route-guards` |
| F04.3 | DONE | P0 | Ibrahim | Mourad | Sprint 1 | F04.1, I02.3 | Gestion session expiree | UX session expiree implementable | Token expire, refresh et perte de session sont geres sans etat incoherent | `feature/frontend-session-expiry` |

### F05 - Standards loading / error / empty states

- Status: `DONE`
- Priority: `P1` · Difficulty: `S` · Impact: `M`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US04`, `US07`, `US09`
- Livrables:
  - composants partages
  - toasts ou banners coherents

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F05.1 | DONE | P1 | Ibrahim | Mourad | Sprint 0 | none | Components UI partages | Catalogue des etats communs documente | Les etats loading, error, empty et success ont une convention visuelle unique | `docs/frontend-shared-states` |
| F05.2 | DONE | P1 | Ibrahim | Mourad | Sprint 1 | F05.1 | Components shared | Bibliotheque d'etats implementable | Les composants partages sont definis pour pouvoir etre reuses dans portail, participant et organisateur | `feature/frontend-shared-feedback-states` |
| F05.3 | DONE | P1 | Ibrahim | Mourad | Sprint 1 | F05.2 | Portail, participant, organisateur | Deploiement des etats communs | Les ecrans MVP utilisent tous les memes patterns de feedback utilisateur | `feature/frontend-state-rollout` |

### F06 - Telechargement des billets et artefacts proteges

- Status: `DONE`
- Priority: `P1` · Difficulty: `S` · Impact: `M`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US08`, `US09`
- Livrables:
  - preview/download de blob authentifie
  - gestion erreurs `401/403/404/502`

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F06.1 | DONE | P1 | Ibrahim | Mourad | Sprint 1 | R04.1 | Contrat download protege | UX de telechargement documentee | Le comportement preview/download et la gestion d'erreur sont figes avant implementation | `docs/frontend-protected-downloads` |
| F06.2 | DONE | P1 | Ibrahim | Mourad | Sprint 2 | F06.1, R04.2 | Helper blob auth | Telechargement blob implementable | Un artefact protege est recupere via client authentifie sans exposer le token dans l'URL | `feature/frontend-blob-download-helper` |
| F06.3 | DONE | P1 | Ibrahim | Mourad | Sprint 2 | F06.2, R05.3 | Dashboard participant, vue organisateur | UX telechargement integree | Les erreurs `401/403/404/502` sont transformees en messages lisibles | `feature/frontend-ticket-download-ux` |

### F07 - Responsive et accessibilite

- Status: `DONE`
- Priority: `P2` · Difficulty: `M` · Impact: `M`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US04`, `US07`
- Livrables:
  - parcours mobile lisible
  - navigation clavier
  - labels/erreurs accessibles

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F07.1 | DONE | P2 | Ibrahim | Mourad | Sprint 0 | F01.1, F02.1, F03.1 | Checklist responsive/a11y | Checklist MVP documentee | Les ecrans prioritaires et controles a valider sont identifies | `docs/frontend-responsive-a11y-checklist` |
| F07.2 | DONE | P2 | Ibrahim | Mourad | Sprint 1 | F07.1 | Portail et dashboard | Ajustements responsive MVP implementables | Les ecrans publics et participant restent utilisables sur mobile | `feature/frontend-responsive-mvp` |
| F07.3 | DONE | P2 | Ibrahim | Mourad | Sprint 2 | F07.1 | Formulaires et feedback | Correctifs accessibilite implementables | Labels, erreurs et navigation clavier couvrent les parcours critiques | `feature/frontend-a11y-pass` |
