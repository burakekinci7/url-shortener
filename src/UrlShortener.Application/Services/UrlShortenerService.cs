using Microsoft.Extensions.Configuration;
using UrlShortener.Application.DTOs.ShortUrls;
using UrlShortener.Application.Interfaces.Repositories;
using UrlShortener.Application.Interfaces.Services;
using UrlShortener.Domain.Entities;

namespace UrlShortener.Application.Services;

public class UrlShortenerService : IUrlShortenerService
{
    private readonly IShortUrlRepository _shortUrlRepository;
    private readonly IShortCodeGenerator _shortCodeGenerator;
    private readonly IConfiguration _configuration;

    private const int MaxGenerationAttempts = 5;
    private const int DefaultShortCodeLength = 6;

    public UrlShortenerService(
        IShortUrlRepository shortUrlRepository,
        IShortCodeGenerator shortCodeGenerator,
        IConfiguration configuration)
    {
        _shortUrlRepository = shortUrlRepository;
        _shortCodeGenerator = shortCodeGenerator;
        _configuration = configuration;
    }

    public async Task<ShortUrlResponseDto> CreateAsync(
    CreateShortUrlDto dto,
    Guid? userId,  // nullable
    CancellationToken cancellationToken = default)
{
    var shortCode = await GenerateUniqueShortCodeAsync(cancellationToken);

    var shortUrl = new ShortUrl
    {
        ShortCode = shortCode,
        OriginalUrl = dto.OriginalUrl,
        UserId = userId,  // null olabilir
        ExpiresAt = dto.ExpiresAt
    };

    await _shortUrlRepository.AddAsync(shortUrl, cancellationToken);
    await _shortUrlRepository.SaveChangesAsync(cancellationToken);

    return MapToDto(shortUrl);
}

    public async Task<ShortUrlResponseDto?> GetByIdAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var shortUrl = await _shortUrlRepository.GetByIdAsync(id, cancellationToken);

        // Authorization: başka kullanıcının linkine erişim yok
        if (shortUrl == null || shortUrl.UserId != userId || !shortUrl.IsActive)
            return null;

        return MapToDto(shortUrl);
    }

    public async Task<IReadOnlyList<ShortUrlResponseDto>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var shortUrls = await _shortUrlRepository.GetByUserIdAsync(userId, cancellationToken);
        return shortUrls.Select(MapToDto).ToList();
    }

    public async Task<ResolveResultDto?> ResolveAsync(
    string shortCode,
    CancellationToken cancellationToken = default)
{
    var shortUrl = await _shortUrlRepository.GetByShortCodeAsync(shortCode, cancellationToken);

    if (shortUrl == null)
        return null;

    // Expired link kontrolü
    if (shortUrl.ExpiresAt.HasValue && shortUrl.ExpiresAt.Value < DateTime.UtcNow)
        return null;

    return new ResolveResultDto
    {
        ShortUrlId = shortUrl.Id,
        OriginalUrl = shortUrl.OriginalUrl
    };
}

    public async Task<bool> DeleteAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var shortUrl = await _shortUrlRepository.GetByIdAsync(id, cancellationToken);

        if (shortUrl == null || shortUrl.UserId != userId)
            return false;

        // Soft delete
        shortUrl.IsActive = false;
        _shortUrlRepository.Update(shortUrl);
        await _shortUrlRepository.SaveChangesAsync(cancellationToken);

        return true;
    }

    private async Task<string> GenerateUniqueShortCodeAsync(CancellationToken cancellationToken)
    {
        for (int attempt = 0; attempt < MaxGenerationAttempts; attempt++)
        {
            var code = _shortCodeGenerator.Generate(DefaultShortCodeLength);
            var exists = await _shortUrlRepository.ShortCodeExistsAsync(code, cancellationToken);

            if (!exists)
                return code;
        }

        throw new InvalidOperationException(
            $"Could not generate a unique short code after {MaxGenerationAttempts} attempts.");
    }

    private ShortUrlResponseDto MapToDto(ShortUrl shortUrl)
    {
        var baseUrl = _configuration["AppSettings:BaseUrl"] ?? "https://localhost:5001";

        return new ShortUrlResponseDto
        {
            Id = shortUrl.Id,
            ShortCode = shortUrl.ShortCode,
            ShortUrl = $"{baseUrl}/{shortUrl.ShortCode}",
            OriginalUrl = shortUrl.OriginalUrl,
            CreatedAt = shortUrl.CreatedAt,
            ExpiresAt = shortUrl.ExpiresAt,
            ClickCount = shortUrl.ClickCount
        };
    }
}