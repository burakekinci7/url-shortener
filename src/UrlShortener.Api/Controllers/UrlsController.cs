using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UrlShortener.Application.DTOs.ShortUrls;
using UrlShortener.Application.DTOs.Stats;
using UrlShortener.Application.Interfaces.Services;

namespace UrlShortener.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]  // Default: tüm endpoint'ler korumalı
public class UrlsController : ControllerBase
{
    private readonly IUrlShortenerService _urlShortenerService;
    private readonly IStatsService _statsService;

    public UrlsController(
        IUrlShortenerService urlShortenerService,
        IStatsService statsService)
    {
        _urlShortenerService = urlShortenerService;
        _statsService = statsService;
    }

    /// <summary>
    /// Create a short URL. Works both anonymously and authenticated.
    /// </summary>
    [HttpPost]
    [AllowAnonymous]  // Bu endpoint istisna — anonim kullanım için
    public async Task<ActionResult<ShortUrlResponseDto>> Create(
        [FromBody] CreateShortUrlDto dto,
        CancellationToken cancellationToken)
    {
        var userId = TryGetCurrentUserId();  // null olabilir
        var result = await _urlShortenerService.CreateAsync(dto, userId, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ShortUrlResponseDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var result = await _urlShortenerService.GetByIdAsync(id, userId, cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ShortUrlResponseDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var result = await _urlShortenerService.GetByUserIdAsync(userId, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}/stats")]
    public async Task<ActionResult<UrlStatsDto>> GetStats(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var result = await _statsService.GetStatsAsync(id, userId, cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var success = await _urlShortenerService.DeleteAsync(id, userId, cancellationToken);
        return success ? NoContent() : NotFound();
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value
            ?? throw new UnauthorizedAccessException("User ID claim not found in token.");

        return Guid.Parse(userIdClaim);
    }

    private Guid? TryGetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            return null;

        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}