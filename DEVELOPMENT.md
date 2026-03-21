# Setup pour développeurs Streakly

## 🚀 Démarrage rapide

### 1. Prerequisites
- Node.js v16+ installedpour installer complètement
- Xcode (avec iOS Simulator) pour iOS development
- Android Studio (avec Android Emulator) pour Android development

### 2. Installation

```bash
# Cloner le repo
git clone <repo-url>
cd streakly

# Installer les dépendances
npm install

# Démarrer le serveur Expo
npm start
```

### 3. Développement Local

**iOS Simulator:**
```bash
npm start
# Appuyez sur «i» pour lancer iOS Simulator
```

**Android Emulator:**
```bash
npm start
# Appuyez sur «a» pour lancer Android Emulator
```

**Physical Device (via Expo Go):**
```bash
npm start
# Scannez le QR code avec camera (iOS 11+) ou la Expo Go app
```

## 🏗️ Architecture

```
src/
├── components/
│   ├── screens/        # Les 5 écrans principaux
│   └── shared/         # Composants réutilisables
├── design/             # Tokens de design
├── store/              # Zustand store
├── services/           # Business logic
├── hooks/              # Custom React hooks
├── utils/              # Utilitaires
└── navigation/         # Navigation setup
```

## 📝 Conventions de code

### Imports
```typescript
// External packages first
import React from 'react';
import { View } from 'react-native';

// Internal absolute imports
import { COLORS } from '../design/colors';
import { useHabitActions } from '../hooks/useHabitActions';
```

### Nommage
- **Composants**: `PascalCase` (MyComponent.tsx)
- **Fichiers**: `kebab-case` ou `PascalCase` selon le type
- **Variables/Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`

### Styles
- Utiliser `StyleSheet.create()` pour tous les styles
- Grouper logiquement les styles
- Utiliser les design tokens (colors, spacing, radius, text)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Créer une habitude de chaque catégorie
- [ ] Valider une habitude via Today screen
- [ ] Modifier les jours d'activation dans Manage
- [ ] Vérifier les statistiques (aperçu + heatmap)
- [ ] Vérifier la persistance des données après fermeture/réouverture
- [ ] Tester sur iOS et Android

### Performance
```bash
# Profile performance
npm start
# Appuyez sur «Shift + M» pour ouvrir menu developer
# Sélectionnez «Toggle performance monitor»
```

## 🐛 Debugging

```bash
# Logs depuis la CLI
npm start

# React Native Debugger
# Ouvrir depuis menu: Developer Menu > "Debug Remote JS"

# AsyncStorage inspection
# Installer: @react-native-async-storage/async-storage DevTools
```

## 📦 Dépendances Clés

- **react-native-reanimated** - Animations performantes
- **zustand** - État global minimaliste
- **@react-navigation** - Navigation
- **expo-notifications** - Notifications push natives
- **@react-native-async-storage** - Stockage local

## 🚀 Build & Deploy

### Build local avec EAS CLI

```bash
# Installer EAS CLI
npm install -g eas-cli

# Login à Expo
eas login

# Build
eas build --platform ios
eas build --platform android

# Soumettre à l'App Store
eas submit --platform ios

# Soumettre à Google Play
eas submit --platform android
```

### Environment Variables en Production
- Créer `.env` avec les valeurs de production
- Ajouter les secrets Expo dans la dashboard

## 💡 Tips & Tricks

### Hot Reload
- Les modifications au code chaud-reload automatiquement
- Les modifications au design tokens nécessitent un refresh (`r` dans la CLI)

### Fast Development
```bash
# Développer sur un seul écran d'abord
# Puis checker les interactions avec d'autres écrans

# Utiliser async/await au lieu de .then() pour la lisibilité
# Utiliser le store Zustand pour partager l'état, pas Context API
```

### Common Issues

**Issue: "Module not found"**
```bash
rm -rf node_modules
npm install
npm start
```

**Issue: "Simulator not starting"**
```bash
# iOS
xcrun simctl list devices  # List available simulators
xcrun simctl erase all      # Erase frozen simulators
npm start                   # Try again

# Android
emulator -list-avds         # List available emulators
emulator -avd <name>        # Launch specific emulator
npm start                   # Try again
```

## 📚 Resources

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [TypeScript mit React Native](https://reactnative.dev/docs/typescript)

---

Happy coding! 🚀
