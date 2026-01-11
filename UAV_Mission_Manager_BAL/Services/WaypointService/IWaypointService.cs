using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.Task;
using UAV_Mission_Manager_DTO.Models.Waypoint;
using UAV_Mission_Manager_DTO.Models.WeatherData;

namespace UAV_Mission_Manager_BAL.Services.WaypointService
{
    public interface IWaypointService
    {
        Task<WaypointDto> CreateWaypointAsync(CreateWaypointDto dto, int missionId);
        Task<List<WaypointDto>> CreateWaypointsAsync(List<CreateWaypointDto> dtos, int missionId);
        Task<WaypointDto> GetWaypointByIdAsync(int id);
        Task<List<WaypointDto>> GetWaypointsByMissionIdAsync(int missionId);
        Task UpdateWaypointAsync(int id, UpdateWaypointDto dto);
        Task DeleteWaypointAsync(int id);
    }
}
