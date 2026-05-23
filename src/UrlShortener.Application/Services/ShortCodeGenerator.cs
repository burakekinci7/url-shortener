using System.Security.Cryptography;
using UrlShortener.Application.Interfaces.Services;

namespace UrlShortener.Application.Services;

public class ShortCodeGenerator : IShortCodeGenerator
{
    private const string AllowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public string Generate(int length = 6)
    {
        if (length < 1 || length > 20)
            throw new ArgumentOutOfRangeException(nameof(length), "Length must be between 1 and 20.");

        var result = new char[length];
        var bytes = RandomNumberGenerator.GetBytes(length);

        for (int i = 0; i < length; i++)
        {
            result[i] = AllowedChars[bytes[i] % AllowedChars.Length];
        }

        return new string(result);
    }
}