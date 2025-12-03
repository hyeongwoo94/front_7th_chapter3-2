import { Product } from '../../types';

// 상품 검색/필터링
/**
 * 상품 검색/필터링
 * @param products 상품 배열 (Product 또는 ProductWithUI)
 * @param searchTerm 검색어
 * @returns 필터링된 상품 배열
 */
export const filterProducts = <T extends Product>(
  products: T[],
  searchTerm: string
): T[] => {
  if (!searchTerm.trim()) {
    return products;
  }
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(lowerSearchTerm);
    const descriptionMatch = 'description' in product && 
      product.description && 
      typeof product.description === 'string' &&
      product.description.toLowerCase().includes(lowerSearchTerm);
    
    return nameMatch || descriptionMatch;
  });
};

//이건 비즈니스 로직인 순수함수이다.
//검색 규칙이다.