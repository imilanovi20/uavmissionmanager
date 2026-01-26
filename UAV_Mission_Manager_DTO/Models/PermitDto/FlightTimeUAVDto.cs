using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PermitDto
{
    public class FlightTimeUAVDto
    {
        public int UAVId { get; set; }
        public string FlightTime { get; set; }
        public Boolean IsFeasible { get; set; }
        public double BatteryUsage { get; set; }
    }
}
