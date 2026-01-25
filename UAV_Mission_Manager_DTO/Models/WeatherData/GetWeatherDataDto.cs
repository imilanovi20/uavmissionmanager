using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.PathPlanning;

namespace UAV_Mission_Manager_DTO.Models.WeatherData
{
    public class GetWeatherDataDto
    {
        public DateTime Date { get; set; }
        public List<PointDto> Points { get; set; }
    }
}
