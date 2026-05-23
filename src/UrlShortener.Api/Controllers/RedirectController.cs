using Microsoft.AspNetCore.Mvc;
using UrlShortener.Application.DTOs.Clicks;
using UrlShortener.Application.Interfaces.Services;

namespace UrlShortener.Api.Controllers;

[ApiController]
public class RedirectController : ControllerBase
{
    private readonly IUrlShortenerService _urlShortenerService;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<RedirectController> _logger;

    public RedirectController(
        IUrlShortenerService urlShortenerService,
        IServiceScopeFactory scopeFactory,
        ILogger<RedirectController> logger)
    {
        _urlShortenerService = urlShortenerService;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    [HttpGet("/{shortCode}")]
    public async Task<IActionResult> RedirectToOriginal(
        string shortCode,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(shortCode) || shortCode.Length < 4)
            return NotFound();

        var result = await _urlShortenerService.ResolveAsync(shortCode, cancellationToken);

        if (result is null)
        {
            _logger.LogInformation("Short code {ShortCode} not found", shortCode);
            return NotFound();
        }

        // Click tracking için gerekli veriyi topla
        var clickDto = new RecordClickDto
        {
            ShortUrlId = result.ShortUrlId,
            IpAddress = GetClientIpAddress(),
            UserAgent = Request.Headers.UserAgent.ToString(),
            Referrer = Request.Headers.Referer.ToString()
        };

        // Fire-and-forget: kendi DI scope'umuzla
        var scopeFactory = _scopeFactory;
        var logger = _logger;

        _ = Task.Run(async () =>
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var clickTrackingService = scope.ServiceProvider.GetRequiredService<IClickTrackingService>();
                await clickTrackingService.RecordClickAsync(clickDto, CancellationToken.None);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to record click for {ShortUrlId}", clickDto.ShortUrlId);
            }
        }, CancellationToken.None);

        return Redirect(result.OriginalUrl);
    }

    private string GetClientIpAddress()
    {
        var forwarded = Request.Headers["X-Forwarded-For"].ToString();
        if (!string.IsNullOrEmpty(forwarded))
            return forwarded.Split(',')[0].Trim();

        return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}