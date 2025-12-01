import { useApp } from '../../hooks/useApp';
import { Toast } from '../ui/Toast';
import { Header } from './Header';
import { CartPage } from '../pages/CartPage';
import { AdminPage } from '../features/admin/AdminPage';

// 페이지 레이아웃 컴포넌트 (Header, Toast, 조건부 렌더링 담당)
export const PagesLayout = () => {
  // 앱 전체 비즈니스 로직 조합
  const {
    notifications,
    removeNotification,
    searchTerm,
    setSearchTerm,
    isAdmin,
    toggleAdmin,
    products,
    coupons,
    cart,
    selectedCoupon,
    total,
    totalItemCount,
    showCouponForm,
    setShowCouponForm,
    activeTab,
    setActiveTab,
    showProductForm,
    setShowProductForm,
    editingProduct,
    setEditingProduct,
    productForm,
    setProductForm,
    couponForm,
    setCouponForm,
    addToCart,
    removeFromCart,
    updateQuantity,
            applyCoupon,
            setSelectedCoupon,
            completeOrder,
    getRemainingStockForProduct,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleAddCoupon,
    handleDeleteCoupon,
    handleProductSubmit,
    handleCouponSubmit,
    startEditProduct,
    formatPrice,
    addNotification
  } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast notifications={notifications} onRemove={removeNotification} />
      <Header
        isAdmin={isAdmin}
        onToggleAdmin={toggleAdmin}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItemCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            products={products}
            coupons={coupons}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            productForm={productForm}
            setProductForm={setProductForm}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            showProductForm={showProductForm}
            setShowProductForm={setShowProductForm}
            showCouponForm={showCouponForm}
            setShowCouponForm={setShowCouponForm}
            handleAddProduct={handleAddProduct}
            handleUpdateProduct={handleUpdateProduct}
            handleDeleteProduct={handleDeleteProduct}
            handleAddCoupon={handleAddCoupon}
            handleDeleteCoupon={handleDeleteCoupon}
            handleProductSubmit={handleProductSubmit}
            handleCouponSubmit={handleCouponSubmit}
            startEditProduct={startEditProduct}
            addNotification={addNotification}
            formatPrice={formatPrice}
          />
        ) : (
          <CartPage
            searchTerm={searchTerm}
            cart={cart}
            selectedCoupon={selectedCoupon}
            total={total}
            coupons={coupons}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onApplyCoupon={applyCoupon}
            onSetSelectedCoupon={setSelectedCoupon}
            onOrder={completeOrder}
            getRemainingStockForProduct={getRemainingStockForProduct}
            formatPrice={formatPrice}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

