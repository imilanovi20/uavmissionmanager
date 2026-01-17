using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class Formation
    {
        public int Id { get; set; }
        public int MissionId { get; set; }
        public int? WaypointId { get; set; }
        public string FormationType { get; set; }
        public int Order { get; set; }

        // Navigation properties
        public Mission Mission { get; set; }
        public Waypoint Waypoint { get; set; }
        public ICollection<UAVPosition> UAVPositions { get; set; } = new List<UAVPosition>();
    }

    public class FormationConfigurationBuilder : IEntityTypeConfiguration<Formation>
    {
        public void Configure(EntityTypeBuilder<Formation> builder)
        {
            builder.HasKey(f => f.Id);

            builder.Property(f => f.Id)
                   .ValueGeneratedOnAdd();

            builder.Property(f => f.FormationType)
                   .IsRequired()
                   .HasMaxLength(50);


            builder.Property(f => f.Order)
                   .IsRequired();

            builder.HasOne(f => f.Mission)
                   .WithMany(m => m.Formations)
                   .HasForeignKey(f => f.MissionId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(f => f.Waypoint)
                   .WithMany()
                   .HasForeignKey(f => f.WaypointId)
                   .OnDelete(DeleteBehavior.NoAction);  
        }
    }
}