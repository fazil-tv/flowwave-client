import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { decode, JwtPayload } from 'jsonwebtoken';
import { useGetUserByIdQuery } from '@/redux/user/userApi';
import type { RootState } from '@/redux/store';

export const useGlobalUser = () => {
    const { Token } = useSelector((state: RootState) => state.user);

    
    const userId = useMemo(() => {
        if (Token) {
            try {
                const decoded = decode(Token) as JwtPayload & { id?: string };
           
                return decoded.id || null;
            } catch (error) {
                console.error('Token decoding error', error);
                return null;
            }
        }
        return null;
    }, [Token]);
    

    const { 
        data: user, 
        isLoading, 
        isError,
        refetch 
    } = useGetUserByIdQuery(userId ?? '', {
        skip: !userId,
    });

    
   

    return {
        user,
        isLoading,
        isError,
        refetch,
        userId,
        isAuthenticated: !!Token
    };
};