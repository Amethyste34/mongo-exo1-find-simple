// scripts/scenario-city.js
// Scénario de modifications sur la collection city

use exercice

print("\n════════════════════════════════════════════════════════");
print("🏙️  SCÉNARIO : Modifications de tableaux (collection city)");
print("════════════════════════════════════════════════════════\n");

// ============================================
// QUESTION 1 : Modifications simples
// ============================================
print("📝 QUESTION 1 : Modifications simples\n");

// 1.1 - Modifier le nom d'une ville
print("1.1 - Modification du nom d'une ville");
const updateNameResult = db.city.updateOne(
  { city_name: "Paris" },
  { $set: { city_name: "Paris-Capitale" } }
);
print(`   ✅ ${updateNameResult.modifiedCount} ville(s) renommée(s)`);

// Afficher la ville modifiée
const parisModified = db.city.findOne({ city_name: "Paris-Capitale" });
if (parisModified) {
  print(`   📍 Nouvelle ville: ${parisModified.city_name}`);
}

// Restaurer le nom original
db.city.updateOne(
  { city_name: "Paris-Capitale" },
  { $set: { city_name: "Paris" } }
);
print("   ↩️  Nom restauré à 'Paris'\n");

// 1.2 - Ajuster les coordonnées de Lyon
print("1.2 - Ajustement des coordonnées de Lyon");
const lyonBefore = db.city.findOne({ city_name: "Lyon" });
if (lyonBefore) {
  print(`   📍 Anciennes coordonnées: ${JSON.stringify(lyonBefore.coordinates)}`);
  
  const updateCoordResult = db.city.updateOne(
    { city_name: "Lyon" },
    { $set: { coordinates: { lat: 45.75, lon: 4.85 } } }
  );
  print(`   ✅ ${updateCoordResult.modifiedCount} ville(s) modifiée(s)`);
  
  const lyonAfter = db.city.findOne({ city_name: "Lyon" });
  print(`   📍 Nouvelles coordonnées: ${JSON.stringify(lyonAfter.coordinates)}\n`);
}

// 1.3 - Ajouter un champ population à Lyon
print("1.3 - Ajout du champ population à Lyon");
const addPopResult = db.city.updateOne(
  { city_name: "Lyon" },
  { $set: { population: 516092 } }
);
print(`   ✅ ${addPopResult.modifiedCount} ville(s) modifiée(s)`);

const lyonWithPop = db.city.findOne({ city_name: "Lyon" });
if (lyonWithPop.population) {
  print(`   👥 Population de Lyon: ${lyonWithPop.population}`);
}

print("\n════════════════════════════════════════════════════════");

// ============================================
// QUESTION 2 : Modifications de tableaux
// ============================================
print("📝 QUESTION 2 : Modifications de tableaux\n");

// 2.1 - Ajouter plusieurs tags à toutes les villes
print("2.1 - Ajout de tags à toutes les villes");
const addTagsResult = db.city.updateMany(
  {},
  { $addToSet: { tags: { $each: ["France", "Europe", "Tourisme"] } } }
);
print(`   ✅ ${addTagsResult.modifiedCount} ville(s) modifiée(s)`);
print("   🏷️  Tags ajoutés: France, Europe, Tourisme\n");

// Afficher quelques exemples
print("   📋 Exemples de villes avec les nouveaux tags:");
db.city.find({}, { city_name: 1, tags: 1, _id: 0 }).limit(3).forEach(city => {
  print(`      - ${city.city_name}: [${city.tags ? city.tags.join(', ') : 'aucun tag'}]`);
});

// 2.2 - Supprimer un tag spécifique
print("\n2.2 - Suppression d'un tag spécifique ('Tourisme')");
const removeTagResult = db.city.updateMany(
  {},
  { $pull: { tags: "Tourisme" } }
);
print(`   ✅ ${removeTagResult.modifiedCount} ville(s) modifiée(s)`);
print("   🗑️  Tag 'Tourisme' supprimé de toutes les villes\n");

// 2.3 - Supprimer le premier tag de Bourges
print("2.3 - Suppression du premier tag de Bourges");
const bourgesBefore = db.city.findOne({ city_name: "Bourges" });
if (bourgesBefore && bourgesBefore.tags) {
  print(`   📋 Tags avant: [${bourgesBefore.tags.join(', ')}]`);
  
  const popFirstResult = db.city.updateOne(
    { city_name: "Bourges" },
    { $pop: { tags: -1 } }  // -1 = premier élément
  );
  print(`   ✅ ${popFirstResult.modifiedCount} ville(s) modifiée(s)`);
  
  const bourgesAfter = db.city.findOne({ city_name: "Bourges" });
  print(`   📋 Tags après: [${bourgesAfter.tags ? bourgesAfter.tags.join(', ') : 'aucun'}]\n`);
}

// 2.4 - Supprimer tous les tags d'un document
print("2.4 - Suppression de tous les tags d'une ville (exemple: Marseille)");
const marseilleBefore = db.city.findOne({ city_name: "Marseille" });
if (marseilleBefore) {
  print(`   📋 Tags avant: [${marseilleBefore.tags ? marseilleBefore.tags.join(', ') : 'aucun'}]`);
  
  const unsetTagsResult = db.city.updateOne(
    { city_name: "Marseille" },
    { $unset: { tags: "" } }
  );
  print(`   ✅ ${unsetTagsResult.modifiedCount} ville(s) modifiée(s)`);
  
  const marseilleAfter = db.city.findOne({ city_name: "Marseille" });
  print(`   📋 Tags après: ${marseilleAfter.tags ? '[' + marseilleAfter.tags.join(', ') + ']' : 'aucun (champ supprimé)'}`);
}

print("\n════════════════════════════════════════════════════════");
print("✅ SCÉNARIO TERMINÉ");
print("════════════════════════════════════════════════════════\n");