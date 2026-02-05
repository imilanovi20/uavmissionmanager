using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using UAV_Mission_Manager_DTO.Models.PathPlanning;
using UAV_Mission_Manager_DTO.Models.WeatherData;

namespace UAV_Mission_Manager_BAL.Services.WeatherService
{
    public class WeatherService : IWeatherService
    {
        private readonly HttpClient _httpClient;
        private const string OpenMeteoBaseUrl = "https://api.open-meteo.com/v1/forecast";

        public WeatherService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<WeatherDataDto> GetWeatherForecastAsync(GetWeatherDataDto dto)
        {
            try
            {
                var dateStr = dto.Date.ToString("yyyy-MM-dd");
                (double latitude, double longitude) = GetCenterPoint(dto.Points);

                var url = $"{OpenMeteoBaseUrl}?" +
                         $"latitude={latitude.ToString(System.Globalization.CultureInfo.InvariantCulture)}&" +
                         $"longitude={longitude.ToString(System.Globalization.CultureInfo.InvariantCulture)}&" +
                         $"daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,winddirection_10m_dominant,weathercode&" +
                         $"start_date={dateStr}&" +
                         $"end_date={dateStr}&" +
                         $"timezone=Europe/Zagreb";

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var weatherResponse = JsonSerializer.Deserialize<OpenMeteoResponse>(content);

                if (weatherResponse?.daily == null || weatherResponse.daily.time.Length == 0)
                {
                    throw new Exception("No weather data returned from OpenMeteo API");
                }

                var avgTemp = (weatherResponse.daily.temperature_2m_max[0] + weatherResponse.daily.temperature_2m_min[0]) / 2;
                var windSpeed = weatherResponse.daily.windspeed_10m_max[0];
                var weatherCode = weatherResponse.daily.weathercode[0];
                var windDirection = GetWindDirection(weatherResponse.daily.winddirection_10m_dominant[0]);

                var isSafe = IsSafeForFlight(avgTemp, windSpeed);

                return new WeatherDataDto
                {
                    Temperature = Math.Round(avgTemp, 1),
                    WindSpeed = Math.Round(windSpeed, 1),
                    WindDirection = windDirection,
                    IsSafeForFlight = isSafe,
                    WeatherCode = weatherCode
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to fetch weather forecast. Please try again later.", ex);
            }
        }

        private (double latitude, double longitude) GetCenterPoint(List<PointDto> points)
        {
            if (points == null || points.Count == 0)
            {
                throw new ArgumentException("Points list cannot be null or empty");
            }

            if (points.Count == 1)
            {
                return (points[0].Lat, points[0].Lng);
            }

            double x = 0, y = 0, z = 0;

            foreach (var point in points)
            {
                double latRad = point.Lat * Math.PI / 180.0;
                double lonRad = point.Lng * Math.PI / 180.0;

                x += Math.Cos(latRad) * Math.Cos(lonRad);
                y += Math.Cos(latRad) * Math.Sin(lonRad);
                z += Math.Sin(latRad);
            }

            int total = points.Count;
            x /= total;
            y /= total;
            z /= total;

            double centralLongitude = Math.Atan2(y, x);
            double centralSquareRoot = Math.Sqrt(x * x + y * y);
            double centralLatitude = Math.Atan2(z, centralSquareRoot);
            
            double latitude = centralLatitude * 180.0 / Math.PI;
            double longitude = centralLongitude * 180.0 / Math.PI;

            return (latitude, longitude);
        }

        private bool IsSafeForFlight(double temperature, double windSpeed)
        {
            return temperature >= -10 && temperature <= 40 && windSpeed <= 40;
        }


        private string GetWindDirection(double degrees)
        {
            if (degrees >= 337.5 || degrees < 22.5) return "N";
            if (degrees >= 22.5 && degrees < 67.5) return "NE";
            if (degrees >= 67.5 && degrees < 112.5) return "E";
            if (degrees >= 112.5 && degrees < 157.5) return "SE";
            if (degrees >= 157.5 && degrees < 202.5) return "S";
            if (degrees >= 202.5 && degrees < 247.5) return "SW";
            if (degrees >= 247.5 && degrees < 292.5) return "W";
            if (degrees >= 292.5 && degrees < 337.5) return "NW";
            return "Unknown";
        }
    }
}
