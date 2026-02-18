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
import { GENDER_LABELS } from "@/data/dummyData";

const GENDER_STACK_COLORS = {
  L: "hsl(213 70% 40%)",
  P: "hsl(213 70% 52%)",
};

export function GenderChartCard({ activeTrendFilterLabel, genderStackedData }) {
  return (
    <Card className="card-ocean lg:h-[520px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Jenis Kelamin</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="mb-2 text-xs text-muted-foreground">Periode: {activeTrendFilterLabel}</div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={genderStackedData}
              layout="vertical"
              margin={{
                top: 8,
                right: 12,
                left: 10,
                bottom: 8,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{
                  fontSize: 10,
                  fill: "hsl(var(--muted-foreground))",
                }}
              />
              <YAxis
                type="category"
                dataKey="year"
                width={52}
                tick={{
                  fontSize: 10,
                  fill: "hsl(var(--muted-foreground))",
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: "11px",
                }}
                formatter={(value) => GENDER_LABELS[value] || value}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value, name) => [
                  `${value} orang`,
                  GENDER_LABELS[name] || name,
                ]}
                labelFormatter={(label) => `Tahun: ${label}`}
              />
              <Bar
                dataKey="L"
                name="L"
                stackId="gender"
                fill={GENDER_STACK_COLORS.L}
                radius={[0, 0, 0, 0]}
                barSize={18}
              />
              <Bar
                dataKey="P"
                name="P"
                stackId="gender"
                fill={GENDER_STACK_COLORS.P}
                radius={[0, 3, 3, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
