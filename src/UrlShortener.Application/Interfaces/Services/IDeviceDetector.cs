namespace UrlShortener.Application.Interfaces.Services;

public interface IDeviceDetector
{
    string DetectDeviceType(string userAgent);
}