export type MissionStatus = 'upcoming' | 'completed' | 'active';

export interface WideCardProps {
    id: number;
    title: string;
    date: string;
    description: string;
    status: MissionStatus;
    uavCount: number;
    teamCount: number;
    waypointCount: number;
    createdBy: string;
    onClick: () => void;
    onDelete?: () => void;  
    showDelete?: boolean;   
}

export interface WideCardMetaItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}