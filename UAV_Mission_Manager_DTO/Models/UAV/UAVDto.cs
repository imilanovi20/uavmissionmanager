using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.AdditionalEquipment;

namespace UAV_Mission_Manager_DTO.Models.UAV
{
    public class UAVDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Type { get; set; }

        public double MaxSpeed { get; set; }

        public TimeSpan FlightTime { get; set; }

        public decimal Weight { get; set; }

        public string ImagePath { get; set; }

        public List<AdditionalEquipmentDto> AdditionalEquipments { get; set; } = new List<AdditionalEquipmentDto>();
    }
}
