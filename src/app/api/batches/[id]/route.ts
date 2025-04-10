import { NextRequest, NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_CONNECTION_STRING!;
const client = new CosmosClient(connectionString);
const container = client.database("labportal").container("batches");

// PATCH (Already present)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
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
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Failed to update batch:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Since /id is the partition key, just use id for both
    const { resource: batch } = await container.item(id, id).read();

    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    await container.item(id, id).delete();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Failed to delete batch:", err.message);
    return NextResponse.json(
      { error: "Failed to delete batch", details: err.message },
      { status: 500 }
    );
  }
}