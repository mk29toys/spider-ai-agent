import { NextRequest, NextResponse } from "next/server";
const BASE_URLS = [ "https://api.binance.com", "https://api1.binance.com", "https://api2.binance.com", "https://api3.binance.com", "https://api4.binance.com", ];
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
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const requestedSymbol =
      searchParams.get("symbol")?.toUpperCase() ?? "BTCUSDT";

    const symbol = ALLOWED_SYMBOLS.includes(requestedSymbol)
      ? requestedSymbol
      : "BTCUSDT";

    const response = await fetchFromBinance(
      `/api/v3/klines?symbol=${symbol}&interval=1m&limit=60`
    );

    const data = (await response.json()) as any[][];

    const chartData = data.map((item: any[]) => ({
      time: new Date(item[0]).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      price: Number(item[4]),
    }));

    return NextResponse.json({
      symbol,
      data: chartData,
    });
  } catch (error) {
    console.error("Chart API error:", error);
    return NextResponse.json(
      {
        error: "Unable to fetch chart data",
      },
      {
        status: 503,
      }
    );
  }
}