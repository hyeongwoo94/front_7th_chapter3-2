import { Coupon } from '../../types';
import { MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON } from '../constants';

// 쿠폰을 총액에 적용
/**
 * 쿠폰을 총액에 적용
 * @param total 할인 적용 전 총액
 * @param coupon 적용할 쿠폰
 * @returns 쿠폰 적용 후 총액
 */
export const applyCouponToTotal = (
  total: number,
  coupon: Coupon
): number => {
  if (coupon.discountType === 'amount') {
    return Math.max(0, total - coupon.discountValue);
  } else {
    return Math.round(total * (1 - coupon.discountValue / 100));
  }
};

// 쿠폰 사용 가능 여부 검증
/**
 * 쿠폰 사용 가능 여부 검증
 * @param total 현재 총액
 * @param coupon 검증할 쿠폰
 * @returns 사용 가능 여부
 */
export const validateCoupon = (
  total: number,
  coupon: Coupon
): boolean => {
  if (coupon.discountType === 'percentage') {
    return total >= MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON;
  }
  return true;
};

