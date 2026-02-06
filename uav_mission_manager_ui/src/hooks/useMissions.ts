import { useState, useEffect, useMemo } from 'react';
import { missionService } from '../services/mission.service';
import type { Mission } from '../types/mission.types';
import type { MissionStatus } from '../components/Cards/WideCard/WideCard.types';

interface UseMissionsOptions {
    showAllMissions?: boolean;
    currentUsername?: string;
    isAdmin?: boolean;
}

interface UseMissionsReturn {
    missions: Mission[];
    loading: boolean;
    error: string | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: MissionStatus | 'all';
    setStatusFilter: (filter: MissionStatus | 'all') => void;
    filteredMissions: Mission[];
    deleteMission: (id: number) => Promise<void>;
    refetch: () => Promise<void>;
    getMissionStatus: (date: string) => MissionStatus;
}

export const useMissions = (options: UseMissionsOptions = {}): UseMissionsReturn => {
    const { showAllMissions = false, currentUsername, isAdmin = false } = options;

    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<MissionStatus | 'all'>('all');

    const getMissionStatus = (date: string): MissionStatus => {
        const missionDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const missionDay = new Date(missionDate);
        missionDay.setHours(0, 0, 0, 0);

        if (missionDay > today) return 'upcoming';
        if (missionDay < today) return 'completed';
        return 'active';
    };

    const fetchMissions = async () => {
        try {
            setLoading(true);
            setError(null);

            let data: Mission[];

            // Ako je admin I showAllMissions je true, dohvati sve
            if (isAdmin && showAllMissions) {
                data = await missionService.getAllMissions();
            }
            // Inaèe dohvati samo misije trenutnog korisnika
            else if (currentUsername) {
                data = await missionService.getUserMissions(currentUsername);
            } else {
                // Ako nema username-a, postavi praznu listu
                data = [];
            }

            setMissions(data);
        } catch (err) {
            setError('Failed to load missions. Please try again.');
            console.error('Error fetching missions:', err);
        } finally {
            setLoading(false);
        }
    };
    const deleteMission = async (id: number) => {
        try {
            await missionService.deleteMission(id);
            await fetchMissions(); // Refresh list
        } catch (err) {
            setError('Failed to delete mission');
            console.error('Error deleting mission:', err);
            throw err;
        }
    };

    useEffect(() => {
        if (currentUsername !== undefined) {
            fetchMissions();
        }
    }, [showAllMissions, currentUsername, isAdmin]);

    const filteredMissions = useMemo(() => {
        let result = [...missions];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(mission =>
                mission.name.toLowerCase().includes(query) ||
                mission.description.toLowerCase().includes(query) ||
                mission.createdByUsername.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(mission => getMissionStatus(mission.date) === statusFilter);
        }

        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return result;
    }, [missions, searchQuery, statusFilter]);

    return {
        missions,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        filteredMissions,
        deleteMission,
        refetch: fetchMissions,
        getMissionStatus
    };
};