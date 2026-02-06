import { useState, useEffect } from 'react';
import { uavService } from '../services/uav.service';
import type { UAV } from '../types/uav.types';

interface UseUAVReturn {
    uavs: UAV[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    paginatedUAVs: UAV[];
    setCurrentPage: (page: number) => void;
    deleteUAV: (id: number) => Promise<void>;  // dodaj ovo
    goToNextPage: () => void;
    goToPrevPage: () => void;
}

interface UseUAVOptions {
    itemsPerPage?: number;
    limit?: number;
}

export const useUAV = (options: UseUAVOptions = {}): UseUAVReturn => {
    const { itemsPerPage = 9, limit } = options;

    const [uavs, setUAVs] = useState<UAV[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchUAVs = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await uavService.getAllUAVs();
            const limitedData = limit ? data.slice(0, limit) : data;
            setUAVs(limitedData);
        } catch (err) {
            setError('Failed to load UAVs. Please try again.');
            console.error('Error fetching UAVs:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUAV = async (id: number) => {
        try {
            await uavService.deleteUAV(id);
            const updatedUAVs = await uavService.getAllUAVs();
            const limitedData = limit ? updatedUAVs.slice(0, limit) : updatedUAVs;  // primijeni limit
            setUAVs(limitedData);
        } catch (err) {
            setError('Failed to delete UAV');
            console.error('Error deleting UAV:', err);  // dodaj log
        }
    };

    useEffect(() => {
        fetchUAVs();
    }, [limit]);

    const totalPages = Math.ceil(uavs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUAVs = uavs.slice(startIndex, startIndex + itemsPerPage);

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    const goToPrevPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [uavs.length]);

    return {
        uavs,
        loading,
        error,
        refetch: fetchUAVs,
        currentPage,
        totalPages,
        itemsPerPage,
        paginatedUAVs,
        setCurrentPage,
        deleteUAV,
        goToNextPage,
        goToPrevPage
    };
};