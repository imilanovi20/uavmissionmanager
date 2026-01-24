import type { CreateTaskDto, Task } from "./task.types";

export interface Waypoint {
  id: number;
  orderIndex: number;
  latitude: number;
  longitude: number;
  tasks: Task[];
}

export interface CreateWaypointDto {
  latitude: number;
  longitude: number;
  orderIndex: number;
  tasks: CreateTaskDto[];
}