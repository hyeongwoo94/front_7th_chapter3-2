import { ProductWithUI } from '../constants';
import { Product } from '../../types';

// 가격 포맷팅 함수
export const formatPrice = (
  price: number,
  options?: {
    isAdmin?: boolean;
    product?: Product | ProductWithUI;
    remainingStock?: number;
  }
): string => {
  const { isAdmin = false, product, remainingStock } = options || {};

  // 재고가 0 이하면 SOLD OUT 표시
  if (product && remainingStock !== undefined && remainingStock <= 0) {
    return 'SOLD OUT';
  }

  // 관리자 모드: "10,000원" 형식
  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }
  
  // 고객 모드: "₩10,000" 형식
  return `₩${price.toLocaleString()}`;
};

