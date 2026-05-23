namespace UrlShortener.Application.DTOs.Clicks;

public class RecordClickDto
{
    public Guid ShortUrlId { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public string? Referrer { get; set; }
}