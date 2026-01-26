using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using UAV_Mission_Manager_BAL.Services.FormationService;
using UAV_Mission_Manager_BAL.Services.ObstacleService;
using UAV_Mission_Manager_BAL.Services.TaskService;
using UAV_Mission_Manager_BAL.Services.WaypointService;
using UAV_Mission_Manager_BAL.Services.WeatherService;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.AdditionalEquipment;
using UAV_Mission_Manager_DTO.Models.Formation;
using UAV_Mission_Manager_DTO.Models.Mission;
using UAV_Mission_Manager_DTO.Models.PathPlanning;
using UAV_Mission_Manager_DTO.Models.Task;
using UAV_Mission_Manager_DTO.Models.UAV;
using UAV_Mission_Manager_DTO.Models.UAVPostion;
using UAV_Mission_Manager_DTO.Models.User;
using UAV_Mission_Manager_DTO.Models.Waypoint;
using UAV_Mission_Manager_DTO.Models.WeatherData;

namespace UAV_Mission_Manager_BAL.Services.MissionService
{
    public class MissionService : IMissionService
    {
        private readonly IRepository<Mission> _missionRepository;
        private readonly IRepository<UAV> _uavRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<MissionUAV> _missionUAVRepository;
        private readonly IRepository<MissionUser> _missionUserRepository;
        private readonly IWaypointService _waypointService;
        private readonly ITaskService _taskService;
        private readonly IFormationService _formationService;
        private readonly IObstacleService _obstacleService;
        private readonly ApplicationDbContext _context;

        public MissionService(
            IRepository<Mission> missionRepository,
            IRepository<UAV> uavRepository,
            IRepository<User> userRepository,
            IRepository<MissionUAV> missionUAVRepository,
            IRepository<MissionUser> missionUserRepository,
            IWaypointService waypointService,
            ITaskService taskService,
            IFormationService formationService,
            IObstacleService obstacleService,
            ApplicationDbContext context)
        {
            _missionRepository = missionRepository;
            _uavRepository = uavRepository;
            _userRepository = userRepository;
            _missionUAVRepository = missionUAVRepository;
            _missionUserRepository = missionUserRepository;
            _waypointService = waypointService;
            _taskService = taskService;
            _formationService = formationService;
            _obstacleService = obstacleService;
            _context = context;
        }

