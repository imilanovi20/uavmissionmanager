using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.Formation;
using UAV_Mission_Manager_DTO.Models.PathPlanning;
using UAV_Mission_Manager_DTO.Models.Waypoint;
using UAV_Mission_Manager_DTO.Models.WeatherData;

namespace UAV_Mission_Manager_DTO.Models.Mission
{
    public class CreateMissionDto
    {
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string CreatedByUsername { get; set; }

        public WeatherDataDto WeatherData { get; set; }

        public PermitDataDto PermitData { get; set; }

        public FlightTimeDataDto FlightTimeData { get; set; }

        public OptimalRouteDto OptimalRoute { get; set; }
        public List<ObstacleDto> Obstacles { get; set; } = new List<ObstacleDto>();

        // Existing fields
        public List<int> UAVIds { get; set; } = new List<int>();
        public List<string> ResponsibleUsers { get; set; } = new List<string>();
        public CreateFormationDto InitialFormation { get; set; }
        public List<CreateWaypointDto> Waypoints { get; set; } = new List<CreateWaypointDto>();
    }

    public class PermitDataDto
    {
        public string OperationCategory { get; set; }
        public double HeaviestUAV { get; set; }
        public string UAVOperationClass { get; set; }
        public string ZoneOperationClass { get; set; }
        public bool IsRecordingPermissionRequired { get; set; }
        public bool CrossesAirspace { get; set; }
        public string CrossesAirspaceMessage { get; set; }
        public List<AirspaceViolationDto>? Violations { get; set; }
    }

    public class FlightTimeDataDto
    {
        public string ProjectedFlightTime { get; set; }
        public List<FlightTimeUAVDto> UAVFlightTimes { get; set; }
    }

    public class FlightTimeUAVDto
    {
        public int UAVId { get; set; }
        public string FlightTime { get; set; }
        public decimal BatteryUsage { get; set; }
        public bool IsFeasible { get; set; }
    }

    public class AirspaceViolationDto
    {
        public string AirportName { get; set; }
        public string? Code { get; set; }
        public decimal Distance { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string? ViolationType { get; set; }
    }

    public class OptimalRouteDto
    {
        public string Algorithm { get; set; }
        public decimal TotalDistance { get; set; }
        public int TotalPoints { get; set; }
        public int OptimizationPointsAdded { get; set; }
        public List<RoutePointDto> Points { get; set; }
    }

    public class RoutePointDto
    {
        public int Order { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}
