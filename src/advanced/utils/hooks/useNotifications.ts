import { useState, useCallback } from 'react';
import { Notification } from '../../components/ui/Toast';
import { NOTIFICATION_DURATION } from '../../constants';

// 알림 관리 유틸리티 Hook
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 알림 추가
  const addNotification = useCallback((
    message: string,
    type: 'error' | 'success' | 'warning' = 'success'
  ) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, NOTIFICATION_DURATION);
  }, []);

  // 알림 제거
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification
  };
};

