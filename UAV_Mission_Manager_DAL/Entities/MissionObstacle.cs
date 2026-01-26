using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class MissionObstacle
    {
        public int Id { get; set; }
        [Required]
        public int MissionId { get; set; }
        [Required]
        public int ObstacleId { get; set; }
        // Navigation properties
        public Mission Mission { get; set; }
        public Obstacle Obstacle { get; set; }
    }

    public class MissionObstacleConfiguration : IEntityTypeConfiguration<MissionObstacle>
    {
        public void Configure(EntityTypeBuilder<MissionObstacle> builder)
        {
            builder.HasKey(mo => mo.Id);
            builder.HasIndex(mo => new { mo.MissionId, mo.ObstacleId })
                .IsUnique();

            builder.HasOne(mo => mo.Mission)
                .WithMany(m => m.MissionObstacles)
                .HasForeignKey(mo => mo.MissionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(mo => mo.Obstacle)
                .WithMany(o => o.MissionObstacles)
                .HasForeignKey(mo => mo.ObstacleId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
