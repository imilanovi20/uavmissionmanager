using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UAV_Mission_Manager_DTO.Models.Task;

namespace UAV_Mission_Manager_BAL.Services.TaskService
{
    public interface ITaskService
    {
        Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaksDto);
        Task<TaskValidationResultDto> ValidateTaskAsync(CreateTaskDto createTaskDto);
        Task<TaskDto> GetTaskByIdAsync(int taskId);
        Task<TaskDto> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto);
        Task<bool> DeleteTaskAsync(int taskId);
    }
}
