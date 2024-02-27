export interface News {
  id: number;
  title: string;
  url: string;
  summary: string;
  published_at: string;
}

export interface FavoriteNews {
  externalId: number;
  title: string;
  description: string;
  summary: string;
  publishedAt: string;
  favoriteAt: string;
  userId: number;
}

export interface FetchAllNewsResponse {
  count: number;
  next: string;
  previous: string;
  results: NewsAllInformation[];
}

export interface NewsAllInformation {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
  launches: Launch[];
  events: Event[];
}

export interface Event {
  event_id: number;
  provider: string;
}

export interface Launch {
  launch_id: string;
  provider: string;
}

export interface User {
  id: number;
  username: string;
}
