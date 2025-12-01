# Components 계층 구현 명세서

이 문서는 `src/basic` 폴더의 Components 계층 구현을 위한 상세 명세서입니다.

---

## 📋 목차

1. [Components 계층의 목적](#components-계층의-목적)
2. [컴포넌트 분류](#컴포넌트-분류)
3. [구현할 컴포넌트 목록](#구현할-컴포넌트-목록)
4. [각 컴포넌트 상세 명세](#각-컴포넌트-상세-명세)
5. [컴포넌트 간 의존성](#컴포넌트-간-의존성)
6. [구현 체크리스트](#구현-체크리스트)

---

## Components 계층의 목적

### 역할
- **UI 렌더링만 담당**
- **비즈니스 로직은 Hooks에서 가져와서 사용**
- **재사용 가능한 컴포넌트 생성**
- **단일 책임 원칙 적용**

### 특징
- ✅ Props를 통한 데이터 전달
- ✅ Hooks를 사용하여 비즈니스 로직 분리
- ✅ 프레젠테이션 컴포넌트 (Presentational Component)
- ✅ 엔티티 컴포넌트와 UI 컴포넌트 구분

---

## 컴포넌트 분류

### 1. UI 컴포넌트 (`components/ui/`)
- **역할**: 범용적이고 재사용 가능한 UI 요소
- **특징**: 엔티티를 모름, 비즈니스 로직 없음
- **예시**: `Button`, `Input`, `Toast` (이미 구현됨)

### 2. 엔티티 컴포넌트 (`components/`)
- **역할**: 특정 엔티티를 다루는 컴포넌트
- **특징**: 엔티티 데이터를 Props로 받음, Hooks를 사용하여 비즈니스 로직 처리
- **예시**: `ProductCard`, `CartItem`, `CouponCard`

### 3. 페이지/섹션 컴포넌트 (`components/`)
- **역할**: 여러 컴포넌트를 조합한 큰 단위
- **특징**: 여러 Hooks를 조합하여 사용
- **예시**: `ProductList`, `Cart`, `AdminPage`

---

## 구현할 컴포넌트 목록

### UI 컴포넌트 (`components/ui/`)
1. ✅ `Toast.tsx` (이미 구현됨)
2. `Button.tsx` - 재사용 가능한 버튼 컴포넌트
3. `Input.tsx` - 재사용 가능한 입력 필드 컴포넌트

### 엔티티 컴포넌트 (`components/`)
1. `ProductCard.tsx` - 상품 카드 컴포넌트
2. `CartItem.tsx` - 장바구니 아이템 컴포넌트
3. `CouponCard.tsx` - 쿠폰 카드 컴포넌트

### 페이지/섹션 컴포넌트 (`components/`)
1. `Header.tsx` - 헤더 (검색창, 장바구니 아이콘, 관리자 모드 전환)
2. `SearchBar.tsx` - 검색 입력 컴포넌트
3. `ProductList.tsx` - 상품 목록 섹션
4. `Cart.tsx` - 장바구니 섹션
5. `CouponSelector.tsx` - 쿠폰 선택 드롭다운
6. `AdminPage.tsx` - 관리자 페이지 (이미 파일 존재, 구현 필요)
7. `ProductManagement.tsx` - 상품 관리 섹션
8. `ProductForm.tsx` - 상품 추가/수정 폼
9. `CouponManagement.tsx` - 쿠폰 관리 섹션
10. `CouponForm.tsx` - 쿠폰 추가 폼

---

## 각 컴포넌트 상세 명세

### 1. UI 컴포넌트

#### 1.1 `Button.tsx`

**파일 위치**: `src/basic/components/ui/Button.tsx`

**목적**: 재사용 가능한 버튼 컴포넌트

**Props**:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

**사용하는 Hooks**: 없음 (순수 UI 컴포넌트)

**사용하는 Models**: 없음

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const Button = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
  className = ''
}: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantStyles = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};
```

---

#### 1.2 `Input.tsx`

**파일 위치**: `src/basic/components/ui/Input.tsx`

**목적**: 재사용 가능한 입력 필드 컴포넌트

**Props**:
```typescript
interface InputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'password';
  label?: string;
  required?: boolean;
  className?: string;
  onBlur?: () => void;
}
```

**사용하는 Hooks**: 없음 (순수 UI 컴포넌트)

**사용하는 Models**: 없음

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  label,
  required = false,
  className = '',
  onBlur
}: InputProps) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        onBlur={onBlur}
        className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border ${className}`}
      />
    </div>
  );
};
```

---

### 2. 엔티티 컴포넌트

#### 2.1 `ProductCard.tsx`

**파일 위치**: `src/basic/components/ProductCard.tsx`

**목적**: 개별 상품을 표시하는 카드 컴포넌트

**Props**:
```typescript
interface ProductCardProps {
  product: ProductWithUI;
  remainingStock: number;
  onAddToCart: (product: ProductWithUI) => void;
  formatPrice: (price: number, productId?: string) => string;
}
```

**사용하는 Hooks**: 없음 (Props로 데이터 받음)

**사용하는 Models**: 없음 (계산은 상위 컴포넌트에서)

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const ProductCard = ({
  product,
  remainingStock,
  onAddToCart,
  formatPrice
}: ProductCardProps) => {
  const isOutOfStock = remainingStock <= 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 상품 이미지 영역 */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          {/* 이미지 placeholder */}
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
          <p className="text-lg font-bold text-gray-900">{formatPrice(product.price, product.id)}</p>
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
        <Button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          variant={isOutOfStock ? 'secondary' : 'primary'}
          className="w-full"
        >
          {isOutOfStock ? '품절' : '장바구니 담기'}
        </Button>
      </div>
    </div>
  );
};
```

