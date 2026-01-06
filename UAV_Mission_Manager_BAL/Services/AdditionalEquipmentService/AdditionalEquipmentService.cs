using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DTO.Models.AdditionalEquipment;
using Microsoft.EntityFrameworkCore;
using UAV_Mission_Manager_DTO.Models.UAV;

namespace UAV_Mission_Manager_BAL.Services.AdditionalEquipmentService
{
    public class AdditionalEquipmentService : IAdditionalEquipmentService
    {
        private readonly IRepository<AdditionalEquipment> _aeRepository;

        public AdditionalEquipmentService(IRepository<AdditionalEquipment> aeRepository)
        {
            _aeRepository = aeRepository;
        }

        public async Task<IEnumerable<AdditionalEquipmentDto>> GetAllEquipmentAsync()
        {
            var ae = await _aeRepository.GetAll().ToListAsync(); 
            return ae.Select(MapToDto);
        }

        public async Task<AdditionalEquipmentDto> GetEquipmentByIdAsync(int id)
        {
            var ae = await _aeRepository.GetAll().FirstOrDefaultAsync(ae => ae.Id == id); 
            return ae != null ? MapToDto(ae) : null;
        }

        public async Task<AdditionalEquipmentDto> CreateEquipmentAsync(CreateAEDto createAEDto)
        {
                var ae = new AdditionalEquipment
                {
                    Type = createAEDto.Type,
                    Name = createAEDto.Name,
                    Weight = createAEDto.Weight,
                    Description = createAEDto.Description,
                    ImagePath = createAEDto.ImagePath
                };

                _aeRepository.Add(ae);
                await _aeRepository.SaveAsync();

                return await GetEquipmentByIdAsync(ae.Id);
            
        }

        private static AdditionalEquipmentDto MapToDto(AdditionalEquipment ae)
        {
            return new AdditionalEquipmentDto
            {
                Id = ae.Id,
                Type = ae.Type,
                Name = ae.Name,
                Weight = ae.Weight,
                Description = ae.Description,
                ImagePath = ae.ImagePath
            };
        }
    }
}
