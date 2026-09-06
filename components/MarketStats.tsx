"use client";

import { useEffect, useState } from "react";

type MarketData = {
  symbol: string;
  price: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
};

type MarketStatsProps = {
  symbol: string;
};

export default function MarketStats({ symbol }: MarketStatsProps) {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchMarketData() {
    try {
      const response = await fetch(`/api/market?symbol=${symbol}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch market data");
      }

      const result: MarketData = await response.json();
      setData(result);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Market data unavailable");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchMarketData();

    const interval = setInterval(() => {
      fetchMarketData();
    }, 10000);

    return () => clearInterval(interval);
  }, [symbol]);

  const coinName = symbol.replace("USDT", "");

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 text-gray-400">
        Loading {coinName} market data...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-red-400">
        {error || "Market data unavailable"}
      </div>
    );
  }

  const isPositive = data.priceChangePercent >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5">
        <p className="text-sm text-gray-500">{coinName} Price</p>

        <h2 className="mt-2 text-2xl font-bold">
          ${data.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
        </h2>

        <p className={`mt-2 text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? "+" : ""}
          {data.priceChangePercent.toFixed(2)}%
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5">
        <p className="text-sm text-gray-500">24H Volume</p>

        <h2 className="mt-2 text-2xl font-bold">
          ${(data.quoteVolume / 1_000_000_000).toFixed(2)}B
        </h2>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5">
        <p className="text-sm text-gray-500">24H High</p>

        <h2 className="mt-2 text-2xl font-bold text-green-400">
          ${data.highPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}
        </h2>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5">
        <p className="text-sm text-gray-500">24H Low</p>

        <h2 className="mt-2 text-2xl font-bold text-yellow-400">
          ${data.lowPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}
        </h2>
      </div>
    </div>
  );
}