import { NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
const database = client.database('labportal');
const container = database.container('products');

// GET all products
export async function GET() {
  try {
    console.log("🔍 Fetching all products...");
    const { resources: products } = await container.items.query('SELECT * FROM c').fetchAll();
    console.log("✅ Retrieved products:", products);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("❌ GET error:", error.message);
    return NextResponse.json({ error: "Failed to fetch products", details: error.message }, { status: 500 });
  }
}

// POST new product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 POST body:", body);

    const { resource: created } = await container.items.create(body);
    console.log("✅ Created product:", created);

    return NextResponse.json(created);
  } catch (error: any) {
    console.error("❌ POST error:", error.message);
    return NextResponse.json({ error: "Failed to create product", details: error.message }, { status: 500 });
  }
}
