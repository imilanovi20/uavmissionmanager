using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace UAV_Mission_Manager_DAL.Entities
{
    public enum TaskType
    {
        Takeoff,
        MoveToPosition,
        Land,
        ExecuteCommand,
        ChangeFormation
    }
    public class MissionTask
    {
        public int Id { get; set; }
        public int WaypointId { get; set; }
        public int Order { get; set; }
        public TaskType Type { get; set; }
        public string Parameters { get; set; }
        public int? UAVId { get; set; } 

        public Waypoint Waypoint { get; set; }
        public UAV UAV { get; set; }
    }

    public class MissionTaskConfigurationBuilder : IEntityTypeConfiguration<MissionTask>
    {
        public void Configure(EntityTypeBuilder<MissionTask> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Id)
                   .ValueGeneratedOnAdd();

            builder.Property(t => t.Type)
                   .IsRequired()
                   .HasConversion<string>();

            builder.Property(t => t.Parameters)
                   .HasColumnType("nvarchar(max)");

            builder.HasOne(t => t.Waypoint)
                   .WithMany(w => w.Tasks)
                   .HasForeignKey(t => t.WaypointId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(t => t.UAV)
                   .WithMany()
                   .HasForeignKey(t => t.UAVId)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
