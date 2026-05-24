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
    public List<BreakdownDto> ClicksByDevice { get; set; } = new();
    public List<BreakdownDto> ClicksByBrowser { get; set; } = new();
    public List<BreakdownDto> ClicksByOs { get; set; } = new();
    public List<BreakdownDto> ClicksByCountry { get; set; } = new();
    public List<BreakdownDto> ClicksByCity { get; set; } = new();
    public List<BreakdownDto> ClicksByReferrer { get; set; } = new();
}

public class DailyClickDto
{
    public DateOnly Date { get; set; }
    public int Count { get; set; }
}

public class BreakdownDto
{
    public string Label { get; set; } = string.Empty;
    public int Count { get; set; }
}