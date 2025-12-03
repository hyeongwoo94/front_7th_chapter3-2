import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ProductWithUI, initialProducts } from '../constants';
import { filterProducts } from '../models/product';

// localStorage와 자동 동기화되는 atom
export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts); // 로컬 스토리지에 저장된 데이터 가져오기

export const searchTermAtom = atom<string>(''); // 검색어 타입은 문자로 지정

// Derived Atoms
export const filteredProductsAtom = atom((get) => { // 필터링 된 상품 데이터
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom);
  return filterProducts(products, searchTerm);
});
// 1. 상품 목록 가져오기
// 2. 검색어 가져오기
// 3. 필터링 된 상품 목록 가져오기
// Write-only Atoms (액션)
export const addProductAtom = atom( //상품 데이터 추가
  null,
  (get, set, newProduct: Omit<ProductWithUI, 'id'>) => {
    const products = get(productsAtom);
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    const newProducts = [...products, product];
    set(productsAtom, newProducts);
  }
);
// 1. 상품목록 가져오기
// 2. 새 상품의 아이디값을 현재 시간로 지정하기
// 3. 상품목록에 새로운 상품을 추가
// 4. 상품 목록을 새로 만든 목록으로 교체
export const updateProductAtom = atom( //상품 데이터 업데이트
  null,
  (get, set, productId: string, updates: Partial<ProductWithUI>) => {
    const products = get(productsAtom);
    const newProducts = products.map(product =>
      product.id === productId
        ? { ...product, ...updates }
        : product
    );
    set(productsAtom, newProducts);
  }
);
// 1. 상품 목록 가져오기
// 2. 상품 ID를 비교하여 일치하는 상품만 업데이트, 나머지는 그대로 유지
// 3. 업데이트 된 상품목록으로 교체
export const deleteProductAtom = atom( //상품 데이터 삭제
  null,
  (get, set, productId: string) => {
    const products = get(productsAtom);
    const newProducts = products.filter(p => p.id !== productId);
    set(productsAtom, newProducts);
  }
);
// 1. 상품 목록 가져오기
// 2. 상품 아이디값이 목록중 일치하는 것을 제외하기
// 3. 새로운 상품 목록으로 교체