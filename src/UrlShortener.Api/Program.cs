using Microsoft.EntityFrameworkCore;
using UrlShortener.Infrastructure.Persistence;
using UrlShortener.Application.Interfaces.Repositories;
using UrlShortener.Infrastructure.Persistence.Repositories;
using UrlShortener.Application.Interfaces.Services;
using UrlShortener.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// PostgreSQL DbContext kayıt
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Web API services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IShortUrlRepository, ShortUrlRepository>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Application Services
builder.Services.AddScoped<IShortCodeGenerator, ShortCodeGenerator>();
builder.Services.AddScoped<IUrlShortenerService, UrlShortenerService>();

// Application Services
builder.Services.AddScoped<IShortCodeGenerator, ShortCodeGenerator>();
builder.Services.AddScoped<IUrlShortenerService, UrlShortenerService>();
builder.Services.AddScoped<IDeviceDetector, DeviceDetector>();
builder.Services.AddScoped<IClickTrackingService, ClickTrackingService>();
builder.Services.AddScoped<IStatsService, StatsService>();

var app = builder.Build();

// HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();