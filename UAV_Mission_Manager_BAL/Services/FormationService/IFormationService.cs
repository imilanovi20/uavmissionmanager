using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.Formation;

namespace UAV_Mission_Manager_BAL.Services.FormationService
{
    public interface IFormationService
    {
        Task<FormationDto> CreateFormationAsync(CreateFormationDto dto);
        Task<FormationDto> GetFormationByIdAsync(int id);
        Task<List<FormationDto>> GetFormationsByMissionIdAsync(int missionId);

    }
}
