"use client";
import { useState, useEffect } from "react";
import { WidgetLoadingWrapper, TableSkeleton } from "../LoadingStates";

export default function TableWidget({ widget }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data for demonstration
  const mockStocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: 2.34, changePercent: 1.35, volume: 45678900 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.56, change: -1.23, changePercent: -0.85, volume: 23456700 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 378.85, change: 4.12, changePercent: 1.10, volume: 34567800 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 155.23, change: -0.87, changePercent: -0.56, volume: 12345600 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: 8.45, changePercent: 3.52, volume: 56789000 },
    { symbol: "META", name: "Meta Platforms Inc.", price: 485.20, change: 12.30, changePercent: 2.60, volume: 23456700 },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.30, change: -15.20, changePercent: -1.71, volume: 45678900 },
    { symbol: "NFLX", name: "Netflix Inc.", price: 612.45, change: 5.67, changePercent: 0.93, volume: 12345600 },
  ];

  useEffect(() => {
    fetchStockData();
  }, [widget.apiEndpoint, widget.apiKey]);

  const fetchStockData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // If API endpoint is provided, try to fetch real data
      if (widget.apiEndpoint) {
        let url = widget.apiEndpoint;
        
        // Handle Alpha Vantage API format
        if (url.includes('alphavantage.co')) {
          if (!widget.apiKey) {
            throw new Error('API key required for Alpha Vantage');
          }
          // Add API key to URL if not already present
          if (!url.includes('apikey=')) {
            url += (url.includes('?') ? '&' : '?') + `apikey=${widget.apiKey}`;
          }
        }
        
        const response = await fetch(url, {
          headers: widget.apiKey && !url.includes('alphavantage.co') ? { 'Authorization': `Bearer ${widget.apiKey}` } : {}
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle Alpha Vantage response format
        if (data["Error Message"]) {
          throw new Error(data["Error Message"]);
        }
        
        if (data["Note"]) {
          throw new Error("API call limit reached. Please try again later.");
        }
        
        // Transform Alpha Vantage data to our format
        if (data["Global Quote"]) {
          const quote = data["Global Quote"];
          const transformedStock = {
            symbol: quote["01. symbol"],
            name: quote["01. symbol"], // Alpha Vantage doesn't provide company name in this endpoint
            price: parseFloat(quote["05. price"]),
            change: parseFloat(quote["09. change"]),
            changePercent: parseFloat(quote["10. change percent"].replace('%', '')),
            volume: parseInt(quote["06. volume"])
          };
          setStocks([transformedStock]);
        } else if (data.stocks || Array.isArray(data)) {
          setStocks(data.stocks || data);
        } else {
          setStocks(mockStocks);
        }
      } else {
        // Use mock data
        setStocks(mockStocks);
      }
    } catch (err) {
      setError(err.message);
      setStocks(mockStocks); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = Array.isArray(stocks) ? stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "gainers") return stock.change > 0;
    if (filter === "losers") return stock.change < 0;
    return matchesSearch;
  }) : [];

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStocks = filteredStocks.slice(startIndex, startIndex + itemsPerPage);

  const formatPrice = (price) => `$${price.toFixed(2)}`;
  const formatChange = (change) => `${change > 0 ? '+' : ''}${change.toFixed(2)}`;
  const formatChangePercent = (changePercent) => `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{widget.title}</h3>
        <button
          onClick={fetchStockData}
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

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border px-3 py-2 rounded text-sm"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="all">All Stocks</option>
          <option value="gainers">Gainers</option>
          <option value="losers">Losers</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <WidgetLoadingWrapper
          loading={loading}
          error={error}
          widgetType="table"
          empty={!Array.isArray(stocks) || stocks.length === 0}
          emptyMessage="No stock data available"
        >
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left p-2 font-medium">Symbol</th>
                <th className="text-left p-2 font-medium">Name</th>
                <th className="text-right p-2 font-medium">Price</th>
                <th className="text-right p-2 font-medium">Change</th>
                <th className="text-right p-2 font-medium">% Change</th>
                <th className="text-right p-2 font-medium">Volume</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStocks.map((stock, index) => (
                <tr key={stock.symbol} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-2 font-medium">{stock.symbol}</td>
                  <td className="p-2">{stock.name}</td>
                  <td className="p-2 text-right">{formatPrice(stock.price)}</td>
                  <td className={`p-2 text-right ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatChange(stock.change)}
                  </td>
                  <td className={`p-2 text-right ${stock.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatChangePercent(stock.changePercent)}
                  </td>
                  <td className="p-2 text-right">{stock.volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </WidgetLoadingWrapper>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredStocks.length)} of {filteredStocks.length} stocks
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
