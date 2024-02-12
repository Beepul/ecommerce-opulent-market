import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ChartType } from '../../type/chart';

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  chartData: ChartType;
}


const PieChart: React.FC<PieChartProps> = ({chartData}) => {
  
  return <Pie data={chartData} />;
}


export default PieChart