# MongoDB Exercises - Find & Validation

Projet d'exercices MongoDB avec tests unitaires utilisant Jest et le driver natif MongoDB.

## 📋 Contenu

Ce projet contient deux exercices :

1. **Exercice 1 : Requêtes simples** (`console_games`)
   - Filtrage de données
   - Projections
   - Tri et limite

2. **Exercice 2 : Validation de schéma** (`livre`)
   - Création de collection avec validation
   - Index unique
   - Tests des contraintes

## 🚀 Installation
```bash
# Cloner le repository
git clone https://github.com/Amethyste34/mongo-exo1-find-simple.git
cd mongo-exo1-find-simple

# Installer les dépendances
npm install
```

## ⚙️ Configuration

Assurez-vous que MongoDB est installé et en cours d'exécution sur `localhost:27017`.

La configuration se trouve dans `src/config.js` :
```javascript
{
  mongoUrl: 'mongodb://localhost:27017',
  dbName: 'exercice',
  collectionName: 'console_games'
}
```

## 📚 Exercice 1 : Requêtes simples (console_games)

### Questions

1. ✅ Connexion à MongoDB
2. ✅ Afficher les jeux 3DS sortis
3. ✅ Afficher les jeux 3DS sortis en 2011
4. ✅ Afficher le nom et le global_sales des jeux 3DS sortis en 2011
5. ✅ Afficher le nom et le global_sales des 3 jeux les plus vendus sur 3DS sortis en 2011

### Lancer les tests
```bash
# Tous les tests
npm test

# Uniquement les tests de games
npm run test:games
```

**Résultats attendus :** 12 tests passent ✅

## 📖 Exercice 2 : Validation de schéma (livre)

### Énoncé

Créer une collection `livre` avec les contraintes suivantes :
- **titre** : string unique (requis)
- **auteur** : string non vide (requis)
- **annee** : int, supérieur à 1900 (requis)
- **genre** : string optionnel

### Données de test

| Livre | Auteur | Année | Genre | Résultat attendu |
|-------|--------|-------|-------|------------------|
| Harry Potter à l'école des sorciers | J. K. Rowling | 2001 | Fantasy | ✅ Succès |
| Harry Potter et la chambre des secrets | J. K. Rowling | 2002 | Fantasy | ✅ Succès |
| Livre vieux | Auteur inconnu | 1800 | - | ❌ Échec (année < 1900) |
| Harry Potter à l'école des sorciers | Copycat | 2012 | Fantasy | ❌ Échec (titre en double) |

### Setup
```bash
# Créer la collection avec validation
npm run setup:livre
```

### Lancer les tests
```bash
# Tous les tests
npm test

# Uniquement les tests de livre
npm run test:livre
```

**Résultats attendus :** 9 tests passent ✅

## 📁 Structure du projet
```
exo1-find-simple/
├── __tests__/
│   ├── gamesService.test.js      # Tests des requêtes console_games
│   └── livreService.test.js      # Tests de validation livre
├── scripts/
│   └── setup-livre-collection.js # Script de création de la collection livre
├── src/
│   ├── config.js                 # Configuration MongoDB
│   ├── database.js               # Client MongoDB
│   ├── gamesService.js           # Service pour console_games
│   └── livreService.js           # Service pour livre
├── exercice-validation.md        # Documentation détaillée de l'exercice 2
├── jest.config.js                # Configuration Jest
├── package.json
└── README.md
```

## 🧪 Scripts disponibles
```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests spécifiques
npm run test:games      # Exercice 1
npm run test:livre      # Exercice 2

# Setup collection livre
npm run setup:livre
```

## ✅ Résultats des tests
```
Test Suites: 2 passed, 2 total
Tests:       21 passed, 21 total
```

### Détails

- **gamesService.test.js** : 12 tests ✅
  - Vérification des filtres
  - Projections
  - Tri et limite
  
- **livreService.test.js** : 9 tests ✅
  - Création de collection avec validation
  - Tests d'insertions valides
  - Tests d'insertions invalides (rejets attendus)
  - Vérification des contraintes

## 🛠️ Technologies utilisées

- **MongoDB** 6.3.0 - Base de données NoSQL
- **Jest** 29.7.0 - Framework de tests
- **Node.js** - Runtime JavaScript
- **ES Modules** - Import/Export moderne

## 📖 Documentation

Pour plus de détails sur l'exercice de validation, consultez [exercice-validation.md](./exercice-validation.md).

## 👤 Auteur

Projet réalisé dans le cadre de la formation Diginamic - Node.js & MongoDB

## 📝 Licence

## 📜 Exercice 3 : Scripts de scénario mongosh

### Objectif

Créer un script MongoDB shell automatique qui exécute un scénario complet :

1. **Insertion** : Ajouter 6 livres dans la collection
2. **Suppression simple** : Supprimer un livre spécifique par son titre ("1984")
3. **Suppression multiple** : Supprimer tous les livres d'un auteur (J.K. Rowling)

### Scripts disponibles
```bash
# Exécuter le scénario complet
npm run scenario:livre

# Nettoyer la collection
npm run clean:livre
```

### Résultat du scénario
```
📝 ÉTAPE 1 : Insertion de 6 livres
   ✅ 6 livre(s) inséré(s)

🗑️  ÉTAPE 2 : Suppression de "1984"
   ✅ 1 livre supprimé (5 livres restants)

🗑️  ÉTAPE 3 : Suppression de tous les J.K. Rowling
   ✅ 3 livres supprimés (2 livres restants)

📚 Livres restants :
   - "Le Seigneur des Anneaux" par J. R. R. Tolkien (1954)
   - "Le Petit Prince" par Antoine de Saint-Exupéry (1943)
```

### Fichiers

- `scripts/scenario-livre.js` - Scénario complet d'insertion et suppression
- `scripts/clean-livre.js` - Nettoyage de la collection

ISC