export enum ChartType {
  Price = 'price',
  Market = 'market',
  Volume= 'volume'
}
export enum TimeSpan {
  Year = '1y',
  Month = '1m',
  Week = '1w',
  Day = '24h'
}

export interface ChartData {
  name: Date,
  value: number;
}
export interface Chart {
  name: string,
  series: ChartData[];
}
