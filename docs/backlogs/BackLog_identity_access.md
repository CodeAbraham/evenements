---
title: Backlog Identity & Access
description: Backlog du domaine auth, comptes, sessions et controle d'acces.
docKind: backlog
domain: identity-access
phase: P1
owner: Mourad
status: DONE
priority: P0
tags:
  - auth
  - sessions
  - jwt
slug: identity-access
---

# BackLog Identity & Access

Ce backlog couvre le futur service d'authentification, autorisation,
roles, sessions et securite d'acces.

## Meta

- Statut global: `DONE`
- Date debut: `2026-03-07`
- Priorite produit: `P1`
- Lead: `Mourad`
- Support: `Ibrahim`

## Taches

### I01 - Specifier le modele utilisateur, role et session

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US01`, `US11`, `US12`
- Livrables:
  - modele `User`, `Role`, `Session`, `PasswordResetToken`
  - regles d'activation/desactivation
  - matrice de roles `PARTICIPANT/ORGANIZER/ADMIN`

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| I01.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | none | Modele `User`, `Role`, `Session` | Schema logique auth documente | Les champs, relations et identifiants minimaux sont definis dans la spec auth | `docs/auth-model-core` |
| I01.2 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | I01.1 | Etats de compte | Cycle de vie compte formalise | Les etats `PENDING`, `ACTIVE`, `DISABLED`, `LOCKED` et leurs transitions sont documentes | `docs/auth-account-states` |
| I01.3 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | I01.1 | Matrice roles/permissions | Roles MVP formalises | Les roles `PARTICIPANT`, `ORGANIZER`, `ADMIN` ont chacun leurs droits minimaux documentes | `docs/auth-role-matrix` |

### I02 - Implementer inscription, login, refresh et reset mot de passe

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US01`
- Livrables:
  - endpoints `register`, `login`, `refresh`, `forgot-password`, `reset-password`
  - reponses d'erreur homogenes
  - protection anti brute force

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| I02.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | I01.1 | REST `POST /auth/register`, `POST /auth/login` | Contrats request/response register/login documentes | Les payloads, erreurs `400/401/409` et metadonnees de session sont valides | `docs/auth-contract-register-login` |
| I02.2 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | I01.1 | REST `POST /auth/refresh`, `POST /auth/forgot-password`, `POST /auth/reset-password` | Contrats refresh et reset documentes | Les flux token expire, reset request et reset confirm sont decrits de bout en bout | `docs/auth-contract-refresh-reset` |
| I02.3 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | I02.1, I02.2 | Service auth + tests smoke | Endpoints MVP implementables | Les 5 endpoints sont prets a coder avec validation, erreurs homogenes et checklist de smoke tests | `feature/auth-endpoints-mvp` |

### I03 - Definir le contrat JWT / session et les middlewares Gateway

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US01`, `US13`
- Livrables:
  - format des claims
  - validation via Gateway
  - propagation du contexte utilisateur aux services

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| I03.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | I01.1 | JWT claims, TTL, session policy | Contrat JWT/session documente | Les claims minimums, la duree de vie des tokens et la politique refresh sont stabilisees | `docs/auth-jwt-contract` |
| I03.2 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | I03.1 | Middleware Gateway | Validation JWT a la Gateway specifiee | Le middleware d'auth, les reponses `401/403` et le mapping des routes publiques/privees sont definis | `feature/gateway-auth-middleware` |
| I03.3 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | I03.1, I03.2 | Headers de contexte utilisateur | Propagation du contexte auth specifiee | Les services backend savent quels headers ou claims consommer apres passage par la Gateway | `feature/auth-context-propagation` |

### I04 - Poser l'autorisation fine par ressource

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US02`, `US03`, `US11`, `US12`
- Livrables:
  - regles `own-resource` vs `admin-resource`
  - controle acces organisateur sur ses propres evenements
  - matrice des actions admin

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| I04.1 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | I01.3 | Matrice permissions par role | Regles d'autorisation MVP documentees | Chaque route MVP possede un acteur autorise et une regle d'acces explicite | `docs/auth-permissions-mvp` |
| I04.2 | DONE | P1 | Mourad | Ibrahim | Sprint 1 | I04.1, E02.2 | Routes organisateur | Regles `own-event` implementables | Un organisateur ne peut gerer que ses propres evenements selon des criteres documentes | `feature/auth-own-resource-rules` |
| I04.3 | DONE | P1 | Mourad | Ibrahim | Sprint 3 | I04.1, A02.2 | Routes admin | Regles `admin-resource` implementables | Les actions de moderation et de recherche globale exigent explicitement le role admin | `feature/auth-admin-resource-rules` |

### I05 - Journaliser les evenements de securite

- Status: `DONE`
- Priority: `P1` · Difficulty: `S` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US01`, `US13`
- Livrables:
  - audit des logins, echecs, resets, lockouts
  - correlation-id et metadata minimales

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| I05.1 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | I03.1 | Evenements d'audit auth | Schema d'audit securite documente | Les champs acteur, action, resultat, cible, date et correlation-id sont stabilises | `docs/auth-audit-schema` |
| I05.2 | DONE | P1 | Mourad | Ibrahim | Sprint 1 | I05.1, I02.3 | Login, reset, lockout | Logging securite implementable | Les actions login succes/echec, reset et verrouillage sont toutes couvertes par un evenement d'audit | `feature/auth-security-audit-events` |
| I05.3 | DONE | P1 | Mourad | Ibrahim | Sprint 3 | I05.1, A03.2 | Consultation audit admin | Traces auth consultables cote admin | Les journaux auth sont filtrables par utilisateur, action et resultat | `feature/auth-audit-query` |

### I06 - Definir la politique de secrets et de rotation

- Status: `DONE`
- Priority: `P2` · Difficulty: `S` · Impact: `M`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US01`, `US13`
- Livrables:
  - regles de rotation JWT keys / mots de passe admin
  - checklist environnement dev / preprod / prod

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| I06.1 | DONE | P2 | Mourad | Ibrahim | Sprint 0 | I03.1 | Variables d'environnement auth | Checklist env/secrets documentee | Les variables critiques et les valeurs attendues par environnement sont listees | `docs/auth-env-checklist` |
| I06.2 | DONE | P2 | Mourad | Ibrahim | Sprint 1 | I06.1 | Strategie de stockage secrets | Strategie d'isolation env definie | Les secrets JWT, credentials et URL sensibles sont ranges selon une convention stable | `feature/auth-env-separation` |
| I06.3 | DONE | P2 | Mourad | Ibrahim | Sprint 3 | I06.1 | Procedure rotation/recovery | Procedure de rotation documentee | Une rotation de secret et une reprise apres incident peuvent etre executees sans ambiguite | `docs/auth-secret-rotation` |
