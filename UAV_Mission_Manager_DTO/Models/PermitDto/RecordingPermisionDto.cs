using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PermitDto
{
    public class RecordingPermisionDto
    {
        public bool IsRecordingPermissionRequired { get; set; }
        public string Message { get; set; }
    }
}
