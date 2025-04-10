import { NextRequest, NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";
import { v4 as uuidv4 } from "uuid";

const connectionString = process.env.COSMOS_CONNECTION_STRING;
const client = new CosmosClient(connectionString!);
const container = client.database("labportal").container("batchEvents");

export async function POST(req: NextRequest) {
    try {
      const { batchId, eventType, triggeredBy, timestamp } = await req.json();
      
      console.log("Received data for batch event:", { batchId, eventType, triggeredBy, timestamp }); // Log data for debugging
  
      if (!batchId || !eventType || !triggeredBy || !timestamp) {
        console.error("Missing fields in event logging request:", { batchId, eventType, triggeredBy, timestamp });
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      const eventDoc = {
        id: uuidv4(),
        batchId,
        eventType,
        triggeredBy,
        timestamp,
      };
  
      await container.items.create(eventDoc);
  
      console.log("Event logged successfully:", eventDoc); // Log successful event logging
  
      return NextResponse.json({ success: true, eventId: eventDoc.id });
    } catch (err: any) {
      console.error("❌ Failed to log batch event:", err.message);
      return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
    }
  }
  