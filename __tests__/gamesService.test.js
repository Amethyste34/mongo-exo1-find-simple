import dbClient from '../src/database.js';
import gamesService from '../src/gamesService.js';

describe('GamesService Tests', () => {
  let has3DSGames = false;
  let has3DSGames2011 = false;

  // Connexion avant tous les tests
  beforeAll(async () => {
    await dbClient.connect();
    
    // Vérifier ce qui existe dans la base
    const collection = dbClient.getCollection();
    const count3DS = await collection.countDocuments({ Platform: '3DS' });
    const count3DS2011 = await collection.countDocuments({ Platform: '3DS', Year: '2011' });  // Year est une string
    
    has3DSGames = count3DS > 0;
    has3DSGames2011 = count3DS2011 > 0;
    
    console.log(`\n📊 Données dans la base:`);
    console.log(`   - Jeux 3DS: ${count3DS}`);
    console.log(`   - Jeux 3DS de 2011: ${count3DS2011}\n`);
  });

  // Déconnexion après tous les tests
  afterAll(async () => {
    await dbClient.disconnect();
  });

  describe('Question 2: get3DSGames', () => {
    test('devrait retourner un tableau', async () => {
      const games = await gamesService.get3DSGames();
      expect(Array.isArray(games)).toBe(true);
    });

    test('devrait retourner tous les jeux 3DS', async () => {
      const games = await gamesService.get3DSGames();
      
      if (has3DSGames) {
        expect(games.length).toBeGreaterThan(0);
        expect(games.every(game => game.Platform === '3DS')).toBe(true);
      } else {
        console.warn('⚠️  Aucun jeu 3DS trouvé dans la base');
        expect(games.length).toBe(0);
      }
    });

    test('chaque jeu devrait avoir les propriétés de base', async () => {
      const games = await gamesService.get3DSGames();
      
      if (games.length > 0) {
        games.forEach(game => {
          expect(game).toHaveProperty('Name');
          expect(game).toHaveProperty('Platform');
          expect(game).toHaveProperty('Global_Sales');
          // Year peut être optionnel dans certaines données
          // expect(game).toHaveProperty('Year');
        });
      }
    });
  });

  describe('Question 3: get3DSGames2011', () => {
    test('devrait retourner uniquement les jeux 3DS de 2011', async () => {
      const games = await gamesService.get3DSGames2011();
      
      expect(Array.isArray(games)).toBe(true);
      
      if (has3DSGames2011) {
        expect(games.length).toBeGreaterThan(0);
        expect(games.every(game => game.Platform === '3DS' && game.Year === '2011')).toBe(true);
      } else {
        console.warn('⚠️  Aucun jeu 3DS de 2011 trouvé dans la base');
        expect(games.length).toBe(0);
      }
    });
  });

  describe('Question 4: get3DSGames2011NameAndSales', () => {
    test('devrait retourner uniquement Name et Global_Sales (projection)', async () => {
      const games = await gamesService.get3DSGames2011NameAndSales();
      
      expect(Array.isArray(games)).toBe(true);
      
      if (games.length > 0) {
        games.forEach(game => {
          // Vérifie que seuls Name et Global_Sales sont présents
          expect(game).toHaveProperty('Name');
          expect(game).toHaveProperty('Global_Sales');
          expect(game).not.toHaveProperty('_id');
          expect(game).not.toHaveProperty('Platform');
          expect(game).not.toHaveProperty('Year');
          expect(game).not.toHaveProperty('Genre');
          
          // Vérifie qu'il n'y a que 2 propriétés
          expect(Object.keys(game).length).toBe(2);
        });
      } else {
        console.warn('⚠️  Aucun jeu 3DS de 2011 pour tester la projection');
      }
    });

    test('Global_Sales devrait être un nombre', async () => {
      const games = await gamesService.get3DSGames2011NameAndSales();
      
      if (games.length > 0) {
        games.forEach(game => {
          expect(typeof game.Global_Sales).toBe('number');
        });
      }
    });
  });

  describe('Question 5: getTop3BestSelling3DSGames2011', () => {
    test('devrait retourner maximum 3 jeux', async () => {
      const games = await gamesService.getTop3BestSelling3DSGames2011();
      
      expect(Array.isArray(games)).toBe(true);
      expect(games.length).toBeLessThanOrEqual(3);
    });

    test('devrait être trié par Global_Sales décroissant', async () => {
      const games = await gamesService.getTop3BestSelling3DSGames2011();
      
      if (games.length > 1) {
        for (let i = 0; i < games.length - 1; i++) {
          expect(games[i].Global_Sales).toBeGreaterThanOrEqual(games[i + 1].Global_Sales);
        }
      }
    });

    test('devrait retourner uniquement Name et Global_Sales', async () => {
      const games = await gamesService.getTop3BestSelling3DSGames2011();
      
      if (games.length > 0) {
        games.forEach(game => {
          expect(game).toHaveProperty('Name');
          expect(game).toHaveProperty('Global_Sales');
          expect(game).not.toHaveProperty('_id');
          expect(Object.keys(game).length).toBe(2);
        });
      }
    });
  });

  describe('Vérification de la structure des requêtes', () => {
    test('get3DSGames utilise bien le filtre Platform', async () => {
      const games = await gamesService.get3DSGames();
      
      if (games.length > 0) {
        // Tous les jeux doivent être de la plateforme 3DS
        const allAre3DS = games.every(game => game.Platform === '3DS');
        expect(allAre3DS).toBe(true);
      }
    });

    test('get3DSGames2011 utilise bien les filtres Platform ET Year', async () => {
      const games = await gamesService.get3DSGames2011();
      
      if (games.length > 0) {
        const allMatch = games.every(game => 
          game.Platform === '3DS' && game.Year === '2011'  // Year est une string
        );
        expect(allMatch).toBe(true);
      }
    });
  });
});