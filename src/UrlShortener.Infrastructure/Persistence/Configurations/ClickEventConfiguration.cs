using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UrlShortener.Domain.Entities;

namespace UrlShortener.Infrastructure.Persistence.Configurations;

public class ClickEventConfiguration : IEntityTypeConfiguration<ClickEvent>
{
    public void Configure(EntityTypeBuilder<ClickEvent> builder)
    {
        builder.ToTable("ClickEvents");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.ClickedAt)
            .IsRequired();

        builder.Property(c => c.IpAddress)
            .IsRequired()
            .HasMaxLength(45); // IPv6 max length

        builder.Property(c => c.UserAgent)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(c => c.Referrer)
            .HasMaxLength(2048);

        builder.Property(c => c.Country)
            .HasMaxLength(2); // ISO 3166-1 alpha-2 (TR, US, DE)

        builder.Property(c => c.DeviceType)
            .HasMaxLength(20);

        // Analytics sorguları hızlı olsun
        builder.HasIndex(c => c.ShortUrlId);
        builder.HasIndex(c => c.ClickedAt);
    }
}