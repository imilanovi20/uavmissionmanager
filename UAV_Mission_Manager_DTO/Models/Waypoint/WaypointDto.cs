using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.Task;

namespace UAV_Mission_Manager_DTO.Models.Waypoint
{
    public class WaypointDto
    {
        public int Id { get; set; }
        public int Order { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public List<TaskDto> Tasks { get; set; } = new List<TaskDto>();
    }
}
