"use client";

import { useState, useEffect } from "react";
import { themes, Theme } from "@/themes";
import { bannerSizes } from "@/lib/banner-sizes";
import { layoutMap } from "@/layouts";

/**
 * Dashboard Page — Preview all banners with live theme switching.
 *
 * "use client" at the top makes this a Client Component. This is needed
 * because we use useState (interactive state). Server Components can't
 * have state — they render once on the server. Client Components render
 * in the browser and can be interactive.
 */
export default function Dashboard() {
  const [theme, setTheme] = useState<Theme>(themes[0]);
  const [headline, setHeadline] = useState(
    "Maximize your finance data to fuel your business strategy"
  );
  const [cta, setCta] = useState("LEARN MORE");
  const [kgQuery, setKgQuery] = useState("");
  const [kgLoading, setKgLoading] = useState(false);
  const [kgSuggestions, setKgSuggestions] = useState<string[]>([]);

  /**
   * Ask the Knowledge Graph for headline suggestions.
   * This calls our /api/kg proxy → which calls the real KG API.
   */
  async function fetchKGHeadlines() {
    if (!kgQuery.trim()) return;
    setKgLoading(true);
    try {
      const res = await fetch("/api/kg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `Generate 5 short, punchy ad headlines (under 10 words each) about: ${kgQuery}. Format as a numbered list.`,
        }),
      });
      const data = await res.json();
      const answer = data.answer || data.result || "";
      // Parse numbered list into array
      const lines = answer
        .split("\n")
        .map((l: string) => l.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter((l: string) => l.length > 0 && l.length < 80);
      setKgSuggestions(lines);
    } catch {
      setKgSuggestions(["Error fetching from Knowledge Graph"]);
    }
    setKgLoading(false);
  }

  const channels = ["linkedin", "gdn", "demandbase"] as const;

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#1e1e1e" }}>
      {/* Controls */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: "#2a2a2a" }}>
        <h1
          className="text-2xl font-bold mb-4"
          style={{ color: "#99CCEE", fontFamily: "'Open Sans', sans-serif" }}
        >
          Domo Ad Banner Generator
        </h1>

        <div className="flex flex-wrap gap-6">
          {/* Theme Selector */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Theme</label>
            <select
              value={theme.name}
              onChange={(e) => {
                const selected = themes.find((t) => t.name === e.target.value);
                if (selected) setTheme(selected);
              }}
              className="bg-gray-700 text-white px-3 py-2 rounded text-sm"
            >
              {themes.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Headline Editor */}
          <div className="flex-1 min-w-64">
            <label className="block text-sm text-gray-400 mb-1">Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
            />
          </div>

          {/* CTA Editor */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">CTA Text</label>
            <input
              type="text"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
            />
          </div>
        </div>

        {/* KG Messaging Panel */}
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid #444" }}>
          <label className="block text-sm text-gray-400 mb-1">
            Knowledge Graph — Generate Headlines
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={kgQuery}
              onChange={(e) => setKgQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchKGHeadlines()}
              placeholder="e.g. Domo BI for finance teams, data integration, AI analytics..."
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-sm"
            />
            <button
              onClick={fetchKGHeadlines}
              disabled={kgLoading}
              className="px-4 py-2 rounded text-sm font-semibold"
              style={{ backgroundColor: "#FFB656", color: "#111" }}
            >
              {kgLoading ? "Loading..." : "Generate"}
            </button>
          </div>

          {kgSuggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {kgSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setHeadline(s)}
                  className="px-3 py-1 rounded text-xs text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#3a3a3a", border: "1px solid #555" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Banner Grid — grouped by channel */}
      {channels.map((channel) => {
        const sizes = bannerSizes.filter((s) => s.channel === channel);
        if (sizes.length === 0) return null;

        return (
          <div key={channel} className="mb-12">
            <h2
              className="text-lg font-semibold mb-4 uppercase tracking-wider"
              style={{ color: "#FFB656" }}
            >
              {channel}
            </h2>

            <div className="flex flex-wrap gap-6 items-start">
              {sizes.map((size) => {
                const Layout = layoutMap[size.slug];
                if (!Layout) return null;

                return (
                  <div key={size.slug}>
                    <p className="text-xs text-gray-500 mb-1">
                      {size.label} ({size.width}x{size.height})
                    </p>
                    {/* Scale down large banners so they fit on screen */}
                    <div
                      style={{
                        transform:
                          size.width > 600
                            ? `scale(${600 / size.width})`
                            : "none",
                        transformOrigin: "top left",
                        width:
                          size.width > 600 ? 600 : size.width,
                        height:
                          size.width > 600
                            ? size.height * (600 / size.width)
                            : size.height,
                      }}
                    >
                      <Layout theme={theme} headline={headline} cta={cta} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
