import {useEffect} from 'react';
import {useGetUserPreferences} from './use-get-user-preferences';
import {useLogOut} from '@/modules/auth/hooks/use-log-out';

export const useAutomaticLogout = () => {
  const {data: userPreferences} = useGetUserPreferences();
  const {mutate: logout} = useLogOut();

  useEffect(() => {
    return () => {
      if (userPreferences?.automaticLogout) {
        logout();
      }
    };
  }, [userPreferences?.automaticLogout, logout]);
};
