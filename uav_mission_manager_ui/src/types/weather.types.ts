export interface WeatherData {
    id: number;
    temperature: number;
    windSpeed: number;
    windDirection: string;
    isSafeForFlight: boolean;
    fetchedAt: string;
    iconCode: number;
}

export interface CreateWeatherDataDto {
    temperature: number;
    windSpeed: number;
    windDirection: string;
    isSafeForFlight: boolean;
    fetchedAt: string;
    iconCode: number;
}