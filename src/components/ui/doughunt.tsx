import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// Define the props interface
interface DoughnutChartProps {
  data: ChartData<"doughnut">;
  options?: ChartOptions<"doughnut">;
  className?: string | "";
}

// Component
export const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, options, className }) => {
  return <Doughnut data={data} options={options} className={className}  />;
};