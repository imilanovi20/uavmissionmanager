import { useState, useEffect } from 'react';
import { equipmentService } from '../services/equipment.service';
import type { Equipment } from '../types/equipment.types';

interface UseEquipmentReturn {
  equipment: Equipment[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  paginatedEquipment: Equipment[];
  setCurrentPage: (page: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

interface UseEquipmentOptions {
  itemsPerPage?: number;
  limit?: number;
}

export const useEquipment = (options: UseEquipmentOptions = {}): UseEquipmentReturn => {
  const { itemsPerPage = 9, limit } = options;
 
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getAllEquipment();
      const limitedData = limit ? data.slice(0, limit) : data;
      setEquipment(limitedData);
    } catch (err) {
      setError('Failed to load equipment. Please try again.');
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [limit]);

  const totalPages = Math.ceil(equipment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEquipment = equipment.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [equipment.length]);

  return {
    equipment,
    loading,
    error,
    refetch: fetchEquipment,
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedEquipment,
    setCurrentPage,
    goToNextPage,
    goToPrevPage
  };
};