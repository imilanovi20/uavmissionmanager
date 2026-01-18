using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.PathPlanning;

namespace UAV_Mission_Manager_BAL.Services.PathPlanningService
{
    public interface IPathPlanningService
    {
        Task<List<RoutePointDto>> FindOptimalMultiWaypointRouteAsync(CreateRouteDto dto);
        Task<ObstacleDetectionResultDto> DetectObstaclesAsync(GetObstacleDto dto);
    }
}
