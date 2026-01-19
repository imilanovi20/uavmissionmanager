using System;
using System.Collections.Generic;
using System.Formats.Asn1;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_BAL.Services.PathPlanningService;
using UAV_Mission_Manager_BAL.Services.UAVService;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.PathPlanning;
using UAV_Mission_Manager_DTO.Models.PermitDto;
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
    }
}