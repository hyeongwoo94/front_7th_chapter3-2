// 타입 정의만 포함 (import 불필요)

// 상품 폼 타입
export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

// 쿠폰 폼 타입
export interface CouponFormData {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

// 빈 폼 초기값
export const EMPTY_PRODUCT_FORM: ProductFormData = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: []
};

export const EMPTY_COUPON_FORM: CouponFormData = {
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0
};

// Admin 탭 타입
export type AdminTab = 'products' | 'coupons';

