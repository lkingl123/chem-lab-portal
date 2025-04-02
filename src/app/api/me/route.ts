// /src/app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { usersCollection } from "@/lib/cosmos";

export async function GET(req: NextRequest) {
    try {
      const authHeader = req.headers.get("authorization");
      if (!authHeader) {
        console.error("Missing Authorization header");
        return NextResponse.json({ error: "No token" }, { status: 401 });
      }
  
      const token = authHeader.split(" ")[1];
      if (!token) {
        console.error("Malformed token header:", authHeader);
        return NextResponse.json({ error: "Invalid token format" }, { status: 400 });
      }
  
      const decoded = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
  
      const userId = decoded.oid || decoded.sub;
      const { resource } = await usersCollection.item(userId, userId).read();
  
      return NextResponse.json({ role: resource?.role || null });
    } catch (error) {
      console.error("Internal error in /api/me:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
  