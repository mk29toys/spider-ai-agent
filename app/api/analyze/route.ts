import { NextRequest, NextResponse } from "next/server";
const BASE_URLS = [
  "https://data-api.binance.vision",
  "https://api-gcp.binance.com",
  "https://api.binance.com",
  "https://api1.binance.com",
  "https://api2.binance.com",
  "https://api3.binance.com",
  "https://api4.binance.com",
];
const ALLOWED_SYMBOLS = [ "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", ];
async function fetchFromBinance(path: string) { let lastError: unknown = null;
for (const baseUrl of BASE_URLS) { try { const response = await fetch(`${baseUrl}${path}`, { cache: "no-store", });
  if (response.ok) {
    return response;
  }

  lastError = new Error(
    `${baseUrl} returned ${response.status}`
  );
} catch (error) {
  lastError = error;
}
}
throw lastError ?? new Error("All Binance endpoints failed"); }
function calculateRSI(prices: number[], period = 14) { if (prices.length <= period) return 50;
let gains = 0; let losses = 0;
for (let i = prices.length - period; i < prices.length; i++) { const change = prices[i] - prices[i - 1];
if (change > 0) {
  gains += change;
} else {
  losses += Math.abs(change);
}
}
const averageGain = gains / period; const averageLoss = losses / period;
if (averageLoss === 0) return 100;
const rs = averageGain / averageLoss;
return 100 - 100 / (1 + rs); }
function calculateSMA(prices: number[], period: number) { const recent = prices.slice(-period);
return ( recent.reduce((sum, price) => sum + price, 0) / recent.length ); }
function calculateVolatility(prices: number[]) { if (prices.length < 2) return 0;
const returns: number[] = [];
for (let i = 1; i < prices.length; i++) { returns.push( ((prices[i] - prices[i - 1]) / prices[i - 1]) * 100 ); }
const average = returns.reduce((sum, value) => sum + value, 0) / returns.length;
const variance = returns.reduce( (sum, value) => sum + Math.pow(value - average, 2), 0 ) / returns.length;
return Math.sqrt(variance); }
export async function GET(request: NextRequest) { try { const searchParams = request.nextUrl.searchParams;
const requestedSymbol =
  searchParams.get("symbol")?.toUpperCase() ?? "BTCUSDT";

const symbol = ALLOWED_SYMBOLS.includes(requestedSymbol)
  ? requestedSymbol
  : "BTCUSDT";

const tickerResponse = await fetchFromBinance(
  `/api/v3/ticker/24hr?symbol=${symbol}`
);

const chartResponse = await fetchFromBinance(
  `/api/v3/klines?symbol=${symbol}&interval=1h&limit=50`
);

const ticker = await tickerResponse.json();
const klines = await chartResponse.json();

const closes = klines.map((item: any[]) =>
  Number(item[4])
);

const latestPrice = Number(ticker.lastPrice);
const change24h = Number(ticker.priceChangePercent);

const firstClose = closes[0];
const lastClose = closes[closes.length - 1];

const momentum =
  ((lastClose - firstClose) / firstClose) * 100;

const rsi = calculateRSI(closes, 14);
const sma20 = calculateSMA(closes, 20);
const sma50 = calculateSMA(closes, 50);
const volatility = calculateVolatility(closes);

const aboveSma20 = latestPrice > sma20;
const aboveSma50 = latestPrice > sma50;

let bullishScore = 0;
let bearishScore = 0;

const factors: {
  name: string;
  side: string;
  value: string;
}[] = [];

if (change24h > 0) {
  bullishScore++;
  factors.push({
    name: "24H Price Change",
    side: "BULLISH",
    value: `${change24h.toFixed(2)}%`,
  });
} else {
  bearishScore++;
  factors.push({
    name: "24H Price Change",
    side: "BEARISH",
    value: `${change24h.toFixed(2)}%`,
  });
}

if (momentum > 0) {
  bullishScore++;
  factors.push({
    name: "Momentum",
    side: "BULLISH",
    value: `${momentum.toFixed(2)}%`,
  });
} else {
  bearishScore++;
  factors.push({
    name: "Momentum",
    side: "BEARISH",
    value: `${momentum.toFixed(2)}%`,
  });
}

if (rsi >= 50 && rsi < 70) {
  bullishScore++;
  factors.push({
    name: "RSI",
    side: "BULLISH",
    value: `${rsi.toFixed(2)}`,
  });
} else if (rsi < 50) {
  bearishScore++;
  factors.push({
    name: "RSI",
    side: "BEARISH",
    value: `${rsi.toFixed(2)}`,
  });
} else {
  factors.push({
    name: "RSI",
    side: "CAUTION",
    value: `${rsi.toFixed(2)}`,
  });
}

if (aboveSma20) {
  bullishScore++;
  factors.push({
    name: "SMA 20",
    side: "BULLISH",
value: "Price above SMA20",
  });
} else {
  bearishScore++;
  factors.push({
    name: "SMA 20",
    side: "BEARISH",
    value: "Price below SMA20",
  });
}

if (aboveSma50) {
  bullishScore++;
  factors.push({
    name: "SMA 50",
    side: "BULLISH",
    value: "Price above SMA50",
  });
} else {
  bearishScore++;
  factors.push({
    name: "SMA 50",
    side: "BEARISH",
    value: "Price below SMA50",
  });
}

let signal = "NEUTRAL";
let confidence = 55;

if (bullishScore >= 4) {
  signal = "BULLISH";
  confidence = 82;
} else if (bullishScore === 3) {
  signal = "MILDLY BULLISH";
  confidence = 68;
} else if (bearishScore >= 4) {
  signal = "BEARISH";
  confidence = 82;
} else if (bearishScore === 3) {
  signal = "MILDLY BEARISH";
  confidence = 68;
}

let volatilityLevel = "LOW";

if (volatility > 1.5) {
  volatilityLevel = "HIGH";
} else if (volatility > 0.7) {
  volatilityLevel = "MEDIUM";
}

const riskScore = Math.min(
  100,
  Math.max(
    10,
    Math.round(
      Math.abs(change24h) * 8 +
        Math.abs(momentum) * 5 +
        volatility * 15
    )
  )
);

let recommendation = "WAIT";

if (
  signal === "BULLISH" &&
  riskScore < 50 &&
  rsi < 70
) {
  recommendation = "WATCH FOR BUY";
}

if (signal === "BEARISH") {
  recommendation = "AVOID / REDUCE RISK";
}

const agentDecision = {
  action:
    recommendation === "WATCH FOR BUY"
      ? "BUY_SETUP"
      : recommendation === "AVOID / REDUCE RISK"
      ? "RISK_OFF"
      : "WAIT",

  marketBias:
    bullishScore > bearishScore
      ? "BULLISH"
      : bearishScore > bullishScore
      ? "BEARISH"
      : "NEUTRAL",

  riskMode:
    riskScore >= 70
      ? "HIGH_RISK"
      : riskScore >= 40
      ? "CAUTION"
      : "CONTROLLED",

  summary:
    bullishScore > bearishScore
      ? `Bullish setup active for ${symbol}; monitor for continuation.`
      : bearishScore > bullishScore
      ? `${symbol} currently has stronger bearish pressure, so Spider AI is prioritizing risk control.`
      : `${symbol} has mixed signals, so Spider AI is waiting for stronger confirmation.`,
};

const reasoning = [
  `${symbol} is trading at $${latestPrice.toLocaleString()}.`,
  `24-hour price change is ${change24h.toFixed(2)}%.`,
  `Market momentum is ${momentum.toFixed(2)}%.`,
  `RSI is ${rsi.toFixed(2)}.`,
  `Price is ${aboveSma20 ? "above" : "below"} SMA20.`,
  `Price is ${aboveSma50 ? "above" : "below"} SMA50.`,
  `Volatility is ${volatilityLevel}.`,
  `Bullish score is ${bullishScore}/5.`,
  `Bearish score is ${bearishScore}/5.`,
  `Risk score is ${riskScore}/100.`,
];

return NextResponse.json({
  symbol,
  signal,
  confidence,
  riskScore,
  recommendation,
  latestPrice,
  change24h,
  momentum,

  scores: {
    bullish: bullishScore,
    bearish: bearishScore,
    max: 5,
  },

  factors,

  indicators: {
    rsi: Number(rsi.toFixed(2)),
    sma20: Number(sma20.toFixed(2)),
    sma50: Number(sma50.toFixed(2)),
    volatility: Number(volatility.toFixed(2)),
    volatilityLevel,
  },

  agentDecision,
  reasoning,
});
} catch (error) { console.error("Analyze API error:", error);
return NextResponse.json(
  {
    error: "Spider analysis temporarily unavailable",
  },
  {
    status: 503,
  }
);
} }