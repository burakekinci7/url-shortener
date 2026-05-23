using System.ComponentModel.DataAnnotations;

namespace UrlShortener.Application.DTOs.ShortUrls;

public class CreateShortUrlDto
{
    [Required(ErrorMessage = "Original URL is required.")]
    [Url(ErrorMessage = "Must be a valid URL.")]
    [MaxLength(2048, ErrorMessage = "URL cannot exceed 2048 characters.")]
    public string OriginalUrl { get; set; } = string.Empty;

    public DateTime? ExpiresAt { get; set; }
}