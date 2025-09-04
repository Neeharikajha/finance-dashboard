// "use client";
// import { useState, useEffect } from "react";
// import { WidgetLoadingWrapper, CardSkeleton } from "../LoadingStates";

// export default function FinanceCardWidget({ widget }) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Mock data for different card types
//   const mockData = {
//     watchlist: [
//       { symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: 2.34, changePercent: 1.35 },
//       { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.56, change: -1.23, changePercent: -0.85 },
//       { symbol: "MSFT", name: "Microsoft Corp.", price: 378.85, change: 4.12, changePercent: 1.10 },
//       { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: 8.45, changePercent: 3.52 },
//     ],
//     market_gainers: [
//       { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: 8.45, changePercent: 3.52 },
//       { symbol: "META", name: "Meta Platforms Inc.", price: 485.20, change: 12.30, changePercent: 2.60 },
//       { symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: 2.34, changePercent: 1.35 },
//       { symbol: "MSFT", name: "Microsoft Corp.", price: 378.85, change: 4.12, changePercent: 1.10 },
//     ],
//     performance: [
//       { metric: "Portfolio Value", value: "$125,430.50", change: 2.34, changePercent: 1.89 },
//       { metric: "Total Return", value: "$15,430.50", change: 1.23, changePercent: 8.65 },
//       { metric: "Daily P&L", value: "$2,340.00", change: 0.45, changePercent: 0.23 },
//       { metric: "Win Rate", value: "68.5%", change: -2.1, changePercent: -2.98 },
//     ],
//     financial_data: [
//       { metric: "Market Cap", value: "$2.8T", description: "Apple Inc." },
//       { metric: "P/E Ratio", value: "28.5", description: "Industry Avg: 25.2" },
//       { metric: "Dividend Yield", value: "0.45%", description: "Annual" },
//       { metric: "52W High", value: "$198.23", description: "52W Low: $124.17" },
//     ]
//   };

//   useEffect(() => {
//     fetchData();
//   }, [widget.financeCardType, widget.apiEndpoint, widget.apiKey]);

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // If API endpoint is provided, try to fetch real data
//       if (widget.apiEndpoint) {
//         const endpoint = `${widget.apiEndpoint}/${widget.financeCardType}`;
//         const response = await fetch(endpoint, {
//           headers: widget.apiKey ? { 'Authorization': `Bearer ${widget.apiKey}` } : {}
//         });
        
//         if (!response.ok) {
//           throw new Error(`API Error: ${response.status}`);
//         }
        
//         const apiData = await response.json();
//         setData(apiData);
//       } else {
//         // Use mock data
//         setData(mockData[widget.financeCardType] || []);
//       }
//     } catch (err) {
//       setError(err.message);
//       setData(mockData[widget.financeCardType] || []); // Fallback to mock data
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatPrice = (price) => `$${price.toFixed(2)}`;
//   const formatChange = (change) => `${change > 0 ? '+' : ''}${change.toFixed(2)}`;
//   const formatChangePercent = (changePercent) => `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`;

//   const getCardTypeTitle = () => {
//     switch (widget.financeCardType) {
//       case 'watchlist': return 'Watchlist';
//       case 'market_gainers': return 'Market Gainers';
//       case 'performance': return 'Performance Data';
//       case 'financial_data': return 'Financial Data';
//       default: return 'Finance Card';
//     }
//   };

