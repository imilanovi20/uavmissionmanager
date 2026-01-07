using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.WeatherData
{
    public class DailyData
    {
        public string[] time { get; set; }
        public double[] temperature_2m_max { get; set; }
        public double[] temperature_2m_min { get; set; }
        public double[] windspeed_10m_max { get; set; }
        public double[] winddirection_10m_dominant { get; set; }
        public int[] weathercode { get; set; }
    }
}
