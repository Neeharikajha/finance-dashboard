"use client";
import { useState, useEffect, useRef } from "react";

export default function ChartWidget({ widget }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState(widget.chartInterval || "1d");
  const canvasRef = useRef(null);

  // Mock data for different intervals
  const mockData = {
    "1d": generateMockData(24, "hourly"),
    "1wk": generateMockData(7, "daily"),
    "1mo": generateMockData(30, "daily")
  };

  function generateMockData(points, type) {
    const data = [];
    let basePrice = 150;
    const now = new Date();
    
    for (let i = points; i >= 0; i--) {
      const date = new Date(now);
      if (type === "hourly") {
        date.setHours(date.getHours() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      // Generate realistic price movement
      const change = (Math.random() - 0.5) * 10;
      basePrice += change;
      basePrice = Math.max(50, Math.min(300, basePrice)); // Keep within reasonable bounds
      
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

  useEffect(() => {
    fetchChartData();
  }, [widget.symbol, selectedInterval, widget.apiEndpoint, widget.apiKey]);

  useEffect(() => {
    if (chartData.length > 0) {
      drawChart();
    }
  }, [chartData, widget.chartType]);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // If API endpoint is provided, try to fetch real data
      if (widget.apiEndpoint && widget.symbol) {
        const endpoint = `${widget.apiEndpoint}/chart/${widget.symbol}?interval=${selectedInterval}`;
        const response = await fetch(endpoint, {
          headers: widget.apiKey ? { 'Authorization': `Bearer ${widget.apiKey}` } : {}
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const apiData = await response.json();
        setChartData(apiData);
      } else {
        // Use mock data
        setChartData(mockData[selectedInterval] || []);
      }
    } catch (err) {
      setError(err.message);
      setChartData(mockData[selectedInterval] || []); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || chartData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate price range
    const prices = chartData.map(d => [d.high, d.low]).flat();
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const pricePadding = priceRange * 0.1;

    // Calculate dimensions
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const stepX = chartWidth / (chartData.length - 1);

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    if (widget.chartType === 'candle') {
      drawCandlestickChart(ctx, chartData, padding, chartWidth, chartHeight, stepX, minPrice - pricePadding, maxPrice + pricePadding);
    } else {
      drawLineChart(ctx, chartData, padding, chartWidth, chartHeight, stepX, minPrice - pricePadding, maxPrice + pricePadding);
    }

    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice + pricePadding - (priceRange + 2 * pricePadding) * (i / 5);
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(`$${price.toFixed(2)}`, padding - 10, y + 4);
    }
  };

  const drawLineChart = (ctx, data, padding, chartWidth, chartHeight, stepX, minPrice, maxPrice) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = padding + chartHeight - ((point.close - minPrice) / (maxPrice - minPrice)) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw data points
    ctx.fillStyle = '#3b82f6';
    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = padding + chartHeight - ((point.close - minPrice) / (maxPrice - minPrice)) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawCandlestickChart = (ctx, data, padding, chartWidth, chartHeight, stepX, minPrice, maxPrice) => {
    const candleWidth = Math.max(2, stepX * 0.8);

    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const isGreen = point.close >= point.open;
      
      // High-Low line
      ctx.strokeStyle = isGreen ? '#10b981' : '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const highY = padding + chartHeight - ((point.high - minPrice) / (maxPrice - minPrice)) * chartHeight;
      const lowY = padding + chartHeight - ((point.low - minPrice) / (maxPrice - minPrice)) * chartHeight;
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Candle body
      const openY = padding + chartHeight - ((point.open - minPrice) / (maxPrice - minPrice)) * chartHeight;
      const closeY = padding + chartHeight - ((point.close - minPrice) / (maxPrice - minPrice)) * chartHeight;
      
      ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
      ctx.fillRect(x - candleWidth/2, Math.min(openY, closeY), candleWidth, Math.abs(closeY - openY));
      
      // Candle border
      ctx.strokeStyle = isGreen ? '#059669' : '#dc2626';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - candleWidth/2, Math.min(openY, closeY), candleWidth, Math.abs(closeY - openY));
    });
  };

  const getIntervalLabel = (interval) => {
    switch (interval) {
      case '1d': return 'Daily';
      case '1wk': return 'Weekly';
      case '1mo': return 'Monthly';
      default: return interval;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {widget.title || `${widget.symbol || 'Stock'} Chart`}
        </h3>
        <div className="flex gap-2">
          <select
            value={selectedInterval}
            onChange={(e) => setSelectedInterval(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="1d">Daily</option>
            <option value="1wk">Weekly</option>
            <option value="1mo">Monthly</option>
          </select>
          <button
            onClick={fetchChartData}
            disabled={loading}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex-1 bg-white border rounded-lg p-4">
        {chartData.length > 0 ? (
          <div className="h-full">
            <div className="text-sm text-gray-600 mb-2">
              {widget.chartType === 'candle' ? 'Candlestick' : 'Line'} Chart - {getIntervalLabel(selectedInterval)}
            </div>
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ maxHeight: '300px' }}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p>No chart data available</p>
              <p className="text-sm">Configure symbol and API endpoint to load real data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
