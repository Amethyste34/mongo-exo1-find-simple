import dbClient from './database.js';

class LivreService {
  /**
   * Crée la collection livre avec les règles de validation
   */
  async createLivreCollection() {
    const db = dbClient.db;
    
    try {
      // Supprimer la collection si elle existe déjà (pour les tests)
      await db.collection('livre').drop().catch(() => {});
      
      // Créer la collection avec validation
      await db.createCollection('livre', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['titre', 'auteur', 'annee'],
            properties: {
              titre: {
                bsonType: 'string',
                description: 'titre doit être une string unique et est requis'
              },
              auteur: {
                bsonType: 'string',
                minLength: 1,
                description: 'auteur doit être une string non vide et est requis'
              },
              annee: {
                bsonType: 'int',
                minimum: 1900,
                description: 'annee doit être un int supérieur à 1900 et est requis'
              },
              genre: {
                bsonType: 'string',
                description: 'genre est une string optionnelle'
              }
            }
          }
        }
      });

      // Créer l'index unique sur titre
      await db.collection('livre').createIndex({ titre: 1 }, { unique: true });
      
      console.log('✅ Collection "livre" créée avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la collection:', error.message);
      throw error;
    }
  }

  /**
   * Insère un livre dans la collection
   */
  async insertLivre(titre, auteur, annee, genre = null) {
    const collection = dbClient.getCollection('livre');
    
    const livre = {
      titre,
      auteur,
      annee,
    };
    
    if (genre) {
      livre.genre = genre;
    }

    try {
      const result = await collection.insertOne(livre);
      console.log(`✅ Livre "${titre}" inséré avec succès`);
      return result;
    } catch (error) {
      console.error(`❌ Erreur insertion "${titre}":`, error.message);
      throw error;
    }
  }

  /**
   * Récupère tous les livres
   */
  async getAllLivres() {
    const collection = dbClient.getCollection('livre');
    return await collection.find().toArray();
  }

  /**
   * Supprime tous les livres
   */
  async deleteAllLivres() {
    const collection = dbClient.getCollection('livre');
    const result = await collection.deleteMany({});
    console.log(`🗑️  ${result.deletedCount} livre(s) supprimé(s)`);
    return result;
  }
}

export default new LivreService();