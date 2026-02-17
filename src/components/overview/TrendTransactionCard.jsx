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
  trendDateFrom,
  trendDateTo,
  onTrendDateFromChange,
  onTrendDateToChange,
  trendData,
  trendYAxisMax,
}) {
  return (
    <Card className="lg:col-span-2 card-ocean flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base font-semibold">Tren Transaksi</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={trendDateFrom}
              onChange={(event) => onTrendDateFromChange(event.target.value)}
              max={trendDateTo || undefined}
              className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
              aria-label="Tanggal awal tren transaksi"
            />
            <span className="text-xs text-muted-foreground">s/d</span>
            <input
              type="date"
              value={trendDateTo}
              onChange={(event) => onTrendDateToChange(event.target.value)}
              min={trendDateFrom || undefined}
              className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
              aria-label="Tanggal akhir tren transaksi"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">vs tahun lalu</span>
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
