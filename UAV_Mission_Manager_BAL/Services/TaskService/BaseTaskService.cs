using System;
using System.Collections.Generic;
using System.Linq;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DTO.Models.Task;
using Microsoft.EntityFrameworkCore;

namespace UAV_Mission_Manager_BAL.Services.TaskService
{
    public abstract class BaseTaskService : ITaskService
    {
        protected readonly IRepository<TaskInMission> _taskRepository;
        protected readonly IRepository<Waypoint> _waypointRepository;
        protected readonly IRepository<UAV> _uavRepository;

        protected BaseTaskService(
            IRepository<TaskInMission> taskRepository,
            IRepository<Waypoint> waypointRepository,
            IRepository<UAV> uavRepository)
        {
            _taskRepository = taskRepository;
            _waypointRepository = waypointRepository;
            _uavRepository = uavRepository;
        }

        public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto)
        {
            var validationResult = await ValidateTaskAsync(createTaskDto);
            if (!validationResult.IsValid)
            {
                throw new InvalidOperationException(
                    $"Task validation failed: {string.Join(", ", validationResult.Errors)}"
                );
            }

            var task = await CreateTaskEntityAsync(createTaskDto);

            _taskRepository.Add(task);
            await _taskRepository.SaveAsync();

            return MapToDto(task);
        }

        public async Task<TaskDto> GetTaskByIdAsync(int taskId)
        {
            var task = await _taskRepository.GetAll()
                .Include(t => t.Waypoint)
                .Include(t => t.UAV)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            return task != null ? MapToDto(task) : null;
        }

        public async Task<TaskDto> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto)
        {
            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null)
            {
                throw new Exception($"Task with ID {taskId} not found");
            }

            await UpdateTaskEntityAsync(task, updateTaskDto);

            _taskRepository.Update(task);
            await _taskRepository.SaveAsync();

            return MapToDto(task);
        }
        public async Task<bool> DeleteTaskAsync(int taskId)
        {
            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null)
            {
                return false;
            }

            _taskRepository.Delete(task);
            await _taskRepository.SaveAsync();
            return true;
        }
        public abstract Task<TaskValidationResultDto> ValidateTaskAsync(CreateTaskDto createTaskDto);
        protected abstract Task<TaskInMission> CreateTaskEntityAsync(CreateTaskDto createTaskDto);
        protected abstract Task UpdateTaskEntityAsync(TaskInMission task, UpdateTaskDto updateTaskDto);
        protected abstract TaskDto MapToDto(TaskInMission task);
    }
}