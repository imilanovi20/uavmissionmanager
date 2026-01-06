using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.AdditionalEquipment;
using UAV_Mission_Manager_DTO.Models.UAV;

namespace UAV_Mission_Manager_BAL.Services.AdditionalEquipmentService
{
    public interface IAdditionalEquipmentService
    {
        Task<IEnumerable<AdditionalEquipmentDto>> GetAllEquipmentAsync();
        Task<AdditionalEquipmentDto> GetEquipmentByIdAsync(int id);
        Task<AdditionalEquipmentDto> CreateEquipmentAsync(CreateAEDto createAEDto);
    }
}
