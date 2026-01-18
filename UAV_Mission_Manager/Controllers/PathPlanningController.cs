using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UAV_Mission_Manager_BAL.Services.PathPlanningService;
using UAV_Mission_Manager_BAL.Services.UAVService;
using UAV_Mission_Manager_DTO.Models.PathPlanning;

namespace UAV_Mission_Manager_API.Controllers
{
    [ApiController]
    [Route("api/path")]
    //[Authorize]
    public class PathPlanningController : Controller
    {
        private readonly IPathPlanningService _pathPlanningService;

        public PathPlanningController(IPathPlanningService pathPlanningService)
        {
            this._pathPlanningService = pathPlanningService;
        }

        /// <summary>
        /// Detect obstacles in given area and avoid tags
        /// </summary>
        /// <param name="dto">Path geometry + avoid tags</param>
        /// <returns>Detected obstacles</returns>
        /// <response code="200">Returns detected obstacles</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="401">Unauthorized access</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("obstacles")]
        public async Task<IActionResult> DetectObstacles([FromBody] GetObstacleDto dto)
        {
            try
            {
                if (dto == null || dto.Points == null || dto.Points.Count < 2)
                    return BadRequest("Invalid geometry input.");

                var result = await _pathPlanningService.DetectObstaclesAsync(dto);
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
                return StatusCode(500, ex.Message);
            }
        }
    }
}
