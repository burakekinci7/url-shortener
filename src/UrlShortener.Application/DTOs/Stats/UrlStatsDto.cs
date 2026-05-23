namespace UrlShortener.Application.DTOs.Stats;

public class UrlStatsDto
{
    public Guid ShortUrlId { get; set; }
    public string ShortCode { get; set; } = string.Empty;
    public string OriginalUrl { get; set; } = string.Empty;
    public int TotalClicks { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastClickedAt { get; set; }

    public List<DailyClickDto> ClicksByDay { get; set; } = new();
    public List<DeviceClickDto> ClicksByDevice { get; set; } = new();
    public List<CountryClickDto> ClicksByCountry { get; set; } = new();
}

public class DailyClickDto
{
    public DateOnly Date { get; set; }
    public int Count { get; set; }
}

public class DeviceClickDto
{
    public string DeviceType { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class CountryClickDto
{
    public string Country { get; set; } = string.Empty;
    public int Count { get; set; }
}