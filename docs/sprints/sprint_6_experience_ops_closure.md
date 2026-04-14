# Sprint 6 - Experience & ops closure

Sprint de consolidation apres `v1.1-prod-ready`, centre sur les restes
frontend/admin et l'exploitation metrique encore ouverte.

**Statut:** `DONE`  
**Periode indicative:** 2026-07-06 -> 2026-07-24

## Objectifs

- Fermer les integrations UI encore `PARTIAL` du parcours participant et organisateur.
- Exposer les panels ops/admin a partir des metriques deja emises.
- Reduire l'ecart entre composants "backend-ready" et vues reellement branchees.

## Services cibles

- Frontend participant / organisateur
- Admin & Moderation
- Monitoring
- Notification
- Registration & Ticketing

## Tickets candidats prioritaires

- `R05.3`: telechargement billet integre dans dashboard participant
- `R06.3`: action export integree dans back-office organisateur
- `F06.3`: UX telechargement billet branchee dans les vues
- `F07.3`: correctifs accessibilite parcours critiques
- `N03.3`: statut SMS simule visible dans l'UI admin
- `M03.3`: panels KPI/ops sur base des metriques critiques

## Livrables cibles

- dashboard participant avec telechargement billet branche
- vue organisateur avec export et etats de chargement/erreur
- lecture UI des statuts notification/SMS simules
- dashboard admin ops branche sur les metriques critiques
- passe accessibilite sur les parcours MVP encore incomplets

## Definition of Done

- les tickets `PARTIAL` cibles sont soit fermes, soit reclasses explicitement.
- les vues front utilisent les modules partages deja livres sans fork local.
- les panels ops exposent des KPI lisibles relies aux metriques existantes.
- les points de friction UX critiques ont une verification minimale documentee.

## Risques / vigilance

- risque de masquer des trous backend reels par une integration UI trop optimiste.
- possible ecart entre modules partages testes et composants applicatifs absents.
- surcharge scope si le sprint absorbe des TODO non relies aux integrations cibles.
