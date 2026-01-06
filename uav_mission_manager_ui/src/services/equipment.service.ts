import type { Equipment } from "../types/equipment.types";
import { ENDPOINTS } from "../utils/constants";
import { api } from "./api";

class EquipmentService {
    async getAllEquipment(): Promise<Equipment[]> {
        try {
            const response = await api.get<Equipment[]>(ENDPOINTS.EQUIPMENT);
            return response.data;
        } catch (error) {
            throw error;
        }
    }  
}

export const equipmentService = new EquipmentService();