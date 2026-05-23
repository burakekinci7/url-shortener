namespace UrlShortener.Application.DTOs.ShortUrls;

public class ResolveResultDto
{
    public Guid ShortUrlId { get; set; }
    public string OriginalUrl { get; set; } = string.Empty;
}