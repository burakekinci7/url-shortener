namespace UrlShortener.Domain.Entities;

public class ShortUrl
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ShortCode { get; set; } = string.Empty;
    public string OriginalUrl { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public int ClickCount { get; set; } = 0;

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<ClickEvent> ClickEvents { get; set; } = new List<ClickEvent>();
}