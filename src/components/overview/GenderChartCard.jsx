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
  LabelList,
} from "recharts";
import { GENDER_LABELS } from "@/data/dummyData";

const GENDER_STACK_COLORS = {
  L: "#7bade9",
  P: "#FF88BA",
};

export function GenderChartCard({ activeTrendFilterLabel, genderStackedData }) {
  const formatNumber = (v) => new Intl.NumberFormat("id-ID").format(v);

  return (
    <Card className="card-ocean lg:h-[520px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Jenis Kelamin</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <div className="mb-2 text-xs text-muted-foreground">
          Periode: {activeTrendFilterLabel}
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={genderStackedData}
              layout="vertical"
              margin={{
                top: 8,
                right: 18, // kasih ruang sedikit kalau label mepet kanan
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
                wrapperStyle={{ fontSize: "11px" }}
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
                  `${formatNumber(value)} orang`,
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
              >
                <LabelList
                  dataKey="L"
                  position="center"
                  formatter={(v) => (v ? formatNumber(v) : "")}
                  fill="#ffffff"
                  fontSize={10}
                />
              </Bar>

              <Bar
                dataKey="P"
                name="P"
                stackId="gender"
                fill={GENDER_STACK_COLORS.P}
                radius={[0, 3, 3, 0]}
                barSize={18}
              >
                <LabelList
                  dataKey="P"
                  position="center"
                  formatter={(v) => (v ? formatNumber(v) : "")}
                  fill="#ffffff"
                  fontSize={10}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}