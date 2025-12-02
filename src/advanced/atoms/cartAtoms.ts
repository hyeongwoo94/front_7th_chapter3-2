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

export const selectedCouponAtom = atom<Coupon | null>(null);

// Derived Atoms
export const totalAtom = atom((get) => {
  const cart = get(cartAtom);
  const coupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, coupon);
});

export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

// Write-only Atoms (액션)
export const addToCartAtom = atom(
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

export const removeFromCartAtom = atom(
  null,
  (get, set, productId: string) => {
    const cart = get(cartAtom);
    const newCart = removeItemFromCart(cart, productId);
    set(cartAtom, newCart);
  }
);

export const updateQuantityAtom = atom(
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

export const applyCouponAtom = atom(
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

export const setSelectedCouponAtom = atom(
  null,
  (get, set, coupon: Coupon | null) => {
    set(selectedCouponAtom, coupon);
  }
);

export const clearCartAtom = atom(
  null,
  (get, set) => {
    set(cartAtom, []);
    set(selectedCouponAtom, null);
  }
);

export const completeOrderAtom = atom(
  null,
  (get, set) => {
    set(cartAtom, []);
    set(selectedCouponAtom, null);
  }
);

// 유틸리티 함수를 위한 atom (getRemainingStockForProduct)
export const getRemainingStockForProductAtom = atom(
  (get) => (product: Product) => {
    const cart = get(cartAtom);
    return getRemainingStock(product, cart);
  }
);

