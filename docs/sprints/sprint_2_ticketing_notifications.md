---
title: Sprint 2 - Ticketing & notifications
description: Planning du lot billets electroniques, QR code et notifications.
docKind: sprint
domain: delivery
phase: P2
owner: Mourad
status: DONE
priority: P1
tags:
  - sprint-2
  - ticketing
  - notification
slug: sprint-2-ticketing-notifications
---

# Sprint 2 - Ticketing & notifications

Sprint de completion du parcours post-inscription.

**Statut:** `DONE`  
**Periode indicative:** 2026-04-13 -> 2026-05-01

## Objectifs

- Generer les billets electroniques.
- Integrer le QR code facultatif.
- Envoyer les notifications email du cycle d'inscription.
- Ajouter l'export des inscrits pour l'organisateur.

## Services cibles

- Ticketing
- Notification
- Media
- Registration
- Frontend participant / organisateur

## Livrables cibles

- billet PDF/PNG telechargeable
- QR code sur le billet si active
- emails de confirmation, attente, promotion, rappel
- historique technique d'envoi
- export des inscrits par evenement

## Avancement

- `N01.1` catalogue templates notification documente
- `N02.1` contrat consumer async notification documente
- `N02.2` worker email partage livre et teste
- `N02.3` module `NotificationLog` partage livre et teste
- `R04.1` contrat ticketing documente
- `R04.2` module partage de generation PDF/PNG livre et teste
- `R04.3` QR code opaque integre au module ticketing
- `R05.2` endpoint-ready participant history module livre
- `R05.3` module d'integration vue participant + download livre
- `R06.1` contrat export organisateur documente
- `R06.2` endpoint-ready export inscrits livre
- `R06.3` module d'integration vue organisateur export livre

## Definition of Done

- Le billet n'est genere qu'apres confirmation effective.
- Une promotion depuis la waitlist regenere correctement le parcours
  ticket + notification.
- Les echecs de notification sont journalises et exploitables.

## Risques / vigilance

- Idempotence de generation des billets.
- Multiplication des emails en cas de retry mal configure.
- Gestion des fichiers et duree de vie des URLs.
