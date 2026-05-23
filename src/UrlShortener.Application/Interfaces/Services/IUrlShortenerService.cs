using UrlShortener.Application.DTOs.ShortUrls;

namespace UrlShortener.Application.Interfaces.Services;

public interface IUrlShortenerService
{
    Task<ShortUrlResponseDto> CreateAsync(
    CreateShortUrlDto dto,
    Guid? userId,  // nullable artık
    CancellationToken cancellationToken = default);

    Task<ShortUrlResponseDto?> GetByIdAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ShortUrlResponseDto>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<ResolveResultDto?> ResolveAsync(
    string shortCode,
    CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken = default);
}