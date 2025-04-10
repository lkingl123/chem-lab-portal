import { NextRequest, NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";
import { v4 as uuidv4 } from "uuid";

const connectionString = process.env.COSMOS_CONNECTION_STRING!;
const client = new CosmosClient(connectionString);
const container = client.database("labportal").container("batchEvents");

export async function POST(req: NextRequest) {
  try {
    const { batchId, eventType, triggeredBy, timestamp } = await req.json();

    // Validate the request data
    if (!batchId || !eventType || !triggeredBy || !timestamp) {
      console.error("Missing fields in event logging request:", { batchId, eventType, triggeredBy, timestamp });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the event already exists in the database
    const existingEvent = await container.items.query(
      `SELECT * FROM c WHERE c.batchId = '${batchId}' AND c.eventType = '${eventType}'`
    ).fetchAll();

    if (existingEvent.resources.length > 0) {
      console.log("Event already logged for this batch.");
      return NextResponse.json({ error: "Event already exists" }, { status: 400 });
    }

    // Generate a new unique ID for the event
    const eventDoc = {
      id: uuidv4(),
      batchId,
      eventType,
      triggeredBy,
      timestamp,
    };

    // Insert the event into Cosmos DB
    await container.items.create(eventDoc);

    console.log("Event logged successfully:", eventDoc);

    return NextResponse.json({ success: true, eventId: eventDoc.id });
  } catch (err: any) {
    console.error("❌ Failed to log batch event:", err.message);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
