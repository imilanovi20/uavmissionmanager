using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PathPlanning
{
    public class ObstacleDto
    {
        public List<PointDto> Coordinates { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public List<PointDto>? BufferCoordinates { get; set; }
    }
}
