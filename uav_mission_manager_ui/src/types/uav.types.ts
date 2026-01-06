import type { Equipment } from "./equipment.types";

export interface UAV{
    id:number;
    name: string;
    type: string;
    maxSpeed: number;
    flightTime: string;
    weight: number;
    imagePath: string;
    additionalEquipments: Equipment[];
}
