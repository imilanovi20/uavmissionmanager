using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UAV_Mission_Manager_BAL.Services.MissionService;
using UAV_Mission_Manager_BAL.Services.UAVService;
using UAV_Mission_Manager_DTO.Models.AdditionalEquipment;
using UAV_Mission_Manager_DTO.Models.Mission;

namespace UAV_Mission_Manager_API.Controllers
{
    [ApiController]
    [Route("api/mission")]
    //[Authorize]
    public class MissionController : ControllerBase
    {
        private readonly IMissionService _missionService;
        public MissionController(IMissionService missionService)
        {
            _missionService = missionService;
        }

        /// <summary>
        /// Get equipment by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMissionById(int id)
        {
            try
            {
                var result = await _missionService.GetMissionByIdAsync(id);

                if (result == null)
                {
                    return NotFound(new { message = "Mission not found" });
                }

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
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

        /// <summary>
        /// Create new mission
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateMission([FromBody] CreateMissionDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _missionService.CreateMissionAsync(createDto);

                return CreatedAtAction(
                    nameof(GetMissionById),
                    new { id = result.Mission.Id },
                    result);
            }
            catch (UnauthorizedAccessException ex)
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

        [HttpPut("{id}/updateweather")]
        public async Task<IActionResult> UpdateWeatherForMission(int id)
        {
            try
            {
                var result = await _missionService.UpdateWeatherForMissionAsync(id);

                if (result.WetherData != null)
                {
                    return Ok(result);
                }

                return StatusCode(500, result.Response);
            }
            catch (UnauthorizedAccessException ex)
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
