using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.WeatherData
{
    public class CreateWeatherDataDto
    {
        public double Temperature { get; set; }
        public double WindSpeed { get; set; }
        public string WindDirection { get; set; }
        public bool IsSafeForFlight { get; set; }
        public DateTime FetchedAt { get; set; }
        public int WeatherCode { get; set; }
    }
}
