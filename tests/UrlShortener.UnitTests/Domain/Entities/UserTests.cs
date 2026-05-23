using FluentAssertions;
using UrlShortener.Domain.Entities;

namespace UrlShortener.UnitTests.Domain.Entities;

public class UserTests
{
    [Fact]
    public void User_WhenCreated_ShouldHaveUniqueId()
    {
        // Arrange & Act
        var user1 = new User();
        var user2 = new User();

        // Assert
        user1.Id.Should().NotBe(Guid.Empty);
        user2.Id.Should().NotBe(Guid.Empty);
        user1.Id.Should().NotBe(user2.Id);
    }

    [Fact]
    public void User_WhenCreated_ShouldHaveUtcCreatedAt()
    {
        // Arrange & Act
        var user = new User();

        // Assert
        user.CreatedAt.Kind.Should().Be(DateTimeKind.Utc);
        user.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void User_WhenCreated_ShouldHaveEmptyShortUrlsList()
    {
        // Arrange & Act
        var user = new User();

        // Assert
        user.ShortUrls.Should().NotBeNull();
        user.ShortUrls.Should().BeEmpty();
    }
}