import { useState, useCallback, useEffect, useMemo } from 'react';
import { CartItem, Coupon, Product } from '../../../types';
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  calculateCartTotal,
  getRemainingStock
} from '../../models/cart';
import { validateCoupon } from '../../models/coupon';
import { MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON } from '../../constants';

// 장바구니 관리 Hook
export const useCart = () => {
  // 장바구니 상태
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // 선택된 쿠폰 상태
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // localStorage 동기화
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  // 장바구니에 상품 추가
  const addToCart = useCallback((product: Product) => {
    const remainingStock = getRemainingStock(product, cart);
    if (remainingStock <= 0) {
      return { success: false, message: '재고가 부족합니다!' };
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > product.stock) {
          return prevCart; // 재고 초과
        }
        return updateCartItemQuantity(prevCart, product.id, newQuantity);
      }
      
      return addItemToCart(prevCart, product);
    });

    return { success: true, message: '장바구니에 담았습니다' };
  }, [cart]);

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => removeItemFromCart(prevCart, productId));
  }, []);

  // 수량 변경
  const updateQuantity = useCallback((productId: string, quantity: number) => {
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

    setCart(prevCart => updateCartItemQuantity(prevCart, productId, quantity));
    return { success: true };
  }, [cart]);

  // 쿠폰 적용
  const applyCoupon = useCallback((coupon: Coupon) => {
    const { totalAfterDiscount } = calculateCartTotal(cart, coupon);
    
    if (!validateCoupon(totalAfterDiscount, coupon)) {
      return {
        success: false,
        message: `percentage 쿠폰은 ${MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON.toLocaleString()}원 이상 구매 시 사용 가능합니다.`
      };
    }

    setSelectedCoupon(coupon);
    return { success: true, message: '쿠폰이 적용되었습니다.' };
  }, [cart]);

  // 장바구니 비우기
  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, []);

  // 총액 계산
  const total = useMemo(() => {
    return calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  // 총 아이템 수량
  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // 특정 상품의 남은 재고 계산
  const getRemainingStockForProduct = useCallback((product: Product) => {
    return getRemainingStock(product, cart);
  }, [cart]);

  return {
    // 상태
    cart,
    selectedCoupon,
    
    // 계산된 값
    total,
    totalItemCount,
    
    // 액션
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    setSelectedCoupon,
    clearCart,
    
    // 유틸리티
    getRemainingStockForProduct
  };
};

