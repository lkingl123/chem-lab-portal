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
    const { status, completedBy, completedAt, completionNotes, abortedAt, assignedTo, assignedAt } = body;

    if (!["InProgress", "Completed", "Aborted"].includes(status)) {
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
      ...(status === "InProgress" && {
        assignedTo,
        assignedAt: assignedAt || new Date().toISOString(),
      }),
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
    let eventType: "Accepted" | "Completed" | "Aborted" | null = null;

    switch (status) {
      case "InProgress":
        eventType = "Accepted";
        break;
      case "Completed":
        eventType = "Completed";
        break;
      case "Aborted":
        eventType = "Aborted";
        break;
    }

    if (eventType) {
      await fetch(`${process.env.NEXT_PUBLIC_REDIRECT_URI}/api/batchEvents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: id,
          eventType,
          triggeredBy: assignedTo || completedBy || existingBatch.assignedTo || existingBatch.completedBy || "system",
          timestamp,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Failed to update batch:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// GET
export async function GET(req: NextRequest) {
  try {
    const id = extractIdFromUrl(req.nextUrl.pathname);
    const { resource } = await container.item(id, id).read();

    if (!resource) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    return NextResponse.json(resource);
  } catch (err: any) {
    console.error("❌ Failed to fetch batch:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}