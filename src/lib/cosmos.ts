// /src/lib/cosmos.ts
import { CosmosClient } from "@azure/cosmos";

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
const db = client.database("labportal");
const usersCollection = db.container("users");

export { usersCollection };
