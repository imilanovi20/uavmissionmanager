using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.Task;

namespace UAV_Mission_Manager_DTO.Models.Waypoint
{
    public class CreateWaypointDto
    {
        public object Order { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public List<CreateTaskDto> Tasks { get; set; }
    }
}
