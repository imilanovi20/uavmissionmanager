using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.Task
{
    public class TaskValidationResultDto
    {
        public bool IsValid { get; set; }
        public object?[] Errors { get; set; }
    }
}
