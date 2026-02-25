import { NextRequest, NextResponse } from "next/server";

/**
 * KG API Proxy Route
 *
 * Why a proxy? The KG API key should stay on the server.
 * The browser calls /api/kg?action=products, and this route
 * forwards it to the real KG API with the key attached.
 *
 * This is a Next.js "Route Handler" — it handles HTTP requests
 * at the /api/kg URL path. GET requests hit this function.
 */

const KG_API_URL = process.env.KG_API_URL || "";
const KG_API_KEY = process.env.KG_API_KEY || "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": KG_API_KEY,
  };

  try {
    if (action === "products") {
      const res = await fetch(`${KG_API_URL}/api/products`, { headers });
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (action === "product") {
      const name = searchParams.get("name") || "";
      const res = await fetch(
        `${KG_API_URL}/api/products/${encodeURIComponent(name)}`,
        { headers }
      );
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (action === "search") {
      const q = searchParams.get("q") || "";
      const res = await fetch(
        `${KG_API_URL}/api/documents/search?q=${encodeURIComponent(q)}`,
        { headers }
      );
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: "KG API request failed", details: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const res = await fetch(`${KG_API_URL}/api/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": KG_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "KG query failed", details: String(err) },
      { status: 500 }
    );
  }
}
