# 🐳 Docker Configuration - Notes Suite

Ce dossier contient la configuration Docker pour déployer l'application Notes Suite (frontend + backend).

## 📋 Prérequis

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 Démarrage rapide

### 1. Lancer l'application complète

```bash
cd docker
docker-compose up -d
```

### 2. Accéder aux services

- **Frontend Web**: http://localhost:5173
- **Backend API**: http://localhost:9090
- **H2 Console** (dev): http://localhost:9090/h2-console
- **API Docs (Swagger)**: http://localhost:9090/swagger-ui.html

### 3. Arrêter l'application

```bash
docker-compose down
```

### 4. Arrêter et supprimer les volumes

```bash
docker-compose down -v
```

## 📦 Services

### Backend (Spring Boot)
- Port: `9090`
- Base de données: H2 (fichier persistant)
- JWT Authentication
- API REST complète

### Frontend (React + Vite)
- Port: `5173`
- Serveur: Nginx
- Build optimisé pour production

## 🔧 Configuration

### Variables d'environnement

Vous pouvez modifier les variables dans `docker-compose.yml` :

**Backend:**
- `JWT_SECRET`: Clé secrète pour JWT (⚠️ changez en production)
- `CORS_ALLOWED_ORIGINS`: Origins autorisées pour CORS
- `SPRING_DATASOURCE_URL`: URL de la base de données

**Frontend:**
- `VITE_API_BASE_URL`: URL de l'API backend

### Volumes

- `backend-data`: Données persistantes de la base de données H2
- `../backend-spring/logs`: Logs du backend (monté depuis l'hôte)

## 🛠️ Commandes utiles

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Backend uniquement
docker-compose logs -f backend

# Frontend uniquement
docker-compose logs -f frontend
```

### Rebuild les images

```bash
docker-compose build

# Rebuild sans cache
docker-compose build --no-cache
```

### Redémarrer un service

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Vérifier le statut

```bash
docker-compose ps
```

## 🔍 Healthcheck

Le backend inclut un healthcheck qui vérifie `/actuator/health` toutes les 30 secondes. Le frontend ne démarre qu'une fois le backend prêt.

## 📝 Notes

- Les données de la base H2 sont persistées dans le volume Docker `backend-data`
- Les logs du backend sont accessibles dans `backend-spring/logs/`
- Le frontend est servi par Nginx pour de meilleures performances
- La configuration supporte le hot-reload en développement (si vous montez les volumes de code source)

## 🚨 Production

Pour la production, pensez à :

1. Changer `JWT_SECRET` avec une clé sécurisée longue
2. Configurer HTTPS avec un reverse proxy (Traefik, Nginx)
3. Utiliser une base de données PostgreSQL ou MySQL au lieu de H2
4. Configurer des limites de ressources pour les containers
5. Mettre en place un système de backup pour les données

