using System;
using System.Collections.Generic;
using UAV_Mission_Manager_DTO.Models.Formation;
using UAV_Mission_Manager_DTO.Models.UAV;
using UAV_Mission_Manager_DTO.Models.User;
using UAV_Mission_Manager_DTO.Models.Waypoint;
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

        // Navigation properties
        public WeatherDataDto WeatherData { get; set; }
        public List<UAVDto> UAVs { get; set; } = new List<UAVDto>();
        public List<UserDto> ResponsibleUsers { get; set; } = new List<UserDto>();
        public List<WaypointDto> Waypoints { get; set; } = new List<WaypointDto>();
        public List<FormationDto>? Formations { get; set; }
        //public List<FormationDto> Formations { get; set; } = new List<FormationDto>();
    }
}