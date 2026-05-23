using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UrlShortener.Domain.Entities;

namespace UrlShortener.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(u => u.PasswordHash)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(u => u.CreatedAt)
            .IsRequired();

        // Email unique olmalı (aynı email ile iki kayıt olmasın)
        builder.HasIndex(u => u.Email)
            .IsUnique();

        // 1-N ilişki: User → ShortUrls (UserId nullable artık)
        builder.HasMany(u => u.ShortUrls)
            .WithOne(s => s.User)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.SetNull);  // Cascade yerine SetNull
    }
}