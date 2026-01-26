using System;
using System.Collections.Generic;
using System.Formats.Asn1;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_BAL.Services.PathPlanningService;
using UAV_Mission_Manager_BAL.Services.TaskService;
using UAV_Mission_Manager_BAL.Services.UAVService;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.ExecuteCommand;
using UAV_Mission_Manager_DTO.Models.PathPlanning;
using UAV_Mission_Manager_DTO.Models.PermitDto;
using UAV_Mission_Manager_DTO.Models.Task;
using UAV_Mission_Manager_DTO.Models.UAV;

namespace UAV_Mission_Manager_BAL.Services.PermitService
{
    public enum UAVWeightCategory
    {
        Class5,
        Class25,
        Class150
    }

    public enum ZoneCategory
    {
        ClassI,
        ClassII,
        ClassIII,
        ClassIV
    }

    public enum OperationCategory
    {
        A,
        B,
        C,
        D
    }

    public class PermitService : IPermitService
    {
        private readonly IUAVService _uavService;
        private readonly IPathPlanningService _pathPlanningService;

        public PermitService(IUAVService uavService, IPathPlanningService pathPlanningService)
        {
            _uavService = uavService;
            _pathPlanningService = pathPlanningService;
        }

        public async Task<OperationCategoryResponseDto> CalculateOperationCategory(GetOperationCategoryDto dto)
        {
            var uavs = new List<UAVDto>();
            foreach (var id in dto.UAVIds)
            {
                var uav = await _uavService.GetUAVByIdAsync(id);
                if (uav != null)
                    uavs.Add(uav);
            }

            if (!uavs.Any())
                throw new Exception("No UAVs found with provided IDs");

            var heaviestUAV = uavs.OrderByDescending(u => u.Weight).First();
            var uavClass = DetermineUAVWeightClass((double)heaviestUAV.Weight);

            var zoneAnalysis = await AnalyzeFlightZoneAsync(dto.Waypoints);
            var zoneClass = DetermineZoneClass(zoneAnalysis);

            var operationCategory = CalculateOperationCategoryFromMatrix(uavClass, zoneClass);

            return new OperationCategoryResponseDto
            {
                Success = true,
                HeviestUAV = heaviestUAV,
                UAVClass = uavClass.ToString(),
                Analysis = zoneAnalysis,
                ZoneClass = zoneClass.ToString(),
                OperationCategory = operationCategory.ToString(),
            };
        }

        public Task<RecordingPermisionDto> IsRecordingPermissionRequired(List<TaskDto> dtos)
        {
            foreach (var task in dtos)
            {
                if (task.Type == TaskType.ExecuteCommand.ToString())
                {
                    var parameters = System.Text.Json.JsonSerializer.Deserialize<ExecuteCommandParametersDto>(task.Parameters);
                    if (parameters.Command.ToLower().Contains("camera") || parameters.Command.ToLower().Contains("record") ||
                        parameters.Command.ToLower().Contains("video") || parameters.Command.ToLower().Contains("photo"))
                    {
                        return Task.FromResult(new RecordingPermisionDto
                        {
                            IsRecordingPermissionRequired = true,
                            Message = "Recording permission is required due to camera operation tasks."
                        });

                    }
                }
            }
            return Task.FromResult(new RecordingPermisionDto
            {
                IsRecordingPermissionRequired = false,
                Message = ""
            });
        }


