using UrlShortener.Application.DTOs.Stats;

namespace UrlShortener.Application.Interfaces.Services;

public interface IStatsService
{
    Task<UrlStatsDto?> GetStatsAsync(
        Guid shortUrlId,
        Guid userId,
        CancellationToken cancellationToken = default);
}