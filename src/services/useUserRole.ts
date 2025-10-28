// src/services/useUserRole.ts

import { useState } from 'react';

type UserRole = 'Developer' | 'Director' | 'AVP' | 'MIS';

/**
 * Hook to simulate user role authentication based on the project requirements.
 * In a real Power App, this data would come from the Power Platform integration 
 * (e.g., using context or another API call).
 */
export const useUserRole = () => {
    // For development, hardcode a role that should have action permissions
    const [role, setRole] = useState<UserRole>('Director'); 
    
    // Define which roles are authorized to take performance actions
    const canTakeAction = role === 'Director' || role === 'AVP';

    return {
        role,
        canTakeAction,
        // Optional: Add a setter for testing different roles
        setRole 
    };
};