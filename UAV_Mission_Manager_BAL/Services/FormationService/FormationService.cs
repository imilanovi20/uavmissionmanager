using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.Formation;
using UAV_Mission_Manager_DTO.Models.UAVPostion;

namespace UAV_Mission_Manager_BAL.Services.FormationService
{
    public class FormationService : IFormationService
    {
        private readonly IRepository<Formation> _formationRepository;
        private readonly IRepository<UAVPosition> _uavPositionRepository;

        public FormationService(IRepository<Formation> formationRepository, IRepository<UAVPosition> uavPositionRepository)
        {
            _formationRepository = formationRepository;
            _uavPositionRepository = uavPositionRepository;
        }

        public async Task<FormationDto> CreateFormationAsync(CreateFormationDto dto)
        {
            var formation = new Formation
            {
                MissionId = dto.MissionId,
                FormationType = dto.FormationType,
                Order = dto.Order
            };

            _formationRepository.Add(formation);
            await _formationRepository.SaveAsync();

            foreach (CreateUAVPositionDto posDto in dto.UAVPositions)
            {
                var position = new UAVPosition
                {
                    FormationId = formation.Id,
                    UAVId = posDto.UAVId,
                    RelativeX = posDto.RelativeX,
                    RelativeY = posDto.RelativeY
                };

                _uavPositionRepository.Add(position);
            }
            await _uavPositionRepository.SaveAsync();
            return await GetFormationByIdAsync(formation.Id);
        }

        public async Task<FormationDto> GetFormationByIdAsync(int id)
        {
            var formation = await _formationRepository.GetAll()
                .Include(f => f.UAVPositions)
                .FirstOrDefaultAsync(f => f.Id == id);

            return MapToDto(formation);
        }

        public async Task<List<FormationDto>> GetFormationsByMissionIdAsync(int missionId)
        {
            var formations = await _formationRepository.GetAll()
                .Include(f => f.UAVPositions)
                .Where(f => f.MissionId == missionId)
                .OrderBy(f => f.Order)
                .ToListAsync();

            return formations.Select(MapToDto).ToList();
        }

        private FormationDto MapToDto(Formation formation)
        {
            return new FormationDto
            {
                FormationType = formation.FormationType,
                Order = formation.Order,
                UAVPositions = formation.UAVPositions?
                    .Select(up => new UAVPositionDto
                    {
                        UAVId = up.UAVId,
                        RelativeX = up.RelativeX,
                        RelativeY = up.RelativeY
                    })
                    .ToList() ?? new List<UAVPositionDto>()
            };
        }
    }
}
