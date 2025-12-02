import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ProductWithUI } from '../constants';
import { ProductFormData, CouponFormData, EMPTY_PRODUCT_FORM, EMPTY_COUPON_FORM } from '../components/features/admin/types';
import { Coupon } from '../../types';
import { initialCoupons } from '../constants';

// 기본 Atoms
export const isAdminAtom = atom<boolean>(false);

export const activeTabAtom = atom<'products' | 'coupons'>('products');

export const showProductFormAtom = atom<boolean>(false);

export const showCouponFormAtom = atom<boolean>(false);

export const editingProductAtom = atom<string | 'new' | null>(null);

export const productFormAtom = atom<ProductFormData>(EMPTY_PRODUCT_FORM);

export const couponFormAtom = atom<CouponFormData>(EMPTY_COUPON_FORM);

// localStorage와 자동 동기화되는 atom
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);

// Write-only Atoms (액션)
export const toggleAdminAtom = atom(
  null,
  (get, set) => {
    const isAdmin = get(isAdminAtom);
    set(isAdminAtom, !isAdmin);
  }
);

export const setActiveTabAtom = atom(
  null,
  (get, set, tab: 'products' | 'coupons') => {
    set(activeTabAtom, tab);
  }
);

export const startEditProductAtom = atom(
  null,
  (get, set, product: ProductWithUI) => {
    set(editingProductAtom, product.id);
    set(productFormAtom, {
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || []
    });
    set(showProductFormAtom, true);
  }
);

export const resetProductFormAtom = atom(
  null,
  (get, set) => {
    set(productFormAtom, EMPTY_PRODUCT_FORM);
    set(editingProductAtom, null);
    set(showProductFormAtom, false);
  }
);

export const resetCouponFormAtom = atom(
  null,
  (get, set) => {
    set(couponFormAtom, EMPTY_COUPON_FORM);
    set(showCouponFormAtom, false);
  }
);

export const handleAddProductAtom = atom(
  null,
  (get, set) => {
    set(editingProductAtom, 'new');
    set(productFormAtom, EMPTY_PRODUCT_FORM);
    set(showProductFormAtom, true);
  }
);

export const handleUpdateProductAtom = atom(
  null,
  (get, set, productId: string, updates: Partial<ProductWithUI>) => {
    // productAtoms의 updateProductAtom을 직접 import해서 사용
    // 이건 컴포넌트에서 조합해서 사용할 예정
  }
);

export const handleDeleteProductAtom = atom(
  null,
  (get, set, productId: string) => {
    // productAtoms의 deleteProductAtom을 직접 import해서 사용
    // 이건 컴포넌트에서 조합해서 사용할 예정
  }
);

export const handleAddCouponAtom = atom(
  null,
  (get, set) => {
    set(couponFormAtom, EMPTY_COUPON_FORM);
    set(showCouponFormAtom, true);
  }
);

export const handleDeleteCouponAtom = atom(
  null,
  (get, set, couponCode: string) => {
    const coupons = get(couponsAtom);
    const existingCoupon = coupons.find(c => c.code === couponCode);
    if (!existingCoupon) {
      return { success: false, message: '존재하지 않는 쿠폰입니다.' };
    }
    const newCoupons = coupons.filter(c => c.code !== couponCode);
    set(couponsAtom, newCoupons);
    return { success: true, message: '쿠폰이 삭제되었습니다.' };
  }
);

