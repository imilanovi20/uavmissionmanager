using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class UAV
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public double MaxSpeed { get; set; }
        public TimeSpan FlightTime { get; set; }
        public decimal Weight { get; set; }
        public string ImagePath { get; set; }
        public ICollection<UAV_AdditionalEquipment> UAV_AdditionalEquipments { get; set; } = new List<UAV_AdditionalEquipment>();
    }

    public class UAVConfigurationBuilder : IEntityTypeConfiguration<UAV>
    {
        public void Configure(EntityTypeBuilder<UAV> builder)
        {
            builder.HasKey(u => u.Id);

            builder.Property(u => u.Id)
                   .ValueGeneratedOnAdd();

            builder.Property(u => u.Name)
                   .IsRequired();

            builder.Property(u => u.Type)
                   .IsRequired();

            builder.Property(u => u.MaxSpeed)
                    .HasPrecision(5, 2)
                   .IsRequired();

            builder.Property(u => u.FlightTime)
                   .IsRequired();

            builder.Property(u => u.Weight)
                    .HasPrecision(18, 2)
                   .IsRequired();

            builder.Property(u => u.ImagePath);
        }
    }
}
