// /api/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
const database = client.database("labportal");
const container = database.container("products");

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await req.json();

  try {
    const { resource: existing } = await container.item(id, id).read(); // Ensure 'id' matches the Cosmos `id`
    const updated = { ...existing, ...body };

    const { resource } = await container.items.upsert(updated);
    return NextResponse.json(resource);
  } catch (err: any) {
    console.error("PATCH error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// DELETE: Delete product
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await container.item(params.id, params.id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
