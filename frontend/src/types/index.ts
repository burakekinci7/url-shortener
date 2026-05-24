export interface ShortUrl {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
  clickCount: number;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: AuthUser;
}

export interface ClicksByDay {
  date: string;
  count: number;
}

export interface LabeledCount {
  label: string;
  count: number;
}

export interface UrlStats {
  shortUrlId: string;
  shortCode: string;
  originalUrl: string;
  totalClicks: number;
  createdAt: string;
  lastClickedAt: string | null;
  clicksByDay: ClicksByDay[];
  clicksByDevice: LabeledCount[];
  clicksByBrowser: LabeledCount[];
  clicksByOs: LabeledCount[];
  clicksByCountry: LabeledCount[];
  clicksByCity: LabeledCount[];
  clicksByReferrer: LabeledCount[];
}

export interface ApiError {
  message: string;
}
