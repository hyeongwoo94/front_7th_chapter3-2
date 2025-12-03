import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CartItem, Coupon, Product } from '../../types';
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  calculateCartTotal,
  getRemainingStock
} from '../models/cart';
import { validateCoupon } from '../models/coupon';
import { MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON } from '../constants';

// localStorage와 자동 동기화되는 atom
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

export const selectedCouponAtom = atom<Coupon | null>(null); // 쿠폰 모드

// Derived Atoms
export const totalAtom = atom((get) => { // 총액 데이터
  const cart = get(cartAtom);
  const coupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, coupon);
});
// 1. 장바구니 안의 데이터 가져오기
// 2. 선택된 쿠폰 가져오기
// 3. 장바구니의 상품과 쿠폰을 사용해서 할인 전/후 총액 객체 반환.
export const totalItemCountAtom = atom((get) => { // 총 상품 개수
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});
// 1. 장바구니 안의 데이터 가져오기
// 2. 상품의 총 갯수 반환하기

// Write-only Atoms (액션)
export const addToCartAtom = atom( // 장바구니에 상품 추가하기
  null,
  (get, set, product: Product) => {
    const cart = get(cartAtom);
    const remainingStock = getRemainingStock(product, cart);
    
    if (remainingStock <= 0) {
      return { success: false, message: '재고가 부족합니다!' };
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.stock) {
        return { success: false, message: '재고가 부족합니다!' };
      }
      const newCart = updateCartItemQuantity(cart, product.id, newQuantity);
      set(cartAtom, newCart);
    } else {
      const newCart = addItemToCart(cart, product);
      set(cartAtom, newCart);
    }

    return { success: true, message: '장바구니에 담았습니다' };
  }
);
// 1. 장바구니 안의 데이터 가져오기
// 2. 해당 상품의 남은 재고 개수 계산
// 3. 남은 재고가 0 이하이면 재고 부족 메시지 반환
// 4. 장바구니에서 해당 상품 찾기
// 5. 기존 아이템이 있으면 수량 1 증가, 증가 후 수량이 재고를 초과하면 재고 부족 반환, 아니면 수량 업데이트
// 6. 기존 아이템이 없으면 장바구니에 새로 추가
export const removeFromCartAtom = atom( //장장바구니 상품 삭제
  null,
  (get, set, productId: string) => {
    const cart = get(cartAtom);
    const newCart = removeItemFromCart(cart, productId);
    set(cartAtom, newCart);
  }
);
// 1. 장바구니 데이터 가져오기
// 2. 해당 아이디 상품을 장바구니 안의 데이터에서 지우기
// 3 . 새로운 장바구니 데이터 상태로 업데이트
export const updateQuantityAtom = atom( //수량 업데이트
  null,
  (get, set, productId: string, quantity: number) => {
    const cart = get(cartAtom);
    const cartItem = cart.find(item => item.product.id === productId);
    
    if (!cartItem) {
      return { success: false, message: '장바구니에 해당 상품이 없습니다.' };
    }

    const product = cartItem.product;
    if (quantity > product.stock) {
      return {
        success: false,
        message: `재고는 ${product.stock}개까지만 있습니다.`
      };
    }

    const newCart = updateCartItemQuantity(cart, productId, quantity);
    set(cartAtom, newCart);
    return { success: true };
  }
);
// 1. 장바구니 데이터 가져오기
// 2. 지정한 상품 찾기
// 3. 만약 상품이 없다면 없다는 메세지 내보내기
// 4. 요청한 수량이 재고보다 많다면 재고 부족 메시지 반환
// 5. 업데이트 된 수량의 아이템으로 장바구니 데이터 업데이트
export const applyCouponAtom = atom( // 쿠폰 적용하기
  null,
  (get, set, coupon: Coupon) => {
    const cart = get(cartAtom);
    const { totalAfterDiscount } = calculateCartTotal(cart, coupon);
    
    if (!validateCoupon(totalAfterDiscount, coupon)) {
      return {
        success: false,
        message: `percentage 쿠폰은 ${MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON.toLocaleString()}원 이상 구매 시 사용 가능합니다.`
      };
    }

    set(selectedCouponAtom, coupon);
    return { success: true, message: '쿠폰이 적용되었습니다.' };
  }
);
// 1. 장바구니 데이터 가져오기
// 2. 순수함수로 쿠폰이 적용 된 금액 총액 가져오기
// 3. 선택한 쿠폰이 유효하지 않을경우 경고문 내보내기
// 4. 새로운 쿠폰으로 업데이트
// 5. 쿠폰이 사용된 메세지 내보내기
export const setSelectedCouponAtom = atom( // 쿠폰 선택하기
  null,
  (get, set, coupon: Coupon | null) => {
    set(selectedCouponAtom, coupon);
  }
);

export const clearCartAtom = atom( // 장바구니 초기화
  null,
  (get, set) => {
    set(cartAtom, []);
    set(selectedCouponAtom, null);
  }
);

export const completeOrderAtom = atom( // 주문 완료
  null,
  (get, set) => {
    set(cartAtom, []);
    set(selectedCouponAtom, null);
  }
);

// 유틸리티 함수를 위한 atom (getRemainingStockForProduct)
export const getRemainingStockForProductAtom = atom( // 상품의 남은 재고 계산 함수
  (get) => (product: Product) => {
    const cart = get(cartAtom);
    return getRemainingStock(product, cart);
  }
);

