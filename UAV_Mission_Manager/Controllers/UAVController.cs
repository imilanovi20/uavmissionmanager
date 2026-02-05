using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UAV_Mission_Manager_BAL.Services.AdditionalEquipmentService;
using UAV_Mission_Manager_BAL.Services.UAVService;
using UAV_Mission_Manager_DTO.Models.UAV;

namespace UAV_Mission_Manager_API.Controllers
{
    [ApiController]
    [Route("api/uav")]
    [Authorize]
    public class UAVController : ControllerBase
    {
        private readonly IUAVService _uavService;

        public UAVController(IUAVService uavService)
        {
            this._uavService = uavService;
        }

        /// <summary>
        /// Get all UAVs
        /// </summary>
        /// <returns>List of all UAVs</returns>
        /// <response code="200">Returns the list of UAVs</response>
        /// <response code="401">Unauthorized access</response>
        /// <response code="500">Internal server error</response>
        [HttpGet]
        public async Task<IActionResult> GetAllUAVs()
        {
            try
            {
                var result = await _uavService.GetAllUAVsAsync();
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
        /// Get UAV by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUAVById(int id)
        {
            try
            {
                var result = await _uavService.GetUAVByIdAsync(id);

                if (result == null)
                {
                    return NotFound(new { message = "UAV not found" });
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

        // <summary>
        /// Create new UAV
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUAV([FromBody] CreateUAVDto uavDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var result = await _uavService.CreateUAVAsync(uavDto);

                return CreatedAtAction(
                    nameof(GetUAVById),
                    new { id = result.Id },
                    result
                );

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
        /// Assign equipment to UAV
        /// </summary>
        [HttpPost("equipment")]
        public async Task<IActionResult> AssignEquipmentToUAV( [FromBody] UAVEquipmentAssignmentDto assignment)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _uavService.AssignEquipmentToUAVAsync(assignment);
                if (!result)
                {
                    return BadRequest(new { message = "Failed to assign equipment to UAV" });
                }

                return Ok(new { message = "Equipment successfully assigned to UAV" });
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
                return StatusCode(500, new { message = "An error occurred while assigning equipment" });
            }
        }

    }
}
