using UrlShortener.Application.DTOs.Clicks;
using UrlShortener.Application.Interfaces.Repositories;
using UrlShortener.Application.Interfaces.Services;
using UrlShortener.Domain.Entities;

namespace UrlShortener.Application.Services;

public class ClickTrackingService : IClickTrackingService
{
    private readonly IRepository<ClickEvent> _clickEventRepository;
    private readonly IShortUrlRepository _shortUrlRepository;
    private readonly IDeviceDetector _deviceDetector;

    public ClickTrackingService(
        IRepository<ClickEvent> clickEventRepository,
        IShortUrlRepository shortUrlRepository,
        IDeviceDetector deviceDetector)
    {
        _clickEventRepository = clickEventRepository;
        _shortUrlRepository = shortUrlRepository;
        _deviceDetector = deviceDetector;
    }

    public async Task RecordClickAsync(
        RecordClickDto dto,
        CancellationToken cancellationToken = default)
    {
        // ClickEvent oluştur
        var click = new ClickEvent
        {
            ShortUrlId = dto.ShortUrlId,
            IpAddress = dto.IpAddress,
            UserAgent = dto.UserAgent,
            Referrer = dto.Referrer,
            DeviceType = _deviceDetector.DetectDeviceType(dto.UserAgent),
            Country = null // İleride GeoIP ile dolduracağız
        };

        await _clickEventRepository.AddAsync(click, cancellationToken);

        // ShortUrl.ClickCount artır
        var shortUrl = await _shortUrlRepository.GetByIdAsync(dto.ShortUrlId, cancellationToken);
        if (shortUrl != null)
        {
            shortUrl.ClickCount++;
            _shortUrlRepository.Update(shortUrl);
        }

        await _clickEventRepository.SaveChangesAsync(cancellationToken);
    }
}