import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
} from "recharts";
import { formatRupiah } from "@/data/dummyData";

const CHART_COLORS = {
  total: "hsl(var(--primary))",
};

export function TrendTransactionCard({
  trendFilter,
  onTrendFilterChange,
  trendOptions,
  trendData,
  trendYAxisMax,
}) {
  return (
    <Card className="lg:col-span-2 card-ocean flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Tren Transaksi</CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={trendFilter}
              onChange={(event) => onTrendFilterChange(event.target.value)}
              className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
            >
              {trendOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">vs tahun lalu</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center pb-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={trendData}
              margin={{
                top: 24,
                right: 10,
                left: -4,
                bottom: 12,
              }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.total} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={CHART_COLORS.total} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                }}
                axisLine={{
                  stroke: "hsl(var(--border))",
                }}
              />
              <YAxis
                domain={[0, trendYAxisMax]}
                tickCount={6}
                tick={{
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                }}
                axisLine={{
                  stroke: "hsl(var(--border))",
                }}
                padding={{
                  top: 8,
                  bottom: 16,
                }}
                tickFormatter={(v) => `${v}jt`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value, name) => [formatRupiah(Number(value) * 1000000), name]}
              />
              <Legend
                iconType="line"
                wrapperStyle={{
                  fontSize: "11px",
                }}
              />
              <Area
                type="monotone"
                dataKey="totalCumulative"
                stroke={CHART_COLORS.total}
                strokeWidth={2}
                fill="url(#colorTotal)"
                name="Akumulasi periode ini"
              />
              <Line
                type="monotone"
                dataKey="lastYearCumulative"
                stroke="#b9bec7"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 4"
                name="Akumulasi tahun lalu"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
