using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.PermitDto
{
    public class ZoneAnalysisDto
    {
        public int BuildingsDetected { get; set; }
        public int ResidentialAreas { get; set; }
        public int IndustrialAreas { get; set; }
        public string PopulationDensity { get; set; }
        public double AnalyzedAreaKm2 { get; set; }
    }

}
