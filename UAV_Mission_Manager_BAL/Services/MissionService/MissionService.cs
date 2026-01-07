using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DTO.Models.Mission;
using UAV_Mission_Manager_DTO.Models.UAV;
using UAV_Mission_Manager_DTO.Models.AdditionalEquipment;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using UAV_Mission_Manager_DTO.Models.WeatherData;

namespace UAV_Mission_Manager_BAL.Services.MissionService
{
    public class MissionService : IMissionService
    {
        private readonly IRepository<Mission> _missionRepository;
        private readonly IRepository<WeatherData> _weatherDataRepository;
        public MissionService(IRepository<Mission> missionRepository, IRepository<WeatherData> weatherDataRepository)
        {
            _missionRepository = missionRepository;
            _weatherDataRepository = weatherDataRepository;
        }
        public async Task<CreateMissionResponseDto> CreateMissionAsync(CreateMissionDto createMissionDto)
        {
            try
            {
                Mission mission = await SaveMission(createMissionDto);
                try
                {
                    await SaveWeatherData(createMissionDto, mission);
                }
                catch (Exception e)
                {
                    return new CreateMissionResponseDto
                    {
                        Mission = null,
                        Response = "Failed to fetch weather data for mission: + " + e
                    };
                }

                CreateMissionResponseDto response = new CreateMissionResponseDto
                {
                    Mission = await GetMissionByIdAsync(mission.Id),
                    Response = "Mission Created Successfully"
                };
                return response;

            }
            catch (Exception e)
            {
                return new CreateMissionResponseDto
                {
                    Mission = null,
                    Response = "Faild to create mission: + " + e
                };
            }
        }

        private async Task<Mission> SaveMission(CreateMissionDto createMissionDto)
        {
            var mission = new Mission
            {
                Name = createMissionDto.Name,
                Date = createMissionDto.Date,
                Description = createMissionDto.Description,
                CreatedAt = DateTime.UtcNow
            };

            _missionRepository.Add(mission);
            await _missionRepository.SaveAsync();
            return mission;
        }

        private async Task SaveWeatherData(CreateMissionDto createMissionDto, Mission mission)
        {
            var weatherDataDto = createMissionDto.weatherData;
            var weatherData = new WeatherData
            {
                MissionId = mission.Id,
                Temperature = weatherDataDto.Temperature,
                WindSpeed = weatherDataDto.WindSpeed,
                WindDirection = weatherDataDto.WindDirection,
                IsSafeForFlight = weatherDataDto.IsSafeForFlight,
                FetchedAt = weatherDataDto.FetchedAt
            };

            _weatherDataRepository.Add(weatherData);
            await _weatherDataRepository.SaveAsync();
        }

        public async Task<IEnumerable<MissionDto>> GetAllMissionsAsync()
        {
            var missions = await _missionRepository.GetAll()
                .Include(m => m.WeatherData)  
                .ToListAsync();

            return missions.Select(MapToDto);
        }

        public async Task<MissionDto> GetMissionByIdAsync(int id)
        {
            var mission = await _missionRepository.GetAll()
                .Include(m => m.WeatherData) 
                .FirstOrDefaultAsync(m => m.Id == id);

            return mission != null ? MapToDto(mission) : null;
        }

        public Task<IEnumerable<MissionDto>> GetUserMissionsAsync()
        {
            throw new NotImplementedException();
        }

        private MissionDto MapToDto(Mission mission)
        {
            return new MissionDto
            {
                Id = mission.Id,
                Name = mission.Name,
                Date = mission.Date,
                Description = mission.Description,
                CreatedAt = mission.CreatedAt,
                WeatherData = mission.WeatherData != null
                    ? MapWeatherToDto(mission.WeatherData)
                    : null
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
    }
}
