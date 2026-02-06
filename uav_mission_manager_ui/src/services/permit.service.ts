import type { PointDto } from "../types/pathPlanning.types";
import type { AirspaceCheckResult, GetOperationCategoryDto, GetProjectedFlightTimeDto, OperationCategoryResponse, ProjectedFlightTimeResponseDto, RecordingPermissionDto } from "../types/permit.types";
import type { Task } from "../types/task.types";
import { ENDPOINTS } from "../utils/constants";
import { api } from "./api";

class PermitService {
    async calculateOperationCategory(
        dto: GetOperationCategoryDto
        ): Promise<OperationCategoryResponse> {
        try {
            const response = await api.post<OperationCategoryResponse>(
                ENDPOINTS.PERMIT + "/operationcategory",
                dto);
            return response.data;
        } catch (error: any) {
            console.error('Error adding UAV:', error);
            throw error;
        }
    }

    async checkRecordingPermission(
        tasks: Task[]
    ): Promise<RecordingPermissionDto> {
        try {
            // Mapiranje Task[] u format koji Backend oèekuje
            const taskDtos = tasks.map(task => ({
                id: task.id || 0,
                type: task.type,
                order: task.order || 0,
                uavId: task.uavId || 0,
                parameters: typeof task.parameters === 'string'
                    ? task.parameters
                    : JSON.stringify(task.parameters)
            }));

            console.log('Sending recording permission request:', taskDtos);
            const response = await api.post<RecordingPermissionDto>(
                ENDPOINTS.PERMIT + "/recordingpermission",
                taskDtos);  // šalji mapirane taskove
            console.log('Recording permission response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Recording permission error:', error);
            console.error('Error response:', error.response?.data);
            throw error;
        }
    }

    async checkAirspace(
        routePoints: PointDto[]
        ): Promise<AirspaceCheckResult> {
        try {
            const response = await api.post<AirspaceCheckResult>(
                ENDPOINTS.PERMIT + "/checkairspace",
                routePoints);
            return response.data;
        } catch (error: any) {
            console.error('Error adding UAV:', error);
            throw error;
        }
    }

    async getProjectedFlightTime(
        dto: GetProjectedFlightTimeDto
        ): Promise<ProjectedFlightTimeResponseDto> {
        try {
            const response = await api.post<ProjectedFlightTimeResponseDto>(
                ENDPOINTS.PERMIT + "/projectedflighttime",
                dto);
            return response.data;
        } catch (error: any) {
            console.error('Error adding UAV:', error);
            throw error;
        }
    }

}

export const permitService = new PermitService();