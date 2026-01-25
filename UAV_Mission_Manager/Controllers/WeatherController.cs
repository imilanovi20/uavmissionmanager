using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UAV_Mission_Manager_BAL.Services.UAVService;
using UAV_Mission_Manager_BAL.Services.WeatherService;
using UAV_Mission_Manager_DTO.Models.WeatherData;

namespace UAV_Mission_Manager_API.Controllers
{
    [ApiController]
    [Route("api/weather")]
    //[Authorize]
    public class WeatherController : ControllerBase
    {
        private readonly IWeatherService _weatherService;

        public WeatherController(IWeatherService weatherService)
        {
            _weatherService = weatherService;
        }

        [HttpPost("forecast")]
        public async Task<IActionResult> GetWeatherForecast([FromBody] GetWeatherDataDto dto)
        {
            try
            {
                if (dto.Date.Date < DateTime.Today)
                {
                    return BadRequest(new
                    {
                        message = "Cannot fetch weather data for past dates",
                        providedDate = dto.Date.ToString("yyyy-MM-dd"),
                        today = DateTime.Today.ToString("yyyy-MM-dd")
                    });
                }

                if (dto.Points == null || dto.Points.Count == 0)
                {
                    return BadRequest(new { message = "At least one point is required" });
                }

                foreach (var point in dto.Points)
                {
                    if (point.Lat < -90 || point.Lat > 90)
                    {
                        return BadRequest(new { message = $"Latitude must be between -90 and 90. Invalid value: {point.Lat}" });
                    }
                    if (point.Lng < -180 || point.Lng > 180)
                    {
                        return BadRequest(new { message = $"Longitude must be between -180 and 180. Invalid value: {point.Lng}" });
                    }
                }

                var weatherData = await _weatherService.GetWeatherForecastAsync(dto);
                return Ok(weatherData);
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
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
