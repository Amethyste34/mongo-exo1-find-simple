import dbClient from './database.js';

class CityService {
  /**
   * Question 1.1 : Modifier le nom d'une ville
   */
  async updateCityName(oldName, newName) {
    const collection = dbClient.getCollection('city');
    const result = await collection.updateOne(
      { city_name: oldName },
      { $set: { city_name: newName } }
    );
    console.log(`✅ ${result.modifiedCount} ville(s) renommée(s)`);
    return result;
  }

  /**
   * Question 1.2 : Ajuster les coordonnées de Lyon
   */
  async updateLyonCoordinates(newCoordinates) {
    const collection = dbClient.getCollection('city');
    const result = await collection.updateOne(
      { city_name: 'Lyon' },
      { $set: { coordinates: newCoordinates } }
    );
    console.log(`✅ Coordonnées de Lyon mises à jour`);
    return result;
  }

  /**
   * Question 1.3 : Ajouter un champ population à Lyon
   */
  async addPopulationToLyon(population) {
    const collection = dbClient.getCollection('city');
    const result = await collection.updateOne(
      { city_name: 'Lyon' },
      { $set: { population: population } }
    );
    console.log(`✅ Population ajoutée à Lyon: ${population}`);
    return result;
  }

  /**
   * Question 2.1 : Ajouter plusieurs éléments à tous les tags
   */
  async addTagsToAll(tagsToAdd) {
    const collection = dbClient.getCollection('city');
    const result = await collection.updateMany(
      {},
      { $addToSet: { tags: { $each: tagsToAdd } } }
    );
    console.log(`✅ ${result.modifiedCount} ville(s) modifiée(s) - Tags ajoutés: ${tagsToAdd.join(', ')}`);
    return result;
  }

  /**
   * Question 2.2 : Supprimer un élément spécifique de tous les tags
   */
  async removeTagFromAll(tagToRemove) {
    const collection = dbClient.getCollection('city');
    const result = await collection.updateMany(
      {},
      { $pull: { tags: tagToRemove } }
    );
    console.log(`✅ ${result.modifiedCount} ville(s) modifiée(s) - Tag supprimé: ${tagToRemove}`);
    return result;
  }

  /**
   * Question 2.3 : Supprimer le premier élément des tags de Bourges
   */
  async removeFirstTagFromBourges() {
    const collection = dbClient.getCollection('city');
    const result = await collection.updateOne(
      { city_name: 'Bourges' },
      { $pop: { tags: -1 } }  // -1 pour le premier élément
    );
    console.log(`✅ Premier tag supprimé de Bourges`);
    return result;
  }

  /**
   * Question 2.4 : Supprimer tous les tags d'un document
   */
  async removeAllTagsFromCity(cityName) {
    const collection = dbClient.getCollection('city');
    const result = await collection.updateOne(
      { city_name: cityName },
      { $unset: { tags: "" } }
    );
    console.log(`✅ Tous les tags supprimés de ${cityName}`);
    return result;
  }

  /**
   * Récupérer une ville par son nom
   */
  async getCityByName(cityName) {
    const collection = dbClient.getCollection('city');
    return await collection.findOne({ city_name: cityName });
  }

  /**
   * Récupérer toutes les villes
   */
  async getAllCities() {
    const collection = dbClient.getCollection('city');
    return await collection.find().toArray();
  }

  /**
   * Compter les villes
   */
  async countCities() {
    const collection = dbClient.getCollection('city');
    return await collection.countDocuments();
  }
}

export default new CityService();