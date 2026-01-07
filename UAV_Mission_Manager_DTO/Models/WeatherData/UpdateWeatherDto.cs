using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.WeatherData
{
    public class UpdateWeatherDto
    {
        public WeatherDataDto WetherData { get; set; }
        public string Response { get; set; }
    }
}
