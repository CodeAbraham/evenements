# Historique des livrables - Projet Evenements

Journal synthetique des livrables majeurs et des baselines de cadrage.

## 2026-03-07 - Baseline documentaire projet

- Structuration complete du dossier `docs/` sur le modele de `docs copy`,
  mais adaptee au domaine evenement.
- Formalisation du perimetre `P1 -> P4` dans `docs/mvp_scope.md`.
- Mise en place des backlogs initiaux par domaine:
  auth, events, registration/ticketing, notification, admin,
  payment, frontend, monitoring, documentation.
- Creation des workflows backend/frontend et du template de spec
  microservice pour lancer l'implementation.
- Conservation du dossier `docs/releases/` comme simple template futur,
  sans suivi actif pour l'instant.

## 2026-03-08 - Baseline contrats `P1` en cours de `Sprint 0`

- Renforcement de `docs/sprints/sprint_0_architecture_foundation.md`
  avec ownership `P1`, contrats minimums, arbitrages ouverts et Done
  criteria plus stricts.
- Creation du dictionnaire de donnees `P1` dans
  `docs/data-dictionary-p1.md`.
- Creation du catalogue REST `P1` dans `docs/api-contracts-p1.md`.
- Creation du catalogue d'evenements async `P1` dans
  `docs/async-events-p1.md`.
- Creation de la checklist smoke MVP dans `docs/test-plan-smoke-mvp.md`.
- Creation de la spec `identity-access-service` dans
  `docs/services/identity-access-service-spec.md`.
- Creation de la spec `event-management-service` dans
  `docs/services/event-management-service-spec.md`.
- Creation de la spec `registration-service` dans
  `docs/services/registration-service-spec.md`.
- Alignement de l'index documentaire et du backlog documentation avec
  ces nouveaux livrables.

## 2026-03-08 - Cloture des livrables documentaires restants de `Sprint 0`

- Creation de la spec `catalog-search-service` dans
  `docs/services/catalog-search-service-spec.md`.
- Creation de la matrice de recette par phase dans
  `docs/test-plan-acceptance-matrix.md`.
- Creation du plan de non-regression ACL et roles dans
  `docs/test-plan-role-regression.md`.
- Creation des trois diagrammes `Sprint 0` en source Mermaid dans
  `docs/diagrams/architecture_global.mmd`,
  `docs/diagrams/flow_event_publication.mmd` et
  `docs/diagrams/flow_registration_waitlist.mmd`.
- Mise a jour de `docs/diagrams/README.md`,
  `docs/DOCUMENTATION_INDEX.md` et `docs/backlogs/BackLog_documentation.md`
  pour referencer ces livrables.

## 2026-03-09 - Stabilisation des shells frontend `Sprint 0` (`S0-I01`)

- Creation du document de routes frontend shells dans
  `docs/workflows/Workflow_frontend_shell_routes.md`.
- Stabilisation documentee des routes MVP:
  portail public, espace participant et back-office organisateur.
- Mise a jour des tickets `F01.1`, `F02.1`, `F03.1` en `DONE` dans
  `docs/backlogs/BackLog_frontend.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Contrat ACL frontend `Sprint 0` (`F04.1`)

- Creation du contrat de guards frontend dans
  `docs/workflows/Workflow_frontend_acl_contract.md`.
- Stabilisation de la matrice ACL par route pour les roles:
  public, participant, organisateur et admin.
- Definition explicite des redirections (`/auth/login?next=`) et des
  comportements `403`.
- Mise a jour du ticket `F04.1` en `DONE` dans
  `docs/backlogs/BackLog_frontend.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Shell routes console admin `Sprint 0` (`A01.1`)

- Creation du document routes admin dans
  `docs/workflows/Workflow_frontend_admin_shell_routes.md`.
- Stabilisation des routes console:
  moderation, audit, search, KPI, incidents, notifications.
- Alignement explicite sur les guards `ADMIN` issus de `F04.1`.
- Mise a jour du ticket `A01.1` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Catalogue KPI admin `Sprint 0` (`A05.1`)

- Creation du catalogue KPI admin dans
  `docs/workflows/Workflow_admin_kpi_catalog.md`.
- Stabilisation des KPI MVP:
  evenements publies, taux de remplissage, attente active, promotions,
  notifications en echec.
- Definition explicite des sources de verite, periodicites et regles de
  degradation (`OK`, `DEGRADED`, `DELAYED`).
- Mise a jour du ticket `A05.1` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Standards etats UI partages `Sprint 0` (`F05.1`)

- Creation du catalogue des etats UI partages dans
  `docs/workflows/Workflow_frontend_shared_states.md`.
- Stabilisation des conventions `loading`, `empty`, `error`, `forbidden`,
  `success` et du mapping erreurs backend vers UX.
- Definition des composants cibles (`StateLoading`, `StateEmpty`,
  `StateError`, `StateForbidden`, `InlineSuccess`, `AppToast`) pour
  preparer `F05.2`.
- Mise a jour du ticket `F05.1` en `DONE` dans
  `docs/backlogs/BackLog_frontend.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Checklist responsive et accessibilite `Sprint 0` (`F07.1`)

- Creation de la checklist responsive/a11y MVP dans
  `docs/workflows/Workflow_frontend_responsive_a11y_checklist.md`.
- Identification des ecrans prioritaires (public, auth participant,
  dashboard participant, organisateur) et des controles a verifier.
- Stabilisation des criteres minimums:
  navigation clavier, labels/erreurs, focus visible, contraste, etats UI.
- Mise a jour du ticket `F07.1` en `DONE` dans
  `docs/backlogs/BackLog_frontend.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Copy rules notifications `Sprint 2` (`N01.3`)

- Creation des regles de copywriting et fallback templates dans
  `docs/workflows/Workflow_notification_template_copy_rules.md`.
- Stabilisation des placeholders standards, des fallback globaux et de la
  matrice des templates MVP (`confirmed`, `waitlisted`, `promoted`,
  `reminder`, `cancelled`).
- Alignement explicite avec les statuts frontend/backend et le logging
  `NotificationLog` (`fallback_used`, `correlation_id`).
- Mise a jour du ticket `N01.3` en `DONE` dans
  `docs/backlogs/BackLog_notification.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Contrat download protege frontend (`F06.1`)

- Creation du contrat de telechargement protege dans
  `docs/workflows/Workflow_frontend_protected_downloads.md`.
- Stabilisation des regles d'eligibilite billet cote UI
  (`CONFIRMED` + `canDownloadTicket` + `ticketId`).
- Definition du mapping UX pour `401/403/404/502` et du pipeline helper
  frontend cible (`F06.2`).
- Mise a jour du ticket `F06.1` en `DONE` dans
  `docs/backlogs/BackLog_frontend.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Helper blob auth frontend (`F06.2`)

- Implementation du helper de telechargement protege dans
  `services/shared/ticketDownloadHelper.js`.
- Ajout des regles d'eligibilite (`CONFIRMED` + `canDownloadTicket`
  + `ticketId`) et du mapping d'erreurs `401/403/404/502`.
- Couverture unitaire ajoutee dans
  `tests/s2-t03.frontend-blob-download-helper.unit.test.js`.
- Ajout du script npm `test:s2-t03` dans `package.json`.
- Mise a jour du ticket `F06.2` en `DONE` dans
  `docs/backlogs/BackLog_frontend.md`.

## 2026-03-09 - UX telechargement billet (`F06.3`) - livraison partielle

- Ajout d'une couche UX de telechargement dans
  `services/shared/ticketDownloadUx.js` pour transformer les erreurs
  `401/403/404/502` en messages lisibles participant/organisateur.
- Ajout des tests unitaires dans
  `tests/s2-t04.ticket-download-ux.unit.test.js`.
