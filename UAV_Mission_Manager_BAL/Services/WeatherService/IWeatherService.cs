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
        Task<WeatherDataDto> GetWeatherForecastAsync(GetWeatherDataDto dto);
    }
}
