using UrlShortener.Application.DTOs.Stats;
using UrlShortener.Application.Interfaces.Repositories;
using UrlShortener.Application.Interfaces.Services;
using UrlShortener.Domain.Entities;

namespace UrlShortener.Application.Services;

public class StatsService : IStatsService
{
    private readonly IShortUrlRepository _shortUrlRepository;
    private readonly IRepository<ClickEvent> _clickEventRepository;

    public StatsService(
        IShortUrlRepository shortUrlRepository,
        IRepository<ClickEvent> clickEventRepository)
    {
        _shortUrlRepository = shortUrlRepository;
        _clickEventRepository = clickEventRepository;
    }

    public async Task<UrlStatsDto?> GetStatsAsync(
        Guid shortUrlId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var shortUrl = await _shortUrlRepository.GetByIdAsync(shortUrlId, cancellationToken);

        // Authorization
        if (shortUrl == null || shortUrl.UserId != userId)
            return null;

        // Bu link için tüm click event'leri çek
        var clicks = await _clickEventRepository.FindAsync(
            c => c.ShortUrlId == shortUrlId,
            cancellationToken);

        return new UrlStatsDto
        {
            ShortUrlId = shortUrl.Id,
            ShortCode = shortUrl.ShortCode,
            OriginalUrl = shortUrl.OriginalUrl,
            TotalClicks = clicks.Count,
            CreatedAt = shortUrl.CreatedAt,
            LastClickedAt = clicks.Any()
                ? clicks.Max(c => c.ClickedAt)
                : null,

            ClicksByDay = clicks
                .GroupBy(c => DateOnly.FromDateTime(c.ClickedAt))
                .Select(g => new DailyClickDto
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .OrderBy(d => d.Date)
                .ToList(),

            ClicksByDevice = clicks
                .Where(c => !string.IsNullOrEmpty(c.DeviceType))
                .GroupBy(c => c.DeviceType!)
                .Select(g => new DeviceClickDto
                {
                    DeviceType = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(d => d.Count)
                .ToList(),

            ClicksByCountry = clicks
                .Where(c => !string.IsNullOrEmpty(c.Country))
                .GroupBy(c => c.Country!)
                .Select(g => new CountryClickDto
                {
                    Country = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(c => c.Count)
                .ToList()
        };
    }
}