- Ajout du script npm `test:s2-t04` dans `package.json`.
- Mise a jour du ticket `F06.3` en `PARTIAL` dans
  `docs/backlogs/BackLog_frontend.md`.
- Reste a faire: brancher ce module dans les vraies vues dashboard
  participant/organisateur une fois le frontend applicatif present
  (`R05.3` / `feature/frontend-ticket-download-ux`).

## 2026-03-09 - UX status SMS notification (`N03.3`) - livraison partielle

- Ajout d'un mapping UX des statuts notification/SMS dans
  `services/shared/notificationStatusUx.js`.
- Les filtres exposent explicitement `SIMULATED` avec libelles
  exploitables cote UI.
- Tests unitaires ajoutes dans
  `tests/s2-t05.notification-status-ux.unit.test.js`.
- Ajout du script npm `test:s2-t05` dans `package.json`.
- Mise a jour du ticket `N03.3` en `PARTIAL` dans
  `docs/backlogs/BackLog_notification.md`.
- Reste a faire: brancher ces mappings dans la vue admin/notification
  (frontend non present ici) et connecter aux logs reels `N03.2`.

## 2026-03-09 - UX ticket dashboard participant (`R05.3`) - livraison partielle

- Ajout d'un mapping UI pour l'action billet participant dans
  `services/shared/participantTicketUi.js`.
- Gestion explicite des cas `CONFIRMED` (download),
  `WAITLISTED`, `CANCELLED` et evenement annule.
- Tests unitaires ajoutes dans
  `tests/s2-t06.participant-ticket-ui.unit.test.js`.
- Ajout du script npm `test:s2-t06` dans `package.json`.
- Mise a jour du ticket `R05.3` en `PARTIAL` dans
  `docs/backlogs/BackLog_registration_ticketing.md`.
- Reste a faire: brancher ce mapping dans la vraie vue dashboard
  participant (frontend non present ici) et connecter aux donnees
  `R05.2` + `R04.2`.

## 2026-03-09 - UX export organisateur (`R06.3`) - livraison partielle

- Ajout du mapping UI export organisateur dans
  `services/shared/organizerExportUi.js`.
- Gestion des etats export `READY`, `RUNNING`, `FAILED` et `UNKNOWN`.
- Tests unitaires ajoutes dans
  `tests/s2-t07.organizer-export-ui.unit.test.js`.
- Ajout du script npm `test:s2-t07` dans `package.json`.
- Mise a jour du ticket `R06.3` en `PARTIAL` dans
  `docs/backlogs/BackLog_registration_ticketing.md`.
- Reste a faire: brancher ce mapping dans la vraie vue inscrits
  organisateur (frontend non present ici) et connecter l'endpoint
  `R06.2`.

## 2026-03-09 - A11y helpers formulaire (`F07.3`) - livraison partielle

- Ajout d'un helper a11y pour champs formulaire dans
  `services/shared/a11yFieldHelper.js`.
- Generation des ids `hint/error`, `aria-describedby` et
  `aria-errormessage` avec deduplication.
- Tests unitaires ajoutes dans
  `tests/s2-t08.a11y-field-helper.unit.test.js`.
- Ajout du script npm `test:s2-t08` dans `package.json`.
- Mise a jour du ticket `F07.3` en `PARTIAL` dans
  `docs/backlogs/BackLog_frontend.md`.
- Reste a faire: integrer ces helpers dans les formulaires UI quand
  le frontend applicatif existe.

## 2026-03-09 - Plan d'integration frontend `Sprint 2`

- Creation du plan d'integration Sprint 2 dans
  `docs/workflows/Workflow_frontend_sprint2_integration_plan.md`.
- Recap des pre-requis backend (`R04.2`, `R05.2`, `R06.2`, `N03.2`) et des
  surfaces UI cibles pour participant/organisateur/admin.
- Inventaire des modules partages a brancher (`F06.2`, `F06.3`, `R05.3`,
  `R06.3`, `N03.3`, `F07.3`) et des flux UI associes.
- Ajout d'une verification rapide (tests helper + smoke UI).
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Shell admin UI `Sprint 3` (`A01.2`)

- Creation du workflow UI admin dans
  `docs/workflows/Workflow_frontend_admin_shell_ui.md`.
- Definition du layout global, de la navigation et des etats standards
  pour la console admin (moderation, audit, KPI, incidents, recherche).
- Mise a jour du ticket `A01.2` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Passage du sprint 3 en `IN_PROGRESS` dans
  `docs/sprints/sprint_3_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Guard admin routes `Sprint 3` (`A01.3`)

- Creation du workflow guard admin dans
  `docs/workflows/Workflow_frontend_admin_route_guards.md`.
- Clarification des routes protegees, des regles `unauth` vs `forbidden`
  et des etats UI standard.
- Definition d'un hook/utilitaire `useAdminGuard` et des tests attendus.
- Mise a jour du ticket `A01.3` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Contrat moderation admin `Sprint 3` (`A02.1`)

- Creation du contrat de moderation dans
  `docs/workflows/Workflow_admin_moderation_contract.md`.
- Definition des etats, actions, motifs et transitions de moderation.
- Alignement du contrat API minimal et des regles d'audit.
- Mise a jour du ticket `A02.1` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Backend moderation admin `Sprint 3` (`A02.2`)

- Creation de la spec `admin-moderation-service` dans
  `docs/services/admin-moderation-service-spec.md`.
- Definition de l'API moderation, des evenements async, des regles de
  securite/audit et de l'observabilite.
- Mise a jour du ticket `A02.2` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - UI moderation admin `Sprint 3` (`A02.3`)

- Creation du workflow UI moderation dans
  `docs/workflows/Workflow_frontend_admin_moderation_ui.md`.
- Definition de la page liste/detail, du mapping actions par statut et
  des validations de formulaire (`reasonCode`, `reasonNote`).
- Alignement explicite avec les endpoints `A02.2` et les transitions de
  `A02.1`.
- Mise a jour du ticket `A02.3` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Contrat audit admin `Sprint 3` (`A03.1`)

- Creation du contrat d'audit transverse dans
  `docs/workflows/Workflow_admin_audit_contract.md`.
- Definition du schema canonique `AuditRecord`, des filtres obligatoires
  et des endpoints admin de consultation.
- Alignement avec l'evenement async `audit.action.recorded` et les
  regles de deduplication/compatibilite.
- Mise a jour du ticket `A03.1` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Backend audit admin `Sprint 3` (`A03.2`)

- Creation de la spec `admin-audit-service` dans
  `docs/services/admin-audit-service-spec.md`.
- Definition de l'ingestion async `audit.action.recorded`, du stockage,
  des endpoints de recherche admin et des regles d'idempotence.
- Clarification des contraintes de securite (lecture `ADMIN`) et des
  metriques minimales d'observabilite.
- Mise a jour du ticket `A03.2` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - UI audit admin `Sprint 3` (`A03.3`)

- Creation du workflow UI audit dans
  `docs/workflows/Workflow_frontend_admin_audit_ui.md`.
- Definition de la page `/admin/audit` (filtres, table, pagination,
  vue detail) alignee sur les contrats `A03.1` et `A03.2`.
- Normalisation du mapping erreurs `400/401/403/404/5xx` et des events
  d'observabilite frontend.
- Mise a jour du ticket `A03.3` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Contrat recherche globale admin `Sprint 3` (`A04.1`)

- Creation du contrat de recherche globale dans
  `docs/workflows/Workflow_admin_global_search_contract.md`.
- Stabilisation des filtres multicriteres user/event, du format commun
  `SearchResultItem` et des regles pagination/tri.
- Clarification des boundaries ownership (services source + index admin),
  des permissions `ADMIN` et des regles de redaction.
- Mise a jour du ticket `A04.1` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Backend recherche globale admin `Sprint 3` (`A04.2`)

- Creation de la spec `admin-search-service` dans
  `docs/services/admin-search-service-spec.md`.
- Definition des endpoints backend de recherche/suggestions et des
  regles de filtres multicriteres user/event.
- Specification de l'alimentation async de l'index admin et des regles
  d'idempotence (`messageId` + upsert `type/entityId`).
- Mise a jour du ticket `A04.2` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - UI recherche globale admin `Sprint 3` (`A04.3`)

- Creation du workflow UI recherche admin dans
  `docs/workflows/Workflow_frontend_admin_search_ui.md`.
- Definition de la page `/admin/search` (filtres, resultats, pagination,
  navigation vers fiches user/event) alignee sur `A04.2`.
- Stabilisation du mapping erreurs (`400/401/403/404/5xx`) et des
  events d'observabilite frontend.
- Mise a jour du ticket `A04.3` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Backend KPI admin `Sprint 3` (`A05.2`)

- Creation de la spec `admin-kpi-service` dans
  `docs/services/admin-kpi-service-spec.md`.
- Definition des endpoints KPI (`/api/admin/kpi`, detail, health) et des
  regles de calcul/degradation alignees sur `A05.1`.
- Specification des sources inter-services (event, registration,
  notification) et de la deduplication async.
- Mise a jour du ticket `A05.2` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - UI dashboard KPI admin `Sprint 3` (`A05.3`)

- Creation du workflow UI KPI dashboard dans
  `docs/workflows/Workflow_frontend_admin_kpi_dashboard_ui.md`.
- Definition de la page `/admin/kpi` (cards, fenetres `D1/D7/D30`,
  health/refresh, etats UI) alignee sur `A05.2`.
- Stabilisation du rendu `dataStatus` (`OK`, `DEGRADED`, `DELAYED`) et
  du mapping erreurs `400/401/403/5xx`.
- Mise a jour du ticket `A05.3` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Contrat incident trace admin `Sprint 3` (`A06.1`)

- Creation du contrat incident trace dans
  `docs/workflows/Workflow_admin_incident_trace_contract.md`.
- Definition des entites `IncidentTrace` et `IncidentTraceStep` avec
  `correlationId` comme cle de jointure principale.
- Stabilisation des endpoints list/detail/by-correlation pour
  l'investigation admin.
- Mise a jour du ticket `A06.1` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Backend incident trace admin `Sprint 3` (`A06.2`)

- Creation de la spec `admin-incident-trace-service` dans
  `docs/services/admin-incident-trace-service-spec.md`.
- Definition des endpoints backend list/detail/by-correlation et des
  regles d'ingestion multi-sources reliees au `correlationId`.
- Clarification de l'idempotence (`messageId`), de la redaction
  sensible et des metriques d'observabilite incident.
- Mise a jour du ticket `A06.2` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - UI incident trace admin `Sprint 3` (`A06.3`)

- Creation du workflow UI incident admin dans
  `docs/workflows/Workflow_frontend_admin_incident_ui.md`.
- Definition de la vue `/admin/incidents` (filtres, table, detail,
  timeline) alignee sur `A06.2`.
- Stabilisation du mapping erreurs (`400/401/403/404/5xx`) et des
  events d'observabilite frontend pour investigation.
- Mise a jour du ticket `A06.3` en `DONE` dans
  `docs/backlogs/BackLog_admin_moderation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-09 - Cadrage provider paiement `Sprint 4` (`P01.1`)

