using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UAV_Mission_Manager_DAL.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWeatherData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Conditions",
                table: "WeatherData");

            migrationBuilder.DropColumn(
                name: "Humidity",
                table: "WeatherData");

            migrationBuilder.DropColumn(
                name: "Visibility",
                table: "WeatherData");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Conditions",
                table: "WeatherData",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Humidity",
                table: "WeatherData",
                type: "float(5)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Visibility",
                table: "WeatherData",
                type: "float(6)",
                precision: 6,
                scale: 2,
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
