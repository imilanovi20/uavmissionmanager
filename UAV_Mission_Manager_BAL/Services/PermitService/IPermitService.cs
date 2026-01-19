using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.PermitDto;

namespace UAV_Mission_Manager_BAL.Services.PermitService
{
    public interface IPermitService
    {
        Task<OperationCategoryResponseDto> CalculateOperationCategory(GetOperationCategoryDto dto);
    }
}
