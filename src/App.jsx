import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  LineController,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function App() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        position: "bottom",
        title: {
          display: false,
          text: "Time",
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: (value, index, values) => {
            // Display labels for every 10th data point
            const labels = chartData.labels;
            return index % 2 === 0 ? labels[index] : "";
          },
        },
      },
      y: {
        title: {
          display: false,
          text: "Value",
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          stepSize: 1000, // Adjust the stepSize as needed
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          // Customize the tooltip label
          label: (context) => {
            const value = context.parsed.y || 0; // Get the y-value
            return `Value: ${value}`;
          },
        },
      },
    },
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const createChartData = (data) => {
    const timestamps = data.map((item) => item[0]);
    const values = data.map((item) => item[1]);
    const labels = timestamps.map(formatTimestamp);

    const finalData = {
      labels,
      datasets: [
        {
          fill: true,
          label: "Dataset-2",
          data: values,
          backgroundColor: "#8ecae6",
        },
      ],
    };

    setChartData(finalData);
  };

  async function fetchData() {
    try {
      const res = await fetch(
        "https://api.llama.fi/summary/fees/lyra?dataType=dailyFees"
      );
      if (res.status === 200) {
        let data = await res.json();
        data = await data.totalDataChart;
        createChartData(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if(chartData.datasets.length !== 0) {
      setIsLoading(false);
    }
  }, [chartData]);

  return (
    <div className="h-screen">
      <div className="max-h-full h-full w-full flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="text-sm font-medium">Loading your data</div>
        ) : (
          <Line options={chartOptions} data={chartData} />
        )}
      </div>
    </div>
  );
}

export default App;
