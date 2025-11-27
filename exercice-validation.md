# Exercice MongoDB - Validation de schéma

## Énoncé

Créer une collection `livre` avec les règles de validation suivantes :
- titre : string unique
- auteur : string non vide
- année : int, supérieur à 1900
- genre : string optionnel

## Étape 1 : Créer la collection avec validation
```javascript
use exercice

db.createCollection("livre", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["titre", "auteur", "annee"],
      properties: {
        titre: {
          bsonType: "string",
          description: "titre doit être une string unique et est requis"
        },
        auteur: {
          bsonType: "string",
          minLength: 1,
          description: "auteur doit être une string non vide et est requis"
        },
        annee: {
          bsonType: "int",
          minimum: 1900,
          description: "annee doit être un int supérieur à 1900 et est requis"
        },
        genre: {
          bsonType: "string",
          description: "genre est une string optionnelle"
        }
      }
    }
  }
})
```

## Étape 2 : Créer l'index unique sur le titre
```javascript
db.livre.createIndex({ titre: 1 }, { unique: true })
```

## Étape 3 : Tester les insertions

### Test 1 : Harry Potter à l'école des sorciers ✅
```javascript
db.livre.insertOne({
  titre: "Harry Potter à l'école des sorciers",
  auteur: "J. K. Rowling",
  annee: NumberInt(2001),
  genre: "Fantasy"
})
```

**Résultat attendu :** ✅ Succès - Toutes les règles sont respectées

---

### Test 2 : Harry Potter et la chambre des secrets ✅
```javascript
db.livre.insertOne({
  titre: "Harry Potter et la chambre des secrets",
  auteur: "J. K. Rowling",
  annee: NumberInt(2002),
  genre: "Fantasy"
})
```

**Résultat attendu :** ✅ Succès - Toutes les règles sont respectées

---

### Test 3 : Livre vieux ❌
```javascript
db.livre.insertOne({
  titre: "Livre vieux",
  auteur: "Auteur inconnu",
  annee: NumberInt(1800)
})
```

**Résultat attendu :** ❌ Échec - L'année 1800 est inférieure à 1900

**Message d'erreur :**
```
Document failed validation
```

---

### Test 4 : Doublon de titre ❌
```javascript
db.livre.insertOne({
  titre: "Harry Potter à l'école des sorciers",
  auteur: "Copycat",
  annee: NumberInt(2012),
  genre: "Fantasy"
})
```

**Résultat attendu :** ❌ Échec - Le titre existe déjà (violation de l'index unique)

**Message d'erreur :**
```
E11000 duplicate key error collection: exercice.livre index: titre_1 dup key
```

---

## Étape 4 : Vérifier les données insérées
```javascript
db.livre.find().pretty()
```

**Résultat attendu :** Seulement 2 livres (les Harry Potter 1 et 2)

---

## Récapitulatif des résultats

| Livre | Résultat | Raison |
|-------|----------|--------|
| Harry Potter à l'école des sorciers (J.K. Rowling, 2001) | ✅ Succès | Toutes les règles respectées |
| Harry Potter et la chambre des secrets (2002) | ✅ Succès | Toutes les règles respectées |
| Livre vieux (1800) | ❌ Échec | Année < 1900 (validation) |
| Harry Potter à l'école des sorciers (Copycat, 2012) | ❌ Échec | Titre en double (index unique) |

---

## Notes

- La validation de schéma empêche l'insertion de documents non conformes
- L'index unique empêche les doublons sur le champ `titre`
- Le champ `genre` est optionnel