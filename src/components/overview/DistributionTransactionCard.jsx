import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { formatRupiah } from "@/data/dummyData";

const PIE_COLORS = [
  "hsl(213 70% 35%)",
  "hsl(213 65% 45%)",
  "hsl(213 60% 55%)",
  "hsl(213 60% 65%)",
  "hsl(213 70% 75%)",
];

function DistributionTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const entry = payload[0];
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <div className="flex items-center gap-2 text-foreground">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: entry.color }}
        />
        <span>{entry.name}</span>
      </div>
      <div className="mt-1 font-medium text-foreground">
        {formatRupiah(Number(entry.value) || 0)}
      </div>
    </div>
  );
}

export function DistributionTransactionCard({ categoryData }) {
  return (
    <Card className="card-ocean">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Distribusi Transaksi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<DistributionTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 mt-2">
          {categoryData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                  }}
                />
                <span className="text-muted-foreground truncate max-w-[160px]">{item.name}</span>
              </div>
              <span className="font-medium">{formatRupiah(item.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
