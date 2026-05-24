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
    private readonly IGeoIpService _geoIpService;

    public ClickTrackingService(
        IRepository<ClickEvent> clickEventRepository,
        IShortUrlRepository shortUrlRepository,
        IDeviceDetector deviceDetector,
        IGeoIpService geoIpService)
    {
        _clickEventRepository = clickEventRepository;
        _shortUrlRepository = shortUrlRepository;
        _deviceDetector = deviceDetector;
        _geoIpService = geoIpService;
    }

    public async Task RecordClickAsync(
        RecordClickDto dto,
        CancellationToken cancellationToken = default)
    {
        // UserAgent parse
        var uaInfo = _deviceDetector.Parse(dto.UserAgent);

        // GeoIP lookup
        var geo = await _geoIpService.LookupAsync(dto.IpAddress, cancellationToken);

        // ClickEvent oluştur
        var click = new ClickEvent
        {
            ShortUrlId = dto.ShortUrlId,
            IpAddress = dto.IpAddress,
            UserAgent = dto.UserAgent,
            Referrer = dto.Referrer,

            // Device info
            DeviceType = uaInfo.DeviceType,
            Browser = uaInfo.Browser,
            BrowserVersion = uaInfo.BrowserVersion,
            OperatingSystem = uaInfo.OperatingSystem,
            OsVersion = uaInfo.OsVersion,

            // GeoIP
            Country = geo.CountryCode,
            CountryName = geo.CountryName,
            City = geo.City
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