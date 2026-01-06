using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DTO.Models.UAV;
using Microsoft.EntityFrameworkCore;
using UAV_Mission_Manager_DTO.Models.AdditionalEquipment;

namespace UAV_Mission_Manager_BAL.Services.UAVService
{
    public class UAVService : IUAVService
    {
        private readonly IRepository<UAV> _uavRepository;
        private readonly IRepository<AdditionalEquipment> _equipmentRepository;
        private readonly IRepository<UAV_AdditionalEquipment> _uavEquipmentRepository;

        public UAVService(IRepository<UAV> uavRepository, IRepository<AdditionalEquipment> equipmentRepository, IRepository<UAV_AdditionalEquipment> uavEquipmentRepository)
        {
            _uavRepository = uavRepository;
            _equipmentRepository = equipmentRepository;
            _uavEquipmentRepository = uavEquipmentRepository;
        }

        public async Task<IEnumerable<UAVDto>> GetAllUAVsAsync()
        {
            var uavs = await _uavRepository
                .GetAll()
                .Include(u => u.UAV_AdditionalEquipments)
                    .ThenInclude(uae => uae.AdditionalEquipment)
                .ToListAsync();

            return uavs.Select(MapToDto);
        }

        public async Task<UAVDto> GetUAVByIdAsync(int id)
        {
            var uav = await _uavRepository
                .GetAll()
                .Include(u => u.UAV_AdditionalEquipments)
                    .ThenInclude(uae => uae.AdditionalEquipment)
                .FirstOrDefaultAsync(u => u.Id == id);

            return uav != null ? MapToDto(uav) : null;
        }


        private static UAVDto MapToDto(UAV uav)
        {
            return new UAVDto
            {
                Id = uav.Id,
                Name = uav.Name,
                Type = uav.Type,
                MaxSpeed = uav.MaxSpeed,
                FlightTime = uav.FlightTime,
                Weight = uav.Weight,
                ImagePath = uav.ImagePath,
                AdditionalEquipments = uav.UAV_AdditionalEquipments.Select(uae => new AdditionalEquipmentDto
                {
                    Id = uae.AdditionalEquipment.Id,
                    Type = uae.AdditionalEquipment.Type,
                    Name = uae.AdditionalEquipment.Name,
                    Weight = uae.AdditionalEquipment.Weight,
                    Description = uae.AdditionalEquipment.Description,
                    ImagePath = uae.AdditionalEquipment.ImagePath
                }).ToList()
            };
        }

        public async Task<UAVDto> CreateUAVAsync(CreateUAVDto createUAVDto)
        {
            var uav = new UAV
            {
                Name = createUAVDto.Name,
                Type = createUAVDto.Type,
                MaxSpeed = createUAVDto.MaxSpeed,
                FlightTime = createUAVDto.FlightTime,
                Weight = createUAVDto.Weight,
                ImagePath = createUAVDto.ImagePath
            };

            _uavRepository.Add(uav);
            await _uavRepository.SaveAsync();

            if (createUAVDto.AdditionalEquipmentIds.Any())
            {
                foreach (var equipmentId in createUAVDto.AdditionalEquipmentIds)
                {
                    var uavEquipment = new UAV_AdditionalEquipment
                    {
                        UAVId = uav.Id,
                        AdditionalEquipmentId = equipmentId
                    };
                    _uavEquipmentRepository.Add(uavEquipment);
                }
                await _uavEquipmentRepository.SaveAsync();
            }

            return await GetUAVByIdAsync(uav.Id);

        }

        public async Task<bool> AssignEquipmentToUAVAsync(UAVEquipmentAssignmentDto assignment)
        {
            try
            {
                foreach (var equipmentId in assignment.EquipmentIds)
                {
                    var uavEquipment = new UAV_AdditionalEquipment
                    {
                        UAVId = assignment.UAVId,
                        AdditionalEquipmentId = equipmentId
                    };
                    _uavEquipmentRepository.Add(uavEquipment);
                }
                await _uavEquipmentRepository.SaveAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }


        }
    }
}
