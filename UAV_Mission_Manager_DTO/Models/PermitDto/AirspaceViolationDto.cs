using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PermitDto
{
    public class AirspaceViolationDto
    {
        public string AirportName { get; set; }
        public double MinDistanceKm { get; set; }
        public List<int> ViolatingPointIndices { get; set; }
        public object Type { get; set; }
        public string Description { get; set; }
    }
}
