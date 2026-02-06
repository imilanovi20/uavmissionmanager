import { useState, useEffect } from 'react';
import { UserService } from '../services/user.service';
import type { User } from '../types/user.types';

interface UseUsersReturn {
    users: User[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    paginatedUsers: User[];
    setCurrentPage: (page: number) => void;
    deleteUser: (username: string) => Promise<void>; 
    goToNextPage: () => void;
    goToPrevPage: () => void;
}

interface UseUsersOptions {
    itemsPerPage?: number;
    limit?: number;
}

export const useUsers = (options: UseUsersOptions = {}): UseUsersReturn => {
    const { itemsPerPage = 9, limit } = options;
    const userService = new UserService();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userService.getAllUsers();
            const limitedData = limit ? data.slice(0, limit) : data;
            setUsers(limitedData);
        } catch (err) {
            setError('Failed to load users. Please try again.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (username: string) => {
        try {
            await userService.deleteUser(username);
            const updatedUsers = await userService.getAllUsers();
            const limitedData = limit ? updatedUsers.slice(0, limit) : updatedUsers;
            setUsers(limitedData);
        } catch (err) {
            setError('Failed to delete user');
            console.error('Error deleting user:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [limit]);

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    const goToPrevPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [users.length]);

    return {
        users,
        loading,
        error,
        refetch: fetchUsers,
        currentPage,
        totalPages,
        itemsPerPage,
        paginatedUsers,
        setCurrentPage,
        deleteUser,  // dodaj ovo
        goToNextPage,
        goToPrevPage
    };
};