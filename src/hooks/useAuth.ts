import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authService } from '@/services/authService';
import { setUser, clearUser, setLoading } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(setLoading(true));
      
      try {
        // Check if user has stored auth token
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // Try to get current session
          const result = await authService.getCurrentSession();
          
          if (result.success && result.user) {
            dispatch(setUser(result.user));
          } else {
            // Clear invalid token
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            dispatch(clearUser());
          }
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        dispatch(clearUser());
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch]);
};