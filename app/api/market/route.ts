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

const ALLOWED_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"];

async function fetchFromBinance(path: string) {
  let lastError: unknown = null;

  for (const baseUrl of BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });

      if (response.ok) {
        return response;
      }

      lastError = new Error(`${baseUrl} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("All Binance endpoints failed");
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const requestedSymbol = searchParams.get("symbol")?.toUpperCase() ?? "BTCUSDT";

    const symbol = ALLOWED_SYMBOLS.includes(requestedSymbol)
      ? requestedSymbol
      : "BTCUSDT";

    const response = await fetchFromBinance(`/api/v3/ticker/24hr?symbol=${symbol}`);
    const data = await response.json();

    return NextResponse.json({
      symbol: data.symbol,
      price: Number(data.lastPrice),
      priceChangePercent: Number(data.priceChangePercent),
      highPrice: Number(data.highPrice),
      lowPrice: Number(data.lowPrice),
      volume: Number(data.volume),
      quoteVolume: Number(data.quoteVolume),
    });
  } catch (error) {
    console.error("Market API error:", error);
    return NextResponse.json(
      {
        error: "Unable to fetch market data",
      },
      {
        status: 503,
      }
    );
  }
}