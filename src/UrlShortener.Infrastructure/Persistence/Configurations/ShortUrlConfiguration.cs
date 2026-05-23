using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UrlShortener.Domain.Entities;

namespace UrlShortener.Infrastructure.Persistence.Configurations;

public class ShortUrlConfiguration : IEntityTypeConfiguration<ShortUrl>
{
    public void Configure(EntityTypeBuilder<ShortUrl> builder)
    {
        builder.ToTable("ShortUrls");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.ShortCode)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(s => s.OriginalUrl)
            .IsRequired()
            .HasMaxLength(2048);

        builder.Property(s => s.CreatedAt)
            .IsRequired();

        builder.Property(s => s.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(s => s.ClickCount)
            .IsRequired()
            .HasDefaultValue(0);

        // ShortCode unique ve indexed (en sık sorgulanan alan)
        builder.HasIndex(s => s.ShortCode)
            .IsUnique();

        // UserId üzerinde index (kullanıcının linklerini listelemek için)
        builder.HasIndex(s => s.UserId);

        // 1-N: ShortUrl → ClickEvents
        builder.HasMany(s => s.ClickEvents)
            .WithOne(c => c.ShortUrl)
            .HasForeignKey(c => c.ShortUrlId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}