- Creation du cadrage provider paiement dans
  `docs/workflows/Workflow_payment_provider_scope.md`.
- Arbitrage explicite vers une abstraction `PaymentProviderAdapter` avec
  implementation initiale provider unique.
- Clarification du perimetre lot 1 (checkout, webhook signe,
  transitions `PENDING/PAID/FAILED`, remboursement simple) et des
  exclusions.
- Mise a jour du ticket `P01.1` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.
- Passage du sprint 4 en `IN_PROGRESS` dans
  `docs/sprints/sprint_4_payment_extensions.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-10 - Regles business paiement `Sprint 4` (`P01.2`)

- Creation des regles business paiement dans
  `docs/workflows/Workflow_payment_business_rules.md`.
- Arbitrage des transitions metier paiement/inscription/billet pour les
  cas paiement simple, annulation et remboursement.
- Clarification des cas limites (double callback, webhook en retard,
  timeout provider) et des roles autorises.
- Mise a jour du ticket `P01.2` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-10 - Non-goals paiement `Sprint 4` (`P01.3`)

- Creation du cadrage non-goals dans
  `docs/workflows/Workflow_payment_non_goals.md`.
- Clarification des scenarios explicitement exclus du lot 1 paiement:
  multi-provider actif, refund partiel, chargeback auto, analytics
  financiers avances et anti-fraude enrichie.
- Ajout d'une regle de gouvernance scope (`OUT_OF_SCOPE_P4_L1`) pour
  traiter les demandes hors perimetre sans bloquer la livraison.
- Mise a jour du ticket `P01.3` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-10 - Contrat checkout/webhook paiement `Sprint 4` (`P02.1`)

- Creation du contrat checkout/webhook dans
  `docs/workflows/Workflow_payment_checkout_webhook_contract.md`.
- Stabilisation des payloads `POST /api/payments/checkout/sessions` et
  `POST /api/payments/webhooks/provider` avec mapping d'erreurs.
- Definition explicite de la verification signature provider, de
  l'idempotence checkout/webhook et du mapping statuts provider -> metier.
- Mise a jour du ticket `P02.1` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-10 - Backend checkout session paiement `Sprint 4` (`P02.2`)

- Creation de la spec `payment-service` dans
  `docs/services/payment-service-spec.md`.
- Definition de l'endpoint `POST /api/payments/checkout/sessions`,
  des validations metier et de l'idempotence checkout.
- Clarification des integrations avec `registration-service` et
  `PaymentProviderAdapter`.
- Mise a jour du ticket `P02.2` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-10 - Verification webhook provider paiement `Sprint 4` (`P02.3`)

- Creation du workflow verification webhook dans
  `docs/workflows/Workflow_payment_webhook_verification.md`.
- Definition du pipeline de verification:
  signature/timestamp, constant-time compare, dedup anti-replay et mapping
  statut provider -> statut metier.
- Clarification des reponses HTTP standard (`200/400/401/409/500`),
  des exigences securite secrets et des metriques d'observabilite.
- Mise a jour du ticket `P02.3` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-11 - Machine d'etat payment/registration/ticket `Sprint 4` (`P03.1`)

- Creation du workflow de coherence d'etats dans
  `docs/workflows/Workflow_payment_registration_ticket_state_machine.md`.
- Clarification de l'ownership des statuts entre `payment-service`,
  `registration-service` et `ticketing-service`.
- Definition des transitions canoniques, de la propagation
  payment -> registration -> ticket et de l'invariant de gating billet
  (pas de `ISSUED` sans paiement `PAID` confirme).
- Ajout des regles d'idempotence/rejet des transitions obsoletes et des
  exigences d'observabilite/audit.
- Mise a jour du ticket `P03.1` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-11 - Propagation status payment -> registration `Sprint 4` (`P03.2`)

- Implementation du module partage de propagation dans
  `services/shared/paymentStatusPropagation.js`.
- Couverture des regles de mapping:
  `PAID -> CONFIRMED`,
  `FAILED|CANCELLED -> CANCELLED`,
  `REFUNDED -> REFUNDED`,
  avec filtrage des transitions obsoletes/incoherentes.
- Ajout du constructeur d'evenement
  `registration.status.update_requested` pour un branchement backend.
- Tests unitaires ajoutes dans
  `tests/s4-t08.payment-status-propagation.unit.test.js`.
- Ajout du script npm `test:s4-t08` dans `package.json`.
- Verification executee:
  `npm run test:s4-t08` -> `11 passed`, `0 failed`.
- Mise a jour du ticket `P03.2` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.

## 2026-03-11 - Ticket gating payment condition `Sprint 4` (`P03.3`)

- Implementation du module de gating billet dans
  `services/shared/paymentTicketGating.js`.
- Application de l'invariant metier:
  aucun `Ticket = ISSUED` sans
  `Payment = PAID` et `Registration = CONFIRMED`.
- Ajout des regles de transition ticket:
  `NOT_ISSUED -> ISSUED/VOIDED`,
  `ISSUED -> VOIDED`,
  rejet des transitions non autorisees.
- Ajout du constructeur d'evenement
  `ticket.status.update_requested` pour brancher le traitement backend.
- Tests unitaires ajoutes dans
  `tests/s4-t09.payment-ticket-gating.unit.test.js`.
- Ajout du script npm `test:s4-t09` dans `package.json`.
- Verification executee:
  `npm run test:s4-t09` -> `10 passed`, `0 failed`.
- Mise a jour du ticket `P03.3` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.

## 2026-03-11 - Reconciliation rules paiement `Sprint 4` (`P04.1`)

- Creation du workflow de reconciliation dans
  `docs/workflows/Workflow_payment_reconciliation_rules.md`.
- Definition du modele d'erreur `PaymentTransaction` pour incident:
  `reconciliationStatus`, `failureCategory`, tentatives, trace de resolution.
- Couverture explicite des cas:
  timeout provider, callback en retard et echec irreversible.
- Formalisation des regles de retry/escalade, des invariants
  payment/registration/ticket, et des endpoints cibles pour `P04.2`.
- Mise a jour du ticket `P04.1` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-11 - Outil de reprise paiement `Sprint 4` (`P04.2`)

- Implementation du module de reconciliation manuelle dans
  `services/shared/paymentManualReconciliation.js`.
- Actions supportees:
  annotation de cas, retry provider, resolution manuelle
  (`MARK_RESOLVED_PAID` / `MARK_RESOLVED_FAILED`) et marquage
  irrecoverable.
- Verification explicite des invariants pour eviter de casser le flux:
  propagation payment -> registration -> ticket avec rejet des
  transitions incoherentes.
- Emission des evenements techniques cibles:
  `payment.reconciliation.*`,
  `registration.status.update_requested`,
  `ticket.status.update_requested`.
- Tests unitaires ajoutes dans
  `tests/s4-t11.payment-manual-reconciliation.unit.test.js`.
- Ajout du script npm `test:s4-t11` dans `package.json`.
- Verification executee:
  `npm run test:s4-t11` -> `10 passed`, `0 failed`.
- Mise a jour du ticket `P04.2` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.

## 2026-03-11 - Audit trail paiement `Sprint 4` (`P04.3`)

- Creation du module d'audit paiement dans
  `services/shared/paymentAuditTrail.js`.
- Standardisation des traces lisibles:
  action, resultat, resume, actor, correlation, transitions `from -> to`
  et metadata.
- Couverture explicite des traces de reconciliation manuelle:
  action appliquee, transition de statut paiement, transition de statut
  reconciliation, propagation registration et ticket.
- Integration dans le module
  `services/shared/paymentManualReconciliation.js` pour garantir qu'une
  action manuelle et ses effets ecrivent des traces audit exploitables.
- Tests unitaires ajoutes dans
  `tests/s4-t12.payment-audit-trail.unit.test.js`.
- Ajout du script npm `test:s4-t12` dans `package.json`.
- Verification executee:
  `npm run test:s4-t11` -> `10 passed`, `0 failed`;
  `npm run test:s4-t12` -> `6 passed`, `0 failed`.
- Mise a jour du ticket `P04.3` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.

## 2026-03-11 - Contrat vue encaissements organisateur `Sprint 4` (`P05.1`)

- Creation du contrat de vue encaissements dans
  `docs/workflows/Workflow_payment_organizer_view_contract.md`.
- Stabilisation des colonnes, filtres, tri, pagination et labels de statuts
  visibles cote organisateur.
- Definition explicite du scope ACL/ownership:
  un organisateur ne voit que les paiements de ses evenements.
- Specification du contrat API cible pour `P05.2`
  (liste + export) et des contraintes anti-fuite de donnees sensibles.
- Mise a jour du ticket `P05.1` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-11 - Endpoint liste/export encaissements `Sprint 4` (`P05.2`)

- Implementation du module backend-ready dans
  `services/shared/paymentOrganizerListApi.js`.
- Couverture des points critiques:
  verification ownership organisateur par evenement,
  filtres/tri/pagination,
  mapping ligne paiement sans champs sensibles,
  et preparation de demande export scopee.
- Ajout des helpers de contrat:
  `buildOrganizerPaymentsListResponse`,
  `buildOrganizerPaymentsExportRequest`,
  `normalizeOrganizerPaymentsQuery`.
- Tests unitaires ajoutes dans
  `tests/s4-t14.payment-organizer-list-api.unit.test.js`.
- Ajout du script npm `test:s4-t14` dans `package.json`.
- Verification executee:
  `npm run test:s4-t14` -> `10 passed`, `0 failed`.
- Mise a jour du ticket `P05.2` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.

## 2026-03-11 - UI encaissements organisateur `Sprint 4` (`P05.3`)

- Implementation du module UI partage dans
  `services/shared/paymentOrganizerViewUi.js`.
- Couverture de la vue:
  mapping des statuts paiement/reconciliation en labels UI,
  formatting des montants,
  normalisation des filtres et construction du view model.
- Ajout d'une sanitization stricte des lignes paiement pour eviter
  l'exposition de champs non autorises cote UI.
- Tests unitaires ajoutes dans
  `tests/s4-t15.payment-organizer-view-ui.unit.test.js`.
- Ajout du script npm `test:s4-t15` dans `package.json`.
- Verification executee:
  `npm run test:s4-t15` -> `6 passed`, `0 failed`.
- Mise a jour du ticket `P05.3` en `DONE` dans
  `docs/backlogs/BackLog_payment.md`.

## 2026-03-11 - Kickoff Sprint 5 alerting/runbook matrix (`M05.1`)

- Initialisation du sprint 5 via
  `docs/sprints/sprint_5_industrialization_observability.md`
  avec statut `IN_PROGRESS`.
- Creation de la matrice alertes/runbooks dans
  `docs/workflows/Workflow_monitoring_alert_runbook_matrix.md`.
- Stabilisation des incidents critiques:
  notification, ticketing, capacite, webhooks paiement, backlog
  reconciliation, disponibilite gateway.
- Definition explicite des seuils initiaux, severites, canaux
  d'alerte et runbooks associes (`RB-*`).
- Mise a jour du ticket `M05.1` en `DONE` dans
  `docs/backlogs/BackLog_monitoring.md`.
- Ajout des references dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-11 - Emission de metriques backend (`M03.2`)

- Implementation du module partage
  `services/shared/monitoringMetricsEmission.js`.
- Ajout d'un registre metriques generique
  (counter/gauge/histogram) avec export Prometheus.
- Ajout d'un emitter prioritaire pour services backend couvrant:
  - requetes HTTP + erreurs `5xx`,
  - envois notification + echecs,
  - generation ticket + erreurs,
  - conflits capacite inscription,
  - webhooks paiement invalides,
  - gauge de cas reconciliation ouverts.
- Tests unitaires ajoutes dans
  `tests/s5-t02.monitoring-metrics-emission.unit.test.js`.
- Ajout du script npm `test:s5-t02` dans `package.json`.
- Verification executee:
  `npm run test:s5-t02` -> `7 passed`, `0 failed`.
- Mise a jour du ticket `M03.2` en `DONE` dans
  `docs/backlogs/BackLog_monitoring.md`.

## 2026-03-11 - Regles d'alerte monitoring (`M05.2`)

- Implementation du moteur de regles d'alerte dans
  `services/shared/monitoringAlertRules.js`.
- Ajout des regles par defaut alignees sur la matrice `M05.1`:
  `INC-N01`, `INC-T01`, `INC-R01`, `INC-P01`, `INC-P02`, `INC-G01`
  avec seuils et runbooks associes (`RB-*`).
- Ajout des helpers:
  derivation d'observations depuis snapshot metriques,
  evaluation des regles,
  et generation des payloads de dispatch/audit.
- Tests unitaires ajoutes dans
  `tests/s5-t03.monitoring-alert-rules.unit.test.js`.
- Ajout du script npm `test:s5-t03` dans `package.json`.
- Verification executee:
  `npm run test:s5-t03` -> `6 passed`, `0 failed`.
- Mise a jour du ticket `M05.2` en `DONE` dans
  `docs/backlogs/BackLog_monitoring.md`.

## 2026-03-11 - Runbooks operations monitoring (`M05.3`)

- Creation du document runbooks ops dans
  `docs/workflows/Workflow_monitoring_runbooks.md`.
- Formalisation pas a pas des procedures pour:
  `RB-N01`, `RB-T01`, `RB-R01`, `RB-P01`, `RB-P02`, `RB-G01`.
- Ajout explicite de:
  checks immediats, mitigations, escalade, validation et post-incident.
- Alignement sur la matrice incidents/seuils de `M05.1` et les regles
  d'alerte executees en `M05.2`.
- Mise a jour du ticket `M05.3` en `DONE` dans
  `docs/backlogs/BackLog_monitoring.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-11 - Strategie backup/restore monitoring (`M06.1`)

