using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using UAV_Mission_Manager_BAL.Services.TaskService;
using UAV_Mission_Manager_BAL.Services.WaypointService;
using UAV_Mission_Manager_BAL.Services.WeatherService;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.AdditionalEquipment;
using UAV_Mission_Manager_DTO.Models.Mission;
using UAV_Mission_Manager_DTO.Models.UAV;
using UAV_Mission_Manager_DTO.Models.User;
using UAV_Mission_Manager_DTO.Models.Waypoint;
using UAV_Mission_Manager_DTO.Models.Task;
using UAV_Mission_Manager_DTO.Models.WeatherData;

namespace UAV_Mission_Manager_BAL.Services.MissionService
{
    public class MissionService : IMissionService
    {
        private readonly IRepository<Mission> _missionRepository;
        private readonly IRepository<WeatherData> _weatherDataRepository;
        private readonly IRepository<UAV> _uavRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<MissionUAV> _missionUAVRepository;
        private readonly IRepository<MissionUser> _missionUserRepository;
        private readonly IWeatherService _weatherService;
        private readonly IWaypointService _waypointService;
        private readonly ITaskService _taskService;
        private readonly ApplicationDbContext _context;

        public MissionService(
            IRepository<Mission> missionRepository,
            IRepository<WeatherData> weatherDataRepository,
            IRepository<UAV> uavRepository,
            IRepository<User> userRepository,
            IRepository<MissionUAV> missionUAVRepository,
            IRepository<MissionUser> missionUserRepository,
            IWeatherService weatherService,
            IWaypointService waypointService,
            ITaskService taskService,
            ApplicationDbContext context)
        {
            _missionRepository = missionRepository;
            _weatherDataRepository = weatherDataRepository;
            _uavRepository = uavRepository;
            _userRepository = userRepository;
            _missionUAVRepository = missionUAVRepository;
            _missionUserRepository = missionUserRepository;
            _weatherService = weatherService;
            _waypointService = waypointService;
            _taskService = taskService;
            _context = context;
        }

        public async Task<CreateMissionResponseDto> CreateMissionAsync(CreateMissionDto createMissionDto)
        {
            IDbContextTransaction transaction = null;
            try
            {
                transaction = await _context.Database.BeginTransactionAsync();

                Mission mission = await SaveMission(createMissionDto);

                await AddWeatherData(createMissionDto, mission);

                if (createMissionDto.UAVIds != null && createMissionDto.UAVIds.Any())
                {
                    await AddUAVsToMission(mission.Id, createMissionDto.UAVIds);
                }

                if (createMissionDto.ResponsibleUsers != null && createMissionDto.ResponsibleUsers.Any())
                {
                    await AddResponsibleUsers(mission.Id, createMissionDto.ResponsibleUsers);
                }

                foreach (var waypointDto in createMissionDto.Waypoints)
                {
                    var createdWaypoint = await _waypointService.CreateWaypointAsync(
                        waypointDto,
                        mission.Id);

                    foreach (var taskDto in waypointDto.Tasks)
                    {
                        await _taskService.CreateTaskAsync(taskDto, createdWaypoint.Id);
                    }
                }

                await transaction.CommitAsync();

                var missionDto = await GetMissionByIdAsync(mission.Id);

                return new CreateMissionResponseDto
                {
                    Mission = missionDto,
                    Response = "Mission created successfully"
                };
            }
            catch (Exception ex)
            {
                if (transaction != null)
                {
                    await transaction.RollbackAsync();
                }

                return new CreateMissionResponseDto
                {
                    Mission = null,
                    Response = $"Failed to create mission: {ex.Message}"
                };
            }
            finally
            {
                if (transaction != null)
                {
                    await transaction.DisposeAsync();
                }
            }
        }

        private async Task<Mission> SaveMission(CreateMissionDto createMissionDto)
        {
            var mission = new Mission
            {
                Name = createMissionDto.Name,
                LocationLat = createMissionDto.LocationLat,
                LocationLon = createMissionDto.LocationLon,
                Date = createMissionDto.Date,
                Description = createMissionDto.Description,
                CreatedAt = DateTime.UtcNow
            };

            _missionRepository.Add(mission);
            await _missionRepository.SaveAsync();
            return mission;
        }

