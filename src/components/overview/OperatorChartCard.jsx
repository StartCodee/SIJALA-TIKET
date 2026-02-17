import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function OperatorChartCard({ operatorTrendData }) {
  return (
    <Card className="card-ocean lg:h-[520px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Jenis Operator</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={operatorTrendData}
              margin={{
                top: 8,
                right: 8,
                left: -8,
                bottom: 32,
              }}
              barCategoryGap="14%"
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-18}
                textAnchor="end"
                height={58}
                tickMargin={8}
                tick={{
                  fontSize: 9,
                  fill: "hsl(var(--muted-foreground))",
                }}
              />
              <YAxis
                tick={{
                  fontSize: 10,
                  fill: "hsl(var(--muted-foreground))",
                }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: "11px",
                }}
              />
              <Bar
                dataKey="current"
                name="Tahun ini"
                fill="hsl(213 70% 45%)"
                radius={[6, 6, 0, 0]}
                barSize={16}
              />
              <Bar
                dataKey="lastYear"
                name="Tahun lalu"
                fill="hsl(213 30% 70%)"
                radius={[6, 6, 0, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
