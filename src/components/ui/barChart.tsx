import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Plugin,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


interface BarChartChartProps {
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
  className?: string | "";
  plugins: Plugin[];
}


export const BarChart: React.FC<BarChartChartProps> = ({
  data,
  options,
  className,
  plugins,
}) => {
  return (
    <Bar
      data={data}
      options={options}
      className={className}
      plugins={plugins}
    />
  );
};
