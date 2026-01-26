using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PermitDto
{
    public class ProjectedFlightTimeResponseDto
    {
        public String ProjectedFlightTime { get; set; }
        public List<FlightTimeUAVDto> FlightTimeUAV { get; set; }
    }
}
