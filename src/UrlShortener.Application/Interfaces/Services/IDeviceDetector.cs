namespace UrlShortener.Application.Interfaces.Services;

public record UserAgentInfo(
    string DeviceType,
    string? Browser,
    string? BrowserVersion,
    string? OperatingSystem,
    string? OsVersion);

public interface IDeviceDetector
{
    UserAgentInfo Parse(string userAgent);
}