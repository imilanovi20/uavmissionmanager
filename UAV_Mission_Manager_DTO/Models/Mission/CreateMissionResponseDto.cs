using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.Mission
{
    public class CreateMissionResponseDto
    {
        public MissionDto Mission { get; set; }
        public string Response { get; set; }
    }
}
