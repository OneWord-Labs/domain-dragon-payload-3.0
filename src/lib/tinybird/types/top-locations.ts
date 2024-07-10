export type TopLocationsData = {
  location: string;
  visits: number;
  hits: number;
  user_id: string;
  site_id: string;
};

export enum TopLocationsSorting {
  Visitors = "visits",
  Pageviews = "hits",
}

export type TopLocation = {
  location: string;
  shortLocation: string;
  visits: number;
  hits: number;
};
