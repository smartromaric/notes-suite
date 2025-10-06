# 🔧 Backend Spring Boot - Notes Collaborative API

## 🚀 Démarrage rapide

### Prérequis
- Java 17+
- Maven 3.6+

### Installation et démarrage

```bash
# Cloner le projet
cd backend-spring

# Installer les dépendances et démarrer
./mvnw spring-boot:run

# Ou avec Maven installé
mvn spring-boot:run
```

L'API sera disponible sur : http://localhost:8080/api/v1

## 📚 Documentation API

### Swagger UI
Une fois l'application démarrée, accédez à la documentation interactive :
- **Swagger UI** : http://localhost:8080/swagger-ui.html
- **API Docs** : http://localhost:8080/v3/api-docs

### Endpoints principaux

#### 🔐 Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/refresh` - Rafraîchir le token

#### 📝 Notes
- `GET /notes` - Liste des notes (avec pagination et filtres)
- `POST /notes` - Créer une note
- `GET /notes/{id}` - Récupérer une note
- `PUT /notes/{id}` - Modifier une note
- `DELETE /notes/{id}` - Supprimer une note

#### 🤝 Partage
- `POST /notes/{id}/share/user` - Partager avec un utilisateur
- `POST /notes/{id}/share/public` - Créer un lien public
- `DELETE /shares/{shareId}` - Supprimer un partage
- `DELETE /public-links/{linkId}` - Supprimer un lien public

#### 🌐 Public
- `GET /p/{urlToken}` - Accéder à une note publique

## 🔧 Configuration

### Base de données SQLite
La base de données SQLite est créée automatiquement dans le dossier `./data/notes.db`

### Variables d'environnement
```yaml
# JWT
jwt.secret: mySecretKey123456789012345678901234567890
jwt.expiration: 86400000  # 24h
jwt.refresh-expiration: 604800000  # 7j

# CORS
cors.allowed-origins: http://localhost:3000,http://localhost:3001
```

## 🧪 Tests

```bash
# Lancer tous les tests
./mvnw test

# Lancer avec couverture
./mvnw test jacoco:report
```

## 📊 Modèle de données

### User
- `id` (Long) - Identifiant unique
- `email` (String) - Email unique
- `passwordHash` (String) - Mot de passe hashé
- `name` (String) - Nom de l'utilisateur
- `createdAt` (LocalDateTime) - Date de création

### Note
- `id` (Long) - Identifiant unique
- `owner` (User) - Propriétaire
- `title` (String) - Titre de la note
- `contentMd` (String) - Contenu en Markdown
- `visibility` (Enum) - PRIVATE, SHARED, PUBLIC
- `createdAt` (LocalDateTime) - Date de création
- `updatedAt` (LocalDateTime) - Date de modification

### Tag
- `id` (Long) - Identifiant unique
- `label` (String) - Libellé du tag

### Share
- `id` (Long) - Identifiant unique
- `note` (Note) - Note partagée
- `sharedWithUser` (User) - Utilisateur avec qui partager
- `permission` (Enum) - READ (lecture seule)

### PublicLink
- `id` (Long) - Identifiant unique
- `note` (Note) - Note publique
- `urlToken` (String) - Token d'accès public
- `expiresAt` (LocalDateTime) - Date d'expiration (optionnel)

## 🔒 Sécurité

- **JWT** : Authentification par token
- **BCrypt** : Hashage des mots de passe
- **CORS** : Configuration pour les requêtes cross-origin
- **Validation** : Validation des données d'entrée

## 📝 Logs

Les logs sont disponibles dans :
- Console : Format JSON structuré
- Fichier : `logs/notes-backend.log`

## 🐳 Docker

```bash
# Construire l'image
docker build -t notes-backend .

# Lancer le conteneur
docker run -p 8080:8080 notes-backend
```

## 🚀 Déploiement

### Production
1. Configurer les variables d'environnement
2. Utiliser une base de données PostgreSQL/MySQL
3. Configurer HTTPS
4. Utiliser un reverse proxy (Nginx)

### Variables d'environnement importantes
```bash
export SPRING_PROFILES_ACTIVE=prod
export JWT_SECRET=your-secret-key
export DATABASE_URL=jdbc:postgresql://localhost:5432/notes
```
