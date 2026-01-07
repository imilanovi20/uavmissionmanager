using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UAV_Mission_Manager_DAL.Entities;

namespace UAV_Mission_Manager_DAL
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UAV> UAVs { get; set; }
        public DbSet<AdditionalEquipment> AdditionalEquipments { get; set; }
        public DbSet<UAV_AdditionalEquipment> UAV_AdditionalEquipments { get; set; }
        public DbSet<Mission> Missions { get; set; }
        public DbSet<WeatherData> WeatherData { get; set; }
        public DbSet<MissionUAV> MissionUAVs { get; set; }
        public DbSet<MissionUser> MissionUsers { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        }
    }
}