using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.Task
{
    public class TaskDto
    {
        public int WaypointId { get; set; }
        public int Order { get; set; }
        public string Type { get; set; }
        public string Parameters { get; set; }
        public int? UAVId { get; set; }
    }
}
