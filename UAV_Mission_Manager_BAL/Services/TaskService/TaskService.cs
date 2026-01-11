using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.Task;

namespace UAV_Mission_Manager_BAL.Services.TaskService
{
    public class TaskService : ITaskService
    {
        private readonly IRepository<MissionTask> _taskRepository;
        private readonly IRepository<UAV> _uavRepository;

        public TaskService(
            IRepository<MissionTask> taskRepository,
            IRepository<UAV> uavRepository)
        {
            _taskRepository = taskRepository;
            _uavRepository = uavRepository;
        }

        public async Task<TaskDto> CreateTaskAsync(CreateTaskDto dto, int waypointId)
        {
            await ValidateTaskAsync(dto);

            var task = new MissionTask
            {
                WaypointId = waypointId,
                Type = ParseTaskType(dto.TaskType),
                Order = dto.Order,
                UAVId = dto.UAVId,
                Parameters = dto.Parameters
            };

            _taskRepository.Add(task);
            await _taskRepository.SaveAsync();

            return await GetTaskByIdAsync(task.Id);
        }

        public async Task<List<TaskDto>> CreateTasksAsync(List<CreateTaskDto> dtos, int waypointId)
        {
            foreach (var dto in dtos)
            {
                await ValidateTaskAsync(dto);

                var task = new MissionTask
                {
                    WaypointId = waypointId,
                    Type = ParseTaskType(dto.TaskType),
                    Order = dto.Order,
                    UAVId = dto.UAVId,
                    Parameters = dto.Parameters
                };

                _taskRepository.Add(task);
                await _taskRepository.SaveAsync();
            }

            return await GetTasksByWaypointIdAsync(waypointId);
        }

        public async Task<TaskDto> GetTaskByIdAsync(int id)
        {
            var task = await _taskRepository
                .GetAll()
                .Include(t => t.UAV)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
            {
                throw new KeyNotFoundException($"Task with ID {id} not found");
            }

            return MapToDto(task);
        }

        public async Task<List<TaskDto>> GetTasksByWaypointIdAsync(int waypointId)
        {
            var tasks = await _taskRepository
                .GetAll()
                .Include(t => t.UAV)
                .Where(t => t.WaypointId == waypointId)
                .OrderBy(t => t.Order)
                .ToListAsync();

            return tasks.Select(MapToDto).ToList();
        }

        public async Task UpdateTaskAsync(int id, UpdateTaskDto dto)
        {
            var task = await _taskRepository.GetByIdAsync(id);

            if (task == null)
            {
                throw new KeyNotFoundException($"Task with ID {id} not found");
            }

            _taskRepository.Update(task);
            await _taskRepository.SaveAsync();
        }

        public async Task DeleteTaskAsync(int id)
        {
            var task = await _taskRepository.GetByIdAsync(id);

            if (task == null)
            {
                throw new KeyNotFoundException($"Task with ID {id} not found");
            }

            _taskRepository.Delete(task);
            await _taskRepository.SaveAsync();
        }

        #region Private Methods

        private async Task ValidateTaskAsync(CreateTaskDto dto)
        {
            if (dto.TaskType == "ExecuteCommand")
            {
                if (string.IsNullOrWhiteSpace(dto.Parameters))
                {
                    throw new ArgumentException("Parameters required for ExecuteCommand");
                }

                try
                {
                    var parameters = JsonSerializer.Deserialize<ExecuteCommandParameters>(dto.Parameters);

                    if (parameters.EquipmentId <= 0)
                    {
                        throw new ArgumentException("Valid EquipmentId required");
                    }

                    if (string.IsNullOrWhiteSpace(parameters.Command))
                    {
                        throw new ArgumentException("Command required");
                    }

                    if (!dto.UAVId.HasValue)
                    {
                        throw new ArgumentException("UAVId required for ExecuteCommand");
                    }

                    var hasEquipment = await _uavRepository
                        .GetAll()
                        .Include(u => u.UAV_AdditionalEquipments)
                        .AnyAsync(u => u.Id == dto.UAVId.Value &&
                                     u.UAV_AdditionalEquipments.Any(e =>
                                         e.AdditionalEquipmentId == parameters.EquipmentId));

                    if (!hasEquipment)
                    {
                        throw new ArgumentException(
                            $"UAV {dto.UAVId} does not have equipment {parameters.EquipmentId}");
                    }
                }
                catch (JsonException)
                {
                    throw new ArgumentException("Invalid Parameters JSON format");
                }
            }

            if (dto.TaskType == "ChangeFormation")
            {
                if (string.IsNullOrWhiteSpace(dto.Parameters))
                {
                    throw new ArgumentException("Parameters required for ChangeFormation");
                }

                try
                {
                    var formation = JsonSerializer.Deserialize<FormationParameters>(dto.Parameters);

                    if (formation.Spacing < 5.0)
                    {
                        throw new ArgumentException("Formation spacing must be at least 5m");
                    }

                    if (formation.UAVPositions == null || !formation.UAVPositions.Any())
                    {
                        throw new ArgumentException("UAVPositions required");
                    }
                }
                catch (JsonException)
                {
                    throw new ArgumentException("Invalid Formation JSON format");
                }
            }
        }

        private TaskType ParseTaskType(string type)
        {
            return type switch
            {
                "Takeoff" => TaskType.Takeoff,
                "MoveToPosition" => TaskType.MoveToPosition,
                "Land" => TaskType.Land,
                "ExecuteCommand" => TaskType.ExecuteCommand,
                "ChangeFormation" => TaskType.ChangeFormation,
                _ => throw new ArgumentException($"Unknown task type: {type}")
            };
        }

        private TaskDto MapToDto(MissionTask task)
        {
            return new TaskDto
            {
                Type = task.Type.ToString(),
                Order = task.Order,
                UAVId = task.UAVId,
                Parameters = task.Parameters
            };
        }

        #endregion
    }
    internal class ExecuteCommandParameters
    {
        public int EquipmentId { get; set; }
        public string Command { get; set; }
        public Dictionary<string, object> Settings { get; set; }
    }

    internal class FormationParameters
    {
        public string FormationType { get; set; }
        public double Spacing { get; set; }
        public List<UAVPosition> UAVPositions { get; set; }
    }

    internal class UAVPosition
    {
        public int UAVId { get; set; }
        public double RelativeX { get; set; }
        public double RelativeY { get; set; }
        public double RelativeZ { get; set; }
    }
}
