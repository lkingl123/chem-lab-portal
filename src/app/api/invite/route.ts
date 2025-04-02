import { NextRequest, NextResponse } from "next/server";
import { Client } from "@microsoft/microsoft-graph-client";
import { usersCollection } from "@/lib/cosmos";
import "isomorphic-fetch";

const tenantId = process.env.AZURE_TENANT_ID!;
const clientId = process.env.AZURE_CLIENT_ID!;
const clientSecret = process.env.AZURE_CLIENT_SECRET!;

async function getAccessToken(): Promise<string> {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Access token not received");
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { email, displayName, role } = await req.json();

    if (!email || !displayName || !role) {
      return NextResponse.json(
        { error: "Email, displayName, and role are required" },
        { status: 400 }
      );
    }

    // 🔍 Check if the email already exists in Cosmos DB
    const query = {
      query: "SELECT * FROM c WHERE c.email = @email",
      parameters: [{ name: "@email", value: email }],
    };
    const { resources: existingUsers } = await usersCollection.items
      .query(query)
      .fetchAll();

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "A user with this email has already been invited." },
        { status: 409 }
      );
    }

    const token = await getAccessToken();
    const client = Client.init({ authProvider: (done) => done(null, token) });

    const invitation = await client.api("/invitations").post({
      invitedUserEmailAddress: email,
      inviteRedirectUrl: "http://localhost:3000",
      sendInvitationMessage: true,
    });

    let userId = invitation?.invitedUser?.id;

    if (!userId) {
      const user = await client.api(`/users/${email}`).get();
      userId = user?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unable to resolve invited user" }, { status: 500 });
    }

    await usersCollection.items.upsert({
      id: userId,
      email,
      displayName,
      role,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("/api/invite error:", err.message, err.stack);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
