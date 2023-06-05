import React from "react";
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
} from "chart.js";
import { Bar } from "react-chartjs-2";
import getCategoryColor from "../domain/getCategoryColor";
import { color } from "chart.js/helpers";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function EffortGraph({
  computedData,
  total,
}: {
  computedData: Array<any>;
  total: number;
}) {
  const options: ChartOptions = {
    indexAxis: "y" as const,
    maintainAspectRatio: false,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      datalabels: {
        color: "#fff",
        formatter: function (value, context) {
          const percentage = Math.round((value / total) * 100);
          return percentage > 7
            ? percentage > 10
              ? context.dataset.label + " " + value
              : context.dataset.label
            : context.dataset.label?.split(" ")[
                context.dataset.label.split(" ").length - 1
              ];
        },
      },
      legend: {
        position: "bottom" as const,
        display: false,
      },
      title: {
        display: false,
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        display: false,
      },
    },
  };

  const labels = ["Empreinte"];

  const chartData: ChartData = {
    labels,
    datasets: computedData
      .sort((a, b) => b.size - a.size)
      .map((datum: any) => ({
        label: datum.name,
        data: [datum.size],
        borderColor: color(getCategoryColor(datum.category))
          .alpha((1 + Math.log(datum.size)) / 13)
          .rgbString(),
        backgroundColor: color(getCategoryColor(datum.category))
          .alpha((1 + Math.log(datum.size)) / 13)
          .rgbString(),
        stack: "Stack 0",
        barThickness: 40,
      })),
  };

  return (
    <div
      className={`chart-container z-30 mx-auto w-full`}
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-start",
      }}
    >
      <Bar
        height={130}
        options={options}
        data={chartData}
        plugins={[ChartDataLabels]}
      />
    </div>
  );
}
