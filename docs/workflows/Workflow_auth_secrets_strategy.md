# Workflow auth - Secrets storage strategy (`I06.2`)

Ce document definit la convention de stockage et d'isolation des secrets
pour les quatre services du MVP.

Dependances:

- `I06.1` checklist des variables d'environnement
- `docs/security-strategy-evenements.md`

## 1. Objectif

Ranger les secrets JWT, credentials base de donnees et URL sensibles selon
une convention stable qui garantit :

- aucun secret ne fuite dans le depot git
- les secrets de production sont distincts de ceux de dev/CI
- la rotation est possible sans redeploy applicatif

## 2. Categories de secrets

| Categorie | Exemples | Sensibilite |
|---|---|---|
| JWT signing | `JWT_SECRET`, `JWT_REFRESH_SECRET` | Critique — rotation obligatoire si compromise |
| DB credentials | `DATABASE_URL` (contient user + password) | Critique |
| Service URLs internes | `REGISTRATION_SERVICE_URL` | Faible — pas de credential |
| Cles media | `MEDIA_STORAGE_PATH` | Faible |
| CORS | `CORS_ORIGIN` | Faible |

## 3. Convention par environnement

### 3.1 Development local

Fichier `.env.local` a la racine de chaque service (non commite).
Template commite : `.env.example` avec des valeurs fictives.

```
# services/identity-access-service/.env.example
JWT_SECRET=change-me-in-dev
JWT_REFRESH_SECRET=change-me-in-dev
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/evenements_dev
```

### 3.2 CI (GitHub Actions)

Secrets GitHub Actions (`Settings > Secrets and variables > Actions`) :
- `CI_JWT_SECRET`
- `CI_DATABASE_URL`

Injectes comme variables d'environnement dans les workflows `.github/workflows/`.

Valeurs CI : aleatoires, generes a la creation du projet, jamais reutilises
en production.

### 3.3 Production

Gestionnaire de secrets externe (hors scope MVP, prevu Sprint 4+) :
- Docker Secrets, Vault, ou secrets cloud provider
- Variables injectees au runtime, jamais dans les images Docker

En attendant : variables d'environnement dans `docker-compose.prod.yml`
avec fichier `.env.prod` stocke hors depot (partition chiffree ou vault).

## 4. Regles absolues

1. `.env*` (sauf `.env.example`) est dans `.gitignore` — jamais commite
2. `JWT_SECRET` en production doit faire >= 64 caracteres aleatoires
3. `DATABASE_URL` de production ne doit pas etre partagee entre services
   (chaque service a son propre user DB avec privileges limites)
4. Les credentials CI doivent etre distincts des credentials dev et prod

## 5. Nommage des variables

Convention : `<DOMAINE>_<NOM>` en UPPER_SNAKE_CASE.

| Variable | Service | Exemple de valeur prod |
|---|---|---|
| `JWT_SECRET` | identity-access-service | 64+ chars random base64 |
| `JWT_REFRESH_SECRET` | identity-access-service | 64+ chars random base64 |
| `DATABASE_URL` | tous | `postgres://svc_user:pass@host:5432/db` |
| `JWT_PUBLIC_KEY` | api-gateway (verification) | PEM si RS256, sinon meme secret |
| `CORS_ORIGIN` | api-gateway | `https://app.example.com` |

## 6. Verification pre-deploiement

Avant tout deploiement en production, valider :

- [ ] Aucun `.env` commite (`git grep "DATABASE_URL" -- '*.env'` vide)
- [ ] `JWT_SECRET` >= 64 chars
- [ ] `DATABASE_URL` pointe sur la base de prod, pas CI
- [ ] Les images Docker ne contiennent aucune variable hardcodee

## 7. Hors scope MVP

- Gestion d'un vault centralise (Hashicorp Vault, AWS Secrets Manager)
- Rotation automatique des secrets
- Audit de l'acces aux secrets
