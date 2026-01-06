using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class UAV_AdditionalEquipment
    {
        public int UAVId { get; set; }
        public int AdditionalEquipmentId { get; set; }
        public UAV UAV { get; set; }
        public AdditionalEquipment AdditionalEquipment { get; set; }
    }

    public class UAV_AdditionalEquipmentConfigurationBuilder : IEntityTypeConfiguration<UAV_AdditionalEquipment>
    {
        public void Configure(EntityTypeBuilder<UAV_AdditionalEquipment> builder)
        {
            builder.HasKey(uae => new { uae.UAVId, uae.AdditionalEquipmentId });

            builder.HasOne(uae => uae.UAV)
                   .WithMany(u => u.UAV_AdditionalEquipments)
                   .HasForeignKey(uae => uae.UAVId);


            builder.HasOne(uae => uae.AdditionalEquipment)
                   .WithMany(ae => ae.UAV_AdditionalEquipments)
                   .HasForeignKey(uae => uae.AdditionalEquipmentId);
        }
    }
}
