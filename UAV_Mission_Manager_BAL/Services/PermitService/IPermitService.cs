using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.PathPlanning;
using UAV_Mission_Manager_DTO.Models.PermitDto;
using UAV_Mission_Manager_DTO.Models.Task;

namespace UAV_Mission_Manager_BAL.Services.PermitService
{
    public interface IPermitService
    {
        Task<OperationCategoryResponseDto> CalculateOperationCategory(GetOperationCategoryDto dto);
        Task<RecordingPermisionDto> IsRecordingPermissionRequired(List<TaskDto> dtos);
        Task<AirspaceCheckResultDto> CheckAirspaceViolation(List<PointDto> routePoints);
    }
}
