---
title: Sprint 4 - Paiement & extensions
description: Planning du lot monetisation, transactions et extensions produit.
docKind: sprint
domain: delivery
phase: P4
owner: Mourad
status: DONE
priority: P2
tags:
  - sprint-4
  - payment
  - extensions
slug: sprint-4-payment-extensions
---

# Sprint 4 - Paiement & extensions

Sprint optionnel selon priorite metier des evenements payants.

**Statut:** `DONE`  
**Periode indicative:** 2026-05-25 -> 2026-06-12

## Objectifs

- Integrer le paiement des evenements payants.
- Garantir la coherence entre transaction, inscription et billet.
- Preparer les extensions mobile, connecteurs et analytique.

## Services cibles

- Payment
- Registration
- Ticketing
- Admin & Moderation

## Livrables cibles

- checkout ou session de paiement
- webhook de confirmation
- statuts de transaction visibles
- traitement des echecs et remboursements simples
- premiers points d'extension vers connecteurs externes

## Definition of Done

- Le paiement confirme ou refuse modifie correctement le statut business.
- Aucun billet final n'est emis a tort pour une transaction echouee.
- Les anomalies de paiement sont auditables et reconcilables.

## Risques / vigilance

- Couplage fort entre provider et logique metier.
- Gestion des cas limites: timeout, double callback, remboursement.
- Complexite de securite et de conformite.
