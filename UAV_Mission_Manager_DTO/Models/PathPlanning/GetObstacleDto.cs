using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PathPlanning
{
    public class GetObstacleDto
    {
        public List<PointDto> Points { get; set; }
        public List<String> AvoidTags { get; set; }
    }
}
