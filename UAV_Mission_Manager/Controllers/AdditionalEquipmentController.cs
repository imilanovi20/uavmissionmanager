using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UAV_Mission_Manager_BAL.Services.AdditionalEquipmentService;
using UAV_Mission_Manager_BAL.Services.UserService;
using UAV_Mission_Manager_DTO.Models.AdditionalEquipment;
using UAV_Mission_Manager_DTO.Models.User;

namespace UAV_Mission_Manager_API.Controllers
{
    [ApiController]
    [Route("api/equipment")]
    [Authorize]
    public class AdditionalEquipmentController :ControllerBase
    {
        private readonly IAdditionalEquipmentService _aeService;

        public AdditionalEquipmentController(IAdditionalEquipmentService aeService)
        {
            _aeService = aeService;
        }

        /// <summary>
        /// Get all additional equipment
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllEquipment()
        {
            try
            {

                var result = await _aeService.GetAllEquipmentAsync();
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
                return  StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Get equipment by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEquipmentById(int id)
        {
            try
            {
                var result = await _aeService.GetEquipmentByIdAsync(id);

                if (result == null)
                {
                    return NotFound(new { message = "Equipment not found" });
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
        /// Create new equipment (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateEquipment([FromBody] CreateAEDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _aeService.CreateEquipmentAsync(createDto);

                return CreatedAtAction(
                    nameof(GetEquipmentById),
                    new { id = result.Id },
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
    }
}
