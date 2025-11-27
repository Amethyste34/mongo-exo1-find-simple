import dbClient from '../src/database.js';
import livreService from '../src/livreService.js';

async function setup() {
  try {
    console.log('🚀 Connexion à MongoDB...');
    await dbClient.connect();

    console.log('📚 Création de la collection livre...');
    await livreService.createLivreCollection();

    console.log('\n✅ Setup terminé avec succès !');
    
    await dbClient.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

setup();