"use client";

import React, { useRef } from "react";
import { ChartData, ChartOptions, Plugin } from "chart.js";
import { frenchMonths } from "@/utils/content/lists";
import { BarChart } from "@/components/ui/barChart";

interface BarChartProps {
  statsData?: any;
  title?: string;
  color?: string;
  attribute?: string;
  label?: string;
}

// Plugin: Custom dashed Y grid + vertical highlight line
const customGridHighlight: Plugin = {
  id: "customBarGridHighlight",
  beforeDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const yScale = scales["y"];
    const xScale = scales["x"];
    if (!yScale || !xScale) return;

    // 1️⃣ Hide default grid
    if (chart.options.scales?.y?.grid)
      chart.options.scales.y.grid.display = false;

    // 2️⃣ Draw custom dashed Y grid lines
    const yTicks = yScale.ticks;
    ctx.save();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1;

    yTicks.forEach((_, i) => {
      const y = yScale.getPixelForTick(i);
      if (i !== 0) ctx.setLineDash([8, 6]);
      else ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(chartArea.left, y);
      ctx.lineTo(chartArea.right, y);
      ctx.stroke();
    });
    ctx.restore();

    // 3️⃣ Highlight a specific bar by its label
    const targetLabel = "Novembre"; // 🔹 Change this dynamically if needed
    const idx = chart.data.labels?.indexOf(targetLabel) ?? -1;
    if (idx === -1) return;

    const x = xScale.getPixelForTick(idx);

    // Get the bar height
    const dataset = chart.data.datasets[0];
    const yVal = dataset.data[idx] as number;
    const y = yScale.getPixelForValue(yVal);

    const barWidth =
      xScale.getPixelForTick(idx + 1) - xScale.getPixelForTick(idx);
    const halfBarWidth = barWidth * 0.4; // approximate bar width depending on bar thickness

    ctx.save();

    // 4️⃣ Draw vertical highlight line at the center of the bar
    ctx.beginPath();
    ctx.setLineDash([6, 4]);
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 5️⃣ Draw highlight circle at bar top
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff8a00";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    ctx.restore();
  },
};

export const DashboardBarChart = ({ statsData }: BarChartProps) => {
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      title: {
        display: false,
      },

      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 10,
            family: "Overpass",
            weight: 500,
          },
          color: "#989898",
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
            family: "Overpass",
            weight: 500,
          },
          color: "#989898",
        },
      },
    },
  };

  const labels = frenchMonths;

  const data: ChartData<"bar"> = {
    labels,
    datasets: statsData?.map((stat: any) => ({
      label: stat?.state || "",
      data: stat?.monthsTasksData,
      backgroundColor: stat.color,
      borderRadius: 0,
      barThickness: 10,
    })),
  };

  return (
    <div
      className="flex w-[65%] xl:w-[calc(100%-38.5%)] min-w-[350px] grow"
      style={{
        height: "auto",
      }}
    >
      <div
        className="w-full"
        style={{
          height: "auto",
          aspectRatio: 1 / 2,
          width: "100%",
          maxHeight: "320px",
          paddingTop: "1rem",
        }}
      >
        <BarChart
          options={options}
          data={data}
          plugins={[customGridHighlight]}
        />
      </div>
    </div>
  );
};
