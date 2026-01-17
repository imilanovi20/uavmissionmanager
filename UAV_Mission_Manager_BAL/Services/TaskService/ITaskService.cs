using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.Task;
using UAV_Mission_Manager_DTO.Models.Waypoint;

namespace UAV_Mission_Manager_BAL.Services.TaskService
{
    public interface ITaskService
    {
        Task<(TaskDto Task, int UpdatedFormationOrder)> CreateTaskAsync(CreateTaskDto dto, int waypointId, int missionId, int currentFormationOrder);

        Task<List<TaskDto>> CreateTasksAsync(List<CreateTaskDto> dtos, int waypointId);

        Task<TaskDto> GetTaskByIdAsync(int id);

        Task<List<TaskDto>> GetTasksByWaypointIdAsync(int waypointId);

        Task UpdateTaskAsync(int id, UpdateTaskDto dto);

        Task DeleteTaskAsync(int id);
    }
}
