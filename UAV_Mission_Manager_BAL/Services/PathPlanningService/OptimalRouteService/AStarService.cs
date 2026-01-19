using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Azure.Core.GeoJson;
using UAV_Mission_Manager_DTO.Models.PathPlanning;

namespace UAV_Mission_Manager_BAL.Services.PathPlanningService.OptimalRouteService
{
    public class AStarService
    {
        public List<PointDto> GetRouteBetweenPoints(PointDto start, PointDto end, List<ObstacleDto> Obstacles)
        {
            var obstacles = Obstacles;
            CreateBufferZones(obstacles, 3.0);

            var optimalRoute = FindOptimalRoute(start, end, obstacles, 2.0);
            
            return optimalRoute;
        }

        private static void CreateBufferZones(List<ObstacleDto> obstacles, double bufferDistanceMeters)
        {
            foreach (var obstacle in obstacles)
            {
                if (obstacle.Coordinates.Count > 2)
                {
                    obstacle.BufferCoordinates = CreateBufferAroundObstacle(obstacle.Coordinates, bufferDistanceMeters);
                }
            }
        }

        private static List<PointDto> CreateBufferAroundObstacle(List<PointDto> originalCoords, double bufferDistanceMeters)
        {
            if (originalCoords.Count < 3) return originalCoords;

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
                var vectorLength = Math.Sqrt(vectorLengthLat * vectorLengthLat + vectorLengthLon * vectorLengthLon);

                if (vectorLength < 0.1)
                {
                    bufferedCoords.Add((new PointDto
                    {
                        Lat = point.Lat + bufferDistanceMeters * metersToDegreesLat,
                        Lng = point.Lng
                    }
                    ));
                }
                else
                {
                    var normalizedVectorLat = vectorLengthLat / vectorLength;
                    var normalizedVectorLon = vectorLengthLon / vectorLength;
                    var bufferedPoint = new PointDto
                    {
                        Lat = point.Lat + normalizedVectorLat * bufferDistanceMeters * metersToDegreesLat,
                        Lng = point.Lng + normalizedVectorLon * bufferDistanceMeters * metersToDegreesLon
                    };

                    bufferedCoords.Add(bufferedPoint);
                }
            }

            return bufferedCoords;
        }

        private List<PointDto> FindOptimalRoute(PointDto start, PointDto end, List<ObstacleDto> obstacles, double gridResolution)
        {
            var bounds = CalculateBounds(start.Lat, start.Lng, end.Lat, end.Lng, obstacles);
            var grid = new NavigationGrid(bounds.minLat, bounds.maxLat, bounds.minLon, bounds.maxLon, gridResolution);

            grid.MarkObstacles(obstacles);

            var startGrid = grid.GetNearestGridPoint(start.Lat, start.Lng);
            var endGrid = grid.GetNearestGridPoint(end.Lat, end.Lng);

            var gridPath = AStar(grid, startGrid, endGrid);

            if (gridPath == null || gridPath.Count == 0)
            {
                Console.WriteLine("   A* nije mogao pronaći put! Vraćam direktnu rutu.");
                return CreateDirectRoute(start.Lat, start.Lng, end.Lat, end.Lng);
            }

            var geoPath = ConvertToGeoPoints(gridPath);

            var smoothedPath = SmoothPath(geoPath, obstacles);

            return smoothedPath;

            throw new NotImplementedException();
        }

        private (double minLat, double maxLat, double minLon, double maxLon) CalculateBounds(
            double startLat, double startLon, double endLat, double endLon, List<ObstacleDto> obstacles)
        {
            var minLat = Math.Min(startLat, endLat);
            var maxLat = Math.Max(startLat, endLat);
            var minLon = Math.Min(startLon, endLon);
            var maxLon = Math.Max(startLon, endLon);

            foreach (var obstacle in obstacles)
            {
                foreach (var coord in obstacle.BufferCoordinates)
                {
                    minLat = Math.Min(minLat, coord.Lat);
                    maxLat = Math.Max(maxLat, coord.Lat);
                    minLon = Math.Min(minLon, coord.Lng);
                    maxLon = Math.Max(maxLon, coord.Lng);
                }
            }

            var latMargin = (maxLat - minLat) * 0.1;
            var lonMargin = (maxLon - minLon) * 0.1;

            return (minLat - latMargin, maxLat + latMargin, minLon - lonMargin, maxLon + lonMargin);
        }

