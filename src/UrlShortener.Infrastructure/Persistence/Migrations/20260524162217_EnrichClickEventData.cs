using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UrlShortener.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class EnrichClickEventData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Browser",
                table: "ClickEvents",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BrowserVersion",
                table: "ClickEvents",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "ClickEvents",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CountryName",
                table: "ClickEvents",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OperatingSystem",
                table: "ClickEvents",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OsVersion",
                table: "ClickEvents",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Browser",
                table: "ClickEvents");

            migrationBuilder.DropColumn(
                name: "BrowserVersion",
                table: "ClickEvents");

            migrationBuilder.DropColumn(
                name: "City",
                table: "ClickEvents");

            migrationBuilder.DropColumn(
                name: "CountryName",
                table: "ClickEvents");

            migrationBuilder.DropColumn(
                name: "OperatingSystem",
                table: "ClickEvents");

            migrationBuilder.DropColumn(
                name: "OsVersion",
                table: "ClickEvents");
        }
    }
}
