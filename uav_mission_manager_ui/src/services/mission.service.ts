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

    async getMissionById(missionId: number): Promise<Mission> {
        try {
            const cached = this.missionCache.get(missionId);
            if (cached && Date.now() - cached.timestamp < this.DETAIL_CACHE_DURATION) {
                console.log(` Using cached mission detail ${missionId}`);
                return cached.data;
            }

            console.log(`Fetching mission detail ${missionId}...`);
            const response = await api.get<any>(`${ENDPOINTS.MISSIONS}/${missionId}`);
            const mission = this.mapMissionResponse(response.data);

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
        const startTime = performance.now();

        console.log('SENDING_MISSION_DATA');
        console.log('PAYLOAD_SIZE:', JSON.stringify(missionData).length, 'bytes');

        try {
            // Start timing the actual API call
            console.time('API_CALL_DURATION');

            const response = await api.post<CreateMissionResponseDto>(
                ENDPOINTS.MISSIONS,
                missionData,
                {
                    timeout: 60000,
                    // Compression if backend supports it
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Encoding': 'gzip, deflate'
                    },
                    // Don't transform response - faster
                    transformResponse: [(data) => data]
                }
            );

            console.timeEnd('API_CALL_DURATION');

            const endTime = performance.now();
            console.log('FRONTEND_OVERHEAD:', (endTime - startTime) - (performance.now() - startTime), 'ms');

            // Parse response if needed
            const parsedData = typeof response.data === 'string'
                ? JSON.parse(response.data)
                : response.data;

            console.log('MISSION_CREATED:', parsedData);

            return parsedData;

        } catch (error: any) {
            console.timeEnd('API_CALL_DURATION');
            console.error('CREATE_MISSION_FAILED:', error.message);
            console.error('ERROR_DETAILS:', error.response?.data);
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

    clearDetailCache(missionId?: number): void {
        if (missionId) {
            this.missionCache.delete(missionId);
        } else {
            this.missionCache.clear();
        }
    }
}

export const missionService = new MissionService();