        private List<GridPoint> AStar(NavigationGrid grid, GridPoint start, GridPoint goal)
        {
            var openSet = new List<GridPoint>();
            var closedSet = new HashSet<GridPoint>();

            start.GCost = 0;
            start.HCost = CalculateHeuristic(start, goal);
            openSet.Add(start);

            int iterations = 0;
            const int maxIterations = 50000;

            while (openSet.Count > 0 && iterations < maxIterations)
            {
                iterations++;

                var current = openSet.OrderBy(p => p.FCost).ThenBy(p => p.HCost).First();

                if (current.Equals(goal))
                {
                    return ReconstructPath(current);
                }

                openSet.Remove(current);
                closedSet.Add(current);

                foreach (var neighbor in grid.GetNeighbors(current))
                {
                    if (closedSet.Contains(neighbor)) continue;

                    var tentativeGCost = current.GCost + CalculateDistance(current, neighbor);

                    if (!openSet.Contains(neighbor))
                    {
                        openSet.Add(neighbor);
                    }
                    else if (tentativeGCost >= neighbor.GCost)
                    {
                        continue;
                    }

                    neighbor.Parent = current;
                    neighbor.GCost = tentativeGCost;
                    neighbor.HCost = CalculateHeuristic(neighbor, goal);
                }
            }

            return null;
        }

        private List<GridPoint> ReconstructPath(GridPoint endPoint)
        {
            var path = new List<GridPoint>();
            var current = endPoint;

            while (current != null)
            {
                path.Add(current);
                current = current.Parent;
            }

            path.Reverse();
            return path;
        }

        private double CalculateDistance(GridPoint a, GridPoint b)
        {
            var dx = Math.Abs(a.X - b.X);
            var dy = Math.Abs(a.Y - b.Y);

            if (dx == 1 && dy == 1)
                return Math.Sqrt(2); // Dijagonalno
            else
                return 1; // Horizontalno/vertikalno
        }

        private double CalculateHeuristic(GridPoint a, GridPoint b)
        {
            var dx = Math.Abs(a.X - b.X);
            var dy = Math.Abs(a.Y - b.Y);

            var diagonal = Math.Min(dx, dy);
            var straight = Math.Abs(dx - dy);
            return diagonal * Math.Sqrt(2) + straight;
        }

        private List<PointDto> CreateDirectRoute(double startLat, double startLon, double endLat, double endLon)
        {
            return new List<PointDto>
                {
                    new PointDto { Lat = startLat, Lng = startLon, Order = 0},
                    new PointDto { Lat = endLat, Lng = endLon, Order = 1 }
                };
        }

        private List<PointDto> ConvertToGeoPoints(List<GridPoint> gridPath)
        {
            var geoPoints = new List<PointDto>();

            for (int i = 0; i < gridPath.Count; i++)
            {
                var gridPoint = gridPath[i];
                geoPoints.Add(new PointDto
                {
                    Lat = gridPoint.Latitude,
                    Lng = gridPoint.Longitude,
                    Order = i
                });
            }

            return geoPoints;
        }

        private List<PointDto> SmoothPath(List<PointDto> originalPath, List<ObstacleDto> obstacles)
        {
            if (originalPath.Count <= 2) return originalPath;

            var smoothedPath = new List<PointDto> { originalPath[0] }; // Start s prvom točkom

            int currentIndex = 0;
            while (currentIndex < originalPath.Count - 1)
            {
                int farthestIndex = currentIndex + 1;

                for (int i = currentIndex + 2; i < originalPath.Count; i++)
                {
                    if (IsLineOfSightClear(originalPath[currentIndex], originalPath[i], obstacles))
                    {
                        farthestIndex = i;
                    }
                    else
                    {
                        break;
                    }
                }

                smoothedPath.Add(originalPath[farthestIndex]);
                currentIndex = farthestIndex;
            }

            for (int i = 0; i < smoothedPath.Count; i++)
            {
                smoothedPath[i].Order = i;
            }

            return smoothedPath;
        }

        private bool IsLineOfSightClear(PointDto start, PointDto end, List<ObstacleDto> obstacles)
        {
            const int checkPoints = 20;

            for (int i = 1; i < checkPoints; i++)
            {
                double t = (double)i / checkPoints;
                double lat = start.Lat + t * (end.Lat - start.Lat);
                double lon = start.Lng + t * (end.Lng - start.Lng);

                foreach (var obstacle in obstacles)
                {
                    if (IsPointInPolygon(lat, lon, obstacle.BufferCoordinates))
                    {
                        return false;
                    }
                }
            }

            return true;
        }

        private bool IsPointInPolygon(double lat, double lon, List<PointDto> polygon)
        {
            if (polygon.Count < 3) return false;

            int intersections = 0;
            int n = polygon.Count;

            for (int i = 0; i < n; i++)
            {
                var p1 = polygon[i];
                var p2 = polygon[(i + 1) % n];

                if (((p1.Lat <= lat && lat < p2.Lat) || (p2.Lat <= lat && lat < p1.Lat)) &&
                    (lon < (p2.Lng - p1.Lng) * (lat - p1.Lat) / (p2.Lat - p1.Lat) + p1.Lng))
                {
                    intersections++;
                }
            }

            return intersections % 2 == 1;
        }