        private async Task AddWeatherData(CreateMissionDto createMissionDto, Mission mission)
        {
            var weatherDataDto = createMissionDto.WeatherData;
            var weatherData = new WeatherData
            {
                MissionId = mission.Id,
                Temperature = weatherDataDto.Temperature,
                WindSpeed = weatherDataDto.WindSpeed,
                WindDirection = weatherDataDto.WindDirection,
                IsSafeForFlight = weatherDataDto.IsSafeForFlight,
                FetchedAt = weatherDataDto.FetchedAt,
                WeatherCode = weatherDataDto.WeatherCode
            };

            _weatherDataRepository.Add(weatherData);
            await _weatherDataRepository.SaveAsync();
        }

        private async Task AddUAVsToMission(int missionId, List<int> uavIds)
        {
            foreach (var uavId in uavIds)
            {
                var uavExists = await _uavRepository.GetAll()
                    .AnyAsync(u => u.Id == uavId);

                if (!uavExists)
                {
                    throw new Exception($"UAV with ID {uavId} not found");
                }

                var missionUAV = new MissionUAV
                {
                    MissionId = missionId,
                    UAVId = uavId
                };

                _missionUAVRepository.Add(missionUAV);
            }

            await _missionUAVRepository.SaveAsync();
        }

        private async Task AddResponsibleUsers(int missionId, List<string> usernames)
        {
            foreach (var username in usernames)
            {
                var userExists = await _userRepository.GetAll()
                    .AnyAsync(u => u.Username == username);

                if (!userExists)
                {
                    throw new Exception($"User with username '{username}' not found");
                }

                var missionUser = new MissionUser
                {
                    MissionId = missionId,
                    Username = username
                };

                _missionUserRepository.Add(missionUser);
            }

            await _missionUserRepository.SaveAsync();
        }

        public async Task<IEnumerable<MissionDto>> GetAllMissionsAsync()
        {
            var missions = await _missionRepository.GetAll()
                .Include(m => m.WeatherData)
                .Include(m => m.MissionUAVs)
                    .ThenInclude(mu => mu.UAV)
                        .ThenInclude(u => u.UAV_AdditionalEquipments)
                            .ThenInclude(uae => uae.AdditionalEquipment)
                .Include(m => m.MissionUsers)
                    .ThenInclude(mu => mu.User)
                        .ThenInclude(u => u.UserRole)
                .ToListAsync();

            return missions.Select(MapToDto);
        }

        public async Task<MissionDto> GetMissionByIdAsync(int id)
        {
            var mission = await _missionRepository.GetAll()
                .Include(m => m.WeatherData)
                .Include(m => m.MissionUAVs)
                    .ThenInclude(mu => mu.UAV)
                        .ThenInclude(u => u.UAV_AdditionalEquipments)
                            .ThenInclude(uae => uae.AdditionalEquipment)
                .Include(m => m.MissionUsers)
                    .ThenInclude(mu => mu.User)
                        .ThenInclude(u => u.UserRole)
                .Include(m => m.Waypoints)  
                    .ThenInclude(w => w.Tasks)  
                .FirstOrDefaultAsync(m => m.Id == id);

            if (mission == null)
            {
                return null;
            }

            return MapToDto(mission);
        }

        public Task<IEnumerable<MissionDto>> GetUserMissionsAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<UpdateWeatherDto> UpdateWeatherForMissionAsync(int missionId)
        {
            try
            {
                var mission = await _missionRepository.GetAll()
                    .Include(m => m.WeatherData)
                    .FirstOrDefaultAsync(m => m.Id == missionId);

                if (mission == null)
                {
                    return new UpdateWeatherDto
                    {
                        WetherData = null,
                        Response = $"Mission with ID {missionId} not found"
                    };
                }

                var newWeatherData = await _weatherService.GetWeatherForecastAsync(
                    mission.Date,
                    mission.LocationLat,
                    mission.LocationLon
                );

                if (mission.WeatherData != null)
                {
                    mission.WeatherData.Temperature = newWeatherData.Temperature;
                    mission.WeatherData.WindSpeed = newWeatherData.WindSpeed;
                    mission.WeatherData.WindDirection = newWeatherData.WindDirection;
                    mission.WeatherData.IsSafeForFlight = newWeatherData.IsSafeForFlight;
                    mission.WeatherData.FetchedAt = DateTime.UtcNow;
                    mission.WeatherData.WeatherCode = newWeatherData.WeatherCode;

                    _weatherDataRepository.Update(mission.WeatherData);
                }
                else
                {
                    var weatherData = new WeatherData
                    {
                        MissionId = mission.Id,
                        Temperature = newWeatherData.Temperature,
                        WindSpeed = newWeatherData.WindSpeed,
                        WindDirection = newWeatherData.WindDirection,
                        IsSafeForFlight = newWeatherData.IsSafeForFlight,
                        FetchedAt = DateTime.UtcNow,
                        WeatherCode = newWeatherData.WeatherCode
                    };

                    _weatherDataRepository.Add(weatherData);
                }

                await _weatherDataRepository.SaveAsync();

                return new UpdateWeatherDto
                {
                    WetherData = newWeatherData,
                    Response = "Weather data updated successfully"
                };
            }
            catch (Exception ex)
            {
                return new UpdateWeatherDto
                {
                    Response = $"Failed to update weather data: {ex.Message}"
                };
            }
        }

