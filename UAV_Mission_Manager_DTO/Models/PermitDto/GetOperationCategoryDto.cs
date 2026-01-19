using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.PathPlanning;

namespace UAV_Mission_Manager_DTO.Models.PermitDto
{
    public class GetOperationCategoryDto
    {
        public List<PointDto> Waypoints { get; set; }
        public List<int> UAVIds { get; set; }
    }
}
