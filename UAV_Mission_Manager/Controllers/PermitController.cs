using Microsoft.AspNetCore.Mvc;
using UAV_Mission_Manager_BAL.Services.PermitService;
using UAV_Mission_Manager_DTO.Models.PathPlanning;
using UAV_Mission_Manager_DTO.Models.PermitDto;
using UAV_Mission_Manager_DTO.Models.Task;

namespace UAV_Mission_Manager_API.Controllers
{
    [ApiController]
    [Route("api/permit")]
    //[Authorize]
    public class PermitController : Controller
    {
        private readonly IPermitService _permitService;

        public PermitController(IPermitService permitService)
        {
            _permitService = permitService;
        }

        /// <summary>
        /// Calculate operation category based on UAV weight and flight zone analysis
        /// </summary>
        /// <param name="dto">UAV IDs and waypoints for zone analysis</param>
        /// <returns>Operation category with UAV and zone classification</returns>
        /// <response code="200">Returns calculated operation category</response>
        /// <response code="400">Invalid request data or no UAVs found</response>
        /// <response code="401">Unauthorized access</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("operationcategory")]
        public async Task<IActionResult> CalculateOperationCategory([FromBody] GetOperationCategoryDto dto)
        {
            try
            {
                if (dto == null || dto.UAVIds == null || !dto.UAVIds.Any())
                    return BadRequest("UAV IDs are required.");

                if (dto.Waypoints == null || dto.Waypoints.Count < 2)
                    return BadRequest("At least 2 waypoints are required.");

                var result = await _permitService.CalculateOperationCategory(dto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new
                {
                    message = "Access denied"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Calculate operation category based on UAV weight and flight zone analysis
        /// </summary>
        /// <param name="dto">UAV IDs and waypoints for zone analysis</param>
        /// <returns>Operation category with UAV and zone classification</returns>
        /// <response code="200">Returns calculated operation category</response>
        /// <response code="400">Invalid request data or no UAVs found</response>
        /// <response code="401">Unauthorized access</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("recordingpermission")]
        public async Task<IActionResult> IsRecordingPermissionRequired([FromBody] List<TaskDto> dtos)
        {
            try
            {
                if (dtos == null)
                    return BadRequest("UAV IDs are required.");

                var result = await _permitService.IsRecordingPermissionRequired(dtos);
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new
                {
                    message = "Access denied"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Check if route crosses controlled airspace (airports)
        /// </summary>
        /// <param name="routePoints">Optimized route points from path planning</param>
        /// <returns>Airspace violation check result</returns>
        /// <response code="200">Returns airspace check result</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("checkairspace")]
        public async Task<IActionResult> CheckAirspace([FromBody] List<PointDto> routePoints)
        {
            try
            {
                if (routePoints == null || routePoints.Count < 2)
                    return BadRequest("At least 2 route points are required.");

                var result = await _permitService.CheckAirspaceViolation(routePoints);

                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
