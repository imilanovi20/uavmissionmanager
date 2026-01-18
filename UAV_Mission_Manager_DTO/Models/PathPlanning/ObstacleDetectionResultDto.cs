using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PathPlanning
{
    public class ObstacleDetectionResultDto
    {
        public List<ObstacleDto> Obstacles { get; set; }
        public int TotalObstaclesDetected { get; set; }
        public double SearchAreaKm2 { get; set; }
        public string DetectionSource { get; set; }
    }
}
