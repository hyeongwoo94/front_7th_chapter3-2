import { useCallback } from 'react';
import { ProductWithUI } from '../../constants';
import { Coupon } from '../../types';
import { useCart } from './entities/useCart';
import { useProducts } from './entities/useProducts';
import { useCoupons } from './entities/useCoupons';
import { useAdminForm } from './useAdminForm';
import { formatPrice as formatPriceUtil } from '../utils/formatters';
import { CouponFormData } from '../components/features/admin/types';

// 쇼핑몰 비즈니스 로직 조합 Hook
export const useShoppingMall = (
  isAdmin: boolean,
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void
) => {
  // 비즈니스 Hooks
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { coupons, addCoupon, deleteCoupon } = useCoupons();
  const {
    cart,
    selectedCoupon,
    total,
    totalItemCount,
    addToCart: addToCartHook,
    removeFromCart,
    updateQuantity,
    applyCoupon: applyCouponHook,
    setSelectedCoupon,
    clearCart,
    getRemainingStockForProduct
  } = useCart();

  // Admin 폼 관리
  const {
    showCouponForm,
    setShowCouponForm,
    activeTab,
    setActiveTab,
    showProductForm,
    setShowProductForm,
    editingProduct,
    setEditingProduct,
    productForm,
    setProductForm,
    couponForm,
    setCouponForm,
    startEditProduct,
    resetProductForm,
    resetCouponForm
  } = useAdminForm();

  // 가격 포맷팅 함수
  const formatPrice = useCallback((price: number, productId?: string): string => {
    const product = productId ? products.find(p => p.id === productId) : undefined;
    const remainingStock = product ? getRemainingStockForProduct(product) : undefined;
    
    return formatPriceUtil(price, {
      isAdmin,
      product,
      remainingStock
    });
  }, [products, isAdmin, getRemainingStockForProduct]);

  // 장바구니에 상품 추가 (알림 포함)
  const addToCart = useCallback((product: ProductWithUI) => {
    const result = addToCartHook(product);
    if (result.success) {
      addNotification(result.message, 'success');
    } else {
      addNotification(result.message, 'error');
    }
  }, [addToCartHook, addNotification]);

  // 쿠폰 적용 (알림 포함)
  const applyCoupon = useCallback((coupon: Coupon) => {
    const result = applyCouponHook(coupon);
    if (result.success) {
      addNotification(result.message, 'success');
    } else {
      addNotification(result.message, 'error');
    }
  }, [applyCouponHook, addNotification]);

  // 주문 완료
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
  }, [addNotification, clearCart]);

  // 상품 추가 (알림 포함)
  const handleAddProduct = useCallback((newProduct: Omit<ProductWithUI, 'id'>) => {
    addProduct(newProduct);
    addNotification('상품이 추가되었습니다.', 'success');
  }, [addProduct, addNotification]);

  // 상품 수정 (알림 포함)
  const handleUpdateProduct = useCallback((productId: string, updates: Partial<ProductWithUI>) => {
    updateProduct(productId, updates);
    addNotification('상품이 수정되었습니다.', 'success');
  }, [updateProduct, addNotification]);

  // 상품 삭제 (알림 포함)
  const handleDeleteProduct = useCallback((productId: string) => {
    deleteProduct(productId);
    addNotification('상품이 삭제되었습니다.', 'success');
  }, [deleteProduct, addNotification]);

  // 쿠폰 추가 (알림 포함)
  const handleAddCoupon = useCallback((newCoupon: CouponFormData) => {
    // CouponFormData를 Coupon으로 변환
    const coupon: Coupon = {
      name: newCoupon.name,
      code: newCoupon.code,
      discountType: newCoupon.discountType,
      discountValue: newCoupon.discountValue
    };
    const result = addCoupon(coupon);
    if (result.success) {
      addNotification(result.message, 'success');
    } else {
      addNotification(result.message, 'error');
    }
  }, [addCoupon, addNotification]);

  // 쿠폰 삭제 (알림 포함)
  const handleDeleteCoupon = useCallback((couponCode: string) => {
    deleteCoupon(couponCode);
    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }
    addNotification('쿠폰이 삭제되었습니다.', 'success');
  }, [deleteCoupon, selectedCoupon, setSelectedCoupon, addNotification]);

  // 상품 폼 제출
  const handleProductSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      handleUpdateProduct(editingProduct, productForm);
    } else {
      handleAddProduct({
        ...productForm,
        discounts: productForm.discounts
      });
    }
    resetProductForm();
  }, [editingProduct, productForm, handleUpdateProduct, handleAddProduct, resetProductForm]);

  // 쿠폰 폼 제출
  const handleCouponSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleAddCoupon(couponForm);
    resetCouponForm();
  }, [handleAddCoupon, couponForm, resetCouponForm]);

  return {
    // 비즈니스 상태
    products,
    coupons,
    cart,
    selectedCoupon,
    total,
    totalItemCount,
    
    // Admin 폼 상태
    showCouponForm,
    setShowCouponForm,
    activeTab,
    setActiveTab,
    showProductForm,
    setShowProductForm,
    editingProduct,
    setEditingProduct,
    productForm,
    setProductForm,
    couponForm,
    setCouponForm,
    
    // 액션
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    setSelectedCoupon,
    clearCart,
    completeOrder,
    getRemainingStockForProduct,
    
    // Admin 액션
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleAddCoupon,
    handleDeleteCoupon,
    handleProductSubmit,
    handleCouponSubmit,
    startEditProduct,
    
    // 유틸리티
    formatPrice
  };
};

