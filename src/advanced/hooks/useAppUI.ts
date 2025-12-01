import { useState } from 'react';
import { useNotifications } from '../utils/hooks/useNotifications';

// 앱 UI 상태 관리 Hook
export const useAppUI = () => {
  // 알림 관리
  const { notifications, addNotification, removeNotification } = useNotifications();

  // 검색어 상태 (Header와 CartPage 공유)
  const [searchTerm, setSearchTerm] = useState('');

  // 모드 전환 상태
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdmin = () => setIsAdmin(prev => !prev);

  return {
    // 알림
    notifications,
    addNotification,
    removeNotification,
    
    // 검색어
    searchTerm,
    setSearchTerm,
    
    // 모드
    isAdmin,
    setIsAdmin,
    toggleAdmin
  };
};

