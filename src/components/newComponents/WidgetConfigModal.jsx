"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editWidget } from "../../store/widgetsSlice";

export default function WidgetConfigModal({ isOpen, onClose, widget }) {
  const dispatch = useDispatch();
  const [color, setColor] = useState("#ffffff");
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(3);
  const [title, setTitle] = useState("");
  const [symbol, setSymbol] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [financeCardType, setFinanceCardType] = useState("watchlist");
  const [chartType, setChartType] = useState("line");
  const [chartInterval, setChartInterval] = useState("1d");

  useEffect(() => {
    if (widget) {
      setColor(widget.color || "#ffffff");
      setWidth(widget.w || 4);
      setHeight(widget.h || 3);
      setTitle(widget.title || "");
      setSymbol(widget.symbol || "");
      setApiEndpoint(widget.apiEndpoint || "");
      setApiKey(widget.apiKey || "");
      setFinanceCardType(widget.financeCardType || "watchlist");
      setChartType(widget.chartType || "line");
      setChartInterval(widget.chartInterval || "1d");
    }
  }, [widget, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (widget) {
      const updatedWidget = {
        ...widget,
        color,
        w: width,
        h: height,
        title,
        symbol,
        apiEndpoint,
        apiKey,
        financeCardType,
        chartType,
        chartInterval
      };
      dispatch(editWidget(updatedWidget));
    }
    onClose();
  };

  if (!isOpen || !widget) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Configure Widget</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-900 dark:text-gray-100">
          <div>
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Widget Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
              placeholder="Enter widget title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Width (Grid Units)</label>
              <input
                type="number"
                value={width}
                min={1}
                max={12}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Height (Grid Units)</label>
              <input
                type="number"
                value={height}
                min={1}
                max={10}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Background Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Stock Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
              placeholder="e.g., AAPL, GOOGL, MSFT"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">API Endpoint</label>
            <input
              type="url"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
              placeholder="https://api.example.com/stocks"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
              placeholder="Your API key"
            />
          </div>

          {widget.type === 'finance_card' && (
            <div>
              <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Finance Card Type</label>
              <select
                value={financeCardType}
                onChange={(e) => setFinanceCardType(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
              >
                <option value="watchlist">Watchlist</option>
                <option value="market_gainers">Market Gainers</option>
                <option value="performance">Performance Data</option>
                <option value="financial_data">Financial Data</option>
              </select>
            </div>
          )}

          {widget.type === 'chart' && (
            <>
              <div>
              <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Chart Type</label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
                >
                  <option value="line">Line Chart</option>
                  <option value="candle">Candlestick Chart</option>
                </select>
              </div>
              <div>
              <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Time Interval</label>
                <select
                  value={chartInterval}
                  onChange={(e) => setChartInterval(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
                >
                  <option value="1d">Daily</option>
                  <option value="1wk">Weekly</option>
                  <option value="1mo">Monthly</option>
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
