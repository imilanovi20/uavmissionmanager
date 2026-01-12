using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class UAVPosition
    {
        public int Id { get; set; }
        public int FormationId { get; set; } 
        public int UAVId { get; set; } 
        public double RelativeX { get; set; } 
        public double RelativeY { get; set; } 

        // Navigation properties
        public Formation Formation { get; set; }
        public UAV UAV { get; set; }
    }

    public class UAVPositionConfigurationBuilder : IEntityTypeConfiguration<UAVPosition>
    {
        public void Configure(EntityTypeBuilder<UAVPosition> builder)
        {
            builder.HasKey(up => up.Id);

            builder.Property(up => up.Id)
                   .ValueGeneratedOnAdd();

            builder.Property(up => up.RelativeX)
                   .HasPrecision(10, 2)
                   .IsRequired();

            builder.Property(up => up.RelativeY)
                   .HasPrecision(10, 2)
                   .IsRequired();

            builder.HasOne(up => up.Formation)
                   .WithMany(f => f.UAVPositions)
                   .HasForeignKey(up => up.FormationId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(up => up.UAV)
                   .WithMany()
                   .HasForeignKey(up => up.UAVId)
                   .OnDelete(DeleteBehavior.Restrict);  
        }
    }
}