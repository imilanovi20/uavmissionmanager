import type { GetWeatherDataDto, WeatherData } from "../types/weather.types";
import { ENDPOINTS } from "../utils/constants";
import { api } from "./api";

class WeatherService {
    async getWeatherData(dto: GetWeatherDataDto): Promise<WeatherData> {
        try {
            const response = await api.post<WeatherData>
                (ENDPOINTS.WEATHER + "/forecast", 
                    dto,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
            return response.data;
        } catch (error) {
            console.error('Error getting weather data:', error);
            throw error;
        }
    }
}

export const weatherService = new WeatherService();