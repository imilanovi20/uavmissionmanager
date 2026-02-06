import type { UAV } from "../types/uav.types";
import { ENDPOINTS } from "../utils/constants";
import { api } from "./api";

class UAVService {
    async getAllUAVs(): Promise<UAV[]> {
        try {
            const response = await api.get<UAV[]>(ENDPOINTS.UAVS);
            return response.data;
        } catch (error) {
            console.error('Error fetching UAVs:', error);
            throw error;
        }
    }  

    async addUAV(uavData: Partial<UAV>): Promise<UAV> {
        try {
            const response = await api.post<UAV>(ENDPOINTS.UAVS, uavData);
            return response.data;
        } catch (error) {
            console.error('Error adding UAV:', error);
            throw error;
        }
    }

    async deleteUAV(id: number): Promise<void> {
        try {
            await api.delete(`${ENDPOINTS.UAVS}/${id}`);
        } catch (error) {
            console.error('Error deleting UAV:', error);
            throw error;
        }
    }


}

export const uavService = new UAVService();