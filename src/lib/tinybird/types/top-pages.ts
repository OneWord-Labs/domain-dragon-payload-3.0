export type TopPagesData = {
  pathname: string;
  visits: number;
  hits: number;
  user_id: string;
  site_id: string;
};

export enum TopPagesSorting {
  Visitors = "visits",
  Pageviews = "hits",
}
