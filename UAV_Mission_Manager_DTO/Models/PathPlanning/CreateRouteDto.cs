using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PathPlanning
{
    public class CreateRouteDto
    {
        public List<ObstacleDto> Obstacles { get; set; }
        public List<PointDto> Waypoints { get; set; }
    }
}
