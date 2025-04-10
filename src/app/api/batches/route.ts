import { NextRequest, NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_CONNECTION_STRING!;
const client = new CosmosClient(connectionString);

const container = client.database("labportal").container("batches");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.formulaId || !body.batchId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = `${body.formulaId}-${Date.now()}`;

    const batch = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
      status: "InProgress",
    };

    await container.items.create(batch);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("❌ Failed to save batch:", error.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
    try {
      const { resources } = await container.items.query("SELECT * FROM c").fetchAll();
      return NextResponse.json(resources);
    } catch (error: any) {
      console.error("❌ Failed to fetch batch list:", error.message);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
  
