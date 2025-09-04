"use client";
import { useState, useEffect } from "react";

export default function FinanceCardWidget({ widget }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for different card types
  const mockData = {
    watchlist: [
      { symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: 2.34, changePercent: 1.35 },
      { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.56, change: -1.23, changePercent: -0.85 },
      { symbol: "MSFT", name: "Microsoft Corp.", price: 378.85, change: 4.12, changePercent: 1.10 },
      { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: 8.45, changePercent: 3.52 },
    ],
    market_gainers: [
      { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: 8.45, changePercent: 3.52 },
      { symbol: "META", name: "Meta Platforms Inc.", price: 485.20, change: 12.30, changePercent: 2.60 },
      { symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: 2.34, changePercent: 1.35 },
      { symbol: "MSFT", name: "Microsoft Corp.", price: 378.85, change: 4.12, changePercent: 1.10 },
    ],
    performance: [
      { metric: "Portfolio Value", value: "$125,430.50", change: 2.34, changePercent: 1.89 },
      { metric: "Total Return", value: "$15,430.50", change: 1.23, changePercent: 8.65 },
      { metric: "Daily P&L", value: "$2,340.00", change: 0.45, changePercent: 0.23 },
      { metric: "Win Rate", value: "68.5%", change: -2.1, changePercent: -2.98 },
    ],
    financial_data: [
      { metric: "Market Cap", value: "$2.8T", description: "Apple Inc." },
      { metric: "P/E Ratio", value: "28.5", description: "Industry Avg: 25.2" },
      { metric: "Dividend Yield", value: "0.45%", description: "Annual" },
      { metric: "52W High", value: "$198.23", description: "52W Low: $124.17" },
    ]
  };

  useEffect(() => {
    fetchData();
  }, [widget.financeCardType, widget.apiEndpoint, widget.apiKey]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // If API endpoint is provided, try to fetch real data
      if (widget.apiEndpoint) {
        const endpoint = `${widget.apiEndpoint}/${widget.financeCardType}`;
        const response = await fetch(endpoint, {
          headers: widget.apiKey ? { 'Authorization': `Bearer ${widget.apiKey}` } : {}
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const apiData = await response.json();
        setData(apiData);
      } else {
        // Use mock data
        setData(mockData[widget.financeCardType] || []);
      }
    } catch (err) {
      setError(err.message);
      setData(mockData[widget.financeCardType] || []); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => `$${price.toFixed(2)}`;
  const formatChange = (change) => `${change > 0 ? '+' : ''}${change.toFixed(2)}`;
  const formatChangePercent = (changePercent) => `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`;

  const getCardTypeTitle = () => {
    switch (widget.financeCardType) {
      case 'watchlist': return 'Watchlist';
      case 'market_gainers': return 'Market Gainers';
      case 'performance': return 'Performance Data';
      case 'financial_data': return 'Financial Data';
      default: return 'Finance Card';
    }
  };

  const renderStockCard = (item) => (
    <div key={item.symbol} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-lg">{item.symbol}</h4>
          <p className="text-sm text-gray-600">{item.name}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">{formatPrice(item.price)}</div>
          <div className={`text-sm ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatChange(item.change)} ({formatChangePercent(item.changePercent)})
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceCard = (item) => (
    <div key={item.metric} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-lg">{item.metric}</h4>
          <p className="text-2xl font-bold text-blue-600">{item.value}</p>
        </div>
        <div className="text-right">
          <div className={`text-sm ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatChange(item.change)} ({formatChangePercent(item.changePercent)})
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialDataCard = (item) => (
    <div key={item.metric} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div>
        <h4 className="font-semibold text-lg">{item.metric}</h4>
        <p className="text-2xl font-bold text-blue-600">{item.value}</p>
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
      </div>
    </div>
  );

  const renderCard = (item) => {
    if (widget.financeCardType === 'performance') {
      return renderPerformanceCard(item);
    } else if (widget.financeCardType === 'financial_data') {
      return renderFinancialDataCard(item);
    } else {
      return renderStockCard(item);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{widget.title || getCardTypeTitle()}</h3>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="grid gap-4">
          {data.map(renderCard)}
        </div>
      </div>

      {data.length === 0 && !loading && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>No data available</p>
            <p className="text-sm">Configure API endpoint to load real data</p>
          </div>
        </div>
      )}
    </div>
  );
}
