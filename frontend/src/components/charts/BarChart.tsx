import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartType } from '../../type/chart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'User Gain / Loss Chart',
    },
  },
};

type PieChartProps = {
  chartData: ChartType;
}


const BarChart: React.FC<PieChartProps> = ({chartData})=> {
  return <Bar options={options} data={chartData} />;
}

export default BarChart