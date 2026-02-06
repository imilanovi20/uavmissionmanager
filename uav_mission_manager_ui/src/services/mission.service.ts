/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import type { CreateMissionDto, CreateMissionResponseDto, Mission } from "../types/mission.types";
import { ENDPOINTS } from "../utils/constants";
import { api } from "./api";

class MissionService {
    // Cache SAMO za mission details
    private missionCache = new Map<number, { data: Mission; timestamp: number }>();
    private readonly DETAIL_CACHE_DURATION = 3 * 60 * 1000; // 3 minute

    // Helper funkcija za mapiranje backend response
    private mapMissionResponse(mission: any): Mission {
        return {
            ...mission,
            uavs: mission.uaVs || mission.uavs || []
        };
    }

    // LISTA - bez cachinga, uvijek fresh
    async getAllMissions(): Promise<Mission[]> {
        try {
            const response = await api.get<any[]>(ENDPOINTS.MISSIONS);
            return response.data.map(m => this.mapMissionResponse(m));
        } catch (error) {
            throw error;
        }
    }

    async getUserMissions(username: string): Promise<Mission[]> {
        try {
            const response = await api.get<any[]>(`${ENDPOINTS.MISSIONS}/user/${username}`);
            return response.data.map(m => this.mapMissionResponse(m));
        } catch (error) {
            throw error;
        }
    }

    // DETAILS - SA cachingom
    async getMissionById(missionId: number): Promise<Mission> {
        try {
            // Provjeri cache
            const cached = this.missionCache.get(missionId);
            if (cached && Date.now() - cached.timestamp < this.DETAIL_CACHE_DURATION) {
                console.log(` Using cached mission detail ${missionId}`);
                return cached.data;
            }

            console.log(`Fetching mission detail ${missionId}...`);
            const response = await api.get<any>(`${ENDPOINTS.MISSIONS}/${missionId}`);
            const mission = this.mapMissionResponse(response.data);

            // Spremi u cache
            this.missionCache.set(missionId, {
                data: mission,
                timestamp: Date.now()
            });

            return mission;
        } catch (error) {
            throw error;
        }
    }

    async createMission(missionData: CreateMissionDto): Promise<CreateMissionResponseDto> {
        try {
            const response = await api.post<CreateMissionResponseDto>(ENDPOINTS.MISSIONS, missionData);

            // Ne treba èistiti ništa - lista se ne cacheira

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteMission(id: number): Promise<void> {
        try {
            await api.delete(`${ENDPOINTS.MISSIONS}/${id}`);

            // Oèisti samo detail cache za obrisanu misiju
            this.missionCache.delete(id);
        } catch (error) {
            throw error;
        }
    }

    // Metoda za ruèno èišæenje detail cache-a
    clearDetailCache(missionId?: number): void {
        if (missionId) {
            this.missionCache.delete(missionId);
        } else {
            this.missionCache.clear();
        }
    }
}

export const missionService = new MissionService();