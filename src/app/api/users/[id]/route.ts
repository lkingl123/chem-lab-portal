// /src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { usersCollection } from "@/lib/cosmos";

export async function PATCH(req: Request) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Get the user ID from the URL
  
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });
    }
  
    const body = await req.json();
    const { role } = body;
  
    if (!role) {
      return new Response(JSON.stringify({ error: "Missing role" }), { status: 400 });
    }
  
    // 🔧 Upsert into Cosmos (assuming usersCollection is set up)
    await usersCollection.items.upsert({
      id,
      role,
    });
  
    return new Response(JSON.stringify({ success: true }));
  }
  