---

#### 2.2 `CartItem.tsx`

**파일 위치**: `src/basic/components/CartItem.tsx`

**목적**: 장바구니 아이템을 표시하는 컴포넌트

**Props**:
```typescript
interface CartItemProps {
  item: CartItem;
  itemTotal: number;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
  formatPrice: (price: number) => string;
}
```

**사용하는 Hooks**: 없음 (Props로 데이터 받음)

**사용하는 Models**: 없음 (계산은 상위 컴포넌트에서)

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const CartItem = ({
  item,
  itemTotal,
  onRemove,
  onUpdateQuantity,
  formatPrice
}: CartItemProps) => {
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">{item.product.name}</h4>
        <button 
          onClick={onRemove} 
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          {/* 삭제 아이콘 */}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => onUpdateQuantity(item.quantity - 1)} 
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(item.quantity + 1)} 
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">+</span>
          </button>
        </div>
        <div className="text-right">
          {hasDiscount && (
            <p className="text-xs text-gray-500 line-through">{formatPrice(originalPrice)}</p>
          )}
          <p className="text-sm font-semibold text-gray-900">{formatPrice(itemTotal)}</p>
          {hasDiscount && (
            <p className="text-xs text-green-600">{discountRate}% 할인</p>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

#### 2.3 `CouponCard.tsx`

**파일 위치**: `src/basic/components/CouponCard.tsx`

**목적**: 쿠폰을 표시하는 카드 컴포넌트

**Props**:
```typescript
interface CouponCardProps {
  coupon: Coupon;
  onDelete?: (couponCode: string) => void;
  isAdmin?: boolean;
}
```

**사용하는 Hooks**: 없음 (Props로 데이터 받음)

**사용하는 Models**: 없음

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const CouponCard = ({
  coupon,
  onDelete,
  isAdmin = false
}: CouponCardProps) => {
  return (
    <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {coupon.discountType === 'amount' 
                ? `${coupon.discountValue.toLocaleString()}원 할인` 
                : `${coupon.discountValue}% 할인`}
            </span>
          </div>
        </div>
        {isAdmin && onDelete && (
          <button
            onClick={() => onDelete(coupon.code)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            {/* 삭제 아이콘 */}
          </button>
        )}
      </div>
    </div>
  );
};
```

---

### 3. 페이지/섹션 컴포넌트

#### 3.1 `Header.tsx`

**파일 위치**: `src/basic/components/Header.tsx`

**목적**: 헤더 영역 (검색창, 장바구니 아이콘, 관리자 모드 전환)

**Props**:
```typescript
interface HeaderProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  cartItemCount: number;
}
```

**사용하는 Hooks**: 없음 (Props로 데이터 받음)

**사용하는 Models**: 없음

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const Header = ({
  isAdmin,
  onToggleAdmin,
  searchTerm,
  onSearchChange,
  cartItemCount
}: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {!isAdmin && (
              <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                className="ml-8 flex-1 max-w-md"
              />
            )}
          </div>
          <nav className="flex items-center space-x-4">
            <Button
              onClick={onToggleAdmin}
              variant={isAdmin ? 'primary' : 'secondary'}
            >
              {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
            </Button>
            {!isAdmin && (
              <div className="relative">
                {/* 장바구니 아이콘 */}
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
```

---

#### 3.2 `SearchBar.tsx`

**파일 위치**: `src/basic/components/SearchBar.tsx`

**목적**: 검색 입력 필드 컴포넌트

**Props**:
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
```

**사용하는 Hooks**: 없음

**사용하는 Models**: 없음

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const SearchBar = ({
  value,
  onChange,
  placeholder = '상품 검색...',
  className = ''
}: SearchBarProps) => {
  return (
    <div className={className}>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
};
```

---

#### 3.3 `ProductList.tsx`

**파일 위치**: `src/basic/components/ProductList.tsx`

**목적**: 상품 목록을 표시하는 섹션 컴포넌트

**Props**:
```typescript
interface ProductListProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  searchTerm: string;
  onAddToCart: (product: ProductWithUI) => void;
  getRemainingStock: (product: ProductWithUI) => number;
  formatPrice: (price: number, productId?: string) => string;
}
```

**사용하는 Hooks**: 없음 (Props로 데이터 받음)

**사용하는 Models**: 없음

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const ProductList = ({
  products,
  filteredProducts,
  searchTerm,
  onAddToCart,
  getRemainingStock,
  formatPrice
}: ProductListProps) => {
  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">
          총 {products.length}개 상품
        </div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              remainingStock={getRemainingStock(product)}
              onAddToCart={onAddToCart}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      )}
    </section>
  );
};
```

---

#### 3.4 `Cart.tsx`

**파일 위치**: `src/basic/components/Cart.tsx`

**목적**: 장바구니 섹션 컴포넌트

**Props**:
```typescript
interface CartProps {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  total: { totalBeforeDiscount: number; totalAfterDiscount: number };
  coupons: Coupon[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onSetSelectedCoupon: (coupon: Coupon | null) => void;
  onClearCart: () => void;
  onOrder: () => void;
  calculateItemTotal: (item: CartItem, cart: CartItem[]) => number;
  formatPrice: (price: number) => string;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}
```

**사용하는 Hooks**: 없음 (Props로 데이터 받음)

**사용하는 Models**: `calculateItemTotal` (Props로 받음)

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const Cart = ({
  cart,
  selectedCoupon,
  total,
  coupons,
  onRemoveItem,
  onUpdateQuantity,
  onApplyCoupon,
  onSetSelectedCoupon,
  onClearCart,
  onOrder,
  calculateItemTotal,
  formatPrice,
  addNotification
}: CartProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        장바구니
      </h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map(item => (
            <CartItem
              key={item.product.id}
              item={item}
              itemTotal={calculateItemTotal(item, cart)}
              onRemove={() => onRemoveItem(item.product.id)}
              onUpdateQuantity={(quantity) => {
                const result = onUpdateQuantity(item.product.id, quantity);
                if (!result.success && result.message) {
                  addNotification(result.message, 'error');
                }
              }}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      )}
      
      {/* 쿠폰 선택 */}
      <CouponSelector
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        onSelect={onApplyCoupon}
        onClear={() => onSetSelectedCoupon(null)}
      />
      
      {/* 총액 및 주문 버튼 */}
      {cart.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">총액</span>
            <span className="font-semibold">{formatPrice(total.totalAfterDiscount)}</span>
          </div>
          {selectedCoupon && (
            <div className="text-sm text-green-600 mb-2">
              쿠폰 적용: {selectedCoupon.name}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={onClearCart} variant="secondary" className="flex-1">
              비우기
            </Button>
            <Button onClick={onOrder} variant="primary" className="flex-1">
              주문하기
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};
```

---

#### 3.5 `CouponSelector.tsx`

**파일 위치**: `src/basic/components/CouponSelector.tsx`

**목적**: 쿠폰 선택 드롭다운 컴포넌트

**Props**:
```typescript
interface CouponSelectorProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onSelect: (coupon: Coupon) => void;
  onClear: () => void;
}
```

**사용하는 Hooks**: 없음

**사용하는 Models**: 없음

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const CouponSelector = ({
  coupons,
  selectedCoupon,
  onSelect,
  onClear
}: CouponSelectorProps) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        쿠폰 선택
      </label>
      <select
        value={selectedCoupon?.code || ''}
        onChange={(e) => {
          const coupon = coupons.find(c => c.code === e.target.value);
          if (coupon) {
            onSelect(coupon);
          } else {
            onClear();
          }
        }}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
      >
        <option value="">쿠폰 선택 안함</option>
        {coupons.map(coupon => (
          <option key={coupon.code} value={coupon.code}>
            {coupon.name} ({coupon.discountType === 'amount' 
              ? `${coupon.discountValue.toLocaleString()}원 할인` 
              : `${coupon.discountValue}% 할인`})
          </option>
        ))}
      </select>
      {selectedCoupon && (
        <button
          onClick={onClear}
          className="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          쿠폰 제거
        </button>
      )}
    </div>
  );
};
```

---

#### 3.6 `AdminPage.tsx`

**파일 위치**: `src/basic/components/AdminPage.tsx` (이미 파일 존재)

**목적**: 관리자 페이지 전체 컴포넌트

**Props**:
```typescript
interface AdminPageProps {
  activeTab: 'products' | 'coupons';
  onTabChange: (tab: 'products' | 'coupons') => void;
  productManagement: React.ReactNode;
  couponManagement: React.ReactNode;
}
```

**사용하는 Hooks**: 없음 (자식 컴포넌트에서 사용)

**사용하는 Models**: 없음

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const AdminPage = ({
  activeTab,
  onTabChange,
  productManagement,
  couponManagement
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
            onClick={() => onTabChange('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'products' 
                ? 'border-gray-900 text-gray-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            상품 관리
          </button>
          <button 
            onClick={() => onTabChange('coupons')}
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
      {activeTab === 'products' ? productManagement : couponManagement}
    </div>
  );
};
```

