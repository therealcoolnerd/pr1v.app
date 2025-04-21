// src/db.js
// Import Dexie library
import Dexie from 'dexie';

// Create a new Dexie database instance named 'pr1vAppDB'
const db = new Dexie('pr1vAppDB');

// Define the database schema
db.version(1).stores({
  // Define a store named 'wallets' with an auto-incrementing 'id' and indexed properties 'address' and 'balance'
  wallets: '++id, address, balance',
  // Add other stores as needed
});

// Export the db instance for use in other parts of the application
export default db;