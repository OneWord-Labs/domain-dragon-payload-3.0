export type TrendData = {
  t: string;
  visits: number;
  user_id: string;
  site_id: string;
};

export type Trend = {
  visits: number[];
  dates: string[];
  totalVisits: number;
  data: TrendData[];
};
