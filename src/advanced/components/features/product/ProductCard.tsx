import { useSetAtom } from 'jotai';
import { ProductWithUI } from '../../../constants';
import { ImageIcon } from '../../icons';
import { addToCartAtom } from '../../../atoms/cartAtoms';
import { addNotificationAtom } from '../../../atoms/notificationAtoms';
import { formatPrice } from '../../../utils/formatters';
import { useAtomValue } from 'jotai';
import { isAdminAtom } from '../../../atoms/adminAtoms';

interface ProductCardProps {
  product: ProductWithUI;
  remainingStock: number;
}

// 개별 상품을 표시하는 카드 컴포넌트
export const ProductCard = ({
  product,
  remainingStock
}: ProductCardProps) => {
  const isOutOfStock = remainingStock <= 0;
  const addToCart = useSetAtom(addToCartAtom);
  const addNotification = useSetAtom(addNotificationAtom);
  const isAdmin = useAtomValue(isAdminAtom);

  const handleAddToCart = () => {
    const result = addToCart(product);
    if (result && result.success) {
      addNotification(result.message || '장바구니에 담았습니다', 'success');
    } else if (result && !result.success) {
      addNotification(result.message || '장바구니에 담기 실패했습니다', 'error');
    }
  };

  const formatPriceFunc = (price: number) => formatPrice(price, { isAdmin, product, remainingStock });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 상품 이미지 영역 */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <ImageIcon className="w-24 h-24 text-gray-300" strokeWidth={1} />
        </div>
        {product.isRecommended && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            BEST
          </span>
        )}
        {product.discounts.length > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            ~{Math.max(...product.discounts.map(d => d.rate)) * 100}%
          </span>
        )}
      </div>
      
      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
        )}
        
        {/* 가격 정보 */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">{formatPriceFunc(product.price)}</p>
          {product.discounts.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.discounts[0].quantity}개 이상 구매시 할인 {product.discounts[0].rate * 100}%
            </p>
          )}
        </div>
        
        {/* 재고 상태 */}
        <div className="mb-3">
          {remainingStock <= 5 && remainingStock > 0 && (
            <p className="text-xs text-red-600 font-medium">품절임박! {remainingStock}개 남음</p>
          )}
          {remainingStock > 5 && (
            <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
          )}
        </div>
        
        {/* 장바구니 버튼 */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {isOutOfStock ? '품절' : '장바구니 담기'}
        </button>
      </div>
    </div>
  );
};

