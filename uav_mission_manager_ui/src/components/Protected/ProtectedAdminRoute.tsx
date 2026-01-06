import React from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';

import { Outlet } from 'react-router-dom';
import { AccessDeniedContainer, AccessDeniedMessage, ErrorText, ErrorTitle } from './PtotectedAdminRoute.styles';

const ProtectedAdminRoute: React.FC = () => {
    const { isAdmin, loading } = useCurrentUser();
    
    if (loading) {
        return <p>Loading...</p>;
    }
 
    return isAdmin ? <Outlet /> : (
        <AccessDeniedContainer>
            <AccessDeniedMessage>
                <ErrorTitle>Access Denied</ErrorTitle>
                <ErrorText>You must be logged as admin to access this page.</ErrorText>
            </AccessDeniedMessage>
        </AccessDeniedContainer>
    );
};

export default ProtectedAdminRoute;