        public async Task<AirspaceCheckResultDto> CheckAirspaceViolation(List<PointDto> routePoints)
        {
            if (routePoints == null || routePoints.Count < 2)
            {
                return new AirspaceCheckResultDto
                {
                    Success = false,
                    CrossesAirspace = false,
                    Message = "At least 2 route points required"
                };
            }

            var getAerodromeDto = new GetObstacleDto
            {
                Points = routePoints,
                AvoidTags = new List<string>
            {
                "aeroway=aerodrome",
                "aeroway=airport",
                "aeroway=international"
            }
            };

            var aerodromeResult = await _pathPlanningService.DetectObstaclesAsync(getAerodromeDto);

            if (aerodromeResult.Obstacles == null || !aerodromeResult.Obstacles.Any())
            {
                return new AirspaceCheckResultDto
                {
                    Success = true,
                    CrossesAirspace = false,
                    AirportsViolated = 0,
                    Violations = new List<AirspaceViolationDto>(),
                    Message = "The route does not pass through restricted airspace. There are no airports nearby."
                };
            }

            CreateAerodromeBufferZones(aerodromeResult.Obstacles, 2.99); 

            var violations = new List<AirspaceViolationDto>();

            for (int i = 0; i < routePoints.Count - 1; i++)
            {
                var segmentStart = routePoints[i];
                var segmentEnd = routePoints[i + 1];

                foreach (var aerodrome in aerodromeResult.Obstacles)
                {
                    if (DoesSegmentCrossAerodrome(segmentStart, segmentEnd, aerodrome))
                    {
                        var violation = CreateViolation(aerodrome, segmentStart, segmentEnd, i);

                        if (!violations.Any(v => v.AirportName == aerodrome.Name))
                        {
                            violations.Add(violation);
                        }
                    }
                }
            }
            var crossesAirspace = violations.Any();

            return new AirspaceCheckResultDto
            {
                Success = true,
                CrossesAirspace = crossesAirspace,
                AirportsViolated = violations.Count,
                Violations = violations,
                Message = "Fly zone"
            };
        }
        public async Task<ProjectedFlightTimeResponseDto> CalculateProjectedFlightTime(GetProjectedFlightTimeDto dto)
        {
            var uavs = new List<UAVDto>();
            foreach (int id in dto.UAVIds)
            {
                var uav = await _uavService.GetUAVByIdAsync(id);
                if (uav != null)
                    uavs.Add(uav);
            }

            if (!uavs.Any())
                throw new Exception("No UAVs found with provided IDs");

            if (dto.Points == null || dto.Points.Count < 2)
                throw new Exception("At least 2 waypoints required for flight path");

            var sortedWaypoints = dto.Points.OrderBy(w => w.Order).ToList();

            double totalDistanceKm = 0;
            for (int i = 0; i < sortedWaypoints.Count - 1; i++)
            {
                var distanceKm = CalculateDistance(
                    sortedWaypoints[i].Lat,
                    sortedWaypoints[i].Lng,
                    sortedWaypoints[i + 1].Lat,
                    sortedWaypoints[i + 1].Lng
                );
                totalDistanceKm += distanceKm;
            }

            var slowestSpeedUAV = uavs.OrderBy(u => u.MaxSpeed).First();

            var projectedTimeHours = totalDistanceKm / (slowestSpeedUAV.MaxSpeed * 0.75);

            var projectedTimeMinutes = projectedTimeHours * 60;

            var hoverTimeMinutes = sortedWaypoints.Count * 0.75; 
            var takeoffLandingMinutes = 5.0;

            var totalProjectedTimeMinutes = projectedTimeMinutes + hoverTimeMinutes + takeoffLandingMinutes;

            var swarmCoordinationBufferMinutes = totalProjectedTimeMinutes * 0.15;
            var finalProjectedTimeMinutes = totalProjectedTimeMinutes + swarmCoordinationBufferMinutes;

            var flightTimeUav = new List<FlightTimeUAVDto>();
            foreach (var uav in uavs)
            {
                var maxFlightTimeMinutes = ParseFlightTime(uav.FlightTime.ToString());

                var batteryUsagePercent = (finalProjectedTimeMinutes / maxFlightTimeMinutes) * 100;

                if (batteryUsagePercent > 100)
                    batteryUsagePercent = 100;

                var isFeasible = finalProjectedTimeMinutes <= maxFlightTimeMinutes;

                flightTimeUav.Add(new FlightTimeUAVDto
                {
                    UAVId = uav.Id,
                    FlightTime = FormatTime(maxFlightTimeMinutes),
                    IsFeasible = isFeasible,
                    BatteryUsage = Math.Round(batteryUsagePercent, 2)
                });
            }

            return new ProjectedFlightTimeResponseDto
            {
                ProjectedFlightTime = FormatTime(finalProjectedTimeMinutes),
                FlightTimeUAV = flightTimeUav
            };
        }

