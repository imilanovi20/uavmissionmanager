using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.Mission;
using UAV_Mission_Manager_DTO.Models.UAV;
using UAV_Mission_Manager_DTO.Models.WeatherData;

namespace UAV_Mission_Manager_BAL.Services.MissionService
{
    public interface IMissionService
    {
        Task<CreateMissionResponseDto> CreateMissionAsync(CreateMissionDto createMissionDto);
        Task<MissionDto> GetMissionByIdAsync(int id);
        Task<IEnumerable<MissionDto>> GetAllMissionsAsync();
        Task<IEnumerable<MissionDto>> GetUserMissionsAsync(String username);
        Task<UpdateWeatherDto> UpdateWeatherForMissionAsync(int missionId);
    }
}
