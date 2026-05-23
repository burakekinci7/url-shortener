using UrlShortener.Application.DTOs.Clicks;

namespace UrlShortener.Application.Interfaces.Services;

public interface IClickTrackingService
{
    Task RecordClickAsync(RecordClickDto dto, CancellationToken cancellationToken = default);
}