---

#### 3.7 `ProductManagement.tsx`

**파일 위치**: `src/basic/components/ProductManagement.tsx`

**목적**: 상품 관리 섹션 컴포넌트

**Props**:
```typescript
interface ProductManagementProps {
  products: ProductWithUI[];
  onAddProduct: () => void;
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
  formatPrice: (price: number, productId?: string) => string;
  productForm: React.ReactNode;
  showProductForm: boolean;
}
```

**사용하는 Hooks**: 없음

**사용하는 Models**: 없음

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const ProductManagement = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  formatPrice,
  productForm,
  showProductForm
}: ProductManagementProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button onClick={onAddProduct}>
            새 상품 추가
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상품명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가격</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">재고</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">설명</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(product.price, product.id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stock > 10 ? 'bg-green-100 text-green-800' :
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.stock}개
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEditProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showProductForm && productForm}
    </section>
  );
};
```

---

#### 3.8 `ProductForm.tsx`

**파일 위치**: `src/basic/components/ProductForm.tsx`

**목적**: 상품 추가/수정 폼 컴포넌트

**Props**:
```typescript
interface ProductFormProps {
  productForm: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Array<{ quantity: number; rate: number }>;
  };
  editingProduct: string | null;
  onFormChange: (updates: Partial<ProductFormProps['productForm']>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}
