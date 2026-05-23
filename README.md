# URL Shortener with Analytics

> Production-ready URL shortening service with click tracking, analytics, and JWT authentication. Built with ASP.NET Core 10, PostgreSQL, and Clean Architecture.

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat&logo=dotnet)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A learning project demonstrating modern .NET API development practices: Clean Architecture, JWT authentication, EF Core migrations, Repository pattern, and asynchronous background processing.

---

## Features

- **URL shortening** with cryptographically secure 6-character codes (~56 billion combinations)
- **Click tracking** with async background processing (non-blocking redirects)
- **Analytics dashboard data** — clicks by day, device type, country
- **JWT authentication** with BCrypt password hashing (work factor 12)
- **User isolation** — each user can only see and manage their own URLs
- **Soft delete** — disabled links return 404 but preserve historical click data
- **Link expiration** — optional `expiresAt` field
- **Device detection** — Mobile / Desktop / Tablet / Bot from User-Agent
- **REST API** with Swagger UI and JWT support
- **Structured logging** with ILogger

---

## Tech Stack

| Layer            | Technology                                         |
|------------------|----------------------------------------------------|
| Runtime          | .NET 10 LTS                                        |
| Framework        | ASP.NET Core Web API                               |
| Database         | PostgreSQL 16                                      |
| ORM              | Entity Framework Core 10 with Npgsql provider     |
| Authentication   | JWT Bearer + BCrypt.Net-Next                       |
| Documentation    | Swashbuckle.AspNetCore 10 (Swagger UI)             |
| Logging          | Microsoft.Extensions.Logging                       |
| Testing          | xUnit, Moq, FluentAssertions, Testcontainers       |

---

## Architecture

The project follows **Clean Architecture** principles with strict dependency rules:

```mermaid
graph TB
    API[API Layer<br/>Controllers, Program.cs, Middleware]
    INFRA[Infrastructure<br/>EF Core, Repositories, JWT, BCrypt]
    APP[Application<br/>Services, DTOs, Interfaces]
    DOMAIN[Domain<br/>Entities: User, ShortUrl, ClickEvent]

    API --> APP
    API --> INFRA
    INFRA --> APP
    INFRA --> DOMAIN
    APP --> DOMAIN

    style DOMAIN fill:#FAECE7,stroke:#993C1D
    style APP fill:#E1F5EE,stroke:#0F6E56
    style INFRA fill:#EEEDFE,stroke:#534AB7
    style API fill:#E6F1FB,stroke:#185FA5
```

**Dependency rule:** dependencies only point inward toward Domain. Domain depends on nothing.

---

## Project Structure
url-shortener/
├── src/
│   ├── UrlShortener.Domain/          # Entities, enums (no external dependencies)
│   ├── UrlShortener.Application/      # Business logic, interfaces, DTOs
│   ├── UrlShortener.Infrastructure/   # EF Core, JWT, BCrypt, repositories
│   └── UrlShortener.Api/              # Controllers, Program.cs, Swagger
├── tests/
│   ├── UrlShortener.UnitTests/
│   └── UrlShortener.IntegrationTests/
└── README.md

