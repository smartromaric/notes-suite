# 📱 Notes Suite - Mobile App (Expo)

Application mobile offline-first pour la gestion de notes collaboratives.

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install --legacy-peer-deps
```

### 2. Configurer l'adresse IP du backend

**⚠️ IMPORTANT**: Pour que l'application mobile puisse communiquer avec le backend, vous devez créer un fichier `.env` avec votre adresse IP locale.

#### Trouver votre adresse IP locale:

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# Cherchez une adresse comme 192.168.x.x ou 10.0.x.x
```

**Windows:**
```bash
ipconfig
# Cherchez IPv4 Address
```

#### Créer le fichier .env:

```bash
echo "API_URL=http://VOTRE_IP:9090" > .env

# Exemple avec IP 192.168.1.100
echo "API_URL=http://192.168.1.100:9090" > .env
```

**Fichier `.env` final:**
```
API_URL=http://192.168.1.100:9090
```

### 3. Lancer l'application

```bash
npx expo start
```

Ensuite:
- Scannez le QR code avec l'app **Expo Go** sur votre téléphone
- Ou appuyez sur `a` pour Android emulator
- Ou appuyez sur `i` pour iOS simulator

## 🎨 Fonctionnalités

- ✅ **Offline-first**: Fonctionne sans connexion internet
- ✅ **Synchronisation auto**: Sync automatique quand connecté
- ✅ **CRUD Notes**: Créer, lire, modifier, supprimer
- ✅ **Markdown**: Éditeur et rendu Markdown
- ✅ **Partage**: Partager avec utilisateurs ou lien public
- ✅ **Recherche**: Par titre, tag, ou visibilité
- ✅ **Tags**: Organisation avec étiquettes
- ✅ **Offline Queue**: Les actions offline sont synchronisées plus tard

## 🛠️ Stack Technique

- **React Native** 0.81
- **Expo** 54
- **TypeScript**
- **Redux Toolkit** (state management)
- **Expo SQLite** (base de données locale)
- **React Navigation** 
- **NativeWind** (Tailwind CSS pour React Native)
- **Axios** (requêtes HTTP)
- **NetInfo** (détection connectivité)

## 🏗️ Architecture

```
src/
├── components/        # Composants réutilisables
├── database/         # SQLite config et repositories
├── navigation/       # React Navigation
├── screens/          # Écrans de l'app
│   ├── auth/        # Login, Register
│   ├── notes/       # Liste, Détails, Création
│   └── public/      # Notes publiques
├── services/         # API et services
└── store/           # Redux store
    ├── auth/        # Auth slice
    ├── notes/       # Notes slice
    └── sync/        # Sync slice (offline)
```

## 🔧 Configuration

### Variables d'environnement (.env)

```bash
# URL du backend (OBLIGATOIRE)
API_URL=http://192.168.1.100:9090
```

### Fichiers de configuration

- `app.config.js` - Configuration Expo
- `tailwind.config.js` - Styles NativeWind
- `babel.config.js` - Configuration Babel
- `tsconfig.json` - Configuration TypeScript

## 📲 Plateformes supportées

- ✅ **Android** (via Expo Go ou build standalone)
- ✅ **iOS** (via Expo Go ou build standalone)

## 🐛 Troubleshooting

### Erreur "Network request failed"

➡️ **Solution**: Vérifiez que le fichier `.env` contient la bonne adresse IP et que le backend est lancé.

```bash
# Vérifier l'IP
ifconfig | grep "inet "

# Mettre à jour .env
echo "API_URL=http://VOTRE_NOUVELLE_IP:9090" > .env

# Relancer Expo avec cache clear
npx expo start --clear
```

### Erreur de dépendances npm

➡️ **Solution**: Utilisez `--legacy-peer-deps`

```bash
npm install --legacy-peer-deps
```

### Base de données SQLite corrompue

➡️ **Solution**: Supprimez l'app et réinstallez

```bash
# Sur l'émulateur/téléphone, désinstallez l'app
# Puis relancez
npx expo start --clear
```

## 📝 Notes importantes

1. **Adresse IP obligatoire**: Le mobile ne peut pas utiliser `localhost`, il faut l'IP locale de votre machine
2. **Backend doit être accessible**: Assurez-vous que le backend est lancé et accessible depuis le réseau local
3. **Même réseau WiFi**: Le téléphone et l'ordinateur doivent être sur le même réseau WiFi
4. **Firewall**: Vérifiez que le port 9090 n'est pas bloqué par un firewall

## 🎨 Design

L'application utilise une palette de couleurs moderne:
- **Vert foncé** (#1E3A2F) - Primary
- **Jaune vibrant** (#FFD700) - Accent
- **Formes abstraites** - Background animé
- **Interface moderne** - UX soignée

## 📄 License

MIT

