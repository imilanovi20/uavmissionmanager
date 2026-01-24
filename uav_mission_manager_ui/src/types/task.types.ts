import type { TaskType } from "../utils/constants";

export interface Task {
  id: number;
  order: number;
  type: TaskType;
  parameters?: string;
  uavId?: number;
}

export interface CreateTaskDto {
  order: number;
  type: TaskType;
  parameters?: string;
  uavId?: number;
}