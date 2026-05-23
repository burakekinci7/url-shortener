using Microsoft.AspNetCore.Mvc;
using UrlShortener.Application.DTOs.ShortUrls;
using UrlShortener.Application.Interfaces.Services;

namespace UrlShortener.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UrlsController : ControllerBase
{
    private readonly IUrlShortenerService _urlShortenerService;

    // GEÇİCİ: Auth eklenince JWT'den çıkaracağız.
    private static readonly Guid TempUserId = Guid.Parse("11111111-1111-1111-1111-111111111111");

    public UrlsController(IUrlShortenerService urlShortenerService)
    {
        _urlShortenerService = urlShortenerService;
    }

    [HttpPost]
    public async Task<ActionResult<ShortUrlResponseDto>> Create(
        [FromBody] CreateShortUrlDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _urlShortenerService.CreateAsync(dto, TempUserId, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ShortUrlResponseDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _urlShortenerService.GetByIdAsync(id, TempUserId, cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ShortUrlResponseDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        var result = await _urlShortenerService.GetByUserIdAsync(TempUserId, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var success = await _urlShortenerService.DeleteAsync(id, TempUserId, cancellationToken);
        return success ? NoContent() : NotFound();
    }
}