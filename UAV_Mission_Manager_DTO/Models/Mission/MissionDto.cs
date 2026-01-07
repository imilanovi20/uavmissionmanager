using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.WeatherData;

namespace UAV_Mission_Manager_DTO.Models.Mission
{
    public class MissionDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double LocationLat { get; set; }
        public double LocationLon { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public WeatherDataDto WeatherData { get; set; }
    }
}
