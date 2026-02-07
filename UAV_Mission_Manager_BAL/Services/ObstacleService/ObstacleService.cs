using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.PathPlanning;
using UAV_Mission_Manager_DTO.Models.Task;

namespace UAV_Mission_Manager_BAL.Services.ObstacleService
{
    public class ObstacleService : IObstacleService
    {
        private readonly IRepository<Obstacle> _oRepository;
        private readonly IRepository<MissionObstacle> _moRepository;

        public ObstacleService(IRepository<Obstacle> oRepository, IRepository<MissionObstacle> moRepository)
        {
            _oRepository = oRepository;
            _moRepository = moRepository;
        }
        public async Task<List<ObstacleDto>> CreateObstaclesForAsync(CreateObstaclesDto dto)
        {
            int missionId = dto.MissionId;
            var detectedObstacles = dto.Obstacles;

            if (detectedObstacles == null || !detectedObstacles.Any())
            {
                return new List<ObstacleDto>();
            }

            var obstacleHashMap = new Dictionary<string, (List<Coordinate> coords, ObstacleDto obstacle)>();

            foreach (var ob in detectedObstacles)
            {
                var coordinates = ob.Coordinates
                    .Select(c => new Coordinate(c.Lat, c.Lng))
                    .ToList();

                var hash = Obstacle.CalculateCoordinateHash(coordinates);

                if (!obstacleHashMap.ContainsKey(hash))
                {
                    obstacleHashMap[hash] = (coordinates, ob);
                }
            }

            var allHashes = obstacleHashMap.Keys.ToList();
            var existingObstacles = await _oRepository
                .GetAll()
                .Where(o => allHashes.Contains(o.CoordinateHash))
                .ToDictionaryAsync(o => o.CoordinateHash, o => o);

            var newObstacles = new List<Obstacle>();
            var result = new List<ObstacleDto>();

            foreach (var kvp in obstacleHashMap)
            {
                var hash = kvp.Key;
                var coordinates = kvp.Value.coords;
                var obstacleData = kvp.Value.obstacle;

                Obstacle obstacle;

                if (existingObstacles.TryGetValue(hash, out var existing))
                {
                    obstacle = existing;
                }
                else
                {
                    obstacle = new Obstacle
                    {
                        CoordinateHash = hash,
                        Name = obstacleData.Name,
                        Type = obstacleData.Type,
                        Coordinates = coordinates,
                    };

                    newObstacles.Add(obstacle);
                    existingObstacles[hash] = obstacle;
                }
            }

            if (newObstacles.Any())
            {
                foreach (var obstacle in newObstacles)
                {
                    _oRepository.Add(obstacle);
                }
                await _oRepository.SaveAsync();
            }

            var missionObstacles = new List<MissionObstacle>();

            foreach (var kvp in obstacleHashMap)
            {
                var hash = kvp.Key;
                var obstacle = existingObstacles[hash];

                missionObstacles.Add(new MissionObstacle
                {
                    MissionId = missionId,
                    ObstacleId = obstacle.Id
                });

                result.Add(new ObstacleDto
                {
                    Name = obstacle.Name,
                    Type = obstacle.Type,
                    Coordinates = obstacle.Coordinates
                        .Select(c => new PointDto { Lat = c.Lat, Lng = c.Lng })
                        .ToList(),
                    BufferCoordinates = null
                });
            }

            foreach (var mo in missionObstacles)
            {
                _moRepository.Add(mo);
            }
            await _moRepository.SaveAsync();

            return result;
        }


        public async Task<ObstacleDto> GetObstacleByIdAsync(int id)
        {
            var obstacle = await _oRepository
                .GetAll()
                .FirstOrDefaultAsync(o => o.Id == id);

            if (obstacle == null)
                return null;

            return MapToDto(obstacle);
        }


        public async Task<List<ObstacleDto>> GetObstaclesForMissionAsync(int missionId)
        {
            var obstacles = await _moRepository
                .GetAll()
                .Where(mo => mo.MissionId == missionId)
                .Include(mo => mo.Obstacle)
                .Select(mo => mo.Obstacle)
                .ToListAsync();

            return obstacles.Select(o => MapToDto(o)).ToList();
        }

        private ObstacleDto MapToDto(Obstacle obstacle)
        {
            return new ObstacleDto
            {
                Name = obstacle.Name,
                Type = obstacle.Type,
                Coordinates = obstacle.Coordinates
                    .Select(c => new PointDto
                    {
                        Lat = c.Lat,
                        Lng = c.Lng
                    })
                    .ToList()
            };
        }
    }
}
