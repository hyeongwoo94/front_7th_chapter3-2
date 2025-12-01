import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Input } from '../../ui/Input';
import { MAX_STOCK } from '../../../constants';
import { 
  editingProductAtom, 
  productFormAtom, 
  resetProductFormAtom 
} from '../../../atoms/adminAtoms';
import { addProductAtom, updateProductAtom } from '../../../atoms/productAtoms';
import { addNotificationAtom } from '../../../atoms/notificationAtoms';

// 상품 추가/수정 폼 컴포넌트
export const ProductForm = () => {
  const editingProduct = useAtomValue(editingProductAtom);
  const [productForm, setProductForm] = useAtom(productFormAtom);
  const resetProductForm = useSetAtom(resetProductFormAtom);
  const addProduct = useSetAtom(addProductAtom);
  const updateProduct = useSetAtom(updateProductAtom);
  const addNotification = useSetAtom(addNotificationAtom);

  const handleFormChange = (updates: Partial<typeof productForm>) => {
    setProductForm({ ...productForm, ...updates });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      addNotification('상품이 수정되었습니다.', 'success');
    } else {
      addProduct(productForm);
      addNotification('상품이 추가되었습니다.', 'success');
    }
    resetProductForm();
  };
  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
            <Input
              type="text"
              value={productForm.name}
              onChange={(e) => handleFormChange({ name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <Input
              type="text"
              value={productForm.description}
              onChange={(e) => handleFormChange({ description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
            <Input
              type="text"
              value={productForm.price === 0 ? '' : productForm.price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  handleFormChange({ price: value === '' ? 0 : parseInt(value) });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === '') {
                  handleFormChange({ price: 0 });
                } else if (parseInt(value) < 0) {
                  addNotification('가격은 0보다 커야 합니다', 'error');
                  handleFormChange({ price: 0 });
                }
              }}
              placeholder="숫자만 입력"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
            <Input
              type="text"
              value={productForm.stock === 0 ? '' : productForm.stock}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  handleFormChange({ stock: value === '' ? 0 : parseInt(value) });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === '') {
                  handleFormChange({ stock: 0 });
                } else if (parseInt(value) < 0) {
                  addNotification('재고는 0보다 커야 합니다', 'error');
                  handleFormChange({ stock: 0 });
                } else if (parseInt(value) > MAX_STOCK) {
                  addNotification(`재고는 ${MAX_STOCK.toLocaleString()}개를 초과할 수 없습니다`, 'error');
                  handleFormChange({ stock: MAX_STOCK });
                }
              }}
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">할인 정책</label>
          <div className="space-y-2">
            {productForm.discounts.map((discount, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <Input
                  type="number"
                  value={discount.quantity}
                  onChange={(e) => {
                    const newDiscounts = [...productForm.discounts];
                    newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                    handleFormChange({ discounts: newDiscounts });
                  }}
                  className="w-20"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <Input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) => {
                    const newDiscounts = [...productForm.discounts];
                    newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
                    handleFormChange({ discounts: newDiscounts });
                  }}
                  className="w-16"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button
                  type="button"
                  onClick={() => {
                    const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
                    handleFormChange({ discounts: newDiscounts });
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                handleFormChange({
                  discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }]
                });
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
                onClick={() => resetProductForm()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {editingProduct === 'new' ? '추가' : '수정'}
          </button>
        </div>
      </form>
    </div>
  );
};

