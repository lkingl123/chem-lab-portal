import { NextRequest, NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_CONNECTION_STRING!;
const client = new CosmosClient(connectionString);
const container = client.database("labportal").container("batches");


function extractIdFromUrl(url: string): string {
  const clean = url.split("?")[0].replace(/\/$/, "");
  return clean.split("/").pop()!;
}
// PATCH (Already present)
export async function PATCH(req: NextRequest) {
  try {
    const id = extractIdFromUrl(req.nextUrl.pathname); // Extract the id from the URL
    console.log(`Attempting to update batch with id: ${id}`); // Log the batchId being updated

    const body = await req.json();
    const { status, completedBy, completedAt, completionNotes, abortedAt } = body;

    if (!["Completed", "Aborted"].includes(status)) {
      console.error("Invalid status:", status); // Log error if status is invalid
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { resource: existingBatch } = await container.item(id, id).read();

    if (!existingBatch) {
      console.error("Batch not found:", id); // Log error if batch is not found
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    const updated = {
      ...existingBatch,
      status,
      updatedAt: new Date().toISOString(),
      ...(status === "Completed" && {
        completedAt: completedAt || new Date().toISOString(),
        completedBy,
        completionNotes: completionNotes || null,
      }),
      ...(status === "Aborted" && {
        abortedAt: abortedAt || new Date().toISOString(),
      }),
    };

    await container.items.upsert(updated);

    console.log(`Batch with id: ${id} successfully updated.`); // Log successful update

    // Optionally log the update event
    const timestamp = new Date().toISOString();
    await fetch("/api/batchEvents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        batchId: id,
        eventType: "StatusUpdated",
        triggeredBy: "Admin", // You can update this based on the logged-in user
        timestamp,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Failed to update batch:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



export async function DELETE(req: NextRequest) {
  try {
    const id = extractIdFromUrl(req.nextUrl.pathname); // Extract the id from the URL
    console.log(`Attempting to delete batch with id: ${id}`); // Add a log for debugging

    const { resource: batch } = await container.item(id, id).read();

    if (!batch) {
      console.error("Batch not found:", id); // Log error if batch not found
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    // Delete the batch item
    await container.item(id, id).delete();

    console.log(`Batch with id: ${id} successfully deleted.`); // Log successful deletion

    // Optionally log the deletion event (batchId, eventType: "Deleted", etc.)
    const timestamp = new Date().toISOString();

    // Use dynamic base URL (from environment variable)
    const baseUrl = process.env.NEXT_PUBLIC_REDIRECT_URI; 
    const eventRes = await fetch(`${baseUrl}/api/batchEvents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        batchId: id,
        eventType: "Deleted",
        triggeredBy: "Admin", // Replace with the current user
        timestamp,
      }),
    });

    if (!eventRes.ok) {
      const error = await eventRes.json();
      console.error("❌ Failed to log event:", error);
      return NextResponse.json({ error: "Failed to log event", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Failed to delete batch:", err.message);
    return NextResponse.json({ error: "Failed to delete batch", details: err.message }, { status: 500 });
  }
}
