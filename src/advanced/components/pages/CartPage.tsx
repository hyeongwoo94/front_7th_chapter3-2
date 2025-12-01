import { useAtomValue } from 'jotai';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { ProductCard } from '../features/product/ProductCard';
import { Cart } from '../features/cart/Cart';
import { filteredProductsAtom, productsAtom, searchTermAtom } from '../../atoms/productAtoms';
import { getRemainingStockForProductAtom } from '../../atoms/cartAtoms';

// 장바구니 페이지 컴포넌트 (상품 목록 + 장바구니)
export const CartPage = () => {
  const searchTerm = useAtomValue(searchTermAtom);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const products = useAtomValue(productsAtom);
  const filteredProducts = useAtomValue(filteredProductsAtom);
  const getRemainingStockForProduct = useAtomValue(getRemainingStockForProductAtom);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">
              총 {products.length}개 상품
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  remainingStock={getRemainingStockForProduct(product)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      
      <div className="lg:col-span-1">
        <Cart />
      </div>
    </div>
  );
};

