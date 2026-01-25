export const API_BASE_URL = 'https://localhost:7000/api';
export const ENDPOINTS = {
  LOGIN: '/user/login',
  REGISTER: '/user/registration',
  ME: '/user/me',
  USERS: '/user',
  UAVS: '/uav',
  EQUIPMENT: '/equipment',
  MISSIONS: '/mission',
  PATH: '/path',
  WEATHER: '/weather',
  PERMIT: '/permit'
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

export const TaskType = {
  Takeoff: 'Takeoff',
  MoveToPosition: 'MoveToPosition',
  Land: 'Land',
  ExecuteCommand: 'ExecuteCommand',
  ChangeFormation: 'ChangeFormation'
} as const;

export type TaskType = typeof TaskType[keyof typeof TaskType];