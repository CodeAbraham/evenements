---
title: Sprint 3 - Admin & moderation
description: Planning du lot moderation, audit, supervision et dashboards metier.
docKind: sprint
domain: delivery
phase: P3
owner: Ibrahim
status: DONE
priority: P1
tags:
  - sprint-3
  - admin
  - moderation
slug: sprint-3-admin-moderation
---

# Sprint 3 - Administration & moderation

Sprint centre sur la gouvernance, la supervision et la moderation.

**Statut:** `DONE`  
**Periode indicative:** 2026-05-04 -> 2026-05-22

## Objectifs

- Livrer une console admin exploitable.
- Permettre la moderation et la validation des evenements.
- Exposer les journaux d'audit et les KPI clefs.
- Ajouter la recherche multicriteres sur utilisateurs et evenements.

## Services cibles

- Admin & Moderation
- Event Management
- Identity & Access
- Monitoring / Audit

## Livrables cibles

- dashboard admin
- file de moderation
- vue audit
- recherche globale
- vues KPI initiales

## Definition of Done

- Les actions admin sensibles sont journalisees.
- Un incident peut etre retrace par acteur, entite ou correlation-id.
- Les droits d'acces admin sont verifies sur toutes les routes et ecrans.

## Risques / vigilance

- Explosion du scope si l'admin veut remplacer un outil BI complet.
- Dilution entre audit technique et audit metier.
- Besoin de filtrage performant sur gros volumes.
