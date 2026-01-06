using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DTO.Models.Mission;
using UAV_Mission_Manager_DTO.Models.UAV;
using UAV_Mission_Manager_DTO.Models.AdditionalEquipment;
using Microsoft.EntityFrameworkCore;

namespace UAV_Mission_Manager_BAL.Services.MissionService
{
    public class MissionService : IMissionService
    {
        private readonly IRepository<Mission> _missionRepository;
        public MissionService(IRepository<Mission> missionRepository)
        {
            _missionRepository = missionRepository;
        }
        public async Task<CreateMissionResponseDto> CreateMissionAsync(CreateMissionDto createMissionDto)
        {
            var mission = new Mission
            {
                Name = createMissionDto.Name,
                Date = createMissionDto.Date,
                Description = createMissionDto.Description,
                CreatedAt = DateTime.UtcNow
            };

            _missionRepository.Add(mission);
            await _missionRepository.SaveAsync();

            CreateMissionResponseDto response = new CreateMissionResponseDto
            {
               Mission = await GetMissionByIdAsync(mission.Id),
               Response = "Mission Created Successfully"
            };
            return response;
        }

        public async Task<MissionDto> GetMissionByIdAsync(int id)
        {
            var mission = await _missionRepository.GetAll().FirstOrDefaultAsync(mission => mission.Id == id);
            return mission != null ? MapToDto(mission) : null;
        }

        private MissionDto MapToDto(Mission mission)
        {
            return new MissionDto
            {
                Id = mission.Id,
                Name = mission.Name,
                Date = mission.Date,
                Description = mission.Description,
                CreatedAt = mission.CreatedAt
            };
        }
    }
}
