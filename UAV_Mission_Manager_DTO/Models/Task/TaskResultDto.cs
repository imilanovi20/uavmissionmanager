using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.Task
{
    public class TaskResultDto
    {
        public bool IsValid { get; set; }
        public string? Error { get; set; }
        public TaskDto TaskDto { get; set; }
    }
}
