export type TopSource = {
  referrer: string;
  visits: number;
  href?: string;
  user_id: string;
  site_id: string;
};

export type TopSources = {
  data: TopSource[];
  refs: string[];
  visits: number[];
};
