using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.PathPlanning;

namespace UAV_Mission_Manager_BAL.Services.PathPlanningService
{
    public class PathPlanningService : IPathPlanningService
    {

        private readonly HttpClient _httpClient;

        public PathPlanningService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<ObstacleDetectionResultDto> DetectObstaclesAsync(GetObstacleDto dto)
        {
            var bounds = CalculateBounds(dto.Points);
            var midLat = (bounds.minLat + bounds.maxLat) / 2;
            var midLon = (bounds.minLon + bounds.maxLon) / 2;
            var radius = CalculateHaversineDistance(midLat, midLon, bounds.maxLat, bounds.maxLon);

            if (dto.AvoidTags == null || !dto.AvoidTags.Any()) return new ObstacleDetectionResultDto
            {
                Obstacles = new List<ObstacleDto>(),
                TotalObstaclesDetected = 0,
                SearchAreaKm2 = 0,
                DetectionSource = "No avoid tags"
            };

            var culture = System.Globalization.CultureInfo.InvariantCulture;

            var tagQueries = dto.AvoidTags.Select(tag =>
            {
                if (tag.Contains("="))
                {
                    var parts = tag.Split('=', 2);
                    return $@"way[""{parts[0]}""=""{parts[1]}""]
                         (around:{radius:F0},{midLat.ToString(culture)},{midLon.ToString(culture)});";
                }
                else
                {
                    return $@"way[""{tag}""]
                        (around:{radius:F0},{midLat.ToString(culture)},{midLon.ToString(culture)});";
                }
            });

            var query = $@"
                [out:json][timeout:25];
                (
                {string.Join("\n", tagQueries)}
                );
                out geom;";

            var encodedQuery = Uri.EscapeDataString(query);
            var url = $"https://overpass-api.de/api/interpreter?data={encodedQuery}";

            try
            {
                var response = await _httpClient.GetStringAsync(url);
                var obstacles = ParseObstaclesFromOverpass(response);

                var searchArea = CalculateAreaKm2(bounds);

                return new ObstacleDetectionResultDto
                {
                    Obstacles = obstacles,
                    TotalObstaclesDetected = obstacles.Count,
                    SearchAreaKm2 = searchArea,
                    DetectionSource = "Overpass API (OpenStreetMap)"
                };
            }
            catch
            {
                return new ObstacleDetectionResultDto
                {
                    Obstacles = new List<ObstacleDto>(),
                    TotalObstaclesDetected = 0,
                    SearchAreaKm2 = 0,
                    DetectionSource = "Failed to detect obstacles"
                };
            }


            throw new NotImplementedException();
        }

        public Task<List<RoutePointDto>> FindOptimalMultiWaypointRouteAsync(CreateRouteDto dto)
        {
            throw new NotImplementedException();
        }

        private (double minLat, double maxLat, double minLon, double maxLon) CalculateBounds(
            List<PointDto> waypoints)
        {
            var minLat = waypoints.Min(w => w.Lat);
            var maxLat = waypoints.Max(w => w.Lat);
            var minLon = waypoints.Min(w => w.Lng);
            var maxLon = waypoints.Max(w => w.Lng);

            var latPadding = (maxLat - minLat) * 0.1;
            var lonPadding = (maxLon - minLon) * 0.1;

            return (minLat - latPadding, maxLat + latPadding, minLon - lonPadding, maxLon + lonPadding);
        }

        private static double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371000;
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }
        private List<ObstacleDto> ParseObstaclesFromOverpass(string json)
        {
            var obstacles = new List<ObstacleDto>();

            try
            {
                using var doc = JsonDocument.Parse(json);
                var elements = doc.RootElement.GetProperty("elements");

                foreach (var element in elements.EnumerateArray())
                {
                    if (!element.TryGetProperty("geometry", out var geometry))
                        continue;

                    var coords = new List<PointDto>();
                    var order = 0;
                    foreach (var point in geometry.EnumerateArray())
                    {
                        coords.Add(new PointDto
                        {
                            Order = order,
                            Lat = point.GetProperty("lat").GetDouble(),
                            Lng = point.GetProperty("lon").GetDouble()
                        });
                        order++;
                    }

                    if (coords.Count >= 3)
                    {
                        obstacles.Add(new ObstacleDto
                        {
                            Coordinates = coords,
                            Type = element.TryGetProperty("tags", out var tags) &&
                                   tags.TryGetProperty("building", out var building)
                                   ? building.GetString() ?? "building"
                                   : "building",
                            Name = element.TryGetProperty("tags", out var tags2) &&
                                   tags2.TryGetProperty("name", out var name)
                                   ? name.GetString() ?? ""
                                   : ""
                        });
                    }
                }
            }
            catch (Exception e){
                throw new Exception("Error parsing Overpass API response: ", e);
            }

            return obstacles;
        }

        private double CalculateAreaKm2((double minLat, double maxLat, double minLon, double maxLon) bounds)
        {
            var latDist = CalculateHaversineDistance(bounds.minLat, bounds.minLon, bounds.maxLat, bounds.minLon) / 1000.0;
            var lonDist = CalculateHaversineDistance(bounds.minLat, bounds.minLon, bounds.minLat, bounds.maxLon) / 1000.0;
            return latDist * lonDist;
        }

    }
}
