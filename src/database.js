import { MongoClient } from 'mongodb';
import { config } from './config.js';

class DatabaseClient {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    if (this.client) {
      return this.db;
    }

    this.client = new MongoClient(config.mongoUrl);
    await this.client.connect();
    this.db = this.client.db(config.dbName);
    console.log(`Connecté à MongoDB: ${config.dbName}`);
    return this.db;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('Déconnecté de MongoDB');
    }
  }

  getCollection(collectionName = config.collectionName) {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db.collection(collectionName);
  }
}

export default new DatabaseClient();