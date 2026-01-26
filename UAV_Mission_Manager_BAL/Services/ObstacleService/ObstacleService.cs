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

            var result = new List<ObstacleDto>();

            foreach (var ob in detectedObstacles)
            {
                var coordinates = ob.Coordinates
                    .Select(c => new Coordinate(c.Lat, c.Lng))
                    .ToList();

                var hash = Obstacle.CalculateCoordinateHash(coordinates);

                var existingObstacle = _oRepository
                    .GetAll()
                    .FirstOrDefault(o => o.CoordinateHash == hash);

                if (existingObstacle == null)
                {
                    existingObstacle = new Obstacle
                    {
                        CoordinateHash = hash,
                        Name = ob.Name,
                        Type = ob.Type,
                        Coordinates = coordinates,
                    };

                    _oRepository.Add(existingObstacle);
                    await _oRepository.SaveAsync();
                }

                var savedObstacle = await GetObstacleByIdAsync(existingObstacle.Id);
                result.Add(savedObstacle);

                var missionObstacle = new MissionObstacle
                {
                    MissionId = missionId,
                    ObstacleId = existingObstacle.Id
                };

                _moRepository.Add(missionObstacle);

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
