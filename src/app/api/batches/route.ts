import { NextRequest, NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_CONNECTION_STRING!;
const client = new CosmosClient(connectionString);

const container = client.database("labportal").container("batches");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentUser } = body; // Current user should be passed from client

    if (!body.formulaId || !body.batchId || !body.assignedBy ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const batchId = body.batchId;

    const batch = {
      id: batchId,  // Use the batchId provided by the client
      ...body,
      createdAt: new Date().toISOString(),
      status: "NotStarted",
    };

    await container.items.create(batch);

    // Log the batch creation event
    const timestamp = new Date().toISOString();
    try {
      await fetch("/api/batchEvents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId,  // Use the same batchId here
          eventType: "Created",
          triggeredBy: currentUser,  // Use the currentUser here
          timestamp,
        }),
      });
      console.log("✔ Created event logged successfully");
    } catch (err) {
      console.error("❌ Failed to log Created event", err);
    }

    return NextResponse.json({ success: true, id: batchId });
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
  
