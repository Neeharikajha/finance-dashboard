// "use client";
// import { useState } from "react";
// import { LoadingSpinner } from "./LoadingStates";

// export default function ApiTester() {
//   const [apiKey, setApiKey] = useState("");
//   const [symbol, setSymbol] = useState("AAPL");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const testApi = async () => {
//     if (!apiKey.trim()) {
//       setError("Please enter your API key");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setResult(null);

//     try {
//       // Test with Alpha Vantage API
//       const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data["Error Message"]) {
//         setError(data["Error Message"]);
//       } else if (data["Note"]) {
//         setError("API call limit reached. Please try again later.");
//       } else if (data["Global Quote"]) {
//         setResult(data["Global Quote"]);
//       } else {
//         setError("Unexpected response format");
//       }
//     } catch (err) {
//       setError(`Network error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const testYahooFinance = async () => {
//     setLoading(true);
//     setError(null);
//     setResult(null);

//     try {
//       // Test with Yahoo Finance (no API key needed)
//       const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
      
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.chart && data.chart.result && data.chart.result[0]) {
//         const quote = data.chart.result[0].meta;
//         setResult({
//           "01. symbol": quote.symbol,
//           "05. price": quote.regularMarketPrice,
//           "09. change": quote.regularMarketPrice - quote.previousClose,
//           "10. change percent": `${(((quote.regularMarketPrice - quote.previousClose) / quote.previousClose) * 100).toFixed(2)}%`
//         });
//       } else {
//         setError("No data found for this symbol");
//       }
//     } catch (err) {
//       setError(`Network error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold mb-6 text-center">API Tester</h2>
      
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-2">Stock Symbol</label>
//           <input
//             type="text"
//             value={symbol}
//             onChange={(e) => setSymbol(e.target.value.toUpperCase())}
//             className="w-full border px-3 py-2 rounded"
//             placeholder="e.g., AAPL, GOOGL, MSFT"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Alpha Vantage API Key (Optional)</label>
//           <input
//             type="password"
//             value={apiKey}
//             onChange={(e) => setApiKey(e.target.value)}
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Enter your Alpha Vantage API key"
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Get free API key at: <a href="https://www.alphavantage.co/support/#api-key" target="_blank" className="text-blue-500 hover:underline">alphavantage.co</a>
//           </p>
//         </div>

//         <div className="flex gap-4">
//           <button
//             onClick={testApi}
//             disabled={loading}
//             className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? (
//               <div className="flex items-center gap-2">
//                 <LoadingSpinner size="sm" />
//                 Testing...
//               </div>
//             ) : "Test Alpha Vantage API"}
//           </button>
          
//           <button
//             onClick={testYahooFinance}
//             disabled={loading}
//             className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
//           >
//             {loading ? (
//               <div className="flex items-center gap-2">
//                 <LoadingSpinner size="sm" />
//                 Testing...
//               </div>
//             ) : "Test Yahoo Finance (Free)"}
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             <strong>Error:</strong> {error}
//           </div>
//         )}

//         {result && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//             <strong>Success! API is working:</strong>
//             <pre className="mt-2 text-sm overflow-auto">
//               {JSON.stringify(result, null, 2)}
//             </pre>
//           </div>
//         )}
//       </div>

//       <div className="mt-6 p-4 bg-gray-50 rounded">
//         <h3 className="font-semibold mb-2">How to use in your widgets:</h3>
//         <ol className="text-sm space-y-1 list-decimal list-inside">
//           <li>Get your API key from Alpha Vantage (free)</li>
//           <li>Test it here to make sure it works</li>
//           <li>When creating widgets, use these endpoints:</li>
//           <ul className="ml-4 mt-2 space-y-1 list-disc list-inside">
//             <li><strong>Stock Quote:</strong> <code>https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SYMBOL&apikey=YOUR_KEY</code></li>
//             <li><strong>Stock List:</strong> <code>https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=YOUR_KEY</code></li>
//             <li><strong>Daily Chart:</strong> <code>https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SYMBOL&apikey=YOUR_KEY</code></li>
//           </ul>
//         </ol>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { LoadingSpinner } from "./LoadingStates";

export default function ApiTester() {
  const [apiKey, setApiKey] = useState("");
  const [symbol, setSymbol] = useState("AAPL");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testApi = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your API key");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test with Alpha Vantage API
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data["Error Message"]) {
        setError(data["Error Message"]);
      } else if (data["Note"]) {
        setError("API call limit reached. Please try again later.");
      } else if (data["Global Quote"]) {
        setResult(data["Global Quote"]);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testYahooFinance = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test with Yahoo Finance (no API key needed)
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.chart && data.chart.result && data.chart.result[0]) {
        const quote = data.chart.result[0].meta;
        setResult({
          "01. symbol": quote.symbol,
          "05. price": quote.regularMarketPrice,
          "09. change": quote.regularMarketPrice - quote.previousClose,
          "10. change percent": `${(
            ((quote.regularMarketPrice - quote.previousClose) /
              quote.previousClose) *
            100
          ).toFixed(2)}%`,
        });
      } else {
        setError("No data found for this symbol");
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        API Tester
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
            Stock Symbol
          </label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
            placeholder="e.g., AAPL, GOOGL, MSFT"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
            Alpha Vantage API Key (Optional)
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
            placeholder="Enter your Alpha Vantage API key"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Get free API key at:{" "}
            <a
              href="https://www.alphavantage.co/support/#api-key"
              target="_blank"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              alphavantage.co
            </a>
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={testApi}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Testing...
              </div>
            ) : (
              "Test Alpha Vantage API"
            )}
          </button>

          <button
            onClick={testYahooFinance}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Testing...
              </div>
            ) : (
              "Test Yahoo Finance (Free)"
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded">
            <strong>Success! API is working:</strong>
            <pre className="mt-2 text-sm overflow-auto text-gray-900 dark:text-gray-100">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Fix: dark mode-aware info section */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
          How to use in your widgets:
        </h3>
        <ol className="text-sm space-y-1 list-decimal list-inside text-gray-800 dark:text-gray-200">
          <li>Get your API key from Alpha Vantage (free)</li>
          <li>Test it here to make sure it works</li>
          <li>When creating widgets, use these endpoints:</li>
          <ul className="ml-4 mt-2 space-y-1 list-disc list-inside">
            <li>
              <strong>Stock Quote:</strong>{" "}
              <code className="text-blue-600 dark:text-blue-400">
                https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SYMBOL&apikey=YOUR_KEY
              </code>
            </li>
            <li>
              <strong>Stock List:</strong>{" "}
              <code className="text-blue-600 dark:text-blue-400">
                https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=YOUR_KEY
              </code>
            </li>
            <li>
              <strong>Daily Chart:</strong>{" "}
              <code className="text-blue-600 dark:text-blue-400">
                https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SYMBOL&apikey=YOUR_KEY
              </code>
            </li>
          </ul>
        </ol>
      </div>
    </div>
  );
}
