using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class Obstacle
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(32)]
        [Column(TypeName = "VARCHAR(32)")]
        public string CoordinateHash { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        [Required]
        [Column(TypeName = "NVARCHAR(MAX)")]
        public string Coordinate { get; set; }

        public ICollection<MissionObstacle> MissionObstacles { get; set; } = new List<MissionObstacle>();

        [NotMapped]
        public List<Coordinate> Coordinates
        {
            get
            {
                if (string.IsNullOrEmpty(Coordinate))
                    return new List<Coordinate>();

                return JsonSerializer.Deserialize<List<Coordinate>>(Coordinate);
            }
            set
            {
                Coordinate = JsonSerializer.Serialize(value);
            }
        }
        public static string CalculateCoordinateHash(List<Coordinate> coordinates)
        {
            if (coordinates == null || coordinates.Count == 0)
                throw new ArgumentException("Coordinates list cannot be null or empty");

            var sorted = coordinates
                .OrderBy(c => c.Lat)
                .ThenBy(c => c.Lng)
                .ToList();

            var coordString = string.Join(",", sorted.Select(c => $"{c.Lat:F6},{c.Lng:F6}"));

            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(coordString));
                return Convert.ToHexString(bytes).Substring(0, 32);
            }
        }
    }

    public class ObstacleConfiguration : IEntityTypeConfiguration<Obstacle>
    {
        public void Configure(EntityTypeBuilder<Obstacle> builder)
        {
            builder.HasKey(o => o.Id);

            builder.HasIndex(o => o.CoordinateHash)
                .IsUnique();

            builder.Property(o => o.CoordinateHash)
                .HasColumnType("VARCHAR(32)")
                .IsRequired();

            builder.Property(o => o.Name)
                .HasMaxLength(200)
                .IsRequired();

            builder.Property(o => o.Coordinate)
                .HasColumnType("NVARCHAR(MAX)")
                .IsRequired();
        }
    }

    public class Coordinate
    {
        public double Lat { get; set; }
        public double Lng { get; set; }

        public Coordinate() { }

        public Coordinate(double lat, double lng)
        {
            Lat = lat;
            Lng = lng;
        }

        public override string ToString()
        {
            return $"({Lat:F6}, {Lng:F6})";
        }
    }
}

