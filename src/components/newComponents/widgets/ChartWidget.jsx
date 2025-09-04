
"use client";
import { useState, useEffect, useRef } from "react";
import { WidgetLoadingWrapper } from "../LoadingStates";

export default function ChartWidget({ widget = {} }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState(widget.chartInterval || "1d");
  const [selectedFields, setSelectedFields] = useState(widget.selectedFields || ["close"]);
  const canvasRef = useRef(null);

  const cacheTTL = widget.cacheTTL ?? 300; // seconds (default 5 min)
  const refreshInterval = widget.refreshInterval ?? null; // seconds, optional
  const cacheKey = `chart-${widget.id ?? widget.symbol ?? "unknown"}-${selectedInterval}`;

  // helper: generate mock data (same style as your original)
  function generateMockData(points, type) {
    const data = [];
    let basePrice = 150;
    const now = new Date();

    for (let i = points; i >= 0; i--) {
      const date = new Date(now);
      if (type === "hourly") date.setHours(date.getHours() - i);
      else date.setDate(date.getDate() - i);

      const change = (Math.random() - 0.5) * 10;
      basePrice += change;
      basePrice = Math.max(50, Math.min(300, basePrice));

      const open = basePrice + (Math.random() - 0.5) * 2;
      const close = basePrice + (Math.random() - 0.5) * 2;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;

      data.push({
        date: date.toISOString(),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }
    return data;
  }

  const mockData = {
    "1d": generateMockData(24, "hourly"),
    "1wk": generateMockData(7, "daily"),
    "1mo": generateMockData(30, "daily"),
  };

  // parse common API shapes into array of {date, open, high, low, close, volume}
  const parseChartApi = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    // Yahoo Finance chart shape
    if (data.chart && data.chart.result && data.chart.result[0]) {
      try {
        const r = data.chart.result[0];
        const timestamps = r.timestamp || [];
        const q = r.indicators?.quote?.[0] || {};
        return timestamps.map((t, i) => ({
          date: new Date(t * 1000).toISOString(),
          open: q.open?.[i] ?? null,
          high: q.high?.[i] ?? null,
          low: q.low?.[i] ?? null,
          close: q.close?.[i] ?? null,
          volume: q.volume?.[i] ?? null,
        }));
      } catch {
        return [];
      }
    }

    // Alpha Vantage like "Time Series (Daily)" keys
    const timeKey = Object.keys(data).find((k) => k.toLowerCase().includes("time series"));
    if (timeKey) {
      const series = data[timeKey];
      return Object.keys(series)
        .map((dt) => {
          const o = series[dt];
          return {
            date: new Date(dt).toISOString(),
            open: parseFloat(o["1. open"]),
            high: parseFloat(o["2. high"]),
            low: parseFloat(o["3. low"]),
            close: parseFloat(o["4. close"]),
            volume: parseInt(o["5. volume"] || 0),
          };
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // common wrappers
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.results && Array.isArray(data.results)) return data.results;
    if (data.series && Array.isArray(data.series)) return data.series;

    return [];
  };

  // Fetch with caching + auto-refresh
  const fetchChartData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try localStorage cache
      try {
        const cachedRaw = localStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cachedObj = JSON.parse(cachedRaw);
          if (cachedObj?.ts && Date.now() - cachedObj.ts < cacheTTL * 1000) {
            setChartData(cachedObj.data);
            setLoading(false);
            return;
          } else {
            localStorage.removeItem(cacheKey);
          }
        }
      } catch (e) {
        // ignore localStorage parsing errors
      }

      // Fetch from API if endpoint & symbol provided
      if (widget.apiEndpoint && widget.symbol) {
        // Build endpoint best-effort:
        let url = widget.apiEndpoint;
        // If endpoint expects pattern /chart/SYMBOL?interval=...
        if (url.includes("{symbol}")) {
          url = url.replace("{symbol}", widget.symbol).replace("{interval}", selectedInterval);
        } else if (!url.includes(widget.symbol) && !url.includes("alphavantage.co")) {
          url = `${url.replace(/\/$/, "")}/chart/${widget.symbol}?interval=${selectedInterval}`;
        } else if (url.includes("alphavantage.co")) {
          // Accept user-provided alphavantage base, append query for TIME_SERIES_DAILY
          const func = widget.apiFunction || "TIME_SERIES_DAILY";
          url = `${url.includes("?") ? url + "&" : url + "?"}function=${func}&symbol=${widget.symbol}&apikey=${widget.apiKey || ""}`;
        } else {
          // ensure interval param
          url = `${url}${url.includes("?") ? "&" : "?"}interval=${selectedInterval}`;
        }

        const response = await fetch(url, {
          headers: widget.apiKey && !url.includes("alphavantage.co") ? { Authorization: `Bearer ${widget.apiKey}` } : {},
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const apiData = await response.json();
        const series = parseChartApi(apiData);

        if (!Array.isArray(series) || series.length === 0) {
          // fallback to mock
          setChartData(mockData[selectedInterval] || []);
          localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: mockData[selectedInterval] || [] }));
        } else {
          setChartData(series);
          localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: series }));
        }
      } else {
        // No API configured -> use mock
        const md = mockData[selectedInterval] || [];
        setChartData(md);
        localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: md }));
      }
    } catch (err) {
      setError(err.message || "Failed to fetch");
      // fallback to mock
      const md = mockData[selectedInterval] || [];
      setChartData(md);
      try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: md })); } catch {}
    } finally {
      setLoading(false);
    }
  };

  // Drawing helpers (reads chartData & selectedFields)
  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || !chartData || chartData.length === 0) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // resets and scales

    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    ctx.clearRect(0, 0, width, height);

    // price range
    let prices = [];
    if (widget.chartType === "candle") {
      prices = chartData.flatMap((d) => [d.high, d.low]).filter((v) => typeof v === "number");
    } else {
      const fields = selectedFields && selectedFields.length ? selectedFields : ["close"];
      prices = chartData.flatMap((d) => fields.map((f) => d[f])).filter((v) => typeof v === "number");
    }
    if (prices.length === 0) return;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    let priceRange = maxPrice - minPrice;
    if (priceRange === 0) priceRange = 1;
    const pricePadding = priceRange * 0.1;

    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const stepX = chartWidth / Math.max(1, chartData.length - 1);

    // grid lines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    if (widget.chartType === "candle") {
      drawCandlestickChart(ctx, chartData, padding, chartWidth, chartHeight, stepX, minPrice - pricePadding, maxPrice + pricePadding);
    } else {
      drawMultiLine(ctx, chartData, padding, chartWidth, chartHeight, stepX, minPrice - pricePadding, maxPrice + pricePadding);
    }

    // Y-axis labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice + pricePadding - (priceRange + 2 * pricePadding) * (i / 5);
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(`$${price.toFixed(2)}`, padding - 10, y + 4);
    }
  };

  const drawMultiLine = (ctx, data, padding, chartWidth, chartHeight, stepX, minPrice, maxPrice) => {
    const colors = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];
    const fields = selectedFields && selectedFields.length ? selectedFields : ["close"];

    fields.forEach((field, fIdx) => {
      ctx.strokeStyle = colors[fIdx % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();

      data.forEach((point, index) => {
        const x = padding + index * stepX;
        const v = point[field];
        if (v === null || typeof v === "undefined") return;
        const y = padding + chartHeight - ((v - minPrice) / (maxPrice - minPrice)) * chartHeight;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // points
      ctx.fillStyle = colors[fIdx % colors.length];
      data.forEach((point, index) => {
        const v = point[field];
        if (v === null || typeof v === "undefined") return;
        const x = padding + index * stepX;
        const y = padding + chartHeight - ((v - minPrice) / (maxPrice - minPrice)) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };

  const drawCandlestickChart = (ctx, data, padding, chartWidth, chartHeight, stepX, minPrice, maxPrice) => {
    const candleWidth = Math.max(2, stepX * 0.6);
    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const isGreen = point.close >= point.open;

      const highY = padding + chartHeight - ((point.high - minPrice) / (maxPrice - minPrice)) * chartHeight;
      const lowY = padding + chartHeight - ((point.low - minPrice) / (maxPrice - minPrice)) * chartHeight;
      ctx.strokeStyle = isGreen ? "#10b981" : "#ef4444";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      const openY = padding + chartHeight - ((point.open - minPrice) / (maxPrice - minPrice)) * chartHeight;
      const closeY = padding + chartHeight - ((point.close - minPrice) / (maxPrice - minPrice)) * chartHeight;

      ctx.fillStyle = isGreen ? "#10b981" : "#ef4444";
      ctx.fillRect(x - candleWidth / 2, Math.min(openY, closeY), candleWidth, Math.max(1, Math.abs(closeY - openY)));

      ctx.strokeStyle = isGreen ? "#059669" : "#dc2626";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - candleWidth / 2, Math.min(openY, closeY), candleWidth, Math.max(1, Math.abs(closeY - openY)));
    });
  };

  // redraw when data or selected fields or chart type change
  useEffect(() => {
    drawChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, selectedFields, widget.chartType]);

  // Setup fetching + optional auto-refresh
  useEffect(() => {
    fetchChartData();
    let timer = null;
    if (refreshInterval) timer = setInterval(fetchChartData, refreshInterval * 1000);
    // redraw on resize
    const onResize = () => drawChart();
    window.addEventListener("resize", onResize);
    return () => {
      if (timer) clearInterval(timer);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widget.symbol, selectedInterval, widget.apiEndpoint, widget.apiKey, refreshInterval]);

  const getIntervalLabel = (interval) => {
    switch (interval) {
      case "1d": return "Daily";
      case "1wk": return "Weekly";
      case "1mo": return "Monthly";
      default: return interval;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{widget.title || `${widget.symbol || "Stock"} Chart`}</h3>
        <div className="flex gap-2 items-center">
          <select value={selectedInterval} onChange={(e) => setSelectedInterval(e.target.value)} className="border px-2 py-1 rounded text-sm">
            <option value="1d">Daily</option>
            <option value="1wk">Weekly</option>
            <option value="1mo">Monthly</option>
          </select>

          {/* For candlestick, selectedFields is not used (candles need OHLC). */}
          <select
            multiple
            value={selectedFields}
            onChange={(e) => setSelectedFields(Array.from(e.target.selectedOptions, (o) => o.value))}
            className="border px-2 py-1 rounded text-sm"
            title={widget.chartType === "candle" ? "Disabled for candlestick (OHLC used)" : "Select fields to plot"}
            disabled={widget.chartType === "candle"}
            style={widget.chartType === "candle" ? { opacity: 0.6 } : {}}
          >
            <option value="open">Open</option>
            <option value="close">Close</option>
            <option value="high">High</option>
            <option value="low">Low</option>
            <option value="volume">Volume</option>
          </select>

          <button onClick={fetchChartData} disabled={loading} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50">
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="flex-1 bg-white border rounded-lg p-4">
        <WidgetLoadingWrapper loading={loading} error={error} widgetType="chart" empty={!Array.isArray(chartData) || chartData.length === 0} emptyMessage="No chart data available">
          <div className="h-full">
            <div className="text-sm text-gray-600 mb-2">{widget.chartType === "candle" ? "Candlestick" : "Line"} Chart - {getIntervalLabel(selectedInterval)}</div>
            <canvas ref={canvasRef} className="w-full h-full" style={{ maxHeight: "300px" }} />
          </div>
        </WidgetLoadingWrapper>
      </div>
    </div>
  );
}
