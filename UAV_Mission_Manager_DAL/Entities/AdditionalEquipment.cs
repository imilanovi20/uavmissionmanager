using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class AdditionalEquipment
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public decimal Weight { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public ICollection<UAV_AdditionalEquipment> UAV_AdditionalEquipments { get; set; } = new List<UAV_AdditionalEquipment>();
    }

    public class AdditionalEquipmentConfigurationBuilder : IEntityTypeConfiguration<AdditionalEquipment>
    {
        public void Configure(EntityTypeBuilder<AdditionalEquipment> builder)
        {
            builder.HasKey(ae => ae.Id);

            builder.Property(ae => ae.Id)
                   .ValueGeneratedOnAdd();

            builder.Property(ae => ae.Type)
                   .IsRequired();

            builder.Property(ae => ae.Name)
                   .IsRequired();

            builder.Property(ae => ae.Weight)
                    .HasPrecision(18, 2)
                   .IsRequired();

            builder.Property(ae => ae.Description);

            builder.Property(ae => ae.ImagePath);
        }
    }
}
