// scripts/scenario-magasins.js
// Requêtes avancées sur la collection magasins

use exercice

print("\n════════════════════════════════════════════════════════");
print("🏪 SCÉNARIO : Requêtes avancées (collection magasins)");
print("════════════════════════════════════════════════════════\n");

const count = db.magasins.countDocuments();
print(`📊 Nombre total de magasins : ${count}\n`);

// ============================================
// PARTIE 1 : Requêtes de base
// ============================================
print("📝 PARTIE 1 : Requêtes de base\n");

// Question 1
print("1️⃣  Le magasin le moins bien noté");
const magasinMoinsNote = db.magasins.find().sort({ rate: 1 }).limit(1).toArray()[0];
if (magasinMoinsNote) {
  print(`   📍 ${magasinMoinsNote.name} - Note: ${magasinMoinsNote.rate}/100\n`);
}

// Question 2
print("2️⃣  Le magasin le plus ancien");
const magasinPlusAncien = db.magasins.find().sort({ createdAt: 1 }).limit(1).toArray()[0];
if (magasinPlusAncien) {
  print(`   📍 ${magasinPlusAncien.name} - Créé le: ${magasinPlusAncien.createdAt}\n`);
}

// Question 3
print("3️⃣  Les magasins avec note entre 50 et 80");
const magasinsNote50_80 = db.magasins.find({
  rate: { $gte: 50, $lte: 80 }
}).toArray();
print(`   📍 ${magasinsNote50_80.length} magasin(s) trouvé(s)`);
if (magasinsNote50_80.length > 0) {
  print("   Exemples:");
  magasinsNote50_80.slice(0, 3).forEach(m => {
    print(`      - ${m.name}: ${m.rate}/100`);
  });
}
print("");

// Question 4
print("4️⃣  Les magasins créés en 2023");
const magasins2023 = db.magasins.find({
  createdAt: {
    $gte: '2023-01-01',
    $lt: '2024-01-01'
  }
}).toArray();
print(`   📍 ${magasins2023.length} magasin(s) créé(s) en 2023`);
if (magasins2023.length > 0) {
  magasins2023.slice(0, 3).forEach(m => {
    print(`      - ${m.name} (${m.createdAt})`);
  });
}

print("\n════════════════════════════════════════════════════════");

// ============================================
// PARTIE 2 : Requêtes conditionnelles
// ============================================
print("📝 PARTIE 2 : Requêtes conditionnelles\n");

// Question 5
print("5️⃣  Les magasins sans catégories");
const magasinsSansCategories = db.magasins.find({
  $or: [
    { category: { $exists: false } },
    { category: null },
    { category: '' }
  ]
}).toArray();
print(`   📍 ${magasinsSansCategories.length} magasin(s) sans catégories\n`);

// Question 6
print("6️⃣  Les magasins avec note > 75");
const magasinsNoteSup75 = db.magasins.find({
  rate: { $gt: 75 }
}).toArray();
print(`   📍 ${magasinsNoteSup75.length} magasin(s) avec note > 75`);
if (magasinsNoteSup75.length > 0) {
  print("   Meilleurs magasins:");
  magasinsNoteSup75.slice(0, 5).forEach(m => {
    print(`      - ${m.name}: ${m.rate}/100`);
  });
}
print("");

// Question 7
print("7️⃣  Les magasins avec > 50 votes ET note > 60");
const magasinsVotesEtNote = db.magasins.find({
  votes: { $gt: 50 },
  rate: { $gt: 60 }
}).toArray();
print(`   📍 ${magasinsVotesEtNote.length} magasin(s) trouvé(s)`);
if (magasinsVotesEtNote.length > 0) {
  print("   Exemples:");
  magasinsVotesEtNote.slice(0, 3).forEach(m => {
    print(`      - ${m.name}: ${m.rate}/100 (${m.votes} votes)`);
  });
}

print("\n════════════════════════════════════════════════════════");

// ============================================
// DÉFI : Requêtes complexes
// ============================================
print("📝 DÉFI : Requêtes complexes\n");

// Question 8
print("8️⃣  Les magasins proposant des produits Google");
const magasinsGoogle = db.magasins.find({
  'products.brand': 'Google'
}).toArray();
print(`   📍 ${magasinsGoogle.length} magasin(s) avec produits Google`);
if (magasinsGoogle.length > 0) {
  print("   Exemples:");
  magasinsGoogle.slice(0, 3).forEach(m => {
    const googleProducts = m.products.filter(p => p.brand === 'Google');
    print(`      - ${m.name}:`);
    googleProducts.forEach(p => {
      print(`         • ${p.name} (${p.price}€)`);
    });
  });
}
print("");

// Question 9
print("9️⃣  Le magasin le plus proche d'un point (Paris: 2.3522, 48.8566)");

// Créer l'index géospatial si nécessaire
try {
  db.magasins.createIndex({ location: '2dsphere' });
  print("   ✅ Index géospatial créé");
} catch (e) {
  print("   ℹ️  Index géospatial déjà existant");
}

const magasinProche = db.magasins.findOne({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [2.3522, 48.8566]
      }
    }
  }
});

if (magasinProche) {
  print(`   📍 Magasin le plus proche: ${magasinProche.name}`);
  if (magasinProche.location?.coordinates) {
    const [lon, lat] = magasinProche.location.coordinates;
    print(`      Coordonnées: [${lon}, ${lat}]`);
  }
} else {
  print("   ⚠️  Aucun magasin avec localisation géospatiale trouvé");
}

print("\n════════════════════════════════════════════════════════");
print("✅ SCÉNARIO TERMINÉ");
print("════════════════════════════════════════════════════════\n");