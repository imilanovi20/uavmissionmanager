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
    goToNextPage,
    goToPrevPage
  };
};