export interface Task {
  id: number;
  order: number;
  type: TaskType;
  parameters?: string;
  uavId?: number;
}

export const TaskType = {
  Takeoff: 'Takeoff',
  MoveToPosition: 'MoveToPosition',
  Land: 'Land',
  ExecuteCommand: 'ExecuteCommand',
  ChangeFormation: 'ChangeFormation'
} as const;

export type TaskType = typeof TaskType[keyof typeof TaskType];