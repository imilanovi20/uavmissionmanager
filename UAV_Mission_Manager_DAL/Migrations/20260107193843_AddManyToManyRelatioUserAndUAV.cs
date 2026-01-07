using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UAV_Mission_Manager_DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddManyToManyRelatioUserAndUAV : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MissionUAVs",
                columns: table => new
                {
                    MissionId = table.Column<int>(type: "int", nullable: false),
                    UAVId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MissionUAVs", x => new { x.MissionId, x.UAVId });
                    table.ForeignKey(
                        name: "FK_MissionUAVs_Missions_MissionId",
                        column: x => x.MissionId,
                        principalTable: "Missions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MissionUAVs_UAVs_UAVId",
                        column: x => x.UAVId,
                        principalTable: "UAVs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MissionUsers",
                columns: table => new
                {
                    MissionId = table.Column<int>(type: "int", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MissionUsers", x => new { x.MissionId, x.Username });
                    table.ForeignKey(
                        name: "FK_MissionUsers_Missions_MissionId",
                        column: x => x.MissionId,
                        principalTable: "Missions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MissionUsers_Users_Username",
                        column: x => x.Username,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MissionUAVs_UAVId",
                table: "MissionUAVs",
                column: "UAVId");

            migrationBuilder.CreateIndex(
                name: "IX_MissionUsers_Username",
                table: "MissionUsers",
                column: "Username");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MissionUAVs");

            migrationBuilder.DropTable(
                name: "MissionUsers");
        }
    }
}
