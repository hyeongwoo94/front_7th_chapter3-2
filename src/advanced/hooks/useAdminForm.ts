import { useState, useCallback } from 'react';
import { ProductWithUI } from '../constants';
import { ProductFormData, CouponFormData, EMPTY_PRODUCT_FORM, EMPTY_COUPON_FORM } from '../components/features/admin/types';
import { Coupon } from '../../types';

// Admin 폼 관리 Hook
export const useAdminForm = () => {
  // UI 상태
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);

  // Admin 폼 상태
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>(EMPTY_PRODUCT_FORM);
  const [couponForm, setCouponForm] = useState<CouponFormData>(EMPTY_COUPON_FORM);

  // 상품 수정 시작
  const startEditProduct = useCallback((product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || []
    });
    setShowProductForm(true);
  }, []);

  // 상품 폼 초기화
  const resetProductForm = useCallback(() => {
    setProductForm(EMPTY_PRODUCT_FORM);
    setEditingProduct(null);
    setShowProductForm(false);
  }, []);

  // 쿠폰 폼 초기화
  const resetCouponForm = useCallback(() => {
    setCouponForm(EMPTY_COUPON_FORM);
    setShowCouponForm(false);
  }, []);

  return {
    // UI 상태
    showCouponForm,
    setShowCouponForm,
    activeTab,
    setActiveTab,
    showProductForm,
    setShowProductForm,
    
    // 폼 상태
    editingProduct,
    setEditingProduct,
    productForm,
    setProductForm,
    couponForm,
    setCouponForm,
    
    // 액션
    startEditProduct,
    resetProductForm,
    resetCouponForm
  };
};

