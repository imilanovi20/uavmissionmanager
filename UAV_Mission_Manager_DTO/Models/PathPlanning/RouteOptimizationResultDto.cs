using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PathPlanning
{
    public class RouteOptimizationResultDto
    {
        public bool Success { get; set; }
        public string Error { get; set; }
        public List<PointDto> OptimizedRoute { get; set; }
        public double TotalDistance { get; set; }
        public int TotalPoints { get; set; }
        public int OptimizationPointsAdded { get; set; }
        public string Algorithm { get; set; }
    }
}
