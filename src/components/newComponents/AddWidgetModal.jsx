"use client";
import { useState, useEffect } from "react";

const WIDGET_TYPES = {
  TABLE: {
    id: 'table',
    name: 'Stock Table',
    description: 'Paginated list of stocks with filters and search',
    icon: '📊'
  },
  FINANCE_CARD: {
    id: 'finance_card',
    name: 'Finance Card',
    description: 'Display watchlist, market gainers, or performance data',
    icon: '💳'
  },
  CHART: {
    id: 'chart',
    name: 'Price Chart',
    description: 'Candle or line graphs showing stock prices',
    icon: '📈'
  }
};

const FINANCE_CARD_TYPES = {
  WATCHLIST: 'watchlist',
  MARKET_GAINERS: 'market_gainers',
  PERFORMANCE: 'performance',
  FINANCIAL_DATA: 'financial_data'
};

const CHART_TYPES = {
  CANDLE: 'candle',
  LINE: 'line'
};

const CHART_INTERVALS = {
  DAILY: '1d',
  WEEKLY: '1wk',
  MONTHLY: '1mo'
};

export default function AddWidgetModal({ isOpen, onClose, onAdd, editingWidget }) {
  const [title, setTitle] = useState("");
  const [widgetType, setWidgetType] = useState("table");
  const [financeCardType, setFinanceCardType] = useState("watchlist");
  const [chartType, setChartType] = useState("line");
  const [chartInterval, setChartInterval] = useState("1d");
  const [symbol, setSymbol] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");

  useEffect(() => {
    if (editingWidget) {
      setTitle(editingWidget.title || "");
      setWidgetType(editingWidget.type || "table");
      setFinanceCardType(editingWidget.financeCardType || "watchlist");
      setChartType(editingWidget.chartType || "line");
      setChartInterval(editingWidget.chartInterval || "1d");
      setSymbol(editingWidget.symbol || "");
      setApiKey(editingWidget.apiKey || "");
      setApiEndpoint(editingWidget.apiEndpoint || "");
    } else {
      setTitle("");
      setWidgetType("table");
      setFinanceCardType("watchlist");
      setChartType("line");
      setChartInterval("1d");
      setSymbol("");
      setApiKey("");
      setApiEndpoint("");
    }
  }, [editingWidget, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const widgetData = {
      title,
      type: widgetType,
      symbol,
      apiKey,
      apiEndpoint
    };

    // Add type-specific configurations
    if (widgetType === 'finance_card') {
      widgetData.financeCardType = financeCardType;
    } else if (widgetType === 'chart') {
      widgetData.chartType = chartType;
      widgetData.chartInterval = chartInterval;
    }

    onAdd(widgetData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {editingWidget ? "Edit Widget" : "Add Finance Widget"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-900 dark:text-gray-100">
          <div>
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Widget Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
              placeholder="Enter widget title"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Widget Type</label>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(WIDGET_TYPES).map((type) => (
                <label key={type.id} className="flex items-center p-3 border border-gray-300 dark:border-gray-700 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                  <input
                    type="radio"
                    name="widgetType"
                    value={type.id}
                    checked={widgetType === type.id}
                    onChange={(e) => setWidgetType(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-2xl mr-3">{type.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{type.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {widgetType === 'finance_card' && (
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

          {widgetType === 'chart' && (
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

          <div>
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Stock Symbol (Optional)</label>
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
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">API Key (Optional)</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
              placeholder="Your API key"
            />
          </div>

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
              {editingWidget ? "Update Widget" : "Add Widget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
