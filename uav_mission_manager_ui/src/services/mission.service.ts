/* eslint-disable no-useless-catch */
import type { CreateMissionDto, CreateMissionResponseDto, Mission } from "../types/mission.types";
import { ENDPOINTS } from "../utils/constants";
import { api } from "./api";


class MissionService {
    async getAllMissions(): Promise<[Mission[]]> {
        try {
            const response = await api.get<[Mission[]]>(ENDPOINTS.MISSIONS);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getUserMissions(username: string): Promise<[Mission[]]> {
        try {
            const response = await api.get<[Mission[]]>(ENDPOINTS.MISSIONS+`/${username}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async createMission(missionData: CreateMissionDto): Promise<CreateMissionResponseDto> {
        try {
            const response = await api.post<CreateMissionResponseDto>(ENDPOINTS.MISSIONS, missionData);
            return response.data;
        } catch (error) {
            throw error;
        }
  }
    
    
}

export const missionService = new MissionService();