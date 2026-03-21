# Streakly - Habit Tracking App for High Performers

Une application mobile de suivi d'habitudes conçue pour les jeunes entrepreneurs (18-35 ans) qui ne plaisantent pas avec leurs objectifs.

## 🚀 Caractéristiques

- **Aujourd'hui (Home)** - Aperçu du jour avec anneau de progression, liste des habitudes et validation rapide
- **Gérer mes habitudes** - Gestion complète avec ajustement des jours d'activation et suppression
- **Créer une habitude** - Formulaire en 5 étapes progressives avec suggestions
- **Statistiques** - Vue d'ensemble et heatmap mensuelle
- **Widgets** - Prévisualisations des widgets d'accueil
- **Notifications** - Messages motivants adaptés à la catégorie
- **Stockage local** - Toutes les données restent sur le téléphone

## 🎨 Design System

- **Fond principal:** `#0d0f14` (très sombre)
- **Accents:** Violet (`#6c63ff`), Vert (`#22c97a`), Rouge (`#ff4d6a`), Orange (`#ff8c3b`)
- **Style:** Dark, premium, haute énergie - comme un dashboard de trading

## 📋 Prérequis

- **Node.js** (v16 ou supérieur)
- **npm** ou **yarn** ou **pnpm**
- **Expo CLI** (installé automatiquement via npm)
- **iOS/Android simulator** ou **Expo Go** sur un téléphone physique

## 🛠️ Installation

### 1. Installer Node.js

**macOS (via Homebrew):**
```bash
brew install node
```

**Ou depuis [nodejs.org](https://nodejs.org)**

### 2. Installer les dépendances

```bash
cd streakly
npm install
# ou
yarn install
```

### 3. Démarrer l'app

```bash
npm start
# ou
yarn start
```

Cela lancera le serveur Expo. Vous verrez un QR code dans le terminal.

### 4. Ouvrir sur un appareil

**Option A: Simulateur iOS (macOS uniquement)**
```bash
npm start
# Puis appuyez sur «i» dans le terminal
```

**Option B: Simulateur Android**
```bash
npm start
# Puis appuyez sur «a» dans le terminal
```

**Option C: Téléphone physique**
- Scannez le QR code avec la caméra (iPhone) ou l'app Expo Go (Android)
- Ou tapez manuel l'URL du serveur dans Expo Go

## 📱 Structure du Projet

```
streakly/
├── src/
│   ├── components/
│   │   ├── screens/          # Écrans principaux (Today, Create, Manage, Stats, Widget)
│   │   └── shared/           # Composants réutilisables (Button, Card, Badge, etc.)
│   ├── design/               # Design tokens (colors, spacing, text, animations)
│   ├── store/                # Zustand store pour la gestion d'état
│   ├── services/             # Services (storage, notifications, stats)
│   ├── hooks/                # Custom hooks (useHabitActions)
│   ├── utils/                # Utilitaires (dates, textes motivants)
│   └── navigation/           # Navigation (Bottom tabs)
├── app.tsx                   # Entry point
├── app.json                  # Configuration Expo
├── package.json              # Dépendances
└── README.md                 # Ce fichier
```

## 🔑 Points Clés de Développement

### Stockage Local
Toutes les données sont persistées dans `AsyncStorage`. Les habitudes sont chargées au démarrage et sauvegardées après chaque action.

### Gestion d'État
Utilisée Zustand pour l'état global. Le store `habitStore` gère:
- Création/suppression/mise à jour d'habitudes
- Complétions d'habitudes
- Réorganisation

### Services
- **`storageService.ts`** - Persistance AsyncStorage
- **`statsService.ts`** - Calculs de statistiques (streaks, taux complétions, etc.)
- **`notificationService.ts`** - Notifications push natives

### Utils
- **`dateUtils.ts`** - Manipulation de dates et formattage
- **`textCopywriting.ts`** - Messages motivants et suggestions

## 🔔 Notifications

Les notifications sont actuellement configurées mais nécessitent un setup backend complet pour fonctionner en production:

1. Enregistrement du token device
2. Scheduling des notifications locales
3. (Optionnel) Synchronisation cloud pour notifications cross-device

Pour les notifications locales simples, elles fonctionnent out-of-the-box.

## 📊 Logique Métier Clé

### Streaks
- S'incrémente si **≥1 habitude est complétée par jour**
- Reset si **0 habitudes complétées**
- Visible avec l'emoji 🔥

### Statistiques
- **Taux complétions** - % d'habitudes faites sur les derniers 7 jours
- **Total réalisé** - Nombre total d'habitudes complétées ever
- **Meilleure semaine** - Taux le plus élevé sur une semaine

### Catégories
8 catégories prédéfinies avec couleurs et messages motivants:
- Sport
- Nutrition
- Développement
- Études
- Méditation
- Créativité
- Bien-être
- Productivité

## 🎯 Prochaines Étapes

Pour un déploiement en production:

1. **Signing & Build**
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

2. **Soumettre à App Store / Play Store**
   - Suivre les directives de chaque plateforme

3. **Features avancées**
   - Synchronisation cloud (Firebase/Supabase)
   - Export de données
   - Partage de streaks
   - Leaderboards

## 🐛 Troubleshooting

### «Module not found» erreurs
```bash
npm install  # Réinstaller toutes les dépendances
rm -rf node_modules  # Puis recommencer
```

### Port déjà utilisé
```bash
npm start -- --port 8081  # Utiliser un autre port
```

### Simulator ne se lance pas
```bash
# Vérifier que Xcode est à jour
xcode-select --install

# Ou utiliser Android Studio pour Android

# Puis relancer
npm start
```

## 📝 Customisation

### Modifier les couleurs
Éditer `src/design/colors.ts`:
```typescript
export const COLORS = {
  background: {
    primary: '#0d0f14',  // Change le fond principal
    ...
  }
}
```

### Ajouter une catégorie
1. Ajouter le type dans `src/store/types.ts`
2. Ajouter les suggestions dans `src/utils/textCopywriting.ts`
3. Ajouter une couleur dans `src/design/colors.ts`

### Modifier les messages motivants
Éditer `src/utils/textCopywriting.ts` - les tableaux `DAILY_QUOTES`, `COMPLETION_MESSAGES`, etc.

## 📚 Documentation Ressources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://github.com/pmndrs/zustand)

## 📄 Licence

Internal use only.

---

**ADN de Streakly:**
- Sombre, premium, haute énergie
- Pour les performers qui ne plaisantent pas
- Streak = super-pouvoir quotidien
- Chaque jour compte
