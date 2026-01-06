using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.UAV
{
    public class CreateUAVDto
    {
        public string Name { get; set; }
        public string Type { get; set; }

        public double MaxSpeed { get; set; }

        public TimeSpan FlightTime { get; set; }

        public decimal Weight { get; set; }

        public string ImagePath { get; set; }

        public List<int> AdditionalEquipmentIds { get; set; } = new List<int>();
    }
}
