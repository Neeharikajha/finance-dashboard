import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Normalize various finance API formats into a unified table row shape
// Output: { symbol, name, price, change, changePercent, volume }
export function normalizeToTableRows(raw) {
  if (!raw) return [];

  // Alpha Vantage Global Quote
  if (raw["Global Quote"]) {
    const q = raw["Global Quote"];
    return [{
      symbol: q["01. symbol"],
      name: q["01. symbol"],
      price: Number(q["05. price"]) || 0,
      change: Number(q["09. change"]) || 0,
      changePercent: Number(String(q["10. change percent"]).replace('%','')) || 0,
      volume: Number(q["06. volume"]) || 0,
    }];
  }

  // Yahoo Finance chart meta -> approximate single row
  if (raw.chart?.result?.[0]?.meta) {
    const m = raw.chart.result[0].meta;
    const change = (m.regularMarketPrice ?? 0) - (m.previousClose ?? 0);
    const cp = (m.previousClose ? (change / m.previousClose) * 100 : 0);
    return [{
      symbol: m.symbol,
      name: m.symbol,
      price: Number(m.regularMarketPrice) || 0,
      change,
      changePercent: Number(cp.toFixed(2)) || 0,
      volume: Number(m.dailyVolume) || 0,
    }];
  }

  // Generic array of rows with common keys
  if (Array.isArray(raw)) {
    return raw.map((r) => ({
      symbol: r.symbol || r.ticker || "-",
      name: r.name || r.companyName || r.symbol || "-",
      price: Number(r.price ?? r.last ?? r.close ?? 0),
      change: Number(r.change ?? r.delta ?? 0),
      changePercent: Number(r.changePercent ?? r.percent ?? 0),
      volume: Number(r.volume ?? r.vol ?? 0),
    }));
  }

  // Generic object containing a list
  if (raw.stocks && Array.isArray(raw.stocks)) {
    return normalizeToTableRows(raw.stocks);
  }

  return [];
}