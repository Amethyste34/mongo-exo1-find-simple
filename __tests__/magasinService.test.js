import dbClient from '../src/database.js';
import magasinService from '../src/magasinService.js';

describe('MagasinService - Requêtes avancées', () => {
  
  beforeAll(async () => {
    await dbClient.connect();
    
    const count = await magasinService.countMagasins();
    console.log(`\n📊 Nombre de magasins dans la base: ${count}\n`);
    
    if (count === 0) {
      console.warn('⚠️  Aucun magasin trouvé. Assurez-vous d\'avoir importé magasins.json');
    }
  });

  afterAll(async () => {
    await dbClient.disconnect();
  });

  describe('PARTIE 1 : Requêtes de base', () => {
    
    test('1. Devrait trouver le magasin le moins bien noté', async () => {
      const magasin = await magasinService.getMagasinLeMoinsNote();
      
      expect(magasin).toBeDefined();
      expect(magasin).toHaveProperty('rate');  // ✅
      expect(magasin).toHaveProperty('name');  // ✅
      
      console.log(`   📍 Magasin le moins noté: ${magasin.name} (note: ${magasin.rate})`);
      
      // Vérifier que c'est bien le moins noté
      const allMagasins = await magasinService.getAllMagasins();
      const minNote = Math.min(...allMagasins.map(m => m.rate));
      expect(magasin.rate).toBe(minNote);
    });

    test('2. Devrait trouver le magasin le plus ancien', async () => {
      const magasin = await magasinService.getMagasinLePlusAncien();
      
      expect(magasin).toBeDefined();
      expect(magasin).toHaveProperty('createdAt');  // ✅
      expect(magasin).toHaveProperty('name');       // ✅
      
      console.log(`   📍 Magasin le plus ancien: ${magasin.name} (créé le: ${magasin.createdAt})`);
      
      // Vérifier que c'est bien le plus ancien
      const allMagasins = await magasinService.getAllMagasins();
      const dates = allMagasins.map(m => m.createdAt).filter(d => d);
      const minDate = dates.sort()[0];
      expect(magasin.createdAt).toBe(minDate);
    });

    test('3. Devrait trouver les magasins avec note entre 50 et 80', async () => {
      const magasins = await magasinService.getMagasinsNoteEntre50Et80();
      
      expect(Array.isArray(magasins)).toBe(true);
      
      if (magasins.length > 0) {
        console.log(`   📍 ${magasins.length} magasin(s) trouvé(s) avec note entre 50 et 80`);
        
        // Vérifier que toutes les notes sont dans l'intervalle
        magasins.forEach(magasin => {
          expect(magasin.rate).toBeGreaterThanOrEqual(50);
          expect(magasin.rate).toBeLessThanOrEqual(80);
        });
      }
    });

    test('4. Devrait trouver les magasins créés en 2023', async () => {
      const magasins = await magasinService.getMagasinsCrees2023();
      
      expect(Array.isArray(magasins)).toBe(true);
      
      if (magasins.length > 0) {
        console.log(`   📍 ${magasins.length} magasin(s) créé(s) en 2023`);
        
        // Vérifier que toutes les dates sont en 2023
        magasins.forEach(magasin => {
          expect(magasin.createdAt).toMatch(/^2023/);
        });
      }
    });
  });

  describe('PARTIE 2 : Requêtes conditionnelles', () => {
    
    test('5. Devrait trouver les magasins sans catégories', async () => {
      const magasins = await magasinService.getMagasinsSansCategories();
      
      expect(Array.isArray(magasins)).toBe(true);
      
      if (magasins.length > 0) {
        console.log(`   📍 ${magasins.length} magasin(s) sans catégories`);
        
        // Vérifier qu'ils n'ont pas de catégories
        magasins.forEach(magasin => {
          const hasNoCategory = 
            !magasin.category || 
            magasin.category === null || 
            magasin.category === '';
          expect(hasNoCategory).toBe(true);
        });
      }
    });

    test('6. Devrait trouver les magasins avec note > 75', async () => {
      const magasins = await magasinService.getMagasinsNoteSup75();
      
      expect(Array.isArray(magasins)).toBe(true);
      
      if (magasins.length > 0) {
        console.log(`   📍 ${magasins.length} magasin(s) avec note > 75`);
        
        // Vérifier que toutes les notes sont > 75
        magasins.forEach(magasin => {
          expect(magasin.rate).toBeGreaterThan(75);
        });
      }
    });

    test('7. Devrait trouver les magasins avec > 50 votes et note > 60', async () => {
      const magasins = await magasinService.getMagasinsPlus50VotesEtNotePlus60();
      
      expect(Array.isArray(magasins)).toBe(true);
      
      if (magasins.length > 0) {
        console.log(`   📍 ${magasins.length} magasin(s) avec > 50 votes et note > 60`);
        
        // Vérifier les conditions
        magasins.forEach(magasin => {
          expect(magasin.votes).toBeGreaterThan(50);
          expect(magasin.rate).toBeGreaterThan(60);
        });
      }
    });
  });

  describe('DÉFI : Requêtes complexes', () => {
    
    test('8. Devrait trouver les magasins proposant des produits Google', async () => {
      const magasins = await magasinService.getMagasinsAvecProduitsGoogle();
      
      expect(Array.isArray(magasins)).toBe(true);
      
      if (magasins.length > 0) {
        console.log(`   📍 ${magasins.length} magasin(s) proposant des produits Google`);
        
        // Vérifier qu'ils ont des produits Google
        magasins.forEach(magasin => {
          const hasGoogleProducts = magasin.products?.some(
            produit => produit.brand === 'Google'
          );
          expect(hasGoogleProducts).toBe(true);
        });
      }
    });

    test('9. Devrait trouver le magasin le plus proche d\'un point', async () => {
      // Coordonnées de Paris (exemple)
      const longitude = 2.3522;
      const latitude = 48.8566;
      
      const magasin = await magasinService.getMagasinLePlusProche(longitude, latitude);
      
      if (magasin) {
        expect(magasin).toBeDefined();
        expect(magasin).toHaveProperty('location');
        expect(magasin).toHaveProperty('name');
        
        console.log(`   📍 Magasin le plus proche de [${longitude}, ${latitude}]: ${magasin.name}`);
        
        if (magasin.location?.coordinates) {
          const [lon, lat] = magasin.location.coordinates;
          console.log(`      Coordonnées: [${lon}, ${lat}]`);
        }
      } else {
        console.log('   ⚠️  Aucun magasin avec localisation géospatiale trouvé');
      }
    });
  });

  describe('Vérifications générales', () => {
    
    test('Devrait récupérer tous les magasins', async () => {
      const magasins = await magasinService.getAllMagasins();
      expect(Array.isArray(magasins)).toBe(true);
      expect(magasins.length).toBeGreaterThan(0);
    });

    test('Chaque magasin devrait avoir un nom', async () => {
      const magasins = await magasinService.getAllMagasins();
      magasins.forEach(magasin => {
        expect(magasin).toHaveProperty('name');  // ✅
      });
    });
  });
});