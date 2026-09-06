"use client";
import { useEffect, useState } from "react"; import Sidebar from "@/components/Sidebar"; import MarketChart from "@/components/MarketChart"; import AgentActivity from "@/components/AgentActivity"; import MarketStats from "@/components/MarketStats";
type AnalysisResult = { symbol: string; signal: string; confidence: number; riskScore: number; recommendation: string; latestPrice?: number; change24h?: number; momentum?: number;
scores?: { bullish: number; bearish: number; max: number; };
factors?: { name: string; side: string; value: string; }[];
indicators?: { rsi: number; sma20: number; sma50: number; volatility: number; volatilityLevel: string; };
agentDecision?: { action: string; marketBias: string; riskMode: string; summary: string; };
reasoning?: string[]; };
type HistoryItem = { id: string; time: string; symbol: string; signal: string; action: string; confidence: number; riskScore: number; bullishScore: number; bearishScore: number; price?: number; };
const COINS = [ { label: "BTC / USDT", value: "BTCUSDT" }, { label: "ETH / USDT", value: "ETHUSDT" }, { label: "BNB / USDT", value: "BNBUSDT" }, { label: "SOL / USDT", value: "SOLUSDT" }, { label: "XRP / USDT", value: "XRPUSDT" }, ];
export default function Home() { const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
const [runningAnalysis, setRunningAnalysis] = useState(false);
const [analysisError, setAnalysisError] = useState("");
const [agentStep, setAgentStep] = useState(-1);
const [history, setHistory] = useState<HistoryItem[]>([]);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms) );
useEffect(() => { try { const savedHistory = localStorage.getItem( "spider-analysis-history" );
  if (savedHistory) {
    setHistory(JSON.parse(savedHistory));
  }
} catch (error) {
  console.error(
    "History load error:",
    error
  );
}
}, []);
const saveHistory = ( items: HistoryItem[] ) => { setHistory(items);
localStorage.setItem(
  "spider-analysis-history",
  JSON.stringify(items)
);
};
const addHistoryItem = ( result: AnalysisResult ) => { const newItem: HistoryItem = { id: crypto.randomUUID(), time: new Date().toLocaleString(), symbol: result.symbol, signal: result.signal, action: result.agentDecision?.action ?? "WAIT", confidence: result.confidence, riskScore: result.riskScore, bullishScore: result.scores?.bullish ?? 0, bearishScore: result.scores?.bearish ?? 0, price: result.latestPrice, };
const updatedHistory = [
  newItem,
  ...history,
].slice(0, 10);

saveHistory(updatedHistory);
};
const clearHistory = () => { setHistory([]);
localStorage.removeItem(
  "spider-analysis-history"
);
};
const handleCoinChange = ( symbol: string ) => { setSelectedSymbol(symbol); setAnalysis(null); setAnalysisError(""); setAgentStep(-1); };
const runFullAnalysis = async () => { if (runningAnalysis) return;
setRunningAnalysis(true);
setAnalysisError("");
setAgentStep(0);

try {
  for (let i = 0; i <= 6; i++) {
    setAgentStep(i);
    await sleep(400);
  }

  setAgentStep(7);

  const response = await fetch(
    `/api/analyze?symbol=${selectedSymbol}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Analysis request failed"
    );
  }

  const result: AnalysisResult =
    await response.json();

  setAnalysis(result);
  addHistoryItem(result);

  await sleep(300);

  setAgentStep(8);
} catch (error) {
  console.error(error);

  setAnalysisError(
    "Spider AI analysis failed. Please try again."
  );
} finally {
  setRunningAnalysis(false);
}
};
const confidence = Math.min( 100, Math.max( 0, analysis?.confidence ?? 0 ) );
const risk = Math.min( 100, Math.max( 0, analysis?.riskScore ?? 0 ) );
const getSignalStyle = ( signal?: string ) => { if (!signal) { return "bg-white/10 text-gray-300"; }
if (
  signal.includes("BULLISH") ||
  signal === "OVERSOLD"
) {
  return "bg-green-400/10 text-green-400";
}

if (
  signal.includes("BEARISH") ||
  signal === "OVERBOUGHT"
) {
  return "bg-red-400/10 text-red-400";
}
return "bg-yellow-400/10 text-yellow-400";
};
const getActionStyle = ( action?: string ) => { if (action === "BUY_SETUP") { return "border-green-400/20 bg-green-400/5 text-green-400"; }
if (action === "RISK_OFF") {
  return "border-red-400/20 bg-red-400/5 text-red-400";
}

if (action === "REVERSAL_WATCH") {
  return "border-yellow-400/20 bg-yellow-400/5 text-yellow-400";
}

return "border-white/10 bg-white/5 text-gray-300";
};
const getRSIStatus = ( rsi: number ) => { if (rsi >= 70) return "OVERBOUGHT"; if (rsi <= 30) return "OVERSOLD";
return "NEUTRAL";
};
const coinName = selectedSymbol.replace("USDT", "");
const selectedCoin = COINS.find( (coin) => coin.value === selectedSymbol ) ?? COINS[0];
return ( <main className="min-h-screen bg-[#050505] text-white"> <Sidebar />
  <section className="ml-64 min-h-screen p-8">
    <div className="mx-auto max-w-7xl">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.35em] text-yellow-400">
            Spider Intelligence
          </p>

          <h1 className="text-4xl font-bold">
            Market Intelligence Dashboard
          </h1>

          <p className="mt-3 text-gray-400">
            Every Signal. One Intelligence.
          </p>
        </div>

        {/* MARKET SELECTOR */}
        <div className="w-full lg:w-[230px]">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">
            Select Market
          </p>

          <select
            value={selectedSymbol}
            onChange={(e) =>
              handleCoinChange(
                e.target.value
              )
            }
            disabled={runningAnalysis}
            className="w-full cursor-pointer rounded-xl border border-yellow-400/20 bg-[#111111] px-4 py-3 font-semibold text-yellow-400 outline-none transition focus:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {COINS.map((coin) => (
              <option
                key={coin.value}
                value={coin.value}
                className="bg-[#111111] text-white"
              >
                {coin.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LIVE MARKET STATS */}
      <MarketStats
        symbol={selectedSymbol}
      />

      {/* CHART + ANALYSIS */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">

        {/* CHART */}
        <div className="min-h-[420px] rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Market Chart
              </p>

              <h2 className="text-2xl font-semibold">
                {selectedCoin.label}
              </h2>
            </div>

            <span className="rounded-lg bg-yellow-400/10 px-3 py-1 text-sm font-semibold text-yellow-400">
              1H
            </span>
          </div>

          <MarketChart
            symbol={selectedSymbol}
          />
        </div>

        {/* AI ANALYSIS */}
        <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
          <p className="text-sm text-gray-500">
            Spider AI Analysis
          </p>

          <h3 className="mt-1 text-xl font-semibold">
            {coinName}
          </h3>

          {!analysis ? (
            <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-5">
              <p className="text-sm leading-6 text-gray-400">
                Run Spider AI to generate a live{" "}
                {coinName} market signal,
                confidence score, risk score,
                technical indicators and
                recommendation.
              </p>
            </div>
          ) : (
            <div className="mt-5">

              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  Signal
                </span>

                <span
                  className={`rounded-lg px-3 py-1 text-sm font-semibold ${getSignalStyle(
                    analysis.signal
                  )}`}
                >
                  {analysis.signal}
                </span>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">
                    Confidence
                  </span>

                  <span className="font-semibold text-yellow-400">
                    {confidence}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{
                      width: `${confidence}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">
                    Risk
                  </span>

                  <span className="font-semibold">
                    {risk} / 100
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-red-400"
                    style={{
                      width: `${risk}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  Recommendation
                </p>

                <p className="mt-1 text-lg font-bold text-yellow-400">
                  {analysis.recommendation}
                </p>
              </div>
            </div>
          )}

          {analysisError && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {analysisError}
            </div>
          )}

          <button
            onClick={runFullAnalysis}
            disabled={runningAnalysis}
            className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-60"
          >
            {runningAnalysis
              ? `Spider is analyzing ${coinName}...`
              : analysis
              ? `Analyze ${coinName} Again`
              : `Analyze ${coinName}`}
          </button>
        </div>
      </div>

      {/* FINAL DECISION */}
      {analysis?.agentDecision && (
        <div className="mt-6">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">
            Spider Final Decision
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Agent Decision Layer
          </h2>

          <div
            className={`mt-4 rounded-2xl border p-6 ${getActionStyle(
              analysis.agentDecision.action
            )}`}
          >
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Action
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {
                    analysis.agentDecision
                      .action
                  }
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Market Bias
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {
                    analysis.agentDecision
                      .marketBias
                  }
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Risk Mode
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {
                    analysis.agentDecision
                      .riskMode
                  }
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm leading-6 text-gray-300">
                {
                  analysis.agentDecision
                    .summary
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SIGNAL SCORING */}
      {analysis?.scores && (
        <div className="mt-6">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">
            Explainable Decision Engine
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Signal Scoring
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-5">
              <p className="text-sm text-gray-400">
                Bullish Score
              </p>

              <p className="mt-2 text-4xl font-bold text-green-400">
                {analysis.scores.bullish}/
                {analysis.scores.max}
              </p>

              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-green-400"
                  style={{
                    width: `${
                      (analysis.scores
                        .bullish /
                        analysis.scores
                          .max) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
              <p className="text-sm text-gray-400">
                Bearish Score
              </p>

              <p className="mt-2 text-4xl font-bold text-red-400">
                {analysis.scores.bearish}/
                {analysis.scores.max}
              </p>

              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-red-400"
                  style={{
                    width: `${
                      (analysis.scores
                        .bearish /
                        analysis.scores
                          .max) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {analysis.factors && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#0c0c0c] p-5">
              <p className="mb-4 font-semibold">
                Decision Factors
              </p>

              <div className="space-y-3">
                {analysis.factors.map(
                  (
                    factor,
                    index
                  ) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0"
                    >
                      <div>
                        <p className="text-sm text-gray-300">
                          {factor.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {factor.value}
                        </p>
                      </div>

                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                          factor.side ===
                          "BULLISH"
                            ? "bg-green-400/10 text-green-400"
                            : factor.side ===
                              "BEARISH"
                            ? "bg-red-400/10 text-red-400"
                            : "bg-yellow-400/10 text-yellow-400"
 }`}
                      >
                        {factor.side}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TECHNICAL INDICATORS */}
      {analysis?.indicators && (
        <div className="mt-6">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">
            Spider Technical Engine
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Technical Indicators
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5">
              <p className="text-sm text-gray-500">
                RSI
              </p>

              <p className="mt-2 text-3xl font-bold">
                {analysis.indicators.rsi.toFixed(
                  2
                )}
              </p>

              <p className="mt-3 text-sm text-gray-300">
                {getRSIStatus(
                  analysis.indicators.rsi
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5">
              <p className="text-sm text-gray-500">
                SMA 20
              </p>

              <p className="mt-2 text-2xl font-bold">
                $
                {analysis.indicators.sma20.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5">
              <p className="text-sm text-gray-500">
                SMA 50
              </p>

              <p className="mt-2 text-2xl font-bold">
                $
                {analysis.indicators.sma50.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5">
              <p className="text-sm text-gray-500">
                Volatility
              </p>

              <p className="mt-2 text-3xl font-bold">
                {analysis.indicators.volatility.toFixed(
                  2
                )}
                %
              </p>

              <p className="mt-2 text-sm text-green-400">
                {
                  analysis.indicators
                    .volatilityLevel
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AGENT ACTIVITY */}
      <div className="mt-6">
        <AgentActivity
          running={runningAnalysis}
          currentStep={agentStep}
        />
      </div>

      {/* ANALYSIS HISTORY */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Analysis History
          </h2>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-sm text-gray-500">
              No analysis history yet.
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Run Spider Analysis to create the first record.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[850px]">
              {/* TABLE HEADER */}
              <div className="grid grid-cols-7 gap-4 px-4 pb-3 text-xs uppercase tracking-wider text-gray-500">
                <div>Time</div>
                <div>Market</div>
                <div>Price</div>
                <div>Action</div>
                <div>Signal</div>
                <div>Score</div>
                <div>Risk</div>
              </div>

              {/* HISTORY ROWS */}
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-7 items-center gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-4 transition hover:border-yellow-400/20 hover:bg-white/[0.03]"
                  >
                    {/* TIME */}
                    <div>
                      <p className="text-sm text-gray-300">
                        {item.time}
                      </p>
                    </div>

                    {/* MARKET */}
                    <div>
                      <span className="rounded-lg bg-yellow-400/10 px-3 py-1 text-sm font-bold text-yellow-400">
                        {item.symbol
                          ? item.symbol.replace("USDT", "")
                          : "BTC"}
                      </span>
                    </div>

                    {/* PRICE */}
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.price !== undefined
                          ? `$${item.price.toLocaleString()}`
                          : "-"}
                      </p>
                    </div>

                    {/* ACTION */}
                    <div>
                      <p className="text-sm font-semibold text-yellow-400">
                        {item.action}
                      </p>
                    </div>

                    {/* SIGNAL */}
                    <div>
                      <span
                        className={`rounded-lg px-2 py-1 text-xs font-semibold ${getSignalStyle(
                          item.signal
                        )}`}
                      >
                        {item.signal}
                      </span>
                    </div>

                    {/* SCORE */}
                    <div>
                      <p className="text-sm font-semibold">
                        <span className="text-green-400">
                          {item.bullishScore}
                        </span>

                        <span className="mx-1 text-gray-600">
                          /
                        </span>

                        <span className="text-red-400">
                          {item.bearishScore}
                        </span>
                      </p>

                      <p className="mt-1 text-[10px] text-gray-600">
                        BULL / BEAR
                      </p>
                    </div>

                    {/* RISK */}
                    <div>
                      <p className="text-sm font-semibold">
                        {item.riskScore}/100
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {item.confidence}% conf.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
</main>
);
}