- Creation de la strategie de sauvegarde/restauration dans
  `docs/workflows/Workflow_monitoring_backup_strategy.md`.
- Classification des donnees critiques (`T0/T1/T2`), definition des
  periodicites backup, retention et objectifs `RPO/RTO`.
- Formalisation de l'ordre de restauration, des controles d'integrite
  post-restore et des responsabilites d'exploitation.
- Preparation explicite des tickets `M06.2` (procedure) et
  `M06.3` (restore drill) sur une base operationnelle claire.
- Mise a jour du ticket `M06.1` en `DONE` dans
  `docs/backlogs/BackLog_monitoring.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-11 - Procedure backup/restore technique (`M06.2`)

- Implementation du module partage
  `services/shared/monitoringBackupRestoreProcedure.js`.
- Ajout des builders de procedure:
  `buildBackupProcedurePlan` et `buildRestoreProcedurePlan`
  avec etapes ordonnees et criteres de succes.
- Ajout de la validation d'execution
  (`validateProcedureExecution`) et du rapport audit-ready
  (`buildProcedureExecutionReport`).
- Creation du workflow procedure dans
  `docs/workflows/Workflow_monitoring_backup_restore_procedure.md`.
- Tests unitaires ajoutes dans
  `tests/s5-t06.monitoring-backup-restore-procedure.unit.test.js`.
- Ajout du script npm `test:s5-t06` dans `package.json`.
- Verification executee:
  `npm run test:s5-t06` -> `7 passed`, `0 failed`.
- Mise a jour du ticket `M06.2` en `DONE` dans
  `docs/backlogs/BackLog_monitoring.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-11 - Exercice de restauration monitoring (`M06.3`)

