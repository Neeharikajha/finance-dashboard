import { NextResponse } from "next/server";

// Simple in-memory cache and rate limit
const cache = new Map(); // key -> { ts, ttlMs, data }
const RATE_LIMIT_WINDOW_MS = 10_000;
const RATE_LIMIT_MAX = 30; // requests/window per IP
const ipHits = new Map(); // ip -> { windowStart, count }

function shouldRateLimit(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip) || { windowStart: now, count: 0 };
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry.windowStart = now;
    entry.count = 0;
  }
  entry.count += 1;
  ipHits.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (shouldRateLimit(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const { url, method = "GET", headers = {}, query = {}, payload = null, ttlSeconds = 30, provider } = body || {};

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    // Inject server-side API keys if provider specified
    const serverHeaders = { ...(headers || {}) };
    if (provider === "alphavantage" && !("apikey" in (query || {}))) {
      const key = process.env.ALPHA_VANTAGE_KEY;
      if (key) query.apikey = key;
    }
    if (provider === "finnhub" && !serverHeaders["X-Finnhub-Token"]) {
      const key = process.env.FINNHUB_KEY;
      if (key) serverHeaders["X-Finnhub-Token"] = key;
    }

    // Build final URL with query params
    const u = new URL(url);
    Object.entries(query || {}).forEach(([k, v]) => {
      if (v != null) u.searchParams.set(k, String(v));
    });

    // Cache key based on URL + method + payload hash
    const cacheKey = `${method}:${u.toString()}:${payload ? JSON.stringify(payload) : ''}`;
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && now - cached.ts < (cached.ttlMs || ttlSeconds * 1000)) {
      return NextResponse.json(cached.data, { status: 200, headers: { "x-cache": "HIT" } });
    }

    const upstream = await fetch(u.toString(), {
      method,
      headers: serverHeaders,
      body: payload ? JSON.stringify(payload) : undefined,
      // Prevent caching issues
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "application/json";
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return NextResponse.json({ error: `Upstream ${upstream.status}`, details: text }, { status: upstream.status });
    }

    let data;
    if (contentType.includes("application/json")) {
      data = await upstream.json();
    } else {
      const text = await upstream.text();
      data = { data: text };
    }

    cache.set(cacheKey, { ts: now, ttlMs: ttlSeconds * 1000, data });
    return NextResponse.json(data, { status: 200, headers: { "x-cache": "MISS" } });
  } catch (err) {
    return NextResponse.json({ error: "Proxy error", message: err.message }, { status: 500 });
  }
}

export const runtime = "nodejs"; // ensure Node runtime (for fetch, env, etc.)

