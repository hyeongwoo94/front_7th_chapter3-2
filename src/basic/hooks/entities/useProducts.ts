import { useState, useCallback, useEffect, useMemo } from 'react';
import { ProductWithUI, initialProducts } from '../../constants';
import { filterProducts } from '../../models/product';

// 상품 관리 Hook
export const useProducts = (searchTerm?: string) => {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // 상품 추가
  const addProduct = useCallback((newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    setProducts(prev => [...prev, product]);
  }, []);

  // 상품 수정
  const updateProduct = useCallback((productId: string, updates: Partial<ProductWithUI>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
  }, []);

  // 상품 삭제
  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  // 재고 수정
  const updateProductStock = useCallback((productId: string, stock: number) => {
    updateProduct(productId, { stock });
  }, [updateProduct]);

  // 할인 규칙 추가
  const addProductDiscount = useCallback((
    productId: string,
    discount: { quantity: number; rate: number }
  ) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? {
              ...product,
              discounts: [...(product.discounts || []), discount]
            }
          : product
      )
    );
  }, []);

  // 할인 규칙 삭제
  const removeProductDiscount = useCallback((
    productId: string,
    discountIndex: number
  ) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? {
              ...product,
              discounts: product.discounts.filter((_, i) => i !== discountIndex)
            }
          : product
      )
    );
  }, []);

  // 필터링된 상품 목록 (검색어가 제공된 경우)
  const filteredProducts = useMemo(() => {
    if (searchTerm !== undefined) {
      return filterProducts(products, searchTerm);
    }
    return products;
  }, [products, searchTerm]);

  return {
    products,
    filteredProducts: searchTerm !== undefined ? filteredProducts : products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount
  };
};

