import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string; // e.g., from your .env
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

// In development, use a global variable so the client is reused across hot reloads
if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
