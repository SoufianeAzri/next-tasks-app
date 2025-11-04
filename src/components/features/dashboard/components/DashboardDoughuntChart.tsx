"use client";
import { DoughnutChart } from "@/components/ui/doughunt";
import { State } from "@/utils/types";
import type { ChartData, ChartOptions } from "chart.js";

interface DashboardDoughnutChartProps {
  stateDistribution: State[];
}

export const DashboardDoughnutChart = ({
  stateDistribution,
}: DashboardDoughnutChartProps) => {
  const doughnutData: ChartData<"doughnut"> = {
    labels: stateDistribution.map((s: State) => s.state),
    datasets: [
      {
        label: "Traffic Sources",
        data:
          stateDistribution.length !== 0
            ? stateDistribution
                .map((s: State) => s.percentage)
                .filter((id): id is string => Boolean(id))
                .map((v) => parseFloat(v))
            : [],
        backgroundColor: stateDistribution.map((s: State) => s.color),
        weight: 100,
        borderColor: "#fff",
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.formattedValue}%`,
        },
      },
    },
  };

  return (
    <div className="w-[35%] flex justify-end items-center grow">
      <div className="w-full flex flex-col">
        <h4 className="text-16-600-s-black pb-2">Statut Distribution</h4>

        <div className="lg:h-[250px] h-[265px] flex justify-center items-center">
          <DoughnutChart
            data={doughnutData}
            options={doughnutOptions}
            className="w-full h-full"
          />
        </div>

        <div className="pt-5 flex justify-center items-center">
          <div className="w-full flex justify-center items-center flex-wrap">
            {stateDistribution.map((s: State) => (
              <div key={s.state} className="mr-3 flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{
                    backgroundColor: s.color,
                  }}
                />
                <p className="text-12-500-s-black pt-0.5">{s.state}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
