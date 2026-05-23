namespace UrlShortener.Application.Interfaces.Services;

public interface IShortCodeGenerator
{
    string Generate(int length = 6);
}