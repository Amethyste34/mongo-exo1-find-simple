import dbClient from '../src/database.js';
import cityService from '../src/cityService.js';

describe('CityService - Modifications de tableaux', () => {
  
  beforeAll(async () => {
    await dbClient.connect();
    
    // Vérifier que la collection city existe
    const count = await cityService.countCities();
    console.log(`\n📊 Nombre de villes dans la base: ${count}\n`);
    
    if (count === 0) {
      console.warn('⚠️  Aucune ville trouvée. Assurez-vous d\'avoir importé city.json');
    }
  });

  afterAll(async () => {
    await dbClient.disconnect();
  });

  describe('Question 1 : Modifications simples', () => {
    
    test('1.1 - Devrait modifier le nom d\'une ville', async () => {
      // Sauvegarder l'état initial
      const originalCity = await cityService.getCityByName('Paris');
      const hasParisInitially = originalCity !== null;
      
      if (hasParisInitially) {
        // Modifier Paris en "Paris-Test"
        const result = await cityService.updateCityName('Paris', 'Paris-Test');
        expect(result.modifiedCount).toBeGreaterThan(0);
        
        // Vérifier la modification
        const modifiedCity = await cityService.getCityByName('Paris-Test');
        expect(modifiedCity).not.toBeNull();
        expect(modifiedCity.city_name).toBe('Paris-Test');
        
        // Restaurer le nom original
        await cityService.updateCityName('Paris-Test', 'Paris');
      } else {
        console.log('⚠️  Paris non trouvé dans la collection');
      }
    });

    test('1.2 - Devrait ajuster les coordonnées de Lyon', async () => {
      const lyon = await cityService.getCityByName('Lyon');
      
      if (lyon) {
        const newCoordinates = { lat: 45.75, lon: 4.85 };
        const result = await cityService.updateLyonCoordinates(newCoordinates);
        
        expect(result.modifiedCount).toBeGreaterThan(0);
        
        // Vérifier la modification
        const updatedLyon = await cityService.getCityByName('Lyon');
        expect(updatedLyon.coordinates).toEqual(newCoordinates);
      } else {
        console.log('⚠️  Lyon non trouvé dans la collection');
      }
    });

    test('1.3 - Devrait ajouter un champ population à Lyon', async () => {
      const lyon = await cityService.getCityByName('Lyon');
      
      if (lyon) {
        const population = 516092;
        const result = await cityService.addPopulationToLyon(population);
        
        expect(result.modifiedCount).toBeGreaterThan(0);
        
        // Vérifier l'ajout
        const updatedLyon = await cityService.getCityByName('Lyon');
        expect(updatedLyon).toHaveProperty('population');
        expect(updatedLyon.population).toBe(population);
      } else {
        console.log('⚠️  Lyon non trouvé dans la collection');
      }
    });
  });

  describe('Question 2 : Modifications de tableaux', () => {
    
    test('2.1 - Devrait ajouter plusieurs tags à toutes les villes', async () => {
      const tagsToAdd = ['test-tag-1', 'test-tag-2'];
      const result = await cityService.addTagsToAll(tagsToAdd);
      
      expect(result.modifiedCount).toBeGreaterThan(0);
      
      // Vérifier qu'au moins une ville a les nouveaux tags
      const cities = await cityService.getAllCities();
      const cityWithNewTags = cities.find(city => 
        city.tags && 
        city.tags.includes('test-tag-1') && 
        city.tags.includes('test-tag-2')
      );
      expect(cityWithNewTags).toBeDefined();
      
      // Nettoyer
      await cityService.removeTagFromAll('test-tag-1');
      await cityService.removeTagFromAll('test-tag-2');
    });

    test('2.2 - Devrait supprimer un tag spécifique de toutes les villes', async () => {
      // D'abord ajouter un tag de test
      await cityService.addTagsToAll(['tag-to-remove']);
      
      // Supprimer ce tag
      const result = await cityService.removeTagFromAll('tag-to-remove');
      expect(result.modifiedCount).toBeGreaterThan(0);
      
      // Vérifier que le tag n'existe plus
      const cities = await cityService.getAllCities();
      const cityWithRemovedTag = cities.find(city => 
        city.tags && city.tags.includes('tag-to-remove')
      );
      expect(cityWithRemovedTag).toBeUndefined();
    });

    test('2.3 - Devrait supprimer le premier tag de Bourges', async () => {
      const bourges = await cityService.getCityByName('Bourges');
      
      if (bourges && bourges.tags && bourges.tags.length > 0) {
        const initialTagsCount = bourges.tags.length;
        const firstTag = bourges.tags[0];
        
        const result = await cityService.removeFirstTagFromBourges();
        expect(result.modifiedCount).toBeGreaterThan(0);
        
        // Vérifier la suppression
        const updatedBourges = await cityService.getCityByName('Bourges');
        expect(updatedBourges.tags.length).toBe(initialTagsCount - 1);
        expect(updatedBourges.tags[0]).not.toBe(firstTag);
      } else {
        console.log('⚠️  Bourges non trouvé ou sans tags');
      }
    });

    test('2.4 - Devrait supprimer tous les tags d\'une ville', async () => {
      // Choisir une ville pour le test
      const cities = await cityService.getAllCities();
      const cityWithTags = cities.find(city => city.tags && city.tags.length > 0);
      
      if (cityWithTags) {
        const cityName = cityWithTags.city_name;
        const result = await cityService.removeAllTagsFromCity(cityName);
        
        expect(result.modifiedCount).toBeGreaterThan(0);
        
        // Vérifier la suppression
        const updatedCity = await cityService.getCityByName(cityName);
        expect(updatedCity.tags).toBeUndefined();
      } else {
        console.log('⚠️  Aucune ville avec tags trouvée');
      }
    });
  });

  describe('Vérifications générales', () => {
    
    test('Devrait récupérer toutes les villes', async () => {
      const cities = await cityService.getAllCities();
      expect(Array.isArray(cities)).toBe(true);
      expect(cities.length).toBeGreaterThan(0);
    });

    test('Chaque ville devrait avoir un city_name', async () => {
      const cities = await cityService.getAllCities();
      cities.forEach(city => {
        expect(city).toHaveProperty('city_name');
      });
    });
  });
});