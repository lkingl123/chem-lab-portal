// /src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { usersCollection } from "@/lib/cosmos";

export async function GET() {
  try {
    const { resources: users } = await usersCollection.items.readAll().fetchAll();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
