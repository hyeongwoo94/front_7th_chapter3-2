import { useAppUI } from './useAppUI';
import { useShoppingMall } from './useShoppingMall';

// 앱 전체 비즈니스 로직 조합 Hook
export const useApp = () => {
  // UI 상태 관리
  const {
    notifications,
    addNotification,
    removeNotification,
    searchTerm,
    setSearchTerm,
    isAdmin,
    toggleAdmin
  } = useAppUI();

  // 비즈니스 로직 조합
  const shoppingMall = useShoppingMall(isAdmin, addNotification);

  return {
    // UI 상태
    notifications,
    addNotification,
    removeNotification,
    searchTerm,
    setSearchTerm,
    isAdmin,
    toggleAdmin,
    
    // 비즈니스 로직
    ...shoppingMall
  };
};