        #region Private Mapping Methods

        private MissionDto MapToDto(Mission mission)
        {
            return new MissionDto
            {
                Id = mission.Id,
                Name = mission.Name,
                LocationLat = mission.LocationLat,
                LocationLon = mission.LocationLon,
                Date = mission.Date,
                Description = mission.Description,
                CreatedAt = mission.CreatedAt,

                // Weather data
                WeatherData = mission.WeatherData != null
                    ? MapWeatherToDto(mission.WeatherData)
                    : null,

                // UAVs
                UAVs = mission.MissionUAVs?
                    .Select(mu => MapUAVToDto(mu.UAV))
                    .ToList() ?? new List<UAVDto>(),

                // Responsible users
                ResponsibleUsers = mission.MissionUsers?
                    .Select(mu => MapUserToDto(mu.User))
                    .ToList() ?? new List<UserDto>(),

                // Waypoints sa Tasks
                Waypoints = mission.Waypoints?
                    .OrderBy(w => w.OrderIndex)
                    .Select(w => MapWaypointToDto(w))
                    .ToList() ?? new List<WaypointDto>()
            };
        }

        private WeatherDataDto MapWeatherToDto(WeatherData weatherData)
        {
            return new WeatherDataDto
            {
                Id = weatherData.Id,
                Temperature = weatherData.Temperature,
                WindSpeed = weatherData.WindSpeed,
                WindDirection = weatherData.WindDirection,
                IsSafeForFlight = weatherData.IsSafeForFlight,
                FetchedAt = weatherData.FetchedAt,
                WeatherCode = weatherData.WeatherCode
            };
        }

        private UAVDto MapUAVToDto(UAV uav)
        {
            return new UAVDto
            {
                Id = uav.Id,
                Name = uav.Name,
                Type = uav.Type,
                MaxSpeed = uav.MaxSpeed,
                FlightTime = uav.FlightTime,
                Weight = uav.Weight,
                ImagePath = uav.ImagePath,
                AdditionalEquipments = uav.UAV_AdditionalEquipments?
                    .Select(uae => new AdditionalEquipmentDto
                    {
                        Id = uae.AdditionalEquipment.Id,
                        Type = uae.AdditionalEquipment.Type,
                        Name = uae.AdditionalEquipment.Name,
                        Weight = uae.AdditionalEquipment.Weight,
                        Description = uae.AdditionalEquipment.Description,
                        ImagePath = uae.AdditionalEquipment.ImagePath
                    })
                    .ToList() ?? new List<AdditionalEquipmentDto>()
            };
        }

        private UserDto MapUserToDto(User user)
        {
            return new UserDto
            {
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                ImagePath = user.ImagePath,
                Role = user.UserRole?.Name ?? "Unknown"
            };
        }

        private WaypointDto MapWaypointToDto(Waypoint waypoint)
        {
            return new WaypointDto
            {
                Id = waypoint.Id,
                Order = waypoint.OrderIndex,
                Latitude = waypoint.Latitude,
                Longitude = waypoint.Longitude,
                Tasks = waypoint.Tasks?
                    .OrderBy(t => t.Order)
                    .Select(t => MapTaskToDto(t))
                    .ToList() ?? new List<TaskDto>()
            };
        }

        private TaskDto MapTaskToDto(MissionTask task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Type = task.Type.ToString(),
                Order = task.Order,
                UAVId = task.UAVId,
                Parameters = task.Parameters
            };
        }

        #endregion
    }
}