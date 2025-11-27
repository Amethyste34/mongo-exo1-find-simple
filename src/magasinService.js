import dbClient from './database.js';

class MagasinService {
  /**
   * PARTIE 1
   */

  /**
   * Question 1 : Le magasin le moins bien noté
   */
  async getMagasinLeMoinsNote() {
    const collection = dbClient.getCollection('magasins');
    const result = await collection
      .find()
      .sort({ rate: 1 })  // ✅ rate au lieu de note
      .limit(1)
      .toArray();
    return result[0];
  }

  /**
   * Question 2 : Le magasin le plus ancien
   */
  async getMagasinLePlusAncien() {
    const collection = dbClient.getCollection('magasins');
    const result = await collection
      .find()
      .sort({ createdAt: 1 })  // ✅ createdAt au lieu de date_creation
      .limit(1)
      .toArray();
    return result[0];
  }

  /**
   * Question 3 : Les magasins ayant une note comprise entre 50 et 80 (inclus)
   */
  async getMagasinsNoteEntre50Et80() {
    const collection = dbClient.getCollection('magasins');
    return await collection
      .find({
        rate: { $gte: 50, $lte: 80 }  // ✅ rate
      })
      .toArray();
  }

  /**
   * Question 4 : Les magasins créés en 2023
   */
  async getMagasinsCrees2023() {
    const collection = dbClient.getCollection('magasins');
    return await collection
      .find({
        createdAt: {  // ✅ createdAt
          $gte: '2023-01-01',
          $lt: '2024-01-01'
        }
      })
      .toArray();
  }

  /**
   * PARTIE 2
   */

  /**
   * Question 5 : Les magasins qui n'ont pas de catégories
   */
  async getMagasinsSansCategories() {
    const collection = dbClient.getCollection('magasins');
    return await collection
      .find({
        $or: [
          { category: { $exists: false } },  // ✅ category (singulier)
          { category: null },
          { category: '' }
        ]
      })
      .toArray();
  }

  /**
   * Question 6 : Les magasins avec une note strictement supérieure à 75
   */
  async getMagasinsNoteSup75() {
    const collection = dbClient.getCollection('magasins');
    return await collection
      .find({
        rate: { $gt: 75 }  // ✅ rate
      })
      .toArray();
  }

  /**
   * Question 7 : Les magasins avec plus de 50 votes et notés à plus de 60
   */
  async getMagasinsPlus50VotesEtNotePlus60() {
    const collection = dbClient.getCollection('magasins');
    return await collection
      .find({
        votes: { $gt: 50 },  // ✅ votes
        rate: { $gt: 60 }    // ✅ rate
      })
      .toArray();
  }

  /**
   * DÉFI
   */

  /**
   * Question 8 : Les magasins proposant des produits Google
   */
  async getMagasinsAvecProduitsGoogle() {
    const collection = dbClient.getCollection('magasins');
    return await collection
      .find({
        'products.brand': 'Google'  // ✅ products.brand
      })
      .toArray();
  }

  /**
   * Question 9 : Le magasin le plus proche du point [lon, lat]
   * Note: Nécessite un index 2dsphere sur le champ location
   */
  async getMagasinLePlusProche(longitude, latitude) {
    const collection = dbClient.getCollection('magasins');
    
    // Créer l'index géospatial si nécessaire
    try {
      await collection.createIndex({ location: '2dsphere' });  // ✅ location
    } catch (error) {
      // L'index existe peut-être déjà
    }

    const result = await collection
      .find({
        location: {  // ✅ location
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            }
          }
        }
      })
      .limit(1)
      .toArray();
    
    return result[0];
  }

  /**
   * Utilitaires
   */

  async getAllMagasins() {
    const collection = dbClient.getCollection('magasins');
    return await collection.find().toArray();
  }

  async countMagasins() {
    const collection = dbClient.getCollection('magasins');
    return await collection.countDocuments();
  }

  async getMagasinById(id) {
    const collection = dbClient.getCollection('magasins');
    return await collection.findOne({ _id: id });
  }
}

export default new MagasinService();