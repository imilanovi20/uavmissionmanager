using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UAV_Mission_Manager_DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddWeatehrDataForMission : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WeatherData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MissionId = table.Column<int>(type: "int", nullable: false),
                    Temperature = table.Column<double>(type: "float(5)", precision: 5, scale: 2, nullable: false),
                    WindSpeed = table.Column<double>(type: "float(5)", precision: 5, scale: 2, nullable: false),
                    WindDirection = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Conditions = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Humidity = table.Column<double>(type: "float(5)", precision: 5, scale: 2, nullable: false),
                    Visibility = table.Column<double>(type: "float(6)", precision: 6, scale: 2, nullable: false),
                    IsSafeForFlight = table.Column<bool>(type: "bit", nullable: false),
                    FetchedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WeatherCode = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeatherData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WeatherData_Missions_MissionId",
                        column: x => x.MissionId,
                        principalTable: "Missions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WeatherData_MissionId",
                table: "WeatherData",
                column: "MissionId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WeatherData");
        }
    }
}
