import React from 'react';
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartType } from '../../type/chart';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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
    text: 'Chart.js Line Chart',
    },
},
};

type LineChartProps = {
  chartData: ChartType;
}


const LineChart: React.FC<LineChartProps> = ({chartData}) => {
  
  return <Line data={chartData} />;
}


export default LineChart