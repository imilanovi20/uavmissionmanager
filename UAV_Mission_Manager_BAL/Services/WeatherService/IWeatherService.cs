using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.WeatherData;

namespace UAV_Mission_Manager_BAL.Services.WeatherService
{
    public interface IWeatherService
    {
        Task<WeatherDataDto> GetWeatherForecastAsync(DateTime date, double latitude = 45.8150, double longitude = 15.9819);
    }
}