---

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [PostgreSQL 16+](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

### Setup

1. **Clone the repository**

```bash
   git clone https://github.com/burakekinci7/url-shortener.git
   cd url-shortener
```

2. **Create the database**

   In `psql` or pgAdmin, create a database named `urlshortener_dev`:

```sql
   CREATE DATABASE urlshortener_dev;
```

3. **Configure connection string**

   Copy `src/UrlShortener.Api/appsettings.json.example` to `src/UrlShortener.Api/appsettings.Development.json` and fill in your PostgreSQL credentials:

```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=urlshortener_dev;Username=postgres;Password=YOUR_PASSWORD"
     }
   }
```

4. **Apply database migrations**

```bash
   dotnet ef database update \
     --project src/UrlShortener.Infrastructure \
     --startup-project src/UrlShortener.Api
```

5. **Run the API**

```bash
   dotnet run --project src/UrlShortener.Api
```

6. **Open Swagger UI**

   Navigate to `http://localhost:5287/swagger`

---

## API Usage

### 1. Register a user

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

Response includes a JWT token. Use it for subsequent requests:


### 2. Create a short URL

```http
POST /api/urls
Authorization: Bearer <token>
Content-Type: application/json

{
  "originalUrl": "https://www.example.com/very/long/url",
  "expiresAt": null
}
```

### 3. Visit the short URL

Open `http://localhost:5287/{shortCode}` in your browser. You'll be redirected to the original URL, and the click will be tracked asynchronously.

### 4. View analytics

```http
GET /api/urls/{id}/stats
Authorization: Bearer <token>
```

Returns total clicks, daily breakdown, device distribution, and country distribution.

---

## Endpoint Reference

| Method | Endpoint                       | Auth | Description                       |
|--------|--------------------------------|------|-----------------------------------|
| POST   | `/api/auth/register`           | —    | Register a new user               |
| POST   | `/api/auth/login`              | —    | Login, returns JWT token          |
| POST   | `/api/urls`                    | ✓    | Create a short URL                |
| GET    | `/api/urls`                    | ✓    | List user's URLs                  |
| GET    | `/api/urls/{id}`               | ✓    | Get URL details                   |
| GET    | `/api/urls/{id}/stats`         | ✓    | Get analytics for a URL           |
| DELETE | `/api/urls/{id}`               | ✓    | Soft-delete a URL                 |
| GET    | `/{shortCode}`                 | —    | Redirect to original URL + track  |

---

## Key Design Decisions

### Clean Architecture with strict dependency rules
Domain has zero external dependencies. Application defines interfaces (`IUserRepository`, `IJwtTokenGenerator`) that Infrastructure implements. This enables testing services without touching the database and swapping implementations (e.g., PostgreSQL to MongoDB) without changing business logic.

### Cryptographically secure short codes
`ShortCodeGenerator` uses `RandomNumberGenerator.GetBytes()` instead of `new Random()`. Predictable codes would allow attackers to enumerate links and hijack traffic. With 62 alphabet × 6 length = ~56 billion combinations, collisions are statistically negligible, but a unique constraint on `ShortCode` is still enforced.

### Fire-and-forget click tracking with IServiceScopeFactory
Click tracking happens **after** the HTTP redirect returns, in a background `Task.Run`. The first naïve implementation injected `IClickTrackingService` directly, which caused `ObjectDisposedException` because the request's DI scope was torn down before the task ran. The fix: inject `IServiceScopeFactory` (singleton), create a fresh scope inside the background task, and resolve the service from that scope. This pattern is essential for any background work that needs scoped services.

### Soft delete for URLs
Deleting a URL sets `IsActive = false` rather than removing the row. Historical click events stay intact for analytics, and existing inbound links return 404 (not stale redirects). The trade-off: storage grows over time, mitigated by indexing `IsActive` in queries.

### ClickCount denormalization
Each click increments `ShortUrls.ClickCount` directly, rather than computing `COUNT(*)` from `ClickEvents` on every analytics request. This makes the URL list endpoint O(1) per row instead of O(N) per row. The trade-off: a small consistency risk under high concurrency (currently mitigated by single-process deployment; future improvement noted below).

### Authorization at the service layer
Every `GetByIdAsync`, `DeleteAsync`, etc. takes a `userId` parameter and verifies ownership before returning data. This means authorization is enforced even if a controller forgets to check — defense in depth.

---

## Future Improvements

- **Redis caching** for short code lookups (currently every redirect hits the database)
- **Rate limiting** to prevent abuse of URL creation
- **Optimistic concurrency** on `ClickCount` updates (atomic `UPDATE ... SET ClickCount = ClickCount + 1`)
- **GeoIP integration** (MaxMind GeoLite2) to populate `Country` from IP
- **Refresh tokens** with shorter access token lifetime
- **Custom short codes** (user-selected slugs like `short.ly/my-link`)
- **Bulk operations** (CSV import of URLs)
- **Frontend** (React dashboard for managing URLs and viewing analytics)
- **Docker** + docker-compose for one-command setup
- **CI/CD** with GitHub Actions (build, test, deploy)
- **Background job queue** (replace `Task.Run` with proper queue using Channels or Hangfire)

---

## What I Learned Building This

- **Clean Architecture in practice**: Understanding why each layer exists, not just memorizing the structure.
- **DbContext lifetime management**: Scoped services in background tasks require fresh scopes — debugging `ObjectDisposedException` taught me this.
- **Package version compatibility**: .NET 10 + Swashbuckle 10 had breaking changes from older versions (`Microsoft.OpenApi.Models` namespace moved). Resolved by reading the official migration guide.
- **JWT internals**: Claims, signing keys, validation parameters, and the importance of `ClockSkew = TimeSpan.Zero`.
- **Async patterns**: When to use `CancellationToken.None` for fire-and-forget vs propagating the request's token.

---

## License

MIT — see [LICENSE](LICENSE) for details.