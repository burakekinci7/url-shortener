using UrlShortener.Application.DTOs.Auth;
using UrlShortener.Application.Interfaces.Repositories;
using UrlShortener.Application.Interfaces.Services;
using UrlShortener.Domain.Entities;

namespace UrlShortener.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponseDto?> RegisterAsync(
        RegisterDto dto,
        CancellationToken cancellationToken = default)
    {
        // Email kontrolü
        var emailExists = await _userRepository.EmailExistsAsync(dto.Email, cancellationToken);
        if (emailExists)
            return null;

        // Şifreyi hash'le
        var passwordHash = _passwordHasher.Hash(dto.Password);

        // User yarat
        var user = new User
        {
            Email = dto.Email.ToLowerInvariant(),
            PasswordHash = passwordHash
        };

        await _userRepository.AddAsync(user, cancellationToken);
        await _userRepository.SaveChangesAsync(cancellationToken);

        // Token üret ve dön
        return BuildAuthResponse(user);
    }

    public async Task<AuthResponseDto?> LoginAsync(
        LoginDto dto,
        CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(
            dto.Email.ToLowerInvariant(),
            cancellationToken);

        if (user == null)
            return null;

        var isValid = _passwordHasher.Verify(dto.Password, user.PasswordHash);
        if (!isValid)
            return null;

        return BuildAuthResponse(user);
    }

    private AuthResponseDto BuildAuthResponse(User user)
    {
        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            ExpiresAt = _jwtTokenGenerator.GetTokenExpiration(),
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email
            }
        };
    }
}