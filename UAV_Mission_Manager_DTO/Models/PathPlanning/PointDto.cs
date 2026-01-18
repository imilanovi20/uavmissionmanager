using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PathPlanning
{
    public class PointDto
    {
        public int Order { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}
