type Datasets = {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
}
  

export type ChartType = {
    labels: string[],
    datasets: Datasets[]
}