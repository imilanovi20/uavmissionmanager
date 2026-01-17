using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.UAVPostion
{
    public class CreateUAVPositionDto
    {
        public int UAVId { get; set; }
        public double RelativeX { get; set; }
        public double RelativeY { get; set; }
    }
}