//   const renderStockCard = (item) => (
//     <div key={item.symbol} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
//       <div className="flex justify-between items-start mb-2">
//         <div>
//           <h4 className="font-semibold text-lg">{item.symbol}</h4>
//           <p className="text-sm text-gray-600">{item.name}</p>
//         </div>
//         <div className="text-right">
//           <div className="text-lg font-semibold">{formatPrice(item.price)}</div>
//           <div className={`text-sm ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>
//             {formatChange(item.change)} ({formatChangePercent(item.changePercent)})
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPerformanceCard = (item) => (
//     <div key={item.metric} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
//       <div className="flex justify-between items-start mb-2">
//         <div>
//           <h4 className="font-semibold text-lg">{item.metric}</h4>
//           <p className="text-2xl font-bold text-blue-600">{item.value}</p>
//         </div>
//         <div className="text-right">
//           <div className={`text-sm ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>
//             {formatChange(item.change)} ({formatChangePercent(item.changePercent)})
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderFinancialDataCard = (item) => (
//     <div key={item.metric} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
//       <div>
//         <h4 className="font-semibold text-lg">{item.metric}</h4>
//         <p className="text-2xl font-bold text-blue-600">{item.value}</p>
//         <p className="text-sm text-gray-600 mt-1">{item.description}</p>
//       </div>
//     </div>
//   );

//   const renderCard = (item) => {
//     if (widget.financeCardType === 'performance') {
//       return renderPerformanceCard(item);
//     } else if (widget.financeCardType === 'financial_data') {
//       return renderFinancialDataCard(item);
//     } else {
//       return renderStockCard(item);
//     }
//   };

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold">{widget.title || getCardTypeTitle()}</h3>
//         <button
//           onClick={fetchData}
//           disabled={loading}
//           className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
//         >
//           {loading ? "Loading..." : "Refresh"}
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <div className="flex-1 overflow-auto">
//         <WidgetLoadingWrapper
//           loading={loading}
//           error={error}
//           widgetType="finance_card"
//           empty={!Array.isArray(data) || data.length === 0}
//           emptyMessage="No financial data available"
//         >
//           <div className="grid gap-4">
//             {Array.isArray(data) && data.map(renderCard)}
//           </div>
//         </WidgetLoadingWrapper>
//       </div>
//     </div>
//   );
// }


























"use client";
import { useState, useEffect } from "react";
import { WidgetLoadingWrapper } from "../LoadingStates";

export default function FinanceCardWidget({ widget = {} }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFields, setSelectedFields] = useState(widget.selectedFields || []);

  const cacheKey = `card-${widget.id ?? widget.financeCardType ?? "unknown"}`;
  const cacheTTL = widget.cacheTTL ?? 300; // seconds
  const refreshInterval = widget.refreshInterval ?? null; // seconds

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

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // try cache
      try {
        const cachedRaw = localStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cachedObj = JSON.parse(cachedRaw);
          if (cachedObj?.ts && Date.now() - cachedObj.ts < cacheTTL * 1000) {
            setData(cachedObj.data);
            setLoading(false);
            return;
          } else {
            localStorage.removeItem(cacheKey);
          }
        }
      } catch {}

      if (widget.apiEndpoint) {
        const endpoint = `${widget.apiEndpoint.replace(/\/$/, "")}/${widget.financeCardType}`;
        const response = await fetch(endpoint, {
          headers: widget.apiKey ? { Authorization: `Bearer ${widget.apiKey}` } : {},
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const apiData = await response.json();

        // normalize common shapes
        let items = [];
        if (Array.isArray(apiData)) items = apiData;
        else if (apiData.data && Array.isArray(apiData.data)) items = apiData.data;
        else if (apiData.stocks && Array.isArray(apiData.stocks)) items = apiData.stocks;
        else if (apiData.result && Array.isArray(apiData.result)) items = apiData.result;
        else items = Array.isArray(apiData) ? apiData : [];

        if (!items.length) {
          // fallback to mock
          items = mockData[widget.financeCardType] || [];
        }

        setData(items);
        try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: items })); } catch {}
      } else {
        const items = mockData[widget.financeCardType] || [];
        setData(items);
        try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: items })); } catch {}
      }
    } catch (err) {
      setError(err.message || "Failed to fetch");
      const items = mockData[widget.financeCardType] || [];
      setData(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    let timer = null;
    if (refreshInterval) timer = setInterval(fetchData, refreshInterval * 1000);
    return () => { if (timer) clearInterval(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widget.financeCardType, widget.apiEndpoint, widget.apiKey, refreshInterval]);

  const formatPrice = (price) => (typeof price === "number" ? `$${price.toFixed(2)}` : price);
  const formatChange = (change) => (typeof change === "number" ? `${change > 0 ? "+" : ""}${change.toFixed(2)}` : change);
  const formatChangePercent = (cp) => (typeof cp === "number" ? `${cp > 0 ? "+" : ""}${cp.toFixed(2)}%` : cp);

  // fields available to map (from first item)
  const availableFields = data && data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{widget.title || (widget.financeCardType || "Finance Data")}</h3>
        <div className="flex gap-2 items-center">
          <select
            multiple
            value={selectedFields}
            onChange={(e) => setSelectedFields(Array.from(e.target.selectedOptions, (o) => o.value))}
            className="border px-2 py-1 rounded text-sm"
            title="Select fields to show on cards"
            style={{ minWidth: 160 }}
          >
            {availableFields.length ? (
              availableFields.map((f) => <option key={f} value={f}>{f}</option>)
            ) : (
              <option disabled>No fields</option>
            )}
          </select>

          <button onClick={fetchData} disabled={loading} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50">
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="flex-1 overflow-auto">
        <WidgetLoadingWrapper loading={loading} error={error} widgetType="finance_card" empty={!data.length} emptyMessage="No financial data available">
          <div className="grid gap-4">
            {Array.isArray(data) && data.map((item, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* If user selected fields, show only those; else show common presentation */}
                {selectedFields && selectedFields.length ? (
                  selectedFields.map((field) => (
                    <p key={field}><strong>{field}:</strong> {String(item[field] ?? "-")}</p>
                  ))
                ) : (
                  // Default rendering (tries to preserve original card styles)
                  (widget.financeCardType === "performance" || widget.financeCardType === "financial_data") ? (
                    // performance / financial_data style
                    item.metric ? (
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{item.metric}</h4>
                          <p className="text-2xl font-bold text-blue-600">{item.value}</p>
                          {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                        </div>
                        <div className="text-right">
                          {(typeof item.change !== "undefined") && <div className={`text-sm ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>{formatChange(item.change)} ({formatChangePercent(item.changePercent)})</div>}
                        </div>
                      </div>
                    ) : (
                      // fallback to key/value list
                      Object.entries(item).map(([k, v]) => <p key={k}><strong>{k}:</strong> {String(v)}</p>)
                    )
                  ) : (
                    // watchlist / stocks style
                    item.symbol ? (
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{item.symbol}</h4>
                          {item.name && <p className="text-sm text-gray-600">{item.name}</p>}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{formatPrice(item.price)}</div>
                          {(typeof item.change !== "undefined") && <div className={`text-sm ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>{formatChange(item.change)} ({formatChangePercent(item.changePercent)})</div>}
                        </div>
                      </div>
                    ) : (
                      // generic fallback
                      Object.entries(item).map(([k, v]) => <p key={k}><strong>{k}:</strong> {String(v)}</p>)
                    )
                  )
                )}
              </div>
            ))}
          </div>
        </WidgetLoadingWrapper>
      </div>
    </div>
  );
}
