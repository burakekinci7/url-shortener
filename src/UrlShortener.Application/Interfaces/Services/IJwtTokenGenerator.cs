using UrlShortener.Domain.Entities;

namespace UrlShortener.Application.Interfaces.Services;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
    DateTime GetTokenExpiration();
}