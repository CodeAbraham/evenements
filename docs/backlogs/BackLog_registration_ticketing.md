---
title: Backlog Registration & Ticketing
description: Backlog inscriptions, waitlist, billets et historique participant.
docKind: backlog
domain: registration-ticketing
phase: P1-P2
owner: Mourad
status: PARTIAL
priority: P0
tags:
  - registration
  - waitlist
  - tickets
slug: registration-ticketing
---

# BackLog Registration & Ticketing

Ce backlog couvre les inscriptions, la capacite, la liste d'attente, la
promotion automatique, la billetterie et l'export des inscrits.

## Meta

- Statut global: `PARTIAL`
- Date debut: `2026-03-07`
- Priorite produit: `P1/P2`
- Lead: `Mourad`
- Support: `Ibrahim`
- Reste principal au `2026-04-11`: aucun item P0 ouvert

## Taches

### R01 - Implementer la creation d'inscription et la verification de capacite

- Status: `DONE`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US05`, `US06`, `US15`
- Livrables:
  - endpoint de soumission d'inscription
  - verification capacite et eligibilite
  - retour `CONFIRMED` ou `WAITLISTED`

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R01.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | E01.3 | REST `POST /registrations` | Contrat de creation inscription documente | Les regles capacite, eligibilite et reponses `CONFIRMED` ou `WAITLISTED` sont explicites | `docs/registration-create-contract` |
| R01.2 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | R01.1 | Creation inscription confirmee | Inscription directe implementable | Une inscription confirmee reserve une place sans depasser la capacite | `feature/registration-confirmed-flow` |
| R01.3 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | R01.1 | Creation inscription attente | Basculer en waitlist implementable | Un evenement complet place automatiquement le participant en `WAITLISTED` | `feature/registration-waitlist-flow` |

### R02 - Garantir l'absence de doublons et le controle de concurrence

- Status: `PARTIAL`
- Priority: `P0` · Difficulty: `L` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US05`, `US06`
- Livrables:
  - unicite participant/evenement
  - garde-fous sur inscriptions simultanees
  - promotion waitlist atomique

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R02.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | R01.1 | Modele `Registration` | Strategie unicite et concurrence documentee | Les cas double clic, multi-onglet et dernier siege simultane sont couverts | `docs/registration-concurrency-rules` |
| R02.2 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | R02.1, R01.2 | Couche persistence registration | Gardes anti-doublon implementables | Une meme personne ne peut pas obtenir deux inscriptions actives sur le meme evenement | `feature/registration-uniqueness-guards` |
| R02.3 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | R02.1, R03.3 | Tests concurrence | Jeu de tests critique definis | Les scenarios de course et promotion concurrente sont ecrits et passes en revue | `test/registration-concurrency-cases` |

### R03 - Gerer annulation et promotion automatique depuis la waitlist

- Status: `PARTIAL`
- Priority: `P0` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US06`, `US07`
- Livrables:
  - annulation participant/organisateur
  - promotion du premier candidat eligible
  - emission `registration.promoted`

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R03.1 | DONE | P0 | Mourad | Ibrahim | Sprint 0 | R01.1 | REST cancel registration, event `registration.promoted` | Contrat annulation/promotion documente | Les cas annulation participant, annulation organisateur et promotion sont decrits | `docs/registration-cancel-promote-contract` |
| R03.2 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | R03.1 | Flux annulation | Annulation d'inscription implementable | Une annulation libere une place et met a jour le statut sans incoherence | `feature/registration-cancel-flow` |
| R03.3 | DONE | P0 | Mourad | Ibrahim | Sprint 1 | R03.1, R02.1 | Promotion waitlist | Promotion automatique implementable | Le premier candidat eligible est promu de facon atomique et un evenement metier est emis | `feature/registration-waitlist-promotion` |

### R04 - Generer le billet electronique et le QR code

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `H`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US08`
- Livrables:
  - PDF/PNG billet
  - reference unique
  - QR code facultatif

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R04.1 | DONE | P1 | Mourad | Ibrahim | Sprint 0 | R01.1 | Modele `Ticket`, event `ticket.generated` | Contrat ticketing documente | La reference billet, le format artefact et l'option QR sont definis | `docs/ticketing-contract` |
| R04.2 | DONE | P1 | Mourad | Ibrahim | Sprint 2 | R04.1, R03.3 | Generation PDF/PNG | Generation billet implementable | Un billet unique est genere uniquement apres confirmation effective | `feature/ticket-pdf-generation` |
| R04.3 | DONE | P1 | Mourad | Ibrahim | Sprint 2 | R04.1, R04.2 | QR code | Option QR code implementable | Le QR est present si active et reference le billet sans divulguer de donnees sensibles | `feature/ticket-qr-code` |

### R05 - Exposer l'historique de participations et le telechargement billet

- Status: `DONE`
- Priority: `P1` · Difficulty: `M` · Impact: `M`
- Owner: `Ibrahim`
- Support: `Mourad`
- User stories: `US07`, `US08`
- Livrables:
  - dashboard participant
  - liste des participations
  - acces au billet si confirme

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R05.1 | DONE | P1 | Ibrahim | Mourad | Sprint 0 | F02.1 | Reponse dashboard participant | Contrat historique participant documente | Les colonnes statut, date, evenement et billet sont stabilisees | `docs/participant-history-contract` |
| R05.2 | DONE | P1 | Mourad | Ibrahim | Sprint 1 | R05.1, R03.2 | REST participations | Endpoint historique implementable | Un participant recupere ses inscriptions et leurs statuts sans voir celles des autres | `feature/participant-history-endpoint` |
| R05.3 | DONE | P1 | Ibrahim | Mourad | Sprint 2 | R05.1, R04.2, F06.2 | Dashboard participant | Telechargement billet integre | Le dashboard affiche un bouton de telechargement uniquement pour les inscriptions confirmees | `feature/participant-ticket-download-ui` |

### R06 - Exporter les inscrits pour les organisateurs

- Status: `DONE`
- Priority: `P2` · Difficulty: `S` · Impact: `M`
- Owner: `Mourad`
- Support: `Ibrahim`
- User stories: `US09`
- Livrables:
  - export CSV/XLSX ou equivalent
  - colonnes statut, contact, reference billet

#### Tickets prets a coder

| Ticket ID | Status | Priority | Owner | Support | Sprint cible | Dependances | Interfaces impactees | Sortie attendue | Critere d'acceptation | Branche suggeree |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R06.1 | DONE | P2 | Mourad | Ibrahim | Sprint 0 | E05.1 | Format export organisateur | Contrat export documente | Les colonnes obligatoires et le format cible sont valides avec l'UI organisateur | `docs/organizer-export-contract` |
| R06.2 | DONE | P2 | Mourad | Ibrahim | Sprint 2 | R06.1, R05.2 | REST export inscrits | Export implementable | L'organisateur exporte les inscrits de ses evenements uniquement | `feature/organizer-registrants-export` |
| R06.3 | DONE | P2 | Ibrahim | Mourad | Sprint 2 | R06.1, F03.3 | Back-office organisateur | Action export integree | Le bouton export apparait dans la vue inscrits avec le bon etat de chargement/erreur | `feature/organizer-export-ui` |