        //Helper class

        internal class GridPoint
        {
            public int X { get; set; }
            public int Y { get; set; }
            public double Latitude { get; set; }
            public double Longitude { get; set; }
            public bool IsWalkable { get; set; } = true;

            // A* properties
            public double GCost { get; set; } = double.MaxValue;
            public double HCost { get; set; }
            public double FCost => GCost + HCost;
            public GridPoint Parent { get; set; }

            public GridPoint(int x, int y, double lat, double lon)
            {
                X = x;
                Y = y;
                Latitude = lat;
                Longitude = lon;
            }

            public override bool Equals(object obj)
            {
                if (obj is GridPoint other)
                    return X == other.X && Y == other.Y;
                return false;
            }

            public override int GetHashCode()
            {
                return HashCode.Combine(X, Y);
            }
        }

        internal class NavigationGrid
        {
            public GridPoint[,] Grid { get; private set; }
            public int Width { get; private set; }
            public int Height { get; private set; }
            public double Resolution { get; private set; } // metara po grid ćeliji
            public double MinLat { get; private set; }
            public double MaxLat { get; private set; }
            public double MinLon { get; private set; }
            public double MaxLon { get; private set; }

            internal NavigationGrid(double minLat, double maxLat, double minLon, double maxLon, double resolution)
            {
                MinLat = minLat;
                MaxLat = maxLat;
                MinLon = minLon;
                MaxLon = maxLon;
                Resolution = resolution;

                var latDistance = CalculateHaversineDistance(minLat, minLon, maxLat, minLon);
                var lonDistance = CalculateHaversineDistance(minLat, minLon, minLat, maxLon);

                Width = (int)Math.Ceiling(lonDistance / resolution);
                Height = (int)Math.Ceiling(latDistance / resolution);

                Console.WriteLine($"   Grid stvoren: {Width}x{Height} ćelija, {resolution}m rezolucija");

                Grid = new GridPoint[Width, Height];
                for (int x = 0; x < Width; x++)
                {
                    for (int y = 0; y < Height; y++)
                    {
                        var lat = MinLat + (y * (MaxLat - MinLat) / Height);
                        var lon = MinLon + (x * (MaxLon - MinLon) / Width);
                        Grid[x, y] = new GridPoint(x, y, lat, lon);
                    }
                }
            }

            private double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
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


            public void MarkObstacles(List<ObstacleDto> obstacles)
            {
                int blockedCells = 0;

                for (int x = 0; x < Width; x++)
                {
                    for (int y = 0; y < Height; y++)
                    {
                        var point = Grid[x, y];

                        foreach (var obstacle in obstacles)
                        {
                            if (IsPointInPolygon(point.Latitude, point.Longitude, obstacle.BufferCoordinates))
                            {
                                point.IsWalkable = false;
                                blockedCells++;
                                break;
                            }
                        }
                    }
                }
            }

            private bool IsPointInPolygon(double lat, double lon, List<PointDto> polygon)
            {
                if (polygon.Count < 3) return false;

                int intersections = 0;
                int n = polygon.Count;

                for (int i = 0; i < n; i++)
                {
                    var p1 = polygon[i];
                    var p2 = polygon[(i + 1) % n];

                    if (((p1.Lat <= lat && lat < p2.Lat) || (p2.Lat <= lat && lat < p1.Lat)) &&
                        (lon < (p2.Lng - p1.Lng) * (lat - p1.Lat) / (p2.Lat - p1.Lat) + p1.Lng))
                    {
                        intersections++;
                    }
                }

                return intersections % 2 == 1;
            }

            public GridPoint GetNearestGridPoint(double lat, double lon)
            {
                int x = (int)Math.Round((lon - MinLon) / (MaxLon - MinLon) * (Width - 1));
                int y = (int)Math.Round((lat - MinLat) / (MaxLat - MinLat) * (Height - 1));

                x = Math.Max(0, Math.Min(Width - 1, x));
                y = Math.Max(0, Math.Min(Height - 1, y));

                return Grid[x, y];
            }

            public List<GridPoint> GetNeighbors(GridPoint point)
            {
                var neighbors = new List<GridPoint>();

                for (int dx = -1; dx <= 1; dx++)
                {
                    for (int dy = -1; dy <= 1; dy++)
                    {
                        if (dx == 0 && dy == 0) continue;

                        int newX = point.X + dx;
                        int newY = point.Y + dy;

                        if (newX >= 0 && newX < Width && newY >= 0 && newY < Height)
                        {
                            var neighbor = Grid[newX, newY];
                            if (neighbor.IsWalkable)
                            {
                                neighbors.Add(neighbor);
                            }
                        }
                    }
                }

                return neighbors;
            }
        }

    }
}
