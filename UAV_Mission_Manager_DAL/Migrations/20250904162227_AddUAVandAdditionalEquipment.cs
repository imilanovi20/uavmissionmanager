using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UAV_Mission_Manager_DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddUAVandAdditionalEquipment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdditionalEquipments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImagePath = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdditionalEquipments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UAVs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaxSpeed = table.Column<double>(type: "float(5)", precision: 5, scale: 2, nullable: false),
                    FlightTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ImagePath = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UAVs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UAV_AdditionalEquipments",
                columns: table => new
                {
                    UAVId = table.Column<int>(type: "int", nullable: false),
                    AdditionalEquipmentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UAV_AdditionalEquipments", x => new { x.UAVId, x.AdditionalEquipmentId });
                    table.ForeignKey(
                        name: "FK_UAV_AdditionalEquipments_AdditionalEquipments_AdditionalEquipmentId",
                        column: x => x.AdditionalEquipmentId,
                        principalTable: "AdditionalEquipments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UAV_AdditionalEquipments_UAVs_UAVId",
                        column: x => x.UAVId,
                        principalTable: "UAVs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UAV_AdditionalEquipments_AdditionalEquipmentId",
                table: "UAV_AdditionalEquipments",
                column: "AdditionalEquipmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UAV_AdditionalEquipments");

            migrationBuilder.DropTable(
                name: "AdditionalEquipments");

            migrationBuilder.DropTable(
                name: "UAVs");
        }
    }
}
