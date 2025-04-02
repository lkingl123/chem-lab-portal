// /src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { usersCollection } from "@/lib/cosmos";

export async function PATCH(req: Request) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
  
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }
  
    const body = await req.json();
    const { role } = body;
  
    if (!role) {
      return NextResponse.json({ error: "Missing role" }, { status: 400 });
    }
  
    // ✅ Get existing user
    const { resource: existingUser } = await usersCollection.item(id, id).read();
  
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  
    // ✅ Upsert with full object (preserving displayName, email, etc.)
    await usersCollection.items.upsert({
      ...existingUser,
      role,
    });
  
    return NextResponse.json({ success: true });
  }
