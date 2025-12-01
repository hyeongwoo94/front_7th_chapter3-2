import { ProductWithUI } from '../../constants';
import { CartItem, Coupon } from '../../../types';
import { useProducts } from '../../hooks/entities/useProducts';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { ProductList } from '../features/product/ProductList';
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
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          searchTerm={debouncedSearchTerm}
          onAddToCart={onAddToCart}
          getRemainingStock={getRemainingStockForProduct}
          formatPrice={formatPrice}
        />
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