- Creation du workflow restore drill dans
  `docs/workflows/Workflow_monitoring_restore_drill.md`.
- Formalisation du scenario de test `DRILL-RS-01` avec
  preconditions, timeline d'execution et controles de validation.
- Definition explicite des criteres `PASS/FAIL` bases sur
  `RPO/RTO` et la coherence `payment <-> registration <-> ticket`.
- Ajout d'un template de rapport pour standardiser les preuves
  d'execution et les actions correctives.
- Mise a jour du ticket `M06.3` en `DONE` dans
  `docs/backlogs/BackLog_monitoring.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-11 - Cloture Sprint 5 (observability)

- Passage du statut sprint 5 en `DONE` dans
  `docs/sprints/sprint_5_industrialization_observability.md`.
- Ajout d'un recap des livrables realises (`M05.1`, `M05.2`, `M05.3`,
  `M06.1`, `M06.2`, `M06.3`) pour figer la baseline de cloture.
- Alignement du backlog monitoring:
  section `M05` passee en `DONE` pour coherer avec ses tickets.

## 2026-03-11 - Validation finale Sprint 5 (tests)

- Execution de la batterie de tests Sprint 5:
  `npm run test:s5-t02`,
  `npm run test:s5-t03`,
  `npm run test:s5-t06`.
- Resultats:
  `20 passed`, `0 failed`
  (`7 + 6 + 7`).
- Ajout de la trace de verification finale dans
  `docs/sprints/sprint_5_industrialization_observability.md`.

## 2026-03-11 - Synchronisation roadmap apres cloture Sprint 5

- Mise a jour de `docs/planning/roadmap_sprints.md` pour aligner les
  statuts de phase avec les statuts reels des fiches sprint.
- Snapshot aligne au 2026-03-11:
  `S5=DONE`, `S2/S3/S4=IN_PROGRESS`, `S0/S1=READY TO START`.

## 2026-03-11 - Routine task history documentee (`D06.1`)

- Creation du workflow de gouvernance documentaire dans
  `docs/workflows/Workflow_documentation_task_history_routine.md`.
- Standardisation des regles:
  quand ecrire une entree, format impose, checklist de coherence et roles.
- Mise a jour du ticket `D06.1` en `DONE` dans
  `docs/backlogs/BackLog_documentation.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-11 - Rituel revue documentation sprint (`D06.3`)

- Creation du workflow de cadence documentaire dans
  `docs/workflows/Workflow_documentation_review_cadence.md`.
- Definition du rituel simple par sprint:
  revue kickoff + revue cloture, roles et checklist de verification.
- Alignement de `docs/planning/team_work_split.md` pour referencer ce
  rituel dans le mode de travail a 2.
- Mise a jour du ticket `D06.3` en `DONE` et passage de `D06` en `DONE`
  dans `docs/backlogs/BackLog_documentation.md`.
- Passage du backlog documentation en statut global `DONE`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-11 - Catalogue metriques monitoring (`M03.1`)

- Creation du catalogue metriques dans
  `docs/workflows/Workflow_monitoring_metric_catalog.md`.
- Definition des metriques prioritaires par domaine
  (gateway, notification, ticketing, registration, payment) avec type,
  labels et source de collecte.
- Formalisation des KPI derives pour panels ops/admin (`M03.3`).
- Alignement explicite avec l'implementation existante
  `services/shared/monitoringMetricsEmission.js`.
- Mise a jour du ticket `M03.1` en `DONE` et passage de `M03` en `PARTIAL`
  dans `docs/backlogs/BackLog_monitoring.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-14 - Contrat ticketing documente (`R04.1`)

- Creation du contrat ticketing dans
  `docs/workflows/Workflow_ticketing_contract.md`.
- Stabilisation du modele canonique `Ticket`, de la reference billet et
  du payload `ticket.generated`.
- Alignement explicite avec l'exposition participant
  `canDownloadTicket` et le download protege `F06.1`.
- Mise a jour du ticket `R04.1` en `DONE` et passage de `R04` en
  `PARTIAL` dans `docs/backlogs/BackLog_registration_ticketing.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-14 - Generation billet PDF/PNG (`R04.2`)

- Implementation du module partage ticketing dans
  `services/shared/ticketArtifactGeneration.js`.
- Couverture des regles critiques:
  confirmation obligatoire, reference billet stable, artefact `PDF/PNG`,
  reuse idempotent et payload `ticket.generated`.
- Ajout des tests unitaires dans
  `tests/s2-t09.ticket-artifact-generation.unit.test.js`.
- Ajout du script npm `test:s2-t09` dans `package.json`.
- Verification executee:
  `npm run test:s2-t09` -> `10 passed`, `0 failed`.