        private UAVWeightCategory DetermineUAVWeightClass(double weightInGrams)
        {
            var weightInKg = weightInGrams / 1000.0;

            if (weightInKg <= 5)
                return UAVWeightCategory.Class5;

            if (weightInKg <= 25)
                return UAVWeightCategory.Class25;

            return UAVWeightCategory.Class150;
        }

        private async Task<ZoneAnalysisDto> AnalyzeFlightZoneAsync(
            List<PointDto> waypoints)
        {
            var minLat = waypoints.Min(w => w.Lat);
            var maxLat = waypoints.Max(w => w.Lat);
            var minLon = waypoints.Min(w => w.Lng);
            var maxLon = waypoints.Max(w => w.Lng);

            var buffer = 0.005;
            minLat -= buffer;
            maxLat += buffer;
            minLon -= buffer;
            maxLon += buffer;

            var obstacleDto = new GetObstacleDto
            {
                Points = new List<PointDto>
                {
                    new PointDto { Lat = minLat, Lng = minLon },
                    new PointDto { Lat = maxLat, Lng = maxLon }
                },
                AvoidTags = new List<string>
                {
                    "building",
                    "landuse=residential",
                    "landuse=commercial",
                    "landuse=industrial",
                    "amenity",
                    "highway"
                }
            };

            var obstacleResult = await _pathPlanningService.DetectObstaclesAsync(obstacleDto);

            if (obstacleResult == null || obstacleResult.Obstacles == null)
                throw new Exception("Failed to retrieve obstacle data for zone analysis.");

            var buildings = obstacleResult.Obstacles
                .Where(o => o.Type.Contains("building"))
                .ToList();

            var residentialAreas = obstacleResult.Obstacles
                .Where(o => o.Type.Contains("residential"))
                .ToList();

            var industrialAreas = obstacleResult.Obstacles
                .Where(o => o.Type.Contains("industrial"))
                .ToList();

            var commercialAreas = obstacleResult.Obstacles
                .Where(o => o.Type.Contains("commercial"))
                .ToList();

            var highways = obstacleResult.Obstacles
                .Where(o => o.Type.Contains("highway"))
                .ToList();

            var amenities = obstacleResult.Obstacles
                .Where(o => o.Type.Contains("amenity"))
                .ToList();

            var areaKm2 = obstacleResult.SearchAreaKm2;

            var buildingDensity = buildings.Count / Math.Max(areaKm2, 0.01);
            string populationDensity;

            if (buildingDensity < 5)
                populationDensity = "low";
            else if (buildingDensity < 50)
                populationDensity = "medium";
            else if (buildingDensity < 200)
                populationDensity = "high";
            else
                populationDensity = "very_high";

            return new ZoneAnalysisDto
            {
                BuildingsDetected = buildings.Count,
                ResidentialAreas = residentialAreas.Count,
                IndustrialAreas = industrialAreas.Count,
                PopulationDensity = populationDensity,
                AnalyzedAreaKm2 = areaKm2
            };
        }

        private ZoneCategory DetermineZoneClass(ZoneAnalysisDto analysis)
        {
            if (analysis.PopulationDensity == "very_high" ||
                analysis.ResidentialAreas > 10 ||
                analysis.BuildingsDetected > 100)
            {
                return ZoneCategory.ClassIV;
            }

            if (analysis.PopulationDensity == "high" ||
                analysis.ResidentialAreas > 0 ||
                analysis.BuildingsDetected > 20)
            {
                return ZoneCategory.ClassIII;
            }

            if (analysis.PopulationDensity == "medium" ||
                analysis.IndustrialAreas > 0 ||
                analysis.BuildingsDetected > 0)
            {
                return ZoneCategory.ClassII;
            }

            return ZoneCategory.ClassI;
        }

