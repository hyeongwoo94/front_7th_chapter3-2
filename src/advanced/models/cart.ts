import { CartItem, Product, Coupon } from '../../types';
import {
  BULK_PURCHASE_QUANTITY,
  BULK_PURCHASE_ADDITIONAL_DISCOUNT,
  MAX_DISCOUNT_RATE
} from '../constants';
import { applyCouponToTotal } from './coupon';

// 적용 가능한 최대 할인율 계산
/**
 * 적용 가능한 최대 할인율 계산
 * @param item 장바구니 아이템
 * @param cart 전체 장바구니 (대량 구매 확인용)
 * @returns 최대 할인율 (0 ~ 1)
 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;
  
  // 기본 할인율 계산
  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount 
      ? discount.rate 
      : maxDiscount;
  }, 0);
  
  // 대량 구매 추가 할인 확인
  const hasBulkPurchase = cart.some(
    cartItem => cartItem.quantity >= BULK_PURCHASE_QUANTITY
  );
  
  if (hasBulkPurchase) {
    return Math.min(
      baseDiscount + BULK_PURCHASE_ADDITIONAL_DISCOUNT,
      MAX_DISCOUNT_RATE
    );
  }
  
  return baseDiscount;
};

// 개별 아이템의 할인 적용 후 총액 계산
/**
 * 개별 아이템의 할인 적용 후 총액 계산
 * @param item 장바구니 아이템
 * @param cart 전체 장바구니 (대량 구매 확인용)
 * @returns 할인 적용 후 총액
 */
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);
  
  return Math.round(price * quantity * (1 - discount));
};

// 장바구니 총액 계산 (할인 전/후)
/**
 * 장바구니 총액 계산 (할인 전/후)
 * @param cart 장바구니 아이템 배열
 * @param selectedCoupon 선택된 쿠폰 (null 가능)
 * @returns 할인 전 총액과 할인 후 총액
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  // 쿠폰 적용
  if (selectedCoupon) {
    totalAfterDiscount = applyCouponToTotal(totalAfterDiscount, selectedCoupon);
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount)
  };
};

// 남은 재고 계산
/**
 * 남은 재고 계산
 * @param product 상품
 * @param cart 장바구니 (현재 주문 수량 확인용)
 * @returns 남은 재고 수량
 */
export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find(item => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);
  return remaining;
};

// 장바구니에 상품 추가 (순수함수)
/**
 * 장바구니에 상품 추가 (순수함수)
 * @param cart 현재 장바구니
 * @param product 추가할 상품
 * @returns 새로운 장바구니 배열
 */
export const addItemToCart = (
  cart: CartItem[],
  product: Product
): CartItem[] => {
  const existingItem = cart.find(item => item.product.id === product.id);
  
  if (existingItem) {
    // 이미 장바구니에 있으면 수량 증가
    return cart.map(item =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  
  // 장바구니에 없으면 새로 추가
  return [...cart, { product, quantity: 1 }];
};

// 장바구니에서 상품 제거 (순수함수)
/**
 * 장바구니에서 상품 제거 (순수함수)
 * @param cart 현재 장바구니
 * @param productId 제거할 상품 ID
 * @returns 새로운 장바구니 배열
 */
export const removeItemFromCart = (
  cart: CartItem[],
  productId: string
): CartItem[] => {
  return cart.filter(item => item.product.id !== productId);
};

// 장바구니 아이템 수량 변경 (순수함수)
/**
 * 장바구니 아이템 수량 변경 (순수함수)
 * @param cart 현재 장바구니
 * @param productId 변경할 상품 ID
 * @param quantity 새로운 수량
 * @returns 새로운 장바구니 배열
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  quantity: number
): CartItem[] => {
  if (quantity <= 0) {
    // 수량이 0 이하면 제거
    return removeItemFromCart(cart, productId);
  }
  
  return cart.map(item =>
    item.product.id === productId
      ? { ...item, quantity }
      : item
  );
};
