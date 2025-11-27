import dbClient from '../src/database.js';
import livreService from '../src/livreService.js';

describe('LivreService - Validation Tests', () => {
  
  // Connexion et création de la collection avant tous les tests
  beforeAll(async () => {
    await dbClient.connect();
    await livreService.createLivreCollection();
  });

  // Nettoyage après chaque test
  afterEach(async () => {
    await livreService.deleteAllLivres();
  });

  // Déconnexion après tous les tests
  afterAll(async () => {
    // Optionnel : supprimer la collection de test
    await dbClient.db.collection('livre').drop().catch(() => {});
    await dbClient.disconnect();
  });

  describe('Création de la collection', () => {
    test('la collection livre devrait exister', async () => {
      const collections = await dbClient.db.listCollections({ name: 'livre' }).toArray();
      expect(collections.length).toBe(1);
    });

    test('la collection devrait avoir un index unique sur titre', async () => {
      const indexes = await dbClient.getCollection('livre').indexes();
      const titreIndex = indexes.find(idx => idx.key.titre === 1);
      expect(titreIndex).toBeDefined();
      expect(titreIndex.unique).toBe(true);
    });
  });

  describe('Test 1: Harry Potter à l\'école des sorciers (2001)', () => {
    test('✅ devrait réussir - toutes les règles respectées', async () => {
      await expect(
        livreService.insertLivre(
          'Harry Potter à l\'école des sorciers',
          'J. K. Rowling',
          2001,
          'Fantasy'
        )
      ).resolves.toBeDefined();

      const livres = await livreService.getAllLivres();
      expect(livres.length).toBe(1);
      expect(livres[0].titre).toBe('Harry Potter à l\'école des sorciers');
    });
  });

  describe('Test 2: Harry Potter et la chambre des secrets (2002)', () => {
    test('✅ devrait réussir - toutes les règles respectées', async () => {
      await expect(
        livreService.insertLivre(
          'Harry Potter et la chambre des secrets',
          'J. K. Rowling',
          2002,
          'Fantasy'
        )
      ).resolves.toBeDefined();

      const livres = await livreService.getAllLivres();
      expect(livres.length).toBe(1);
      expect(livres[0].titre).toBe('Harry Potter et la chambre des secrets');
    });
  });

  describe('Test 3: Livre vieux (1800)', () => {
    test('❌ devrait échouer - année inférieure à 1900', async () => {
      await expect(
        livreService.insertLivre(
          'Livre vieux',
          'Auteur inconnu',
          1800
        )
      ).rejects.toThrow();

      const livres = await livreService.getAllLivres();
      expect(livres.length).toBe(0);
    });
  });

  describe('Test 4: Doublon de titre', () => {
    test('❌ devrait échouer - titre déjà existant', async () => {
      // Insérer le premier livre
      await livreService.insertLivre(
        'Harry Potter à l\'école des sorciers',
        'J. K. Rowling',
        2001,
        'Fantasy'
      );

      // Tenter d'insérer un doublon
      await expect(
        livreService.insertLivre(
          'Harry Potter à l\'école des sorciers',
          'Copycat',
          2012,
          'Fantasy'
        )
      ).rejects.toThrow();

      const livres = await livreService.getAllLivres();
      expect(livres.length).toBe(1);
      expect(livres[0].auteur).toBe('J. K. Rowling');
    });
  });

  describe('Tests de validation des champs', () => {
    test('❌ devrait échouer - titre manquant', async () => {
      const collection = dbClient.getCollection('livre');
      await expect(
        collection.insertOne({
          auteur: 'Test Auteur',
          annee: 2020
        })
      ).rejects.toThrow();
    });

    test('❌ devrait échouer - auteur vide', async () => {
      await expect(
        livreService.insertLivre(
          'Titre Test',
          '',
          2020,
          'Test'
        )
      ).rejects.toThrow();
    });

    test('✅ devrait réussir - genre optionnel', async () => {
      await expect(
        livreService.insertLivre(
          'Livre sans genre',
          'Auteur Test',
          2020
        )
      ).resolves.toBeDefined();

      const livres = await livreService.getAllLivres();
      expect(livres[0].genre).toBeUndefined();
    });
  });

  describe('Scénario complet', () => {
    test('devrait insérer 2 livres valides et rejeter 2 livres invalides', async () => {
      // Test 1: ✅ Succès
      await livreService.insertLivre(
        'Harry Potter à l\'école des sorciers',
        'J. K. Rowling',
        2001,
        'Fantasy'
      );

      // Test 2: ✅ Succès
      await livreService.insertLivre(
        'Harry Potter et la chambre des secrets',
        'J. K. Rowling',
        2002,
        'Fantasy'
      );

      // Test 3: ❌ Échec (année < 1900)
      await expect(
        livreService.insertLivre('Livre vieux', 'Auteur inconnu', 1800)
      ).rejects.toThrow();

      // Test 4: ❌ Échec (doublon)
      await expect(
        livreService.insertLivre(
          'Harry Potter à l\'école des sorciers',
          'Copycat',
          2012,
          'Fantasy'
        )
      ).rejects.toThrow();

      // Vérification finale
      const livres = await livreService.getAllLivres();
      expect(livres.length).toBe(2);
      expect(livres[0].titre).toBe('Harry Potter à l\'école des sorciers');
      expect(livres[1].titre).toBe('Harry Potter et la chambre des secrets');
    });
  });
});