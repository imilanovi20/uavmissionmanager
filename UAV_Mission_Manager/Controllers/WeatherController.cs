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

        [HttpGet]
        public async Task<IActionResult> GetWeatherForecast(
            [FromQuery] DateTime date,
            [FromQuery] double latitude,  
            [FromQuery] double longitude)  
        {
            try
            {
                if (date.Date < DateTime.Today)
                {
                    return BadRequest(new
                    {
                        message = "Cannot fetch weather data for past dates",
                        providedDate = date.ToString("yyyy-MM-dd"),
                        today = DateTime.Today.ToString("yyyy-MM-dd")
                    });
                }

                // Validacija koordinata
                if (latitude < -90 || latitude > 90)
                {
                    return BadRequest(new { message = "Latitude must be between -90 and 90" });
                }

                if (longitude < -180 || longitude > 180)
                {
                    return BadRequest(new { message = "Longitude must be between -180 and 180" });
                }

                var weatherData = await _weatherService.GetWeatherForecastAsync(date, latitude, longitude);

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
                return StatusCode(500, ex.Message);
            }
        }
    }
}
