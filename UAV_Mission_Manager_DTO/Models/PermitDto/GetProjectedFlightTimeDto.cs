using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.PathPlanning;

namespace UAV_Mission_Manager_DTO.Models.PermitDto
{
    public class GetProjectedFlightTimeDto
    {
        public List<int> UAVIds { get; set; }
        public List<PointDto> Points { get; set; }
    }
}