        private OperationCategory CalculateOperationCategoryFromMatrix(
            UAVWeightCategory uavClass,
            ZoneCategory zoneClass)
        {
            return (uavClass, zoneClass) switch
            {
                (UAVWeightCategory.Class5, ZoneCategory.ClassI) => OperationCategory.A,
                (UAVWeightCategory.Class5, ZoneCategory.ClassII) => OperationCategory.A,
                (UAVWeightCategory.Class5, ZoneCategory.ClassIII) => OperationCategory.B,
                (UAVWeightCategory.Class5, ZoneCategory.ClassIV) => OperationCategory.C,

                (UAVWeightCategory.Class25, ZoneCategory.ClassI) => OperationCategory.A,
                (UAVWeightCategory.Class25, ZoneCategory.ClassII) => OperationCategory.B,
                (UAVWeightCategory.Class25, ZoneCategory.ClassIII) => OperationCategory.C,
                (UAVWeightCategory.Class25, ZoneCategory.ClassIV) => OperationCategory.D,

                (UAVWeightCategory.Class150, ZoneCategory.ClassI) => OperationCategory.B,
                (UAVWeightCategory.Class150, ZoneCategory.ClassII) => OperationCategory.C,
                (UAVWeightCategory.Class150, ZoneCategory.ClassIII) => OperationCategory.D,
                (UAVWeightCategory.Class150, ZoneCategory.ClassIV) => OperationCategory.D,

                _ => OperationCategory.D
            };
        }


        private void CreateAerodromeBufferZones(List<ObstacleDto> aerodromes, double bufferMeters)
        {
            foreach (var aerodrome in aerodromes)
            {
                if (aerodrome.Coordinates != null && aerodrome.Coordinates.Count >= 3)
                {
                    aerodrome.BufferCoordinates = CreateBufferAroundAerodrome(
                        aerodrome.Coordinates,
                        bufferMeters);
                }
            }
        }

        private List<PointDto> CreateBufferAroundAerodrome(List<PointDto> originalCoords, double bufferMeters)
        {
            if (originalCoords.Count < 3)
                return originalCoords;

            const double metersToDegreesLat = 1.0 / 111320.0;

            var centerLat = originalCoords.Average(c => c.Lat);
            var centerLon = originalCoords.Average(c => c.Lng);
            var metersToDegreesLon = metersToDegreesLat / Math.Cos(centerLat * Math.PI / 180.0);

            var bufferedCoords = new List<PointDto>();

            foreach (var point in originalCoords)
            {
                var vectorLat = point.Lat - centerLat;
                var vectorLon = point.Lng - centerLon;

                var vectorLengthLat = vectorLat / metersToDegreesLat;
                var vectorLengthLon = vectorLon / metersToDegreesLon;
                var vectorLength = Math.Sqrt(
                    vectorLengthLat * vectorLengthLat +
                    vectorLengthLon * vectorLengthLon);

                if (vectorLength < 0.1)
                {
                    // Točka je preblizu centru
                    bufferedCoords.Add(new PointDto
                    {
                        Lat = point.Lat + bufferMeters * metersToDegreesLat,
                        Lng = point.Lng
                    });
                }
                else
                {
                    // Normaliziraj vektor i dodaj buffer
                    var normalizedVectorLat = vectorLengthLat / vectorLength;
                    var normalizedVectorLon = vectorLengthLon / vectorLength;

                    bufferedCoords.Add(new PointDto
                    {
                        Lat = point.Lat + normalizedVectorLat * bufferMeters * metersToDegreesLat,
                        Lng = point.Lng + normalizedVectorLon * bufferMeters * metersToDegreesLon
                    });
                }
            }

            return bufferedCoords;
        }

