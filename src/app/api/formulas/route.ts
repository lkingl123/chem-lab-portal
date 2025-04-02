// src/app/api/formulas/route.ts
import { NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_CONNECTION_STRING;

if (!connectionString) {
  console.error("❌ Missing COSMOS_CONNECTION_STRING in .env.local");
}

const client = new CosmosClient(connectionString!);

const databaseId = "labportal";
const containerId = "formulas";

export async function GET() {
  try {
    const container = client.database(databaseId).container(containerId);
    const query = "SELECT * FROM c";
    const { resources } = await container.items.query(query).fetchAll();

    return NextResponse.json(resources);
  } catch (error: any) {
    console.error("🔥 Cosmos DB GET error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
