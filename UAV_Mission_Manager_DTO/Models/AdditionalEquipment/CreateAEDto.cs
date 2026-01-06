using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.AdditionalEquipment
{
    public class CreateAEDto
    {
        public string Type { get; set; }

        public string Name { get; set; }

        public decimal Weight { get; set; }

        public string Description { get; set; }

        public string ImagePath { get; set; }
    }
}
