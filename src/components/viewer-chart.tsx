"use client";

import { ResponsiveBar } from "@nivo/bar";
import { useMemo } from "react";

const chartTheme = {
  axis: {
    ticks: {
      text: {
        fill: "hsl(0 0% 45%)",
        fontSize: 11,
      },
    },
  },
  grid: {
    line: {
      stroke: "hsl(0 0% 88%)",
      strokeWidth: 0.5,
    },
  },
};

interface ViewerChartProps {
  data: { time: string; viewers: number }[];
}

export function ViewerChart({ data }: ViewerChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        time: d.time,
        viewers: d.viewers,
      })),
    [data]
  );

  return (
    <div className="h-[200px] w-full">
      <ResponsiveBar
        data={chartData}
        keys={["viewers"]}
        indexBy="time"
        margin={{ top: 12, right: 12, bottom: 28, left: 40 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={["hsl(230 51% 41%)"]}
        theme={chartTheme}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          tickValues: 5,
        }}
        enableGridY={true}
        enableLabel={false}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  );
}
