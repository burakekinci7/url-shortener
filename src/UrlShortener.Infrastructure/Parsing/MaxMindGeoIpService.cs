using System.Net;
using MaxMind.GeoIP2;
using Microsoft.Extensions.Logging;
using UrlShortener.Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;

namespace UrlShortener.Infrastructure.Parsing;

public class MaxMindGeoIpService : IGeoIpService, IDisposable
{
    private readonly DatabaseReader? _reader;
    private readonly ILogger<MaxMindGeoIpService> _logger;

    public MaxMindGeoIpService(
        IConfiguration configuration,
        ILogger<MaxMindGeoIpService> logger)
    {
        _logger = logger;
        var dbPath = configuration["GeoIp:DatabasePath"] ?? "GeoLite2-City.mmdb";

        try
        {
            if (File.Exists(dbPath))
            {
                _reader = new DatabaseReader(dbPath);
                _logger.LogInformation("MaxMind GeoIP database loaded from {DbPath}", dbPath);
            }
            else
            {
                _logger.LogWarning("MaxMind database not found at {DbPath}. GeoIP lookups will return null.", dbPath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to load MaxMind GeoIP database");
        }
    }

    public Task<GeoIpInfo> LookupAsync(string ipAddress, CancellationToken cancellationToken = default)
    {
        if (_reader == null || string.IsNullOrWhiteSpace(ipAddress))
            return Task.FromResult(new GeoIpInfo(null, null, null));

        // Localhost / private IP'leri atla
        if (ipAddress == "::1" || ipAddress == "127.0.0.1" || ipAddress.StartsWith("192.168.") || ipAddress.StartsWith("10."))
            return Task.FromResult(new GeoIpInfo(null, null, null));

        try
        {
            if (!IPAddress.TryParse(ipAddress, out var parsedIp))
                return Task.FromResult(new GeoIpInfo(null, null, null));

            var response = _reader.City(parsedIp);

            return Task.FromResult(new GeoIpInfo(
                CountryCode: response.Country?.IsoCode,
                CountryName: response.Country?.Name,
                City: response.City?.Name
            ));
        }
        catch (MaxMind.GeoIP2.Exceptions.AddressNotFoundException)
        {
            // IP veritabanında yok, normal
            return Task.FromResult(new GeoIpInfo(null, null, null));
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "GeoIP lookup failed for {IpAddress}", ipAddress);
            return Task.FromResult(new GeoIpInfo(null, null, null));
        }
    }

    public void Dispose()
    {
        _reader?.Dispose();
        GC.SuppressFinalize(this);
    }
}