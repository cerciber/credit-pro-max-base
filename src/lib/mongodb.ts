import { MongoClient, Db, Collection } from 'mongodb';
import {
  MongoUri,
  mongoUriSchema,
} from '../modules/general/schemas/mongo-uri-schema';
import { validate } from './validate';
import { z } from 'zod';

const uri = validate<MongoUri>(
  process.env.MONGODB_URI,
  mongoUriSchema,
  'Invalid MONGODB_URI environment variable'
);

const options = {};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  const dbName = validate<string>(
    process.env.MONGODB_DB_NAME,
    z.string().min(1),
    'Invalid MONGODB_DB_NAME environment variable'
  );
  return client.db(dbName);
}

export async function getCollection(collection: string): Promise<Collection> {
  const db = await getDatabase();
  return db.collection(collection);
}

export async function getDatabaseByUri(
  mongoUri: string,
  dbName: string
): Promise<Db> {
  const client = new MongoClient(mongoUri, {});
  await client.connect();

  return client.db(dbName);
}
