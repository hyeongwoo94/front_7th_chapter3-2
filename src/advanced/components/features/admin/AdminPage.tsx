import { ProductWithUI } from '../../../constants';
import { Coupon } from '../../../../types';
import { ProductManagement } from './ProductManagement';
import { CouponManagement } from './CouponManagement';
import { AdminTab, ProductFormData, CouponFormData, EMPTY_PRODUCT_FORM, EMPTY_COUPON_FORM } from './types';

interface AdminPageProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  products: ProductWithUI[];
  coupons: Coupon[];
  editingProduct: string | null;
  setEditingProduct: (id: string | null) => void;
  productForm: ProductFormData;
  setProductForm: (form: ProductFormData) => void;
  couponForm: CouponFormData;
  setCouponForm: (form: CouponFormData) => void;
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
  showCouponForm: boolean;
  setShowCouponForm: (show: boolean) => void;
  handleAddProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  handleUpdateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  handleDeleteProduct: (productId: string) => void;
  handleAddCoupon: (newCoupon: CouponFormData) => void;
  handleDeleteCoupon: (couponCode: string) => void;
  handleProductSubmit: (e: React.FormEvent) => void;
  handleCouponSubmit: (e: React.FormEvent) => void;
  startEditProduct: (product: ProductWithUI) => void;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
  formatPrice: (price: number, productId?: string) => string;
}

// 관리자 페이지 컴포넌트
export const AdminPage = ({
  activeTab,
  setActiveTab,
  products,
  coupons,
  editingProduct,
  setEditingProduct,
  productForm,
  setProductForm,
  couponForm,
  setCouponForm,
  showProductForm,
  setShowProductForm,
  showCouponForm,
  setShowCouponForm,
  handleAddProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleAddCoupon,
  handleDeleteCoupon,
  handleProductSubmit,
  handleCouponSubmit,
  startEditProduct,
  addNotification,
  formatPrice,
}: AdminPageProps) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button 
            onClick={() => setActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'products' 
                ? 'border-gray-900 text-gray-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            상품 관리
          </button>
          <button 
            onClick={() => setActiveTab('coupons')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'coupons' 
                ? 'border-gray-900 text-gray-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === 'products' ? (
        <ProductManagement
          products={products}
          editingProduct={editingProduct}
          productForm={productForm}
          showProductForm={showProductForm}
          onAddProduct={() => {
            setEditingProduct('new');
            setProductForm(EMPTY_PRODUCT_FORM);
            setShowProductForm(true);
          }}
          onEditProduct={startEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onFormChange={(updates) => setProductForm({ ...productForm, ...updates })}
          onFormSubmit={handleProductSubmit}
          onFormCancel={() => {
            setEditingProduct(null);
            setProductForm(EMPTY_PRODUCT_FORM);
            setShowProductForm(false);
          }}
          formatPrice={formatPrice}
          addNotification={addNotification}
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          couponForm={couponForm}
          showCouponForm={showCouponForm}
          onAddCoupon={() => setShowCouponForm(!showCouponForm)}
          onDeleteCoupon={handleDeleteCoupon}
          onFormChange={(updates) => setCouponForm({ ...couponForm, ...updates })}
          onFormSubmit={handleCouponSubmit}
          onFormCancel={() => {
            setCouponForm(EMPTY_COUPON_FORM);
            setShowCouponForm(false);
          }}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};
