using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.AdditionalEquipment;
using UAV_Mission_Manager_DTO.Models.UAV;

namespace UAV_Mission_Manager_BAL.Services.UAVService
{
    public interface IUAVService
    {
        Task<IEnumerable<UAVDto>> GetAllUAVsAsync();
        Task<UAVDto> GetUAVByIdAsync(int id);
        Task<UAVDto> CreateUAVAsync(CreateUAVDto createUAVDto);
        Task<bool> AssignEquipmentToUAVAsync(UAVEquipmentAssignmentDto assignment);

    }
}
