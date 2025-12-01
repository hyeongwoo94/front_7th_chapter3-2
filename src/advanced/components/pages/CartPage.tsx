import { ProductWithUI } from '../../constants';
import { CartItem, Coupon } from '../../../types';
import { useProducts } from '../../hooks/entities/useProducts';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { ProductCard } from '../features/product/ProductCard';
import { Cart } from '../features/cart/Cart';

interface CartPageProps {
  searchTerm: string;
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  total: { totalBeforeDiscount: number; totalAfterDiscount: number };
  coupons: Coupon[];
  onAddToCart: (product: ProductWithUI) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  onApplyCoupon: (coupon: Coupon) => void;
  onSetSelectedCoupon: (coupon: Coupon | null) => void;
  onOrder: () => void;
  getRemainingStockForProduct: (product: ProductWithUI) => number;
  formatPrice: (price: number, productId?: string) => string;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}

// 장바구니 페이지 컴포넌트 (상품 목록 + 장바구니)
export const CartPage = ({ 
  searchTerm,
  cart,
  selectedCoupon,
  total,
  coupons,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onSetSelectedCoupon,
  onOrder,
  getRemainingStockForProduct,
  formatPrice,
  addNotification
}: CartPageProps) => {
  const debouncedSearchTerm = useDebounce(searchTerm);

  // Hooks 사용
  const { products, filteredProducts } = useProducts(debouncedSearchTerm);


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
                  onAddToCart={onAddToCart}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      
      <div className="lg:col-span-1">
        <Cart
          cart={cart}
          selectedCoupon={selectedCoupon}
          total={total}
          coupons={coupons}
          onRemoveItem={onRemoveFromCart}
          onUpdateQuantity={onUpdateQuantity}
          onApplyCoupon={onApplyCoupon}
          onSetSelectedCoupon={onSetSelectedCoupon}
          onOrder={onOrder}
          formatPrice={(price) => formatPrice(price)}
          addNotification={addNotification}
        />
      </div>
    </div>
  );
};

