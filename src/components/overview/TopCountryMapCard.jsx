import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { Search, ZoomIn, ZoomOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const WORLD_MAP_KEY = "world-top10-countries";

export function TopCountryMapCard({
  topCountries,
  topCountrySeriesData,
  getTopCountryColor,
}) {
  const [countryMapZoom, setCountryMapZoom] = useState(1.08);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [worldMapReady, setWorldMapReady] = useState(
    () => Boolean(echarts.getMap(WORLD_MAP_KEY)),
  );

  useEffect(() => {
    let isMounted = true;
    if (echarts.getMap(WORLD_MAP_KEY)) {
      setWorldMapReady(true);
      return () => {
        isMounted = false;
      };
    }

    fetch("/data/world-countries.geo.json")
      .then((response) => response.json())
      .then((geoJson) => {
        echarts.registerMap(WORLD_MAP_KEY, geoJson);
        if (isMounted) {
          setWorldMapReady(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setWorldMapReady(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const mapOption = useMemo(
    () => ({
      tooltip: {
        trigger: "item",
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        textStyle: {
          color: "hsl(var(--foreground))",
          fontSize: 12,
        },
        formatter: (params) => {
          const value = Number(params.value) || 0;
          if (!value) {
            return `${params.name}<br/>Tidak ada transaksi`;
          }
          const color = getTopCountryColor(value);
          return `
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:9999px;background:${color};"></span>
              <span style="font-weight:600;">${params.name}</span>
            </div>
            <div style="margin-top:4px;color:hsl(215 16% 47%);">${value} transaksi</div>
          `;
        },
      },
      series: [
        {
          type: "map",
          map: WORLD_MAP_KEY,
          roam: true,
          zoom: countryMapZoom,
          scaleLimit: {
            min: 1,
            max: 4,
          },
          selectedMode: false,
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: "#dce6f1",
            borderColor: "#9fb2c9",
            borderWidth: 0.8,
          },
          emphasis: {
            itemStyle: {
              areaColor: "#2d66ad",
            },
            label: {
              show: false,
            },
          },
          data: topCountrySeriesData,
        },
      ],
    }),
    [countryMapZoom, getTopCountryColor, topCountrySeriesData],
  );

  const handleZoomIn = () => {
    setCountryMapZoom((prev) => Math.min(4, Number((prev + 0.2).toFixed(2))));
  };

  const handleZoomOut = () => {
    setCountryMapZoom((prev) => Math.max(1, Number((prev - 0.2).toFixed(2))));
  };

  const handleResetZoom = () => {
    setCountryMapZoom(1.08);
  };

  return (
    <>
      <Card className="card-ocean lg:h-[520px] flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base font-semibold">Top 10 Negara Asal</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowMapDialog(true)}
              title="Perbesar peta"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <div className="relative h-[260px] overflow-hidden rounded-lg border border-border/60 bg-slate-50/60">
            <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md border border-border bg-card/90 p-1 shadow-sm">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleZoomOut}
                title="Zoom out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleZoomIn}
                title="Zoom in"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
            </div>
            {worldMapReady ? (
              <ReactECharts
                option={mapOption}
                notMerge
                lazyUpdate
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Memuat peta dunia...
              </div>
            )}
          </div>
          <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
            {topCountries.map((country, index) => (
              <div
                key={`rank-country-${country.name}`}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 text-muted-foreground">{index + 1}.</span>
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: getTopCountryColor(country.count),
                    }}
                  />
                  <span className="text-muted-foreground truncate">{country.name}</span>
                </div>
                <span className="font-medium">{country.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2">
              <span>Top 10 Negara Asal</span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleZoomOut}
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleZoomIn}
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleResetZoom}
                >
                  Reset
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="h-[70vh] overflow-hidden rounded-lg border border-border/60 bg-slate-50/60">
            {worldMapReady ? (
              <ReactECharts
                option={mapOption}
                notMerge
                lazyUpdate
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Memuat peta dunia...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