        public async Task<CreateMissionResponseDto> CreateMissionAsync(CreateMissionDto createMissionDto)
        {
            IDbContextTransaction transaction = null;
            try
            {
                transaction = await _context.Database.BeginTransactionAsync();

                Mission mission = await SaveMission(createMissionDto);


                if (createMissionDto.UAVIds != null && createMissionDto.UAVIds.Any())
                {
                    await AddUAVsToMission(mission.Id, createMissionDto.UAVIds);
                }

                if (createMissionDto.ResponsibleUsers != null && createMissionDto.ResponsibleUsers.Any())
                {
                    await AddResponsibleUsers(mission.Id, createMissionDto.ResponsibleUsers);
                }

                createMissionDto.InitialFormation.Order = 0;
                createMissionDto.InitialFormation.MissionId = mission.Id;
                await _formationService.CreateFormationAsync(
                    createMissionDto.InitialFormation
                );

                int currentFormationOrder = 0;

                foreach (var waypointDto in createMissionDto.Waypoints)
                {
                    var createdWaypoint = await _waypointService.CreateWaypointAsync(
                        waypointDto,
                        mission.Id);

                    foreach (var taskDto in waypointDto.Tasks)
                    {
                        var (task, updatedOrder) =await _taskService.CreateTaskAsync(taskDto, createdWaypoint.Id, mission.Id, currentFormationOrder);
                        currentFormationOrder = updatedOrder;
                    }
                }

                if (createMissionDto.Obstacles != null && createMissionDto.Obstacles.Any())
                {
                    var createObstaclesDto = new CreateObstaclesDto
                    {
                        MissionId = mission.Id,
                        Obstacles = createMissionDto.Obstacles
                    };
                    await _obstacleService.CreateObstaclesForAsync(createObstaclesDto);
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
                Date = createMissionDto.Date,
                Description = createMissionDto.Description,
                CreatedAt = DateTime.UtcNow,
                CreatedByUsername = createMissionDto.CreatedByUsername,

                Temperature = createMissionDto.WeatherData.Temperature,
                WindSpeed = createMissionDto.WeatherData.WindSpeed,
                WindDirection = createMissionDto.WeatherData.WindDirection,
                IsSafeForFlight = createMissionDto.WeatherData.IsSafeForFlight,
                WeatherCode = createMissionDto.WeatherData.WeatherCode,

                OperationCategory = createMissionDto.PermitData?.OperationCategory,
                HeviestUAV = createMissionDto.PermitData?.HeaviestUAV ?? 0,
                UAVOperationClass = createMissionDto.PermitData?.UAVOperationClass,
                ZoneOperationClass = createMissionDto.PermitData?.ZoneOperationClass,
                IsRecordingPermissionRequired = createMissionDto.PermitData?.IsRecordingPermissionRequired ?? false,
                CrossesAirspace = createMissionDto.PermitData?.CrossesAirspace ?? false,
                CrossesAirspaceMessage = createMissionDto.PermitData?.CrossesAirspaceMessage,

                ProjectedFlightTime = createMissionDto.FlightTimeData?.ProjectedFlightTime,
                FlightTimeUAV = createMissionDto.FlightTimeData != null
                    ? JsonSerializer.Serialize(createMissionDto.FlightTimeData)
                    : null,
                Violations = createMissionDto.PermitData?.Violations != null
                    ? JsonSerializer.Serialize(createMissionDto.PermitData.Violations)
                    : null,
                OptimalRoute = createMissionDto.OptimalRoute != null
                    ? JsonSerializer.Serialize(createMissionDto.OptimalRoute)
                    : null
            };

            _missionRepository.Add(mission);
            await _missionRepository.SaveAsync();
            return mission;
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
                .Include(m => m.MissionObstacles)
                    .ThenInclude(mo => mo.Obstacle)
                .Include(m => m.MissionUAVs)
                    .ThenInclude(mu => mu.UAV)
                        .ThenInclude(u => u.UAV_AdditionalEquipments)
                            .ThenInclude(uae => uae.AdditionalEquipment)
                .Include(m => m.MissionUsers)
                    .ThenInclude(mu => mu.User)
                        .ThenInclude(u => u.UserRole)
                .Include(m => m.Waypoints)  
                    .ThenInclude(w => w.Tasks)
                .Include(m => m.Formations)              
                    .ThenInclude(f => f.UAVPositions)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (mission == null)
            {
                return null;
            }

            return MapToDto(mission);
        }

        public async Task<IEnumerable<MissionDto>> GetUserMissionsAsync(string username)
        {
            var missions = await _missionRepository.GetAll()
                .Include(m => m.MissionUAVs)
                    .ThenInclude(mu => mu.UAV)
                        .ThenInclude(u => u.UAV_AdditionalEquipments)
                            .ThenInclude(uae => uae.AdditionalEquipment)
                .Include(m => m.MissionUsers)
                    .ThenInclude(mu => mu.User)
                        .ThenInclude(u => u.UserRole)
                .Include(m => m.Waypoints)
                    .ThenInclude(w => w.Tasks)
                .Include(m => m.Formations)
                    .ThenInclude(f => f.UAVPositions)
                .Where(m => m.MissionUsers.Any(mu => mu.Username == username))
                .ToListAsync();

            return missions.Select(MapToDto);
        }


        #region Private Mapping Methods

        private MissionDto MapToDto(Mission mission)
        {
            return new MissionDto
            {
                Id = mission.Id,
                Name = mission.Name,
                Date = mission.Date,
                Description = mission.Description,
                CreatedAt = mission.CreatedAt,
                CreatedByUsername = mission.CreatedByUsername,

                WeatherData = new WeatherDataDto
                {
                    Temperature = mission.Temperature,
                    WindSpeed = mission.WindSpeed,
                    WindDirection = mission.WindDirection,
                    IsSafeForFlight = mission.IsSafeForFlight,
                    WeatherCode = mission.WeatherCode
                },

                // Permit data
                PermitData = new PermitDataDto
                {
                    OperationCategory = mission.OperationCategory,
                    HeaviestUAV = mission.HeviestUAV,
                    UAVOperationClass = mission.UAVOperationClass,
                    ZoneOperationClass = mission.ZoneOperationClass,
                    IsRecordingPermissionRequired = mission.IsRecordingPermissionRequired,
                    CrossesAirspace = mission.CrossesAirspace,
                    CrossesAirspaceMessage = mission.CrossesAirspaceMessage,
                    Violations = !string.IsNullOrEmpty(mission.Violations)
                        ? JsonSerializer.Deserialize<List<AirspaceViolationDto>>(mission.Violations)
                        : new List<AirspaceViolationDto>()
                },

                FlightTimeData = !string.IsNullOrEmpty(mission.FlightTimeUAV)
                    ? JsonSerializer.Deserialize<FlightTimeDataDto>(mission.FlightTimeUAV)
                    : null,



                OptimalRoute = !string.IsNullOrEmpty(mission.OptimalRoute)
                    ? JsonSerializer.Deserialize<OptimalRouteDto>(mission.OptimalRoute)
                    : null,

                
                Obstacles = mission.MissionObstacles?
                    .Select(mo => new ObstacleDto
                    {
                        Name = mo.Obstacle.Name,
                        Type = mo.Obstacle.Type,
                        Coordinates = mo.Obstacle.Coordinates 
                            .Select(c => new PointDto
                            {
                                Lat = c.Lat,
                                Lng = c.Lng
                            })
                            .ToList()
                    })
                    .ToList() ?? new List<ObstacleDto>(),

                UAVs = mission.MissionUAVs?
                    .Select(mu => MapUAVToDto(mu.UAV))
                    .ToList() ?? new List<UAVDto>(),

                ResponsibleUsers = mission.MissionUsers?
                    .Select(mu => MapUserToDto(mu.User))
                    .ToList() ?? new List<UserDto>(),

                Waypoints = mission.Waypoints?
                    .OrderBy(w => w.OrderIndex)
                    .Select(w => MapWaypointToDto(w))
                    .ToList() ?? new List<WaypointDto>(),

                Formations = mission.Formations?
                    .OrderBy(f => f.Order)
                    .Select(f => MapFormationToDto(f))
                    .ToList() ?? new List<FormationDto>()
            };
        }

        private FormationDto MapFormationToDto(Formation formation)
        {
            return new FormationDto
            {
                FormationType = formation.FormationType,
                Order = formation.Order,

                UAVPositions = formation.UAVPositions?
                    .Select(up => MapUAVPositionToDto(up))
                    .ToList() ?? new List<UAVPositionDto>()
            };
        }

        private UAVPositionDto MapUAVPositionToDto(UAV_Mission_Manager_DAL.Entities.UAVPosition position)
        {
            return new UAVPositionDto
            {
                UAVId = position.UAVId,
                RelativeX = position.RelativeX,
                RelativeY = position.RelativeY
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