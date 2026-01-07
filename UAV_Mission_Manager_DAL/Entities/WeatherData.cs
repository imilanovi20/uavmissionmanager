using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class WeatherData
    {
        public int Id { get; set; }
        public int MissionId { get; set; }
        public double Temperature { get; set; }
        public double WindSpeed { get; set; }
        public string WindDirection { get; set; }
        public bool IsSafeForFlight { get; set; }
        public DateTime FetchedAt { get; set; }
        public int WeatherCode { get; set; }

        public Mission Mission { get; set; }
    }

    public class WeatherDataConfigurationBuilder : IEntityTypeConfiguration<WeatherData>
    {
        public void Configure(EntityTypeBuilder<WeatherData> builder)
        {
            builder.HasKey(wd => wd.Id);

            builder.Property(wd => wd.Id)
                   .ValueGeneratedOnAdd();

            builder.Property(wd => wd.Temperature)
                   .HasPrecision(5, 2);

            builder.Property(wd => wd.WindSpeed)
                   .HasPrecision(5, 2);

            builder.Property(wd => wd.WindDirection)
                   .HasMaxLength(10);

            builder.Property(wd => wd.IsSafeForFlight)
                   .IsRequired();

            builder.Property(wd => wd.FetchedAt)
                   .IsRequired();

            builder.HasOne(wd => wd.Mission)
                   .WithOne(m => m.WeatherData)
                   .HasForeignKey<WeatherData>(wd => wd.MissionId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
