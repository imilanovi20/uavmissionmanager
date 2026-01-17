using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.UAVPostion;

namespace UAV_Mission_Manager_DTO.Models.Formation
{
    public class FormationDto
    {
        public string FormationType { get; set; }
        public List<UAVPositionDto>? UAVPositions { get; set; }
        public int Order { get; set; }
    }
}
