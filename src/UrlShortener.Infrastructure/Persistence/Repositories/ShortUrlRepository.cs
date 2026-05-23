using Microsoft.EntityFrameworkCore;
using UrlShortener.Application.Interfaces.Repositories;
using UrlShortener.Domain.Entities;

namespace UrlShortener.Infrastructure.Persistence.Repositories;

public class ShortUrlRepository : Repository<ShortUrl>, IShortUrlRepository
{
    public ShortUrlRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<ShortUrl?> GetByShortCodeAsync(
        string shortCode,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(s => s.ShortCode == shortCode && s.IsActive, cancellationToken);
    }

    public async Task<bool> ShortCodeExistsAsync(
        string shortCode,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .AnyAsync(s => s.ShortCode == shortCode, cancellationToken);
    }

    public async Task<IReadOnlyList<ShortUrl>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(s => s.UserId == userId && s.IsActive)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}