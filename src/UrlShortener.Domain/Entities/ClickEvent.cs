namespace UrlShortener.Domain.Entities;

public class ClickEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShortUrlId { get; set; }
    public DateTime ClickedAt { get; set; } = DateTime.UtcNow;
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public string? Referrer { get; set; }
    public string? Country { get; set; }
    public string? DeviceType { get; set; }

    // Navigation property
    public ShortUrl ShortUrl { get; set; } = null!;
}