        private bool DoesSegmentCrossAerodrome(
            PointDto segmentStart,
            PointDto segmentEnd,
            ObstacleDto aerodrome)
        {
            if (aerodrome.BufferCoordinates == null || aerodrome.BufferCoordinates.Count < 3)
                return false;

            const int checkPoints = 20;

            for (int i = 0; i <= checkPoints; i++)
            {
                double t = (double)i / checkPoints;
                double lat = segmentStart.Lat + t * (segmentEnd.Lat - segmentStart.Lat);
                double lng = segmentStart.Lng + t * (segmentEnd.Lng - segmentStart.Lng);

                if (IsPointInPolygon(lat, lng, aerodrome.BufferCoordinates))
                {
                    return true;
                }
            }

            return false;
        }

        private bool IsPointInPolygon(double lat, double lng, List<PointDto> polygon)
        {
            if (polygon.Count < 3)
                return false;

            int intersections = 0;
            int n = polygon.Count;

            for (int i = 0; i < n; i++)
            {
                var p1 = polygon[i];
                var p2 = polygon[(i + 1) % n];

                if (((p1.Lat <= lat && lat < p2.Lat) || (p2.Lat <= lat && lat < p1.Lat)) &&
                    (lng < (p2.Lng - p1.Lng) * (lat - p1.Lat) / (p2.Lat - p1.Lat) + p1.Lng))
                {
                    intersections++;
                }
            }

            return intersections % 2 == 1;
        }

    private AirspaceViolationDto CreateViolation(
        ObstacleDto aerodrome,
        PointDto segmentStart,
        PointDto segmentEnd,
        int segmentIndex)
        {
            var centerLat = aerodrome.Coordinates.Average(c => c.Lat);
            var centerLng = aerodrome.Coordinates.Average(c => c.Lng);

            var distStart = CalculateDistance(segmentStart.Lat, segmentStart.Lng, centerLat, centerLng);
            var distEnd = CalculateDistance(segmentEnd.Lat, segmentEnd.Lng, centerLat, centerLng);
            var minDistance = Math.Min(distStart, distEnd);

            String type;
            string description;

            if (minDistance < 1.0)
            {
                type = "DirectCrossing";
                description = $"CRITICAL: Route directly crosses over airport '{aerodrome.Name}'! " +
                              $"Distance: {minDistance:F2} km. FLIGHT PROHIBITED without CCAA approval!";
            }
            else if (minDistance < 3.0)
            {
                type = "WithinNoFlyZone";
                description = $"Route passes through the no-fly zone of airport '{aerodrome.Name}'. " +
                              $"Distance: {minDistance:F2} km. CCAA approval required.";
            }
            else
            {
                type = "NearNoFlyZone";
                description = $"Route is near airport '{aerodrome.Name}'. " +
                              $"Distance: {minDistance:F2} km. Verification recommended.";
            }

            return new AirspaceViolationDto
            {
                AirportName = !string.IsNullOrEmpty(aerodrome.Name) ? aerodrome.Name : "Airport",
                MinDistanceKm = minDistance,
                ViolatingPointIndices = new List<int> { segmentIndex, segmentIndex + 1 },
                Type = type,
                Description = description
            };

        }

        private double CalculateDistance(double lat1, double lng1, double lat2, double lng2)
        {
            const double R = 6371.0; 
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLng = (lng2 - lng1) * Math.PI / 180;

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                    Math.Sin(dLng / 2) * Math.Sin(dLng / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private double ParseFlightTime(string flightTime)
        {
            if (string.IsNullOrEmpty(flightTime))
                throw new Exception("Flight time not specified");

            if (TimeSpan.TryParse(flightTime, out TimeSpan timeSpan))
            {
                return timeSpan.TotalMinutes;
            }

            if (double.TryParse(flightTime, out double minutes))
            {
                return minutes;
            }

            throw new Exception($"Invalid flight time format: {flightTime}. Expected format: 'HH:mm:ss' or 'HH:mm'");
        }

        private string FormatTime(double totalMinutes)
        {
            var hours = (int)(totalMinutes / 60);
            var minutes = (int)(totalMinutes % 60);
            var seconds = (int)((totalMinutes % 1) * 60);

            if (hours > 0)
                return $"{hours:D2}:{minutes:D2}:{seconds:D2}";
            else
                return $"00:{minutes:D2}:{seconds:D2}";
        }
    }
}