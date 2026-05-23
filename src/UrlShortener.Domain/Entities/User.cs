namespace UrlShortener.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property: bir kullanıcının birden fazla linki olur
    public ICollection<ShortUrl> ShortUrls { get; set; } = new List<ShortUrl>();
}