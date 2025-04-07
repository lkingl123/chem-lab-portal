// src/app/api/formulas/route.ts
import { NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_CONNECTION_STRING;

if (!connectionString) {
  console.error("❌ Missing COSMOS_CONNECTION_STRING in .env.local");
}

const client = new CosmosClient(connectionString!);
const container = client.database("labportal").container("formulas");

export async function GET() {
  try {
    const { resources } = await container.items
      .query("SELECT * FROM c") // ⚠️ Make sure this is not SELECT c.id, c.name, etc.
      .fetchAll();

    // Log what you're returning
    console.log("✅ Full formulas from DB:", resources);

    return NextResponse.json(resources);
  } catch (error: any) {
    console.error("🔥 Cosmos DB GET error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
