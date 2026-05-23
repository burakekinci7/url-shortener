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

export interface ClicksByDevice {
  device: string;
  count: number;
}

export interface ClicksByCountry {
  country: string;
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
  clicksByDevice: ClicksByDevice[];
  clicksByCountry: ClicksByCountry[];
}

export interface ApiError {
  message: string;
}
