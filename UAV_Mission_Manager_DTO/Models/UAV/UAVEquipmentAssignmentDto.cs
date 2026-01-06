using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.UAV
{
    public class UAVEquipmentAssignmentDto
    {
        public int UAVId { get; set; }
        public List<int> EquipmentIds { get; set; } = new List<int>();
    }
}
