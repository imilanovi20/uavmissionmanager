using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PathPlanning
{
    public class SegmentOptimizationResultDto
    {
        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
        public List<PointDto> RoutePoints { get; set; }
        public double SegmentDistance { get; set; }
        public int OptimizationPointsCount { get; set; }
    }
}
