using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.UAV;

namespace UAV_Mission_Manager_DTO.Models.PermitDto
{
    public class OperationCategoryResponseDto
    {
        public bool Success { get; set; }
        public UAVDto HeviestUAV { get; set; }
        public string UAVClass { get; set; }
        public string ZoneClass { get; set; }
        public string OperationCategory { get; set; }
        public ZoneAnalysisDto Analysis { get; set; }
    }
}
