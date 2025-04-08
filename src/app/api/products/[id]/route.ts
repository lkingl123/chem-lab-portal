// src/app/api/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_CONNECTION_STRING!;
const client = new CosmosClient(connectionString);
const container = client.database("labportal").container("products");

// PATCH: Update a product
export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  try {
    const id = context.params.id;
    const body = await req.json();

    const { resource: existing } = await container.item(id, id).read();

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString()
    };

    const { resource } = await container.items.upsert(updated);
    return NextResponse.json(resource);
  } catch (err: any) {
    console.error("PATCH error:", err.message);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE: Remove a product
export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  try {
    const id = context.params.id;
    await container.item(id, id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
