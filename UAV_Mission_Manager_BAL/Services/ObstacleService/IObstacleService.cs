using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.PathPlanning;
using UAV_Mission_Manager_DTO.Models.Task;

namespace UAV_Mission_Manager_BAL.Services.ObstacleService
{
    public interface IObstacleService
    {
        Task<List<ObstacleDto>> CreateObstaclesForAsync(CreateObstaclesDto dto);
        Task<ObstacleDto> GetObstacleByIdAsync(int id);
        Task<List<ObstacleDto>> GetObstaclesForMissionAsync(int missionId);
    }
}
