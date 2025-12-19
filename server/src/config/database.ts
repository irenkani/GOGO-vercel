import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root directory (only needed for local dev)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const uri = process.env.MONGO_URI ?? '';

if (!uri) {
  console.warn('[database] MONGO_URI is not set. Set it in your environment before starting the server.');
}

let client: MongoClient | null = null;
let database: Db | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Optimized for serverless: cache the connection promise to reuse across invocations
export async function getDatabase(): Promise<Db> {
  if (database) return database;

  if (!uri) {
    throw new Error('MONGO_URI is not defined');
  }

  // Reuse connection promise for serverless (prevents multiple connections)
  if (!clientPromise) {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 1, // Lower pool size for serverless
      minPoolSize: 0,
      retryWrites: true,
      retryReads: true,
    } as any);
    clientPromise = client.connect();
  }

  await clientPromise;
  const dbName = process.env.MONGO_DB_NAME ?? 'gogo-impact-report';
  database = client!.db(dbName);
  return database;
}

export function getClient(): MongoClient | null {
  return client;
}

export async function disconnectDatabase() {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}

