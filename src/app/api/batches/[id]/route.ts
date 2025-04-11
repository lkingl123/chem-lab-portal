import { NextRequest, NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_CONNECTION_STRING!;
const client = new CosmosClient(connectionString);
const container = client.database("labportal").container("batches");

function extractIdFromUrl(url: string): string {
  const clean = url.split("?")[0].replace(/\/$/, "");
  return clean.split("/").pop()!;
}

// PATCH
export async function PATCH(req: NextRequest) {
  try {
    const id = extractIdFromUrl(req.nextUrl.pathname);
    console.log(`Attempting to update batch with id: ${id}`);

    const body = await req.json();
    const { status, completedBy, completedAt, completionNotes, abortedAt } = body;

    if (!["Completed", "Aborted"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { resource: existingBatch } = await container.item(id, id).read();
    if (!existingBatch) {
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
    console.log(`Batch with id: ${id} successfully updated.`);

    const timestamp = new Date().toISOString();
    const triggeredBy = req.nextUrl.searchParams.get("triggeredBy") || "unknown";

    await fetch(`${process.env.NEXT_PUBLIC_REDIRECT_URI}/api/batchEvents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        batchId: id,
        eventType: "StatusUpdated",
        triggeredBy,
        timestamp,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Failed to update batch:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  try {
    const id = extractIdFromUrl(req.nextUrl.pathname);
    console.log(`Attempting to delete batch with id: ${id}`);

    const { resource: batch } = await container.item(id, id).read();
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    await container.item(id, id).delete();
    console.log(`Batch with id: ${id} successfully deleted.`);

    const timestamp = new Date().toISOString();
    const triggeredBy = req.nextUrl.searchParams.get("triggeredBy") || "unknown";

    const eventRes = await fetch(`${process.env.NEXT_PUBLIC_REDIRECT_URI}/api/batchEvents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        batchId: id,
        eventType: "Deleted",
        triggeredBy,
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
