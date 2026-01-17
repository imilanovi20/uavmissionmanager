using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.UAVPostion;

namespace UAV_Mission_Manager_DTO.Models.Formation
{
    public class CreateFormationDto
    {
        public int Order { get; set; }
        public int MissionId { get; set; }
        public string FormationType { get; set; }
        public List<CreateUAVPositionDto> UAVPositions { get; set; }
    }
}
