using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UAV_Mission_Manager_DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddFormationAndUAVPosition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Formations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MissionId = table.Column<int>(type: "int", nullable: false),
                    WaypointId = table.Column<int>(type: "int", nullable: true),
                    FormationType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Spacing = table.Column<double>(type: "float(10)", precision: 10, scale: 2, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Formations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Formations_Missions_MissionId",
                        column: x => x.MissionId,
                        principalTable: "Missions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Formations_Waypoints_WaypointId",
                        column: x => x.WaypointId,
                        principalTable: "Waypoints",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UAVPositions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FormationId = table.Column<int>(type: "int", nullable: false),
                    UAVId = table.Column<int>(type: "int", nullable: false),
                    RelativeX = table.Column<double>(type: "float(10)", precision: 10, scale: 2, nullable: false),
                    RelativeY = table.Column<double>(type: "float(10)", precision: 10, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UAVPositions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UAVPositions_Formations_FormationId",
                        column: x => x.FormationId,
                        principalTable: "Formations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UAVPositions_UAVs_UAVId",
                        column: x => x.UAVId,
                        principalTable: "UAVs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Formations_MissionId",
                table: "Formations",
                column: "MissionId");

            migrationBuilder.CreateIndex(
                name: "IX_Formations_WaypointId",
                table: "Formations",
                column: "WaypointId");

            migrationBuilder.CreateIndex(
                name: "IX_UAVPositions_FormationId",
                table: "UAVPositions",
                column: "FormationId");

            migrationBuilder.CreateIndex(
                name: "IX_UAVPositions_UAVId",
                table: "UAVPositions",
                column: "UAVId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UAVPositions");

            migrationBuilder.DropTable(
                name: "Formations");
        }
    }
}
