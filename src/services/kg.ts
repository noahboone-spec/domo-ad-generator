/**
 * Knowledge Graph API Client
 *
 * Fetches messaging content from the Domo Knowledge Graph.
 * The KG contains products, concepts, competitor info, and
 * 197+ sections of marketing copy — perfect for generating
 * ad variants with different messaging.
 *
 * Architecture note: We call the KG REST API directly from
 * the browser (client-side). In production you'd proxy through
 * a Next.js API route to hide the API key. For now, we use
 * a server-side API route.
 */

const KG_API_URL = process.env.KG_API_URL || process.env.NEXT_PUBLIC_KG_API_URL || "";
const KG_API_KEY = process.env.KG_API_KEY || process.env.NEXT_PUBLIC_KG_API_KEY || "";

interface KGProduct {
  name: string;
  tagline?: string;
  description?: string;
  key_benefits?: string[];
  value_propositions?: string[];
}

interface KGSearchResult {
  title: string;
  content: string;
  section_type?: string;
}

/**
 * Ask the KG a natural language question.
 * Great for generating headlines: "What's a compelling headline about Domo BI?"
 */
export async function askKnowledgeGraph(query: string): Promise<string> {
  const res = await fetch(`${KG_API_URL}/api/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": KG_API_KEY,
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error(`KG query failed: ${res.status}`);
  const data = await res.json();
  return data.answer || data.result || "";
}

/**
 * Get product info — returns taglines, benefits, value props.
 * Perfect for generating product-specific ad campaigns.
 */
export async function getProductInfo(productName: string): Promise<KGProduct | null> {
  const res = await fetch(`${KG_API_URL}/api/products/${encodeURIComponent(productName)}`, {
    headers: { "X-API-Key": KG_API_KEY },
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.product || data;
}

/**
 * Search documents for messaging content.
 * Returns sections that match your keyword — great for finding
 * specific copy like "finance" or "data integration" messaging.
 */
export async function searchDocuments(keyword: string): Promise<KGSearchResult[]> {
  const res = await fetch(`${KG_API_URL}/api/documents/search?q=${encodeURIComponent(keyword)}`, {
    headers: { "X-API-Key": KG_API_KEY },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

/**
 * Get all available products — useful for building a product selector dropdown.
 */
export async function getAllProducts(): Promise<string[]> {
  const res = await fetch(`${KG_API_URL}/api/products`, {
    headers: { "X-API-Key": KG_API_KEY },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return (data.products || []).map((p: { name: string }) => p.name);
}
