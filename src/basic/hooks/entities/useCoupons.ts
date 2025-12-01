import { useState, useCallback, useEffect } from 'react';
import { Coupon } from '../../../types';
import { initialCoupons } from '../../constants';

// 쿠폰 관리 Hook
export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  // 쿠폰 추가
  const addCoupon = useCallback((newCoupon: Coupon) => {
    const existingCoupon = coupons.find(c => c.code === newCoupon.code);
    if (existingCoupon) {
      return { success: false, message: '이미 존재하는 쿠폰 코드입니다.' };
    }
    setCoupons(prev => [...prev, newCoupon]);
    return { success: true, message: '쿠폰이 추가되었습니다.' };
  }, [coupons]);

  // 쿠폰 삭제
  const deleteCoupon = useCallback((couponCode: string) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
  }, []);

  return {
    coupons,
    addCoupon,
    deleteCoupon
  };
};

