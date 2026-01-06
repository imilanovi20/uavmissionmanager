using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.Mission;
using UAV_Mission_Manager_DTO.Models.UAV;

namespace UAV_Mission_Manager_BAL.Services.MissionService
{
    public interface IMissionService
    {
        Task<CreateMissionResponseDto> CreateMissionAsync(CreateMissionDto createMissionDto);
        Task<MissionDto> GetMissionByIdAsync(int id);
    }
}
