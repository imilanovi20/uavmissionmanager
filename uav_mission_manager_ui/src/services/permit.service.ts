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
            const response = await api.post<RecordingPermissionDto>(
                ENDPOINTS.PERMIT + "/recordingpermission",
                tasks);
            return response.data;
        } catch (error: any) {
            console.error('Error adding UAV:', error);
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