import { NextRequest, NextResponse } from "next/server";
import { usersCollection } from "@/lib/cosmos";

// ✅ PATCH: Update a user's role
export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const body = await req.json();
  const { role } = body;

  if (!role) {
    return NextResponse.json({ error: "Missing role" }, { status: 400 });
  }

  try {
    const { resource: existingUser } = await usersCollection.item(id, id).read();

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await usersCollection.items.upsert({
      ...existingUser,
      role,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to update role:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ DELETE: Remove a user from Cosmos DB only
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    await usersCollection.item(id, id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to delete user from Cosmos DB:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
