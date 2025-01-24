import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
interface Props {
  tag:string;
  labels :string[];
  statData: number[];
  backgroundColor: string[];
  borderColor: string[];
  title:string;
  //deficits: any[];
}

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Bars: React.FC<Props> = ({ tag, labels, statData, backgroundColor, borderColor, title }) => {
  // Definir el tipo de datos y opciones
  const data = {
    labels: labels,
    datasets: [
      {
        label: tag,
        data: statData,
        backgroundColor: backgroundColor,
        borderColor:  borderColor,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default Bars;
