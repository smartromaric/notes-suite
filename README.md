# 📝 Notes Suite - Application de Gestion de Notes Collaboratives

## 🎯 Vue d'ensemble

Application complète de gestion de notes avec authentification JWT, partage collaboratif, et synchronisation offline-first.

### 🏗️ Architecture

```
notes-suite/
├── backend-spring/          # Spring Boot 3 + SQLite
├── web-frontend/           # React + TypeScript
├── mobile-app/            # React Native + Redux + SQLite
├── docker/
│   └── docker-compose.yml
└── README.md
```

## 🚀 Démarrage rapide

### Option 1: Docker (Recommandé) 🐳

```bash
# Cloner le projet
git clone https://github.com/smartromaric/notes-suite.git
cd notes-suite/docker

# Lancer l'application complète
./start.sh

# Ou manuellement
docker-compose up -d
```

**Accès:**
- Frontend: http://localhost:5173
- Backend: http://localhost:9090
- API Docs: http://localhost:9090/swagger-ui.html

### Option 2: Installation manuelle

#### Prérequis
- Java 17+
- Node.js 18+
- Maven 3.6+

```bash
# Backend Spring Boot
cd backend-spring
./mvnw spring-boot:run

# Frontend Web (nouveau terminal)
cd frontend-web
npm install
npm run dev

# Mobile App Expo (nouveau terminal)
cd mobile-expo

# Créer le fichier .env avec votre adresse IP locale
# Trouvez votre IP: ifconfig | grep "inet " (Mac/Linux) ou ipconfig (Windows)
echo "API_URL=http://VOTRE_IP_LOCALE:9090" > .env
# Exemple: echo "API_URL=http://192.168.1.100:9090" > .env

npm install --legacy-peer-deps
npx expo start
```

## 📋 Fonctionnalités

### ✅ Backend (Spring Boot)
- Authentification JWT (register, login, refresh)
- CRUD complet des notes
- Recherche et filtrage par tags
- Partage par utilisateur et liens publics
- Base de données SQLite
- Documentation OpenAPI/Swagger

### ✅ Frontend Web (React)
- Interface moderne avec Material-UI
- Éditeur Markdown avec prévisualisation
- Gestion des tags et visibilité
- Partage collaboratif
- Authentification sécurisée

### ✅ Mobile (React Native - Expo)
- Application offline-first
- Synchronisation automatique
- Base de données SQLite locale
- Gestion d'état avec Redux
- Interface native iOS/Android
- **⚠️ Configuration requise**: Créer un fichier `.env` dans `mobile-expo/` avec votre adresse IP locale
  ```bash
  # Exemple: mobile-expo/.env
  API_URL=http://192.168.1.100:9090
  ```

## 🛠️ Stack technique

**Backend**
- Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA
- SQLite
- OpenAPI/Swagger

**Frontend Web**
- React 18 + TypeScript
- Material-UI
- React Router
- Axios

**Mobile**
- React Native 0.72
- Redux Toolkit
- SQLite (react-native-sqlite-storage)
- React Navigation

## 📱 APIs disponibles

### Authentification
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`

### Notes
- `GET /api/v1/notes` (avec pagination et filtres)
- `POST /api/v1/notes`
- `GET /api/v1/notes/{id}`
- `PUT /api/v1/notes/{id}`
- `DELETE /api/v1/notes/{id}`

### Partage
- `POST /api/v1/notes/{id}/share/user`
- `POST /api/v1/notes/{id}/share/public`
- `GET /api/v1/p/{url_token}` (lecture publique)

## 🐳 Docker

```bash
# Démarrer tous les services
docker-compose up -d

# Services disponibles
# - API: http://localhost:8080
# - Web: http://localhost:3000
# - Docs: http://localhost:8080/swagger-ui.html
```

## 📖 Documentation

- [Backend Setup](backend-spring/README.md)
- [Web Frontend Setup](web-frontend/README.md)
- [Mobile App Setup](mobile-app/README.md)



---

**Développé pour l'exercice technique - Gestion de Notes Collaboratives**
# notes-suite
