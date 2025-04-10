import { NextRequest, NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";
import { v4 as uuidv4 } from "uuid";

const connectionString = process.env.COSMOS_CONNECTION_STRING;
const client = new CosmosClient(connectionString!);
const container = client.database("labportal").container("batchEvents");

// POST /api/batchEvents
export async function POST(req: NextRequest) {
  try {
    const { batchId, eventType, triggeredBy, timestamp } = await req.json();

    if (!batchId || !eventType || !triggeredBy || !timestamp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const eventDoc = {
      id: uuidv4(), // unique ID for this event
      batchId,
      eventType,
      triggeredBy,
      timestamp,
    };

    await container.items.create(eventDoc);

    return NextResponse.json({ success: true, eventId: eventDoc.id });
  } catch (err: any) {
    console.error("❌ Failed to log batch event:", err.message);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
