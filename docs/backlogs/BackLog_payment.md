---
title: Backlog Payment
description: Backlog monetisation, transactions, providers et webhooks.
docKind: backlog
domain: payment
phase: P4
owner: Mourad
status: DONE
priority: P2
tags:
  - payment
  - webhooks
  - transactions
slug: payment
---

# BackLog Payment

Ce backlog couvre le lot optionnel de monetisation pour les evenements
payants.

## Meta

- Statut global: `DONE`
- Date debut: `2026-03-07`
- Priorite produit: `P4`
- Lead: `Mourad`
- Support: `Ibrahim`

## Taches

### P01 - Fixer le perimetre paiement du projet

- Status: `DONE`
- Priority: `P0` · Difficulty: `S` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US14`
- Livrables:
  - choix du provider ou abstraction maison
  - flux accepte: paiement simple, remboursement, annulation

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01.1 | DONE | P0 | Mourad | Ibrahim | Sprint 4 | none | Provider, flux paiement | Cadrage provider documente | Les options provider et le perimetre fonctionnel retenu sont explicites | `docs/payment-provider-scope` |
| P01.2 | DONE | P0 | Mourad | Ibrahim | Sprint 4 | P01.1 | Politique remboursement/annulation | Regles business paiement definies | Les cas paiement simple, annulation et remboursement sont arbitres sans ambiguite | `docs/payment-business-rules` |
| P01.3 | DONE | P1 | Mourad | Ibrahim | Sprint 4 | P01.1 | Non-goals paiement | Hors scope paiement documente | Les scenarios exclus du premier lot paiement sont notes pour eviter le creep | `docs/payment-non-goals` |

### P02 - Definir le contrat checkout / webhook

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US14`
- Livrables:
  - creation session de paiement
  - callback / webhook
  - verification signature provider

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P02.1 | DONE | P0 | Mourad | Ibrahim | Sprint 4 | P01.1 | REST checkout, webhook | Contrats checkout/webhook documentes | Les payloads de creation session, callback et erreurs sont figes | `docs/payment-checkout-webhook-contract` |
| P02.2 | DONE | P0 | Mourad | Ibrahim | Sprint 4 | P02.1 | Session paiement | Endpoint checkout implementable | Une inscription payante peut demarrer une session de paiement avec retour tracable | `feature/payment-checkout-session` |
| P02.3 | DONE | P0 | Mourad | Ibrahim | Sprint 4 | P02.1 | Webhook provider | Verification webhook implementable | Les callbacks provider sont verifies et refusent les signatures invalides | `feature/payment-webhook-verification` |

### P03 - Aligner inscription, paiement et billet

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US14`
- Livrables:
  - statuts coherents entre registration et payment
  - regles d'emission de billet selon paiement

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P03.1 | DONE | P0 | Mourad | Ibrahim | Sprint 4 | P02.1, R04.1 | Machine d'etat payment/registration/ticket | Regles de coherence documentees | Les statuts payment et registration sont alignes avec la generation billet | `docs/payment-registration-ticket-state-machine` |
| P03.2 | DONE | P0 | Mourad | Ibrahim | Sprint 4 | P03.1, P02.3 | Propagation de statut | Synchronisation payment -> registration implementable | Un paiement confirme ou echoue met a jour l'inscription comme prevu | `feature/payment-status-propagation` |
| P03.3 | DONE | P0 | Mourad | Ibrahim | Sprint 4 | P03.1, R04.2 | Ticket gating | Emission billet sous condition paiement | Aucun billet final n'est emis tant que la condition de paiement n'est pas satisfaite | `feature/payment-ticket-gating` |

### P04 - Gerer les erreurs et la reconciliation

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US14`
- Livrables:
  - transactions `PENDING/PAID/FAILED/REFUNDED`
  - reprise manuelle et journalisation

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P04.1 | DONE | P1 | Mourad | Ibrahim | Sprint 4 | P03.1 | Journal `PaymentTransaction` | Modele d'erreur et reconciliation documente | Les cas timeout, callback en retard et echec irreversible sont couverts | `docs/payment-reconciliation-rules` |
| P04.2 | DONE | P1 | Mourad | Ibrahim | Sprint 4 | P04.1, P02.3 | Outil reprise paiement | Reconciliation manuelle implementable | Une transaction incoherente peut etre reprise ou annotee sans casser le flux | `feature/payment-manual-reconciliation` |
| P04.3 | DONE | P1 | Mourad | Ibrahim | Sprint 4 | P04.1, A03.2 | Audit paiement | Traces paiement exploitables | Chaque transaction et chaque action manuelle ecrivent une trace d'audit lisible | `feature/payment-audit-trail` |

### P05 - Vue organisateur sur les encaissements

- Status: `DONE`
- Priority: `P2` · Difficulty: `S` · Impact: `M`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US14`
- Livrables:
  - liste des paiements par evenement
  - filtres et export

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P05.1 | DONE | P2 | Ibrahim | Mourad | Sprint 4 | P03.1 | Contrat vue encaissements | Ecran organisateur documente | Les colonnes, filtres et statuts visibles sont stabilises | `docs/payment-organizer-view-contract` |
| P05.2 | DONE | P2 | Mourad | Ibrahim | Sprint 4 | P05.1, P04.1 | Endpoint liste/export paiement | Backend encaissements implementable | L'organisateur voit les paiements de ses evenements uniquement | `feature/payment-organizer-list-api` |
| P05.3 | DONE | P2 | Ibrahim | Mourad | Sprint 4 | P05.1, P05.2 | UI encaissements | Vue organisateur implementable | La vue affiche les montants, statuts et filtres sans exposer de donnees non autorisees | `feature/payment-organizer-view-ui` |
