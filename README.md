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

### Prérequis
- Java 17+
- Node.js 18+
- React Native CLI
- Docker (optionnel)

### Installation complète
```bash
# Cloner le projet
git clone <repo-url>
cd notes-suite

# Backend Spring Boot
cd backend-spring
./mvnw spring-boot:run

# Frontend Web (nouveau terminal)
cd web-frontend
npm install
npm run dev

# Mobile App (nouveau terminal)
cd mobile-app
npm install
npx react-native run-android  # ou run-ios
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

### ✅ Mobile (React Native)
- Application offline-first
- Synchronisation automatique
- Base de données SQLite locale
- Gestion d'état avec Redux
- Interface native iOS/Android

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

## 🧪 Tests

```bash
# Backend
cd backend-spring && ./mvnw test

# Frontend
cd web-frontend && npm test

# Mobile
cd mobile-app && npm test
```

## 👥 Comptes de démo

- **Admin**: admin@notes.com / admin123
- **User**: user@notes.com / user123

---

**Développé pour l'exercice technique - Gestion de Notes Collaboratives**
# notes-suite
