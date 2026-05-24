namespace UrlShortener.Application.Interfaces.Services;

public record GeoIpInfo(
    string? CountryCode,
    string? CountryName,
    string? City);

public interface IGeoIpService
{
    Task<GeoIpInfo> LookupAsync(string ipAddress, CancellationToken cancellationToken = default);
}