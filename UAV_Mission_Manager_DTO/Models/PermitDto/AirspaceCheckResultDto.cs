using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PermitDto
{
    public class AirspaceCheckResultDto
    {
        public bool Success { get; set; }
        public bool CrossesAirspace { get; set; }
        public string Message { get; set; }
        public int AirportsViolated { get; set; }
        public List<AirspaceViolationDto> Violations { get; set; }
    }
}
