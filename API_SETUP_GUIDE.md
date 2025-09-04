# 🚀 API Setup Guide for Finance Dashboard

## Quick Start - Get Free API Key

### Step 1: Get Alpha Vantage API Key (FREE)
1. Go to: **https://www.alphavantage.co/support/#api-key**
2. Enter your email address
3. Click "GET FREE API KEY"
4. Check your email for the API key
5. Copy the API key (looks like: `ABC123XYZ789`)

### Step 2: Test Your API
1. Run your app: `npm run dev`
2. Click the **"Test API"** button on your dashboard
3. Enter your API key and test with "AAPL"
4. If it works, you'll see real stock data!

## How to Use in Widgets

### For Table Widget:
- **API Endpoint**: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL`
- **API Key**: Your Alpha Vantage key
- **Symbol**: The stock symbol (AAPL, GOOGL, etc.)

### For Chart Widget:
- **API Endpoint**: `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL`
- **API Key**: Your Alpha Vantage key
- **Symbol**: The stock symbol

### For Finance Card Widget:
- **API Endpoint**: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL`
- **API Key**: Your Alpha Vantage key

## Alternative Free APIs

### Yahoo Finance (No API Key Needed)
- **Endpoint**: `https://query1.finance.yahoo.com/v8/finance/chart/AAPL`
- **No API key required**
- **Unlimited calls** (but rate limited)

### Example Yahoo Finance Usage:
- **API Endpoint**: `https://query1.finance.yahoo.com/v8/finance/chart/AAPL`
- **API Key**: Leave empty
- **Symbol**: AAPL

## Alpha Vantage API Limits (Free Tier)
- **5 API calls per minute**
- **500 calls per day**
- **Perfect for testing and small projects**

## Troubleshooting

### Common Issues:
1. **"API call limit reached"** - Wait a minute and try again
2. **"Invalid API key"** - Check your API key is correct
3. **"No data found"** - Try a different stock symbol (AAPL, GOOGL, MSFT)

### Test Symbols:
- AAPL (Apple)
- GOOGL (Google)
- MSFT (Microsoft)
- TSLA (Tesla)
- AMZN (Amazon)

## Ready to Use!

Once you have your API key:
1. Click "Add Widget"
2. Choose your widget type
3. Enter your API endpoint and key
4. Add a stock symbol
5. Your widget will show real data!

**That's it! Your finance dashboard is now connected to real financial data! 🎉**
