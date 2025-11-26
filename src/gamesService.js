import dbClient from './database.js';

class GamesService {
  /**
   * Question 2: Afficher les jeux 3DS sortis
   */
  async get3DSGames() {
    const collection = dbClient.getCollection();
    return await collection.find({ Platform: '3DS' }).toArray();
  }

  /**
   * Question 3: Afficher les jeux 3DS sortis en 2011
   */
  async get3DSGames2011() {
    const collection = dbClient.getCollection();
    return await collection.find({ 
      Platform: '3DS',
      Year: '2011'
    }).toArray();
  }

  /**
   * Question 4: Afficher le nom et le global_sales des jeux 3DS sortis en 2011
   */
  async get3DSGames2011NameAndSales() {
    const collection = dbClient.getCollection();
    return await collection.find(
      { 
        Platform: '3DS',
        Year: '2011'
      },
      { 
        projection: { 
          _id: 0,
          Name: 1, 
          Global_Sales: 1 
        } 
      }
    ).toArray();
  }

  /**
   * Question 5: Afficher le nom et le global_sales des 3 jeux les plus vendus sur 3DS sortis en 2011
   */
  async getTop3BestSelling3DSGames2011() {
    const collection = dbClient.getCollection();
    return await collection.find(
      { 
        Platform: '3DS',
        Year: '2011'
      },
      { 
        projection: { 
          _id: 0,
          Name: 1, 
          Global_Sales: 1 
        } 
      }
    )
    .sort({ Global_Sales: -1 })
    .limit(3)
    .toArray();
  }
}

export default new GamesService();