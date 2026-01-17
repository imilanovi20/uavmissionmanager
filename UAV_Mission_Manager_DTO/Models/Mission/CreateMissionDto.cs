using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.Formation;
using UAV_Mission_Manager_DTO.Models.Waypoint;
using UAV_Mission_Manager_DTO.Models.WeatherData;

namespace UAV_Mission_Manager_DTO.Models.Mission
{
    public class CreateMissionDto
    {
        public string Name { get; set; }
        public double LocationLat { get; set; }
        public double LocationLon { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }

        public WeatherDataDto WeatherData { get; set; }
        public List<int> UAVIds { get; set; } = new List<int>();
        public List<string> ResponsibleUsers { get; set; } = new List<string>();
        public CreateFormationDto InitialFormation { get; set; }
        public List<CreateWaypointDto> Waypoints { get; set; } = new List<CreateWaypointDto>();
    }
}
