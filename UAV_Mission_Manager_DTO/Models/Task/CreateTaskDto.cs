using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.Task
{
    public class CreateTaskDto
    {
        public string TaskType { get; set; }
        public int Order { get; set; }
        public int? UAVId { get; set; }
        public string Parameters { get; set; }
    }
}
