import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WAFFLE_COLORS = {
  group: "hsl(213 72% 44%)",
  individual: "hsl(210 14% 62%)",
  empty: "hsl(210 16% 88%)",
};

export function BookingWaffleCard({
  activeTrendFilterLabel,
  bookingYearFilter,
  onBookingYearChange,
  bookingYearOptions,
  bookingWaffleData,
  bookingTotalPeople,
  bookingGroupPct,
  bookingIndividualPct,
}) {
  return (
    <Card className="card-ocean mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Perbandingan Pengunjung (Grup vs Individu)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">Periode: {activeTrendFilterLabel}</div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Tahun</label>
            <select
              value={bookingYearFilter}
              onChange={(event) => onBookingYearChange(event.target.value)}
              className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
            >
              {bookingYearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="rounded-lg border border-border/60 bg-card/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">Tahun {bookingWaffleData.year}</h4>
            <span className="text-xs text-muted-foreground">Total {bookingTotalPeople} orang</span>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {bookingWaffleData.cells.map((cell, index) => (
              <div
                key={`${bookingWaffleData.year}-${cell.id}-${index}`}
                className="h-4 rounded-[4px]"
                style={{
                  backgroundColor: WAFFLE_COLORS[cell.type],
                }}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: WAFFLE_COLORS.group,
                }}
              />
              <span>
                Grup: {bookingWaffleData.counts.group} ({bookingGroupPct}%)
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: WAFFLE_COLORS.individual,
                }}
              />
              <span>
                Individu: {bookingWaffleData.counts.individual} ({bookingIndividualPct}%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
