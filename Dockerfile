# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Önce csproj dosyalarını kopyala (Docker layer caching için)
COPY src/UrlShortener.Domain/*.csproj src/UrlShortener.Domain/
COPY src/UrlShortener.Application/*.csproj src/UrlShortener.Application/
COPY src/UrlShortener.Infrastructure/*.csproj src/UrlShortener.Infrastructure/
COPY src/UrlShortener.Api/*.csproj src/UrlShortener.Api/

# Bağımlılıkları restore et
RUN dotnet restore src/UrlShortener.Api/UrlShortener.Api.csproj

# Tüm src klasörünü kopyala
COPY src/ src/


# Build + publish (Release)
RUN dotnet publish src/UrlShortener.Api/UrlShortener.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# Runtime stage (daha küçük image)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Render PORT environment variable ile gelir
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080}

EXPOSE 8080

ENTRYPOINT ["dotnet", "UrlShortener.Api.dll"]