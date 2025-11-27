// scripts/scenario-livre.js
// Scénario de manipulation de la collection livre

// Se connecter à la base exercice
use exercice

print("\n════════════════════════════════════════════════════════");
print("SCÉNARIO : Manipulation de la collection livre");
print("════════════════════════════════════════════════════════\n");

// ============================================
// ÉTAPE 1 : Insérer plusieurs livres
// ============================================
print("ÉTAPE 1 : Insertion de plusieurs livres\n");

const livres = [
  {
    titre: "Harry Potter à l'école des sorciers",
    auteur: "J. K. Rowling",
    annee: NumberInt(2001),
    genre: "Fantasy"
  },
  {
    titre: "Harry Potter et la chambre des secrets",
    auteur: "J. K. Rowling",
    annee: NumberInt(2002),
    genre: "Fantasy"
  },
  {
    titre: "Harry Potter et le prisonnier d'Azkaban",
    auteur: "J. K. Rowling",
    annee: NumberInt(2004),
    genre: "Fantasy"
  },
  {
    titre: "Le Seigneur des Anneaux",
    auteur: "J. R. R. Tolkien",
    annee: NumberInt(1954),
    genre: "Fantasy"
  },
  {
    titre: "1984",
    auteur: "George Orwell",
    annee: NumberInt(1949),
    genre: "Dystopie"
  },
  {
    titre: "Le Petit Prince",
    auteur: "Antoine de Saint-Exupéry",
    annee: NumberInt(1943),
    genre: "Conte"
  }
];

try {
  const resultInsert = db.livre.insertMany(livres);
  print(`✅ ${resultInsert.insertedCount} livre(s) inséré(s) avec succès`);
} catch (error) {
  print(`❌ Erreur lors de l'insertion : ${error.message}`);
}

print("\nListe des livres après insertion :");
db.livre.find().forEach(livre => {
  print(`   - "${livre.titre}" par ${livre.auteur} (${livre.annee})`);
});

print(`\nNombre total de livres : ${db.livre.countDocuments()}`);

// ============================================
// ÉTAPE 2 : Supprimer un livre spécifique par son titre
// ============================================
print("\n────────────────────────────────────────────────────────");
print("ÉTAPE 2 : Suppression d'un livre spécifique\n");

const titreASupprimer = "1984";
print(`Suppression du livre : "${titreASupprimer}"`);

try {
  const resultDelete = db.livre.deleteOne({ titre: titreASupprimer });
  if (resultDelete.deletedCount > 0) {
    print(`✅ Livre "${titreASupprimer}" supprimé avec succès`);
  } else {
    print(`⚠️  Livre "${titreASupprimer}" non trouvé`);
  }
} catch (error) {
  print(`❌ Erreur lors de la suppression : ${error.message}`);
}

print("\nListe des livres après suppression :");
db.livre.find().forEach(livre => {
  print(`   - "${livre.titre}" par ${livre.auteur}`);
});

print(`\nNombre total de livres : ${db.livre.countDocuments()}`);

// ============================================
// ÉTAPE 3 : Supprimer tous les livres de J.K. Rowling
// ============================================
print("\n────────────────────────────────────────────────────────");
print("ÉTAPE 3 : Suppression de tous les livres de J.K. Rowling\n");

const auteurASupprimer = "J. K. Rowling";
print(`Suppression de tous les livres de : ${auteurASupprimer}`);

// Afficher les livres qui vont être supprimés
print("\nLivres de J.K. Rowling avant suppression :");
db.livre.find({ auteur: auteurASupprimer }).forEach(livre => {
  print(`   - "${livre.titre}"`);
});

try {
  const resultDeleteMany = db.livre.deleteMany({ auteur: auteurASupprimer });
  print(`\n✅ ${resultDeleteMany.deletedCount} livre(s) de ${auteurASupprimer} supprimé(s)`);
} catch (error) {
  print(`❌ Erreur lors de la suppression : ${error.message}`);
}

print("\nListe finale des livres :");
const livresRestants = db.livre.find().toArray();
if (livresRestants.length > 0) {
  livresRestants.forEach(livre => {
    print(`   - "${livre.titre}" par ${livre.auteur} (${livre.annee})`);
  });
} else {
  print("   ⚠️  Aucun livre restant dans la collection");
}

print(`\nNombre total de livres restants : ${db.livre.countDocuments()}`);

print("\n════════════════════════════════════════════════════════");
print("✅ SCÉNARIO TERMINÉ");
print("════════════════════════════════════════════════════════\n");