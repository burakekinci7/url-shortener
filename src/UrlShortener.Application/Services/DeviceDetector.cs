using UrlShortener.Application.Interfaces.Services;

namespace UrlShortener.Application.Services;

public class DeviceDetector : IDeviceDetector
{
    public string DetectDeviceType(string userAgent)
    {
        if (string.IsNullOrWhiteSpace(userAgent))
            return "Unknown";

        var ua = userAgent.ToLowerInvariant();

        // Bot kontrolü (genelde User-Agent'ta belirtirler)
        if (ua.Contains("bot") || ua.Contains("crawler") || ua.Contains("spider"))
            return "Bot";

        // Tablet öncelikli (iPad bazen "Mobile" içerir, dikkat)
        if (ua.Contains("ipad") || ua.Contains("tablet"))
            return "Tablet";

        if (ua.Contains("mobile") || ua.Contains("android") || ua.Contains("iphone"))
            return "Mobile";

        return "Desktop";
    }
}