```

**사용하는 Hooks**: 없음

**사용하는 Models**: 없음

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const ProductForm = ({
  productForm,
  editingProduct,
  onFormChange,
  onSubmit,
  onCancel,
  addNotification
}: ProductFormProps) => {
  // 폼 유효성 검사 및 할인 정책 관리 로직 포함
  // (App.tsx에서 해당 로직 추출)
  
  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
        </h3>
        {/* 폼 필드들 */}
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onCancel} variant="secondary">
            취소
          </Button>
          <Button type="submit" variant="primary">
            {editingProduct === 'new' ? '추가' : '수정'}
          </Button>
        </div>
      </form>
    </div>
  );
};
```

---

#### 3.9 `CouponManagement.tsx`

**파일 위치**: `src/basic/components/CouponManagement.tsx`

**목적**: 쿠폰 관리 섹션 컴포넌트

**Props**:
```typescript
interface CouponManagementProps {
  coupons: Coupon[];
  onDeleteCoupon: (couponCode: string) => void;
  onAddCoupon: () => void;
  couponForm: React.ReactNode;
  showCouponForm: boolean;
}
```

**사용하는 Hooks**: 없음

**사용하는 Models**: 없음

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const CouponManagement = ({
  coupons,
  onDeleteCoupon,
  onAddCoupon,
  couponForm,
  showCouponForm
}: CouponManagementProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map(coupon => (
            <CouponCard
              key={coupon.code}
              coupon={coupon}
              onDelete={onDeleteCoupon}
              isAdmin={true}
            />
          ))}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={onAddCoupon}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              {/* 추가 아이콘 */}
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>
        {showCouponForm && couponForm}
      </div>
    </section>
  );
};
```

---

#### 3.10 `CouponForm.tsx`

**파일 위치**: `src/basic/components/CouponForm.tsx`

**목적**: 쿠폰 추가 폼 컴포넌트

**Props**:
```typescript
interface CouponFormProps {
  couponForm: {
    name: string;
    code: string;
    discountType: 'amount' | 'percentage';
    discountValue: number;
  };
  onFormChange: (updates: Partial<CouponFormProps['couponForm']>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}
```

**사용하는 Hooks**: 없음

**사용하는 Models**: 없음

**반환값**: JSX.Element

**구현 예시**:
```typescript
export const CouponForm = ({
  couponForm,
  onFormChange,
  onSubmit,
  onCancel,
  addNotification
}: CouponFormProps) => {
  // 폼 유효성 검사 로직 포함
  // (App.tsx에서 해당 로직 추출)
  
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        {/* 폼 필드들 */}
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onCancel} variant="secondary">
            취소
          </Button>
          <Button type="submit" variant="primary">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
};
```

---

## 컴포넌트 간 의존성

### 의존성 다이어그램

```
App.tsx
  ├─ Header
  │   └─ SearchBar
  ├─ Toast (이미 구현됨)
  ├─ ProductList
  │   └─ ProductCard
  │       └─ Button (ui)
  ├─ Cart
  │   ├─ CartItem
  │   ├─ CouponSelector
  │   └─ Button (ui)
  └─ AdminPage
      ├─ ProductManagement
      │   ├─ ProductForm
      │   │   └─ Input (ui)
      │   └─ Button (ui)
      └─ CouponManagement
          ├─ CouponCard
          └─ CouponForm
              └─ Input (ui)
