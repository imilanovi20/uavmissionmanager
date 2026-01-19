using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.ExecuteCommand
{
    public class ExecuteCommandParametersDto
    {
        public int EquipmentId { get; set; }
        public string Command { get; set; }
        public Dictionary<string, object> Settings { get; set; }
    }
}
