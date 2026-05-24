using UAParser;
using UrlShortener.Application.Interfaces.Services;

namespace UrlShortener.Infrastructure.Parsing;

public class DeviceDetector : IDeviceDetector
{
    private static readonly Parser UaParser = Parser.GetDefault();

    public UserAgentInfo Parse(string userAgent)
    {
        if (string.IsNullOrWhiteSpace(userAgent))
            return new UserAgentInfo("Unknown", null, null, null, null);

        var ua = userAgent.ToLowerInvariant();

        // Bot kontrolü
        if (ua.Contains("bot") || ua.Contains("crawler") || ua.Contains("spider"))
            return new UserAgentInfo("Bot", null, null, null, null);

        var parsed = UaParser.Parse(userAgent);

        // Device type
        string deviceType;
        if (ua.Contains("ipad") || ua.Contains("tablet"))
            deviceType = "Tablet";
        else if (ua.Contains("mobile") || ua.Contains("android") || ua.Contains("iphone"))
            deviceType = "Mobile";
        else
            deviceType = "Desktop";

        return new UserAgentInfo(
            DeviceType: deviceType,
            Browser: parsed.UA.Family,                          // "Chrome", "Safari"
            BrowserVersion: $"{parsed.UA.Major}.{parsed.UA.Minor}",  // "120.0"
            OperatingSystem: parsed.OS.Family,                   // "Windows", "Mac OS X"
            OsVersion: $"{parsed.OS.Major}.{parsed.OS.Minor}"       // "11.0"
        );
    }
}