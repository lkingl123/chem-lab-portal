// /src/app/api/invite/route.ts
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
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
    }

    const token = await getAccessToken();
    const client = Client.init({ authProvider: (done) => done(null, token) });

    // Step 1: Invite the user
    const invite = await client.api("/invitations").post({
      invitedUserEmailAddress: email,
      inviteRedirectUrl: "https://localhost:3000/", // or your prod URL
      sendInvitationMessage: true,
    });

    const invitedUser = invite.invitedUser;
    const userId = invitedUser?.id;
    const userPrincipalName = invitedUser?.userPrincipalName;
    const displayName = invitedUser?.displayName || email;

    if (!userId || !userPrincipalName) {
      return NextResponse.json({ error: "Failed to invite user" }, { status: 500 });
    }

    // Step 2: Store user + role in Cosmos DB
    await usersCollection.items.upsert({
      id: userId,
      email,
      userPrincipalName,
      displayName,
      role,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Invite error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
