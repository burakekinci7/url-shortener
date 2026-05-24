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

        if (shortUrl == null || shortUrl.UserId != userId)
            return null;

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
            LastClickedAt = clicks.Any() ? clicks.Max(c => c.ClickedAt) : null,

            ClicksByDay = BuildDailyClicks(clicks),
            ClicksByDevice = GroupBy(clicks, c => c.DeviceType),
            ClicksByBrowser = GroupBy(clicks, c => c.Browser),
            ClicksByOs = GroupBy(clicks, c => c.OperatingSystem),
            ClicksByCountry = GroupBy(clicks, c => c.CountryName ?? c.Country),
            ClicksByCity = GroupBy(clicks, c => c.City),
            ClicksByReferrer = BuildReferrerBreakdown(clicks)
        };
    }

    private static List<DailyClickDto> BuildDailyClicks(IEnumerable<ClickEvent> clicks)
    {
        return clicks
            .GroupBy(c => DateOnly.FromDateTime(c.ClickedAt))
            .Select(g => new DailyClickDto { Date = g.Key, Count = g.Count() })
            .OrderBy(d => d.Date)
            .ToList();
    }

    private static List<BreakdownDto> GroupBy(
        IEnumerable<ClickEvent> clicks,
        Func<ClickEvent, string?> selector)
    {
        return clicks
            .Where(c => !string.IsNullOrEmpty(selector(c)))
            .GroupBy(c => selector(c)!)
            .Select(g => new BreakdownDto { Label = g.Key, Count = g.Count() })
            .OrderByDescending(b => b.Count)
            .Take(10) // Top 10 göster, çok kalabalık olmasın
            .ToList();
    }

    private static List<BreakdownDto> BuildReferrerBreakdown(IEnumerable<ClickEvent> clicks)
    {
        return clicks
            .Select(c => string.IsNullOrEmpty(c.Referrer) ? "Direct" : ExtractDomain(c.Referrer))
            .Where(d => !string.IsNullOrEmpty(d))
            .GroupBy(d => d!)
            .Select(g => new BreakdownDto { Label = g.Key, Count = g.Count() })
            .OrderByDescending(b => b.Count)
            .Take(10)
            .ToList();
    }

    private static string? ExtractDomain(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            return url;

        return uri.Host.StartsWith("www.")
            ? uri.Host[4..]
            : uri.Host;
    }
}