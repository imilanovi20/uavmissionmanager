using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.Waypoint;
using UAV_Mission_Manager_DTO.Models.Task;

namespace UAV_Mission_Manager_BAL.Services.WaypointService
{
    public class WaypointService : IWaypointService
    {
        private readonly IRepository<Waypoint> _waypointRepository;

        public WaypointService(IRepository<Waypoint> waypointRepository)
        {
            _waypointRepository = waypointRepository;
        }

        public async Task<WaypointDto> CreateWaypointAsync(CreateWaypointDto dto, int missionId)
        {
            ValidateWaypoint(dto);

            var waypoint = new Waypoint
            {
                MissionId = missionId,
                OrderIndex = dto.Order,  
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
            };

            _waypointRepository.Add(waypoint);
            await _waypointRepository.SaveAsync();

            return await GetWaypointByIdAsync(waypoint.Id);
        }

        public async Task<List<WaypointDto>> CreateWaypointsAsync(List<CreateWaypointDto> dtos, int missionId)
        {
            foreach (var dto in dtos)
            {
                ValidateWaypoint(dto);

                var waypoint = new Waypoint
                {
                    MissionId = missionId,
                    OrderIndex = dto.Order,  
                    Latitude = dto.Latitude,
                    Longitude = dto.Longitude
                };

                _waypointRepository.Add(waypoint);
                await _waypointRepository.SaveAsync();
            }

            return await GetWaypointsByMissionIdAsync(missionId);
        }

        public async Task<WaypointDto> GetWaypointByIdAsync(int id)
        {
            var waypoint = await _waypointRepository
                .GetAll()
                .Include(w => w.Tasks)
                .FirstOrDefaultAsync(w => w.Id == id);

            if (waypoint == null)
            {
                throw new KeyNotFoundException($"Waypoint with ID {id} not found");
            }

            return MapToDto(waypoint);
        }

        public async Task<List<WaypointDto>> GetWaypointsByMissionIdAsync(int missionId)
        {
            var waypoints = await _waypointRepository
                .GetAll()
                .Include(w => w.Tasks)
                .Where(w => w.MissionId == missionId)
                .OrderBy(w => w.OrderIndex)  
                .ToListAsync();

            return waypoints.Select(MapToDto).ToList();
        }

        public async Task UpdateWaypointAsync(int id, UpdateWaypointDto dto)
        {
            var waypoint = await _waypointRepository.GetByIdAsync(id);

            if (waypoint == null)
            {
                throw new KeyNotFoundException($"Waypoint with ID {id} not found");
            }

            ValidateWaypoint(dto);

            waypoint.Latitude = dto.Latitude;
            waypoint.Longitude = dto.Longitude;

            _waypointRepository.Update(waypoint);
            await _waypointRepository.SaveAsync();
        }

        public async Task DeleteWaypointAsync(int id)
        {
            var waypoint = await _waypointRepository.GetByIdAsync(id);

            if (waypoint == null)
            {
                throw new KeyNotFoundException($"Waypoint with ID {id} not found");
            }

            _waypointRepository.Delete(waypoint);
            await _waypointRepository.SaveAsync();
        }

        #region Private Methods

        private void ValidateWaypoint(CreateWaypointDto dto)
        {
            if (dto.Latitude < -90 || dto.Latitude > 90)
            {
                throw new ArgumentException("Latitude must be between -90 and 90");
            }

            if (dto.Longitude < -180 || dto.Longitude > 180)
            {
                throw new ArgumentException("Longitude must be between -180 and 180");
            }
        }

        private void ValidateWaypoint(UpdateWaypointDto dto)
        {
            if (dto.Latitude < -90 || dto.Latitude > 90)
            {
                throw new ArgumentException("Latitude must be between -90 and 90");
            }

            if (dto.Longitude < -180 || dto.Longitude > 180)
            {
                throw new ArgumentException("Longitude must be between -180 and 180");
            }
        }

        private WaypointDto MapToDto(Waypoint waypoint)
        {
            return new WaypointDto
            {
                Id = waypoint.Id,
                Order = waypoint.OrderIndex,
                Latitude = waypoint.Latitude,
                Longitude = waypoint.Longitude,

                Tasks = waypoint.Tasks?
                    .OrderBy(t => t.Order)
                    .Select(t => new TaskDto
                    {
                        Id = t.Id,
                        Type = t.Type.ToString(),
                        Order = t.Order,
                        UAVId = t.UAVId,
                        Parameters = t.Parameters
                    })
                    .ToList() ?? new List<TaskDto>()
            };
        }

        #endregion
    }
}