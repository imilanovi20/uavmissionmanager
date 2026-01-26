using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UAV_Mission_Manager_DAL.Migrations
{
    /// <inheritdoc />
    public partial class UpgradeMissonObstacle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WeatherData");

            migrationBuilder.DropColumn(
                name: "LocationLat",
                table: "Missions");

            migrationBuilder.RenameColumn(
                name: "LocationLon",
                table: "Missions",
                newName: "HeviestUAV");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByUsername",
                table: "Missions",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "CrossesAirspace",
                table: "Missions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "CrossesAirspaceMessage",
                table: "Missions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FlightTimeUAV",
                table: "Missions",
                type: "NVARCHAR(MAX)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsRecordingPermissionRequired",
                table: "Missions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsSafeForFlight",
                table: "Missions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OperationCategory",
                table: "Missions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OptimalRoute",
                table: "Missions",
                type: "NVARCHAR(MAX)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProjectedFlightTime",
                table: "Missions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Temperature",
                table: "Missions",
                type: "DECIMAL(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "UAVOperationClass",
                table: "Missions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Violations",
                table: "Missions",
                type: "NVARCHAR(MAX)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WeatherCode",
                table: "Missions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WindDirection",
                table: "Missions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "WindSpeed",
                table: "Missions",
                type: "DECIMAL(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "ZoneOperationClass",
                table: "Missions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Obstacles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CoordinateHash = table.Column<string>(type: "VARCHAR(32)", maxLength: 32, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Coordinate = table.Column<string>(type: "NVARCHAR(MAX)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Obstacles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MissionObstacles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MissionId = table.Column<int>(type: "int", nullable: false),
                    ObstacleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MissionObstacles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MissionObstacles_Missions_MissionId",
                        column: x => x.MissionId,
                        principalTable: "Missions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MissionObstacles_Obstacles_ObstacleId",
                        column: x => x.ObstacleId,
                        principalTable: "Obstacles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Missions_CreatedByUsername",
                table: "Missions",
                column: "CreatedByUsername");

            migrationBuilder.CreateIndex(
                name: "IX_MissionObstacles_MissionId_ObstacleId",
                table: "MissionObstacles",
                columns: new[] { "MissionId", "ObstacleId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MissionObstacles_ObstacleId",
                table: "MissionObstacles",
                column: "ObstacleId");

            migrationBuilder.CreateIndex(
                name: "IX_Obstacles_CoordinateHash",
                table: "Obstacles",
                column: "CoordinateHash",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Missions_Users_CreatedByUsername",
                table: "Missions",
                column: "CreatedByUsername",
                principalTable: "Users",
                principalColumn: "Username",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Missions_Users_CreatedByUsername",
                table: "Missions");

            migrationBuilder.DropTable(
                name: "MissionObstacles");

            migrationBuilder.DropTable(
                name: "Obstacles");

            migrationBuilder.DropIndex(
                name: "IX_Missions_CreatedByUsername",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "CreatedByUsername",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "CrossesAirspace",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "CrossesAirspaceMessage",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "FlightTimeUAV",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "IsRecordingPermissionRequired",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "IsSafeForFlight",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "OperationCategory",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "OptimalRoute",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "ProjectedFlightTime",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "Temperature",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "UAVOperationClass",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "Violations",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "WeatherCode",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "WindDirection",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "WindSpeed",
                table: "Missions");

            migrationBuilder.DropColumn(
                name: "ZoneOperationClass",
                table: "Missions");

            migrationBuilder.RenameColumn(
                name: "HeviestUAV",
                table: "Missions",
                newName: "LocationLon");

            migrationBuilder.AddColumn<double>(
                name: "LocationLat",
                table: "Missions",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateTable(
                name: "WeatherData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MissionId = table.Column<int>(type: "int", nullable: false),
                    FetchedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsSafeForFlight = table.Column<bool>(type: "bit", nullable: false),
                    Temperature = table.Column<double>(type: "float(5)", precision: 5, scale: 2, nullable: false),
                    WeatherCode = table.Column<int>(type: "int", nullable: false),
                    WindDirection = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    WindSpeed = table.Column<double>(type: "float(5)", precision: 5, scale: 2, nullable: false)
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
    }
}