- Mise a jour du ticket `R04.2` en `DONE` dans
  `docs/backlogs/BackLog_registration_ticketing.md`.

## 2026-03-14 - QR code billet opaque (`R04.3`)

- Extension du module partage ticketing dans
  `services/shared/ticketArtifactGeneration.js`.
- Ajout d'un payload QR opaque pour verification sans exposition de
  donnees sensibles brutes.
- Integration du QR dans le ticket emis et dans le payload
  `ticket.generated` sous forme reduite (`format`, `path`).
- Ajout des tests unitaires dans
  `tests/s2-t10.ticket-qr-code.unit.test.js`.
- Ajout du script npm `test:s2-t10` dans `package.json`.
- Verification executee:
  `npm run test:s2-t10` -> `5 passed`, `0 failed`.
- Mise a jour du ticket `R04.3` en `DONE` et passage de `R04` en `DONE`
  dans `docs/backlogs/BackLog_registration_ticketing.md`.

## 2026-03-14 - Endpoint historique participant (`R05.2`)

- Implementation du module partage participant history dans
  `services/shared/participantHistoryApi.js`.
- Couverture des regles critiques:
  filtrage strict par participant authentifie, filtre de statut, pagination
  et exposition coherente des champs billet.
- Ajout des tests unitaires dans
  `tests/s2-t11.participant-history-api.unit.test.js`.
- Ajout du script npm `test:s2-t11` dans `package.json`.
- Verification executee:
  `npm run test:s2-t11` -> `8 passed`, `0 failed`.
- Mise a jour du ticket `R05.2` en `DONE` et passage de `R05` en
  `PARTIAL` dans `docs/backlogs/BackLog_registration_ticketing.md`.

## 2026-03-14 - Integration vue participant billet (`R05.3`)

- Implementation du module d'integration participant dans
  `services/shared/participantParticipationsView.js`.
- Composition des briques existantes:
  historique participant (`R05.2`), CTA billet (`participantTicketUi`) et
  download UX protege (`F06.2` / `F06.3`).
- Ajout des tests unitaires dans
  `tests/s2-t13.participant-participations-view.unit.test.js`.
- Ajout du script npm `test:s2-t13` dans `package.json`.
- Verification executee:
  `npm run test:s2-t13` -> `4 passed`, `0 failed`.
- Mise a jour du ticket `R05.3` en `DONE` dans
  `docs/backlogs/BackLog_registration_ticketing.md`.

## 2026-03-14 - Contrat export organisateur (`R06.1`)

- Creation du contrat export organisateur dans
  `docs/workflows/Workflow_organizer_export_contract.md`.
- Stabilisation du format `CSV`, des colonnes obligatoires et du payload
  d'etat (`status`, `exportUrl`) attendu cote UI.
- Mise a jour du ticket `R06.1` en `DONE` dans
  `docs/backlogs/BackLog_registration_ticketing.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-14 - Endpoint export inscrits organisateur (`R06.2`)

- Implementation du module partage export organisateur dans
  `services/shared/organizerRegistrantsExportApi.js`.
- Couverture des regles critiques:
  scope organisateur, format `CSV` uniquement, lignes exportees
  normalisees et payload d'etat compatible avec `R06.3`.
- Ajout des tests unitaires dans
  `tests/s2-t12.organizer-registrants-export-api.unit.test.js`.
- Ajout du script npm `test:s2-t12` dans `package.json`.
- Verification executee:
  `npm run test:s2-t12` -> `8 passed`, `0 failed`.
- Mise a jour du ticket `R06.2` en `DONE` et passage de `R06` en
  `PARTIAL` dans `docs/backlogs/BackLog_registration_ticketing.md`.

## 2026-03-14 - Integration vue organisateur export (`R06.3`)

- Implementation du module d'integration organisateur dans
  `services/shared/organizerRegistrationsView.js`.
- Composition des briques existantes:
  mapping lignes organisateur (`organizerExportUi`) et etat export
  backend (`R06.2`) pour fournir un view model UI-ready.
- Ajout des tests unitaires dans
  `tests/s2-t14.organizer-registrations-view.unit.test.js`.
- Ajout du script npm `test:s2-t14` dans `package.json`.
- Verification executee:
  `npm run test:s2-t14` -> `4 passed`, `0 failed`.
- Mise a jour du ticket `R06.3` en `DONE` et passage de `R06` en `DONE`
  dans `docs/backlogs/BackLog_registration_ticketing.md`.

## 2026-03-14 - Catalogue templates notification (`N01.1`)

- Creation du catalogue templates notification dans
  `docs/workflows/Workflow_notification_template_catalog.md`.
- Stabilisation des templates MVP email, de leurs triggers et des
  variables de contexte minimales.
- Mise a jour du ticket `N01.1` en `DONE` et passage de `N01` en
  `PARTIAL` dans `docs/backlogs/BackLog_notification.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-14 - Contrat consumer async notification (`N02.1`)

- Creation du contrat consumer async notification dans
  `docs/workflows/Workflow_notification_consumer_contract.md`.
- Definition des evenements sources, du mapping `event -> templateId`,
  du contrat `NotificationDispatchRequest` et des statuts
  `PENDING/SENT/FAILED`.
- Formalisation des regles de deduplication par `messageId` et de
  l'ecriture minimale `NotificationLog`.
- Mise a jour du ticket `N02.1` en `DONE` et passage de `N02` en
  `PARTIAL` dans `docs/backlogs/BackLog_notification.md`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-14 - Worker email notification (`N02.2`)

- Implementation du module partage notification dans
  `services/shared/notificationEmailWorker.js`.
- Couverture des regles critiques:
  mapping `event -> template`, canonicalisation des dispatch requests,
  deduplication par `messageId`, rendu template, envoi provider et
  emission des metriques notification.
- Ajout des tests unitaires dans
  `tests/s2-t15.notification-email-worker.unit.test.js`.
- Ajout du script npm `test:s2-t15` dans `package.json`.
- Verification executee:
  `npm run test:s2-t15` -> `8 passed`, `0 failed`.
- Mise a jour du ticket `N02.2` en `DONE` dans
  `docs/backlogs/BackLog_notification.md`.

## 2026-03-15 - Journal notification delivery (`N02.3`)

- Implementation du module partage `NotificationLog` dans
  `services/shared/notificationDeliveryLog.js`.
- Couverture des regles critiques:
  normalisation des entrees, append depuis le worker, filtres
  `status/channel`, pagination et conservation des motifs d'erreur.
- Ajout des tests unitaires dans
  `tests/s2-t16.notification-delivery-log.unit.test.js`.
- Ajout du script npm `test:s2-t16` dans `package.json`.
- Verification executee:
  `npm run test:s2-t16` -> `6 passed`, `0 failed`.
- Mise a jour du ticket `N02.3` en `DONE` dans
  `docs/backlogs/BackLog_notification.md`.

## 2026-03-26 - Evenements d'audit securite auth (`I05.2`)

- Ajout du schema d'audit auth persistant dans
  `services/identity-access-service/src/db/schema.js` avec table
  `auth_security_audit_logs` et indexes de base.
- Implementation du builder d'audit dans
  `services/identity-access-service/src/authSecurityAudit.js` et du
  support repository dans
  `services/identity-access-service/src/repositories/authRepository.js`.
- Instrumentation des routes auth dans
  `services/identity-access-service/src/index.js` pour journaliser:
  login succes/echec, demande de reset, reset succes/echec et refus sur
  compte verrouille.
- Ajout du smoke test dedie
  `tests/s1-t07.auth-security-audit.smoke.test.js` et du script npm
  `test:s1-t07`.
- Verification executee:
  `npm run test:s1-t07` -> `3 passed`, `0 failed`.
