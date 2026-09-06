"use client";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
type ChartData = { time: string; price: number; };
type MarketChartProps = { symbol: string; };
export default function MarketChart({ symbol, }: MarketChartProps) { const [data, setData] = useState<ChartData[]>([]);
const [loading, setLoading] = useState(true);
async function fetchChartData() {
  try {
    const response = await fetch(`/api/market/chart?symbol=${symbol}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chart data");
    }

  const result = await response.json();

  setData(result.data);
} catch (error) {
  console.error(
    "Chart error:",
    error
  );
} finally {
  setLoading(false);
}
}
useEffect(() => { setLoading(true);
fetchChartData();

const interval = setInterval(
  fetchChartData,
  60000
);

return () => clearInterval(interval);
}, [symbol]);
if (loading) { return ( <div className="flex h-[310px] items-center justify-center text-gray-500"> Loading market chart... </div> ); }
return ( <div className="h-[310px] w-full"> <ResponsiveContainer
width="100%"
height="100%"
> <AreaChart data={data}> <defs> <linearGradient
id="priceGradient"
x1="0"
y1="0"
x2="0"
y2="1"
> <stop
offset="5%"
stopColor="#facc15"
stopOpacity={0.35}
/>
          <stop
            offset="95%"
            stopColor="#facc15"
            stopOpacity={0}
          />
        </linearGradient>
      </defs>

      <CartesianGrid
        strokeDasharray="3 3"
        stroke="#ffffff10"
        vertical={false}
      />

      <XAxis
        dataKey="time"
        stroke="#6b7280"
        tickLine={false}
        axisLine={false}
      />

      <YAxis
        domain={[
          "dataMin",
          "dataMax",
        ]}
        stroke="#6b7280"
        tickLine={false}
        axisLine={false}
        width={80}
      />

      <Tooltip
        contentStyle={{
          background: "#111111",
          border:
            "1px solid #ffffff20",
          borderRadius: "12px",
        }}
        labelStyle={{
          color: "#9ca3af",
        }}
      />

      <Area
        type="monotone"
        dataKey="price"
        stroke="#facc15"
        strokeWidth={3}
        fill="url(#priceGradient)"
      />
    </AreaChart>
  </ResponsiveContainer>
</div>
); }