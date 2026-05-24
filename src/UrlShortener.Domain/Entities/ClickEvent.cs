namespace UrlShortener.Domain.Entities;

public class ClickEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShortUrlId { get; set; }
    public DateTime ClickedAt { get; set; } = DateTime.UtcNow;

    // Request bilgileri
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public string? Referrer { get; set; }

    // Device parsing (UAParser ile)
    public string? DeviceType { get; set; }      // Mobile / Desktop / Tablet / Bot
    public string? Browser { get; set; }          // Chrome, Safari, Firefox
    public string? BrowserVersion { get; set; }   // 120.0, 17.1
    public string? OperatingSystem { get; set; }  // Windows, macOS, iOS, Android
    public string? OsVersion { get; set; }        // 11, 14, 17

    // GeoIP (MaxMind ile)
    public string? Country { get; set; }          // ISO 2-letter (TR, US, DE)
    public string? CountryName { get; set; }      // Türkiye, United States
    public string? City { get; set; }             // Istanbul, New York

    // Navigation property
    public ShortUrl ShortUrl { get; set; } = null!;
}