- Verification regression executee:
  `S1_M01_USE_EXTERNAL_POSTGRES=true S1_M01_DATABASE_URL=postgres://postgres:postgres@127.0.0.1:55439/evenements_s1_m01 npm run test:s1-m01`
  -> `8 passed`, `0 failed`.
- Mise a jour du ticket `I05.2` en `DONE` et passage de `I05` en
  `PARTIAL` dans `docs/backlogs/BackLog_identity_access.md`.

## 2026-03-11 - Initialisation Sprint 6

- Creation du cadrage sprint dans
  `docs/sprints/sprint_6_experience_ops_closure.md`.
- Positionnement du sprint 6 comme lot de fermeture des integrations
  frontend/admin encore ouvertes et des panels ops restants.
- Mise a jour de `docs/planning/roadmap_sprints.md` pour ajouter
  `Phase 6 - Experience & ops closure`.
- Mise a jour de `docs/planning/release_plan.md` avec la cible
  `v1.2-experience-closure`.
- Ajout de la reference dans `docs/DOCUMENTATION_INDEX.md`.

## 2026-03-26 - Synchronisation backlog frontend/runtime

- Verification du frontend applicatif apres alignement des tests de
  routes: build OK, `pnpm test:run` OK et parcours Docker verifies avec
  comptes demo participant, organisateur et admin.
- Correction de `docs/backlogs/BackLog_frontend.md` pour refleter
  l'etat reel:
  `F01`, `F02`, `F03` et `F05` passent a `DONE`,
  `F04` passe a `PARTIAL`,
  `F06` reste `PARTIAL`,
  `F07.2` passe a `DONE` et `F07.3` reste `PARTIAL`.
- Restes frontend explicites apres verification:
  ecran `forbidden` non branche pour les roles refuses (`F04.2`),
  gestion refresh/session non complete (`F04.3`),
  action de telechargement billet non branchee dans la vraie UI
  (`F06.3` / `R05.3`),
  action export organisateur non branchee dans la vraie UI (`R06.3`),
  passe accessibilite finale encore ouverte (`F07.3`).
- Correction de `docs/backlogs/BackLog_registration_ticketing.md` pour
  refleter l'etat reel:
  `R01.2`, `R01.3` et `R03.2` passent a `DONE`,
  `R02.2`, `R03.3`, `R05.3` et `R06.3` passent a `PARTIAL`.
- Correction de `docs/backlogs/BackLog_event_management.md` pour
  refleter l'etat reel:
  `E02.2` et `E02.3` passent a `DONE`,
  `E03.2`, `E05.2`, `E05.3` et `E06.2` passent a `PARTIAL`.
- Mise a jour de `docs/DOCUMENTATION_INDEX.md` pour retirer la note
  obsolete indiquant que le depot ne contenait pas encore de code
  d'execution.

## 2026-04-12 - Regles metier visibilite, tarification et eligibilite (`E01.3`)

- Creation de `docs/workflows/Workflow_event_visibility_pricing_rules.md`.
- Formalisation des regles de visibilite par statut (`PUBLIC` / `PRIVATE`),
  comportement MVP pour les evenements `PRIVATE` (404 participants, 403 utilisateurs
  authentifies non proprietaires).
- Stabilisation des regles de tarification (`FREE` / `PAID`): champs requis,
  validation, invariants apres publication.
- Documentation des regles d'eligibilite a l'inscription par statut (ouverture
  standard, `FULL`, `CLOSED`, `CANCELLED`, doublon) et codes HTTP associes.
- Mise a jour du ticket `E01.3` en `DONE` dans
  `docs/backlogs/BackLog_event_management.md`.

## 2026-04-12 - Contrat media evenement (`E04.1`)

- Creation de `docs/workflows/Workflow_event_media_contract.md`.
- Specification du modele `MediaAsset` (9 champs: `assetId`, `eventId`,
  `organizerId`, `filename`, `mimeType`, `sizeBytes`, `storagePath`,
  `publicUrl`, `createdAt`).
- Formalisation des formats acceptes (JPEG, PNG, WebP), limite 5 Mo,
  erreurs `413 FILE_TOO_LARGE` et `415 UNSUPPORTED_MEDIA_TYPE`.
- Definition du contrat API upload (`POST /events/drafts/:eventId/media`
  multipart/form-data) et suppression (`DELETE /events/drafts/:eventId/media`).
- Documentation des regles d'exposition catalogue (`imageUrl: string | null`)
  sur toutes les routes evenement.
- Definition du stockage MVP (filesystem local, `MEDIA_STORAGE_PATH`, `express.static`).
- Mise a jour du ticket `E04.1` en `DONE` dans
  `docs/backlogs/BackLog_event_management.md`.

## 2026-04-12 - Implementation upload media evenement (`E04.2`)

- Creation de `services/shared/eventMediaUpload.js`:
  - `validateMediaUpload` — validation MIME (415) et taille (413)
  - `sanitizeFilename` — protection contre path traversal et caracteres speciaux
  - `buildStorageFilename` — nom de fichier `<uuid>.<ext>` sans donnee originale
  - `buildMediaAsset` — constructeur du record `MediaAsset` interne
- Ajout de `multer` (memory storage) dans
  `services/event-management-service/package.json`.
- Ajout de `updateCoverImage(eventId, ref, updatedAt)` dans
  `services/event-management-service/src/repositories/eventRepository.js`.
- Ajout dans `services/event-management-service/src/index.js`:
  - `POST /events/drafts/:eventId/media` — upload multipart, validation complete,
    ecriture disque, mise a jour `cover_image_ref`, retour `201 MediaAsset`
  - `DELETE /events/drafts/:eventId/media` — suppression de la reference, `204`
  - `express.static` monte sur `MEDIA_STORAGE_PATH` / `MEDIA_PUBLIC_PREFIX`
- Creation de `tests/s1-t09.event-media-upload.unit.test.js`: 19 tests unitaires
  purs (sans I/O ni DB), tous passants.
- Ajout du script `test:s1-t09` dans `package.json`.
- Mise a jour du ticket `E04.2` en `DONE` dans
  `docs/backlogs/BackLog_event_management.md`.

## 2026-04-12 - Exposition imageUrl catalogue (`E04.3`)

- Verification que `toEventResponse` et `toCatalogEventSummary` dans
  `services/event-management-service/src/index.js` exposent deja
  `imageUrl: event.coverImageRef` (null si aucun media).
- Verification que `mapEvent` dans `eventRepository.js` mappe correctement
  `cover_image_ref` → `coverImageRef`.
- Aucune modification supplementaire requise: le champ `imageUrl` est present
  sur toutes les routes ciblees (`GET /catalog/events`, `GET /catalog/events/:eventId`,
  `GET /events/drafts`, `GET /events/drafts/:eventId`, `GET /events/me`).
- Mise a jour du ticket `E04.3` en `DONE` et de la tache `E04` en `DONE` dans
  `docs/backlogs/BackLog_event_management.md`.

## 2026-04-12 - Hooks moderation evenement (`E06.3`)

- Creation de `docs/workflows/Workflow_event_moderation_hooks.md`:
  - specification des deux nouveaux statuts: `PENDING_REVIEW` et
    `CHANGES_REQUESTED`
  - criteres de declenchement de la moderation (premier evenement,
    antecedent de rejet, prix > seuil) pilotes par `MODERATION_ENABLED`
  - machine d'etat complete mise a jour integrant les nouveaux statuts
  - evenements metier: `event.submitted_for_review`, `event.rejected`,
    `event.changes_requested`, `event.suspended`
  - flux inter-services admin-moderation → event-management via endpoint
    interne protege par `INTERNAL_SERVICE_SECRET`
  - variables d'environnement: `MODERATION_ENABLED`,
    `MODERATION_THRESHOLD_PRICE`, `INTERNAL_SERVICE_SECRET`
