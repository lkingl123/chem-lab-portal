// /src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { usersCollection } from "@/lib/cosmos";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const { role } = await req.json();

  if (!role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  try {
    const { resource: existingUser } = await usersCollection.item(userId, userId).read();

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = {
      ...existingUser,
      role,
    };

    await usersCollection.items.upsert(updatedUser);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
