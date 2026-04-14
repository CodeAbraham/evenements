# Workflow auth - Secret rotation procedure (`I06.3`)

Ce document decrit la procedure de rotation d'un secret compromis et la
reprise apres incident, sans ambiguite sur l'ordre des operations.

Dependances:

- `I06.1` checklist des variables d'environnement
- `I06.2` strategie de stockage des secrets

## 1. Scenarios couverts

| Scenario | Urgence | Section |
|---|---|---|
| Rotation preventive planifiee de `JWT_SECRET` | Faible | §2 |
| `JWT_SECRET` compromise (leak detecte) | Critique | §3 |
| Mot de passe base de donnees compromise | Critique | §4 |
| Reprise apres incident complet | Post-incident | §5 |

## 2. Rotation preventive de `JWT_SECRET`

Cadence recommandee : tous les 90 jours en production.

**Etapes :**

1. Generer un nouveau secret :
   ```bash
   openssl rand -base64 64
   ```
2. Mettre a jour `JWT_SECRET` dans le gestionnaire de secrets (vault / `.env.prod`)
3. Redemarrer `identity-access-service` (nouveau secret actif)
4. Les tokens existants signés avec l'ancien secret deviennent invalides
   — les utilisateurs se reconnectent (comportement attendu)
5. Mettre a jour `JWT_PUBLIC_KEY` dans `api-gateway` si RS256

**Impact :** deconnexion de tous les utilisateurs actifs. Planifier en
periode creuse (nuit, week-end).

## 3. Rotation d'urgence — `JWT_SECRET` compromis

Si un `JWT_SECRET` fuite (depot public, log, incident) :

1. **Immediat** : invalider tous les tokens en cours
   - Option A : changer `JWT_SECRET` maintenant → deconnexion totale
   - Option B (si Redis disponible) : ajouter un `jti` blocklist — hors MVP
2. Generer un nouveau secret (`openssl rand -base64 64`)
3. Redemarrer `identity-access-service` ET `api-gateway` (ordre : identity d'abord)
4. Verifier que les anciens tokens sont rejetes : tester un token invalide → 401
5. Notifier les utilisateurs si le leak est confirme public

**Temps cible :** < 15 minutes du detecteur au service patche.

## 4. Rotation d'urgence — credential DB compromis

1. Sur la base de donnees : creer un nouvel utilisateur ou changer le mot de passe
   ```sql
   ALTER USER svc_events PASSWORD 'nouveau-mot-de-passe-fort';
   ```
2. Mettre a jour `DATABASE_URL` dans le gestionnaire de secrets
3. Redemarrer le service concerne (pas de coupure des autres services)
4. Verifier la connexion : `GET /health` → `{ "db": "ok" }`
5. Revoquer l'ancien credential une fois le service valide

**Ne pas** reutiliser l'ancien mot de passe meme temporairement.

## 5. Reprise apres incident complet

Si plusieurs secrets sont compromis simultanement :

1. Isoler les services (couper le trafic entrant via gateway ou DNS)
2. Appliquer §3 et §4 dans l'ordre : identity-access-service → api-gateway → autres services
3. Verifier chaque `GET /health` avant de rouvrir le trafic
4. Analyser comment le leak s'est produit (logs, git history, CI)
5. Documenter l'incident dans `docs/task_history.md`

## 6. Verification post-rotation

Checklist a executer apres toute rotation :

- [ ] `GET /health` de chaque service retourne `200` avec `db: ok`
- [ ] Login avec un compte test reussit → token JWT valide
- [ ] Ancien token (garde en preuve) retourne `401`
- [ ] Aucune variable d'environnement ancienne dans les processus (`env | grep SECRET`)
- [ ] Logs ne contiennent pas le secret en clair

## 7. Hors scope MVP

- Rotation automatisee (scheduler + vault TTL)
- Double-signing pendant la periode de transition (pour zero-downtime)
- Notification automatique des utilisateurs