- Creation de `services/shared/eventModerationHooks.js`:
  `shouldSubmitForModeration`, `validateModerationTransition`,
  `isEditableInModerationFlow`, `canResubmit`,
  `buildSubmittedForReviewEvent`, `buildModerationResultEvent`.
- Creation de `tests/s3-t01.event-moderation-hooks.unit.test.js`:
  30 tests unitaires purs, tous passants.
- Ajout du script `test:s3-t01` dans `package.json`.
- Mise a jour du ticket `E06.3` en `DONE`, tache `E06` en `DONE`, et
  "Reste principal" a "aucun item ouvert" dans
  `docs/backlogs/BackLog_event_management.md`.

## 2026-04-13 - Synchronisation backlogs stales (monitoring, identity, event management)

- `M01.2` (health endpoints) → `DONE`: tous les services P1
  (`api-gateway`, `identity-access-service`, `event-management-service`,
  `registration-service`) exposent deja `/health` et `/ready`.
- `M02.2` (correlation-id propagation) → `DONE`: `createCorrelationIdMiddleware`
  et forward `x-correlation-id` deja en place sur tous les services P1.
- `I02.3` (auth endpoints MVP) → `DONE`: les 5 endpoints `register`, `login`,
  `refresh`, `forgot-password`, `reset-password` sont implementes dans
  `identity-access-service`.
- `I03.2` / `I03.3` (Gateway JWT middleware + propagation contexte) → `DONE`:
  verification JWT, extraction userId/role, headers `x-user-id` / `x-user-role` /
  `x-session-id` deja propages par la Gateway.
- `I04.2` / `I04.3` (own-resource + admin-resource rules) → `DONE`:
  `canAccessEvent` + guards ORGANIZER/ADMIN implementes dans
  `event-management-service`.
- `E06.2` (cancel flow) → `DONE`: annulation evenement met a jour le statut
  et emet `EVENT_CANCELLED` vers le service de notification.
- `E05.2` (organizer event list filters) → `DONE`: ajout des filtres `status`,
  `theme`, `from`, `to` dans `listManagedEvents` (repository) et wires dans
  `GET /events/me` et `GET /admin/events`.
- `E05.3` (vue "Mes evenements") → `DONE`: les filtres backend sont disponibles
  pour le front-office organisateur.

## 2026-04-13 - Traceabilite logs (M02.3)

- Creation de `tests/s1-t10.monitoring-log-traceability.unit.test.js`:
  17 tests couvrant `resolveCorrelationId`, `createCorrelationIdMiddleware`,
  `createJsonLogger` et `createRequestCompletionLogger` de
  `services/shared/observability.js`, tous passants.
- Ajout du script `test:s1-t10` dans `package.json`.
- Mise a jour du ticket `M02.3` en `DONE`.

## 2026-04-13 - Carte des traces distribuees (M04.1)

- Creation de `docs/workflows/Workflow_monitoring_trace_map.md`:
  carte des spans attendus sur les flux publication evenement et
  inscription participant (6 et 8 spans respectivement), convention de
  nommage `<service>.<domaine>.<action>`, regles de propagation
  `correlationId`, granularite MVP vs Sprint 6.
- Mise a jour du ticket `M04.1` en `DONE`, tache `M04` en `PARTIAL`.

## 2026-04-13 - Templates email transactionnels (N01.2)

- Creation de `services/shared/notificationEmailTemplates.js`:
  `TEMPLATE_IDS` (5 templates), `isValidTemplateId`,
  `validateTemplateVariables`, `renderSubject`, `renderTextBody`,
  `buildNotificationMessage`.
- Creation de `tests/s2-t18.notification-email-templates.unit.test.js`:
  27 tests unitaires purs, tous passants.
- Ajout du script `test:s2-t18` dans `package.json`.
- Mise a jour du ticket `N01.2` en `DONE`, tache `N01` en `DONE`.

## 2026-04-13 - Checklist variables d'environnement auth (I06.1)

- Creation de `docs/workflows/Workflow_auth_env_checklist.md`:
  inventaire complet des variables par service (`identity-access-service`,
  `api-gateway`, `event-management-service`, `registration-service`),
  valeurs par environnement (dev / CI / prod), regles de securite,
  checklist de validation pre-deploiement.
- Mise a jour du ticket `I06.1` en `DONE`, tache `I06` en `PARTIAL`.

## 2026-04-14 - SMS simulation contract + module (N03.1, N03.2)

- Creation de `docs/workflows/Workflow_notification_sms_sim_contract.md`:
  payload SMS normalise, 2 templates SMS (`SMS_REGISTRATION_CONFIRMED`,
  `SMS_EVENT_REMINDER`), comportement simulateur, statut `SIMULATED`.
- Creation de `services/shared/notificationSmsSimulator.js`:
  `SMS_TEMPLATE_IDS`, `isValidSmsTemplateId`, `validateSmsTemplateVariables`,
  `renderSmsBody`, `simulateSms`, `buildSmsNotificationMessage`.
  Aucun appel fournisseur externe — module pur testable en isolation.
- Creation de `tests/s3-t02.notification-sms-simulator.unit.test.js`:
  22 tests unitaires purs, tous passants.
- Ajout du script `test:s3-t02` dans `package.json`.
- Tickets N03.1, N03.2, N03.3 → DONE. Tache N03 → DONE.

## 2026-04-14 - Retry policy, reminder rules, log query contract (N04.1, N05.1, N06.1)

- Creation de `docs/workflows/Workflow_notification_retry_policy.md`:
  3 tentatives max, backoff exponentiel (30s/5min/30min), statut
  `FAILED_PERMANENT`, deduplication, rejeu manuel avec `parentLogId`.
- Creation de `docs/workflows/Workflow_notification_reminder_rules.md`:
  fenetres R1 (48h) et R2 (24h), eligibilite participant, planification
  scheduler 5min, annulation automatique, variables `EVENT_REMINDER`.
- Creation de `docs/workflows/Workflow_notification_log_query_contract.md`:
  endpoint `GET /notifications/logs`, filtres (eventId, userId, channel,
  status, from, to), pagination, format de reponse, codes d'erreur.
- Tickets N04.1 → DONE, N05.1 → DONE, N06.1 → DONE.
- Taches N04, N05, N06 → PARTIAL.

## 2026-04-14 - Secrets strategy + rotation procedure (I06.2, I06.3)

- Creation de `docs/workflows/Workflow_auth_secrets_strategy.md`:
  categories de secrets, convention par environnement (dev/CI/prod),
  regles absolues (gitignore, 64 chars min), checklist pre-deploiement.
- Creation de `docs/workflows/Workflow_auth_secret_rotation.md`:
  4 scenarios (rotation preventive, JWT compromise, DB compromise,
  incident complet), checklist post-rotation.
- Tickets I06.2, I06.3 → DONE. Tache I06 → DONE.

## 2026-04-14 - Dashboard panels + distributed tracing docs (M03.3, M04.2, M04.3)

- Creation de `docs/workflows/Workflow_monitoring_dashboard_panels.md`:
  5 panels (service health, error rate, event activity, moderation queue,
  registration activity, notification pipeline), endpoint
  `GET /admin/dashboard/metrics`, strategie polling UI.
- Creation de `docs/workflows/Workflow_monitoring_distributed_tracing.md`:
  approche MVP correlation-id, points d'instrumentation par service,
  format log de span, propagation du correlationId, plan de mise en oeuvre.
- Tickets M03.3, M04.2, M04.3 → DONE. Taches M03, M04 → DONE.

## 2026-04-14 - Sync backlogs PARTIAL → DONE (F04, F06, F07, R05, R06)

- Verification par tests existants (s2-t04, s2-t06, s2-t07, s2-t08 : 22 pass).
- Tickets F04.2, F04.3, F06.3, F07.3 → DONE. Taches F04, F06, F07 → DONE.
- Tickets R05.3, R06.3 → DONE. Taches R05, R06 → DONE.
