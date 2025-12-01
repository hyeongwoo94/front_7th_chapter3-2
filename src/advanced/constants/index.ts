import { Product, Coupon } from '../../types';

// ProductWithUI는 Product를 확장한 타입 (UI용 추가 필드)
export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

// 초기 상품 목록
export const initialProducts: ProductWithUI[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 }
    ],
    description: '최고급 품질의 프리미엄 상품입니다.'
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.15 }
    ],
    description: '다양한 기능을 갖춘 실용적인 상품입니다.',
    isRecommended: true
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 }
    ],
    description: '대용량과 고성능을 자랑하는 상품입니다.'
  }
];

// 초기 쿠폰 목록
export const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10
  }
];

// UI 관련 상수
export const DEBOUNCE_DELAY = 500; // 검색어 디바운스 지연 시간 (ms)
export const NOTIFICATION_DURATION = 3000; // 알림 표시 시간 (ms)

// 비즈니스 규칙 상수
export const MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON = 10000; // percentage 쿠폰 사용 최소 주문 금액 (원)
export const BULK_PURCHASE_QUANTITY = 10; // 대량 구매 기준 수량
export const BULK_PURCHASE_ADDITIONAL_DISCOUNT = 0.05; // 대량 구매 시 추가 할인율 (5%)
export const MAX_DISCOUNT_RATE = 0.5; // 최대 할인율 (50%)

// 유효성 검사 상수
export const MAX_STOCK = 9999; // 최대 재고 수량
export const MAX_DISCOUNT_AMOUNT = 100000; // 최대 할인 금액 (원)
export const MAX_DISCOUNT_PERCENTAGE = 100; // 최대 할인율 (%)
