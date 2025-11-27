// scripts/clean-livre.js
// Nettoie la collection livre

use exercice

print("\n🧹 Nettoyage de la collection livre...");

const result = db.livre.deleteMany({});
print(`✅ ${result.deletedCount} livre(s) supprimé(s)`);

const count = db.livre.countDocuments();
print(`📊 Livres restants : ${count}\n`);