```

### 컴포넌트 계층 구조

```
Level 1: App.tsx (최상위)
  ├─ Level 2: Header, ProductList, Cart, AdminPage
  │   ├─ Level 3: SearchBar, ProductCard, CartItem, CouponSelector, ProductManagement, CouponManagement
  │   │   ├─ Level 4: ProductForm, CouponForm, CouponCard
  │   │   │   └─ Level 5: Button, Input (UI 컴포넌트)
```

---

## 구현 체크리스트

### Phase 1: UI 컴포넌트 구현
- [ ] `Button.tsx` 구현
- [ ] `Input.tsx` 구현

### Phase 2: 엔티티 컴포넌트 구현
- [ ] `ProductCard.tsx` 구현
- [ ] `CartItem.tsx` 구현
- [ ] `CouponCard.tsx` 구현

### Phase 3: 페이지/섹션 컴포넌트 구현
- [ ] `SearchBar.tsx` 구현
- [ ] `Header.tsx` 구현
- [ ] `ProductList.tsx` 구현
- [ ] `Cart.tsx` 구현
- [ ] `CouponSelector.tsx` 구현
- [ ] `ProductManagement.tsx` 구현
- [ ] `ProductForm.tsx` 구현
- [ ] `CouponManagement.tsx` 구현
- [ ] `CouponForm.tsx` 구현
- [ ] `AdminPage.tsx` 구현

### Phase 4: App.tsx 리팩토링
- [ ] App.tsx에서 컴포넌트로 분리
- [ ] Props 전달 구조 설계
- [ ] 이벤트 핸들러 전달 구조 설계

### Phase 5: 테스트 및 검증
- [ ] 각 컴포넌트가 독립적으로 렌더링되는지 확인
- [ ] Props 전달이 올바른지 확인
- [ ] 기존 기능이 정상 작동하는지 확인

---

## 구현 순서 권장사항

### 1단계: UI 컴포넌트부터
가장 기본이 되는 UI 컴포넌트(`Button`, `Input`)를 먼저 구현합니다. 이들은 다른 모든 컴포넌트에서 사용됩니다.

### 2단계: 엔티티 컴포넌트
엔티티 컴포넌트(`ProductCard`, `CartItem`, `CouponCard`)를 구현합니다. 이들은 UI 컴포넌트를 사용합니다.

### 3단계: 페이지/섹션 컴포넌트
페이지/섹션 컴포넌트를 구현합니다. 이들은 엔티티 컴포넌트와 UI 컴포넌트를 조합합니다.

### 4단계: App.tsx 리팩토링
모든 컴포넌트가 구현되면 App.tsx에서 해당 컴포넌트들을 사용하도록 리팩토링합니다.

---

## 주의사항

### ✅ 해야 할 것

1. **Props를 통한 데이터 전달**
   ```typescript
   // ✅ 좋은 예: Props로 데이터 전달
   <ProductCard product={product} onAddToCart={handleAddToCart} />
   ```

2. **Hooks는 상위 컴포넌트에서 사용**
   ```typescript
   // ✅ 좋은 예: App.tsx에서 Hook 사용
   const App = () => {
     const { products, addProduct } = useProducts();
     return <ProductList products={products} onAddProduct={addProduct} />;
   };
   ```

3. **단일 책임 원칙 준수**
   ```typescript
   // ✅ 좋은 예: 각 컴포넌트가 하나의 책임만
   <ProductCard /> // 상품 표시만
   <CartItem />    // 장바구니 아이템 표시만
   ```

### ❌ 하지 말아야 할 것

1. **컴포넌트 내부에서 Hook 직접 사용 (엔티티 컴포넌트)**
   ```typescript
   // ❌ 나쁜 예: 컴포넌트 내부에서 Hook 사용
   const ProductCard = ({ product }: { product: Product }) => {
     const { addToCart } = useCart(); // ❌ 안티패턴
     return <button onClick={() => addToCart(product)}>담기</button>;
   };
   
   // ✅ 좋은 예: Props로 함수 전달
   const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
     return <button onClick={() => onAddToCart(product)}>담기</button>;
   };
   ```

2. **비즈니스 로직을 컴포넌트에 포함**
   ```typescript
   // ❌ 나쁜 예: 컴포넌트에 비즈니스 로직
   const CartItem = ({ item }: { item: CartItem }) => {
     const total = calculateCartTotal([item]); // ❌ 계산 로직
     return <div>{total}</div>;
   };
   
   // ✅ 좋은 예: 계산은 상위에서
   const CartItem = ({ item, itemTotal }: CartItemProps) => {
     return <div>{itemTotal}</div>;
   };
   ```

3. **엔티티 컴포넌트가 다른 엔티티를 직접 import**
   ```typescript
   // ❌ 나쁜 예: 다른 엔티티 직접 import
   import { useCart } from '../hooks/useCart';
   
   // ✅ 좋은 예: Props로 전달
   interface Props {
     cart: CartItem[];
   }
   ```

---

## 관련 문서

- `../hooks-명세서.md`: Hooks 계층 구현 명세서
- `../리팩토링-실행순서.md`: 리팩토링 전체 프로세스
- `../../hooks/README.md`: Hooks 폴더 가이드
- `../../models/README.md`: Models 폴더 가이드

---

**마지막 업데이트**: 2025-12-01

