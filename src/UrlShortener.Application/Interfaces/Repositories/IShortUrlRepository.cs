using UrlShortener.Domain.Entities;

namespace UrlShortener.Application.Interfaces.Repositories;

public interface IShortUrlRepository : IRepository<ShortUrl>
{
    Task<ShortUrl?> GetByShortCodeAsync(string shortCode, CancellationToken cancellationToken = default);
    Task<bool> ShortCodeExistsAsync(string shortCode, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ShortUrl>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}