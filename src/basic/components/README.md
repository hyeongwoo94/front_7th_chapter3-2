# Components 폴더 가이드

이 폴더는 **UI 렌더링을 담당하는 React 컴포넌트**를 포함합니다.

---

## 📋 목차

1. [Components 폴더란?](#components-폴더란)
2. [컴포넌트 분류](#컴포넌트-분류)
3. [파일 구조](#파일-구조)
4. [각 폴더별 설명](#각-폴더별-설명)
5. [컴포넌트와 Hooks의 관계](#컴포넌트와-hooks의-관계)
6. [사용 예시](#사용-예시)
7. [주의사항](#주의사항)

---

## Components 폴더란?

### 역할
- **UI 렌더링만 담당** (비즈니스 로직 없음)
- **Hooks를 사용하여 데이터와 액션을 받음**
- **재사용 가능한 UI 컴포넌트 제공**
- **엔티티별 컴포넌트와 범용 컴포넌트 분리**

### 특징
- ✅ 비즈니스 로직 없음 (Hooks에서 처리)
- ✅ Props를 통한 데이터 전달
- ✅ 순수 함수형 컴포넌트 (함수형 컴포넌트)
- ✅ 단일 책임 원칙 (각 컴포넌트는 하나의 UI만 담당)

---

## 컴포넌트 분류

### 1. UI 컴포넌트 (`ui/`)
**특징**: 엔티티를 모름, 범용적으로 사용 가능

**예시**:
- `Button.tsx`: 범용 버튼 컴포넌트
- `Input.tsx`: 범용 입력 필드 컴포넌트
- `Toast.tsx`: 범용 알림 컴포넌트

**사용 예시**:
```typescript
<Button onClick={handleClick} variant="primary">
  클릭하세요
</Button>
```

### 2. 엔티티 컴포넌트 (`features/`)
**특징**: 특정 엔티티를 다룸, 비즈니스 도메인에 종속적

**예시**:
- `features/product/ProductCard.tsx`: Product 엔티티 표시
- `features/cart/Cart.tsx`: Cart 엔티티 표시
- `features/coupon/CouponCard.tsx`: Coupon 엔티티 표시

**사용 예시**:
```typescript
<ProductCard
  product={product}
  remainingStock={remainingStock}
  onAddToCart={handleAddToCart}
  formatPrice={formatPrice}
/>
```

### 3. 레이아웃 컴포넌트 (`layout/`)
**특징**: 페이지 구조를 담당, 여러 컴포넌트를 조합

**예시**:
- `Header.tsx`: 헤더 영역
- `PagesLayout.tsx`: 전체 페이지 레이아웃

**사용 예시**:
```typescript
<PagesLayout />
```

### 4. 페이지 컴포넌트 (`pages/`)
**특징**: 여러 기능 컴포넌트를 조합하여 특정 페이지 구성

**예시**:
- `CartPage.tsx`: 쇼핑몰 메인 페이지 (상품 목록 + 장바구니)

**사용 예시**:
```typescript
<CartPage
  searchTerm={searchTerm}
  cart={cart}
  onAddToCart={addToCart}
  // ... props
/>
```

### 5. 아이콘 컴포넌트 (`icons/`)
**특징**: 재사용 가능한 SVG 아이콘 컴포넌트

**예시**:
- `CartIcon`, `CloseIcon`, `TrashIcon` 등

**사용 예시**:
```typescript
<CartIcon className="w-6 h-6" />
```

---

## 파일 구조

```
src/basic/components/
├── ui/                    # 범용 UI 컴포넌트
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Toast.tsx
├── layout/                # 레이아웃 컴포넌트
│   ├── Header.tsx
│   └── PagesLayout.tsx
├── features/             # 엔티티별 기능 컴포넌트
│   ├── product/          # 상품 관련 컴포넌트
│   │   └── ProductCard.tsx
│   ├── cart/             # 장바구니 관련 컴포넌트
│   │   ├── Cart.tsx
│   │   └── CartItem.tsx
│   ├── coupon/           # 쿠폰 관련 컴포넌트
│   │   └── CouponSelector.tsx
│   └── admin/            # 관리자 기능 컴포넌트
│       ├── AdminPage.tsx
│       ├── ProductManagement.tsx
│       ├── ProductForm.tsx
│       ├── CouponManagement.tsx
│       ├── CouponForm.tsx
│       └── types.ts
├── pages/                 # 페이지 컴포넌트
│   └── CartPage.tsx
├── icons/                 # 아이콘 컴포넌트
│   └── index.tsx
└── README.md
```

---

## 각 폴더별 설명

### 📁 `ui/` - 범용 UI 컴포넌트

**역할**: 엔티티를 모르는 범용적인 UI 컴포넌트

**컴포넌트**:
- **`Button.tsx`**: 재사용 가능한 버튼 컴포넌트
  - Props: `children`, `onClick`, `disabled`, `variant`, `type`, `className`
  - Variants: `primary`, `secondary`, `danger`
  
- **`Input.tsx`**: 재사용 가능한 입력 필드 컴포넌트
  - Props: `value`, `onChange`, `placeholder`, `type`, `label`, `required`, `className`
  - HTML input 속성을 모두 상속받음

- **`Toast.tsx`**: 알림 메시지 표시 컴포넌트
  - Props: `notifications`, `onRemove`
  - 알림 타입: `error`, `success`, `warning`

**특징**:
- ✅ 어떤 프로젝트에서도 사용 가능
- ✅ 엔티티 관련 prop 없음
- ✅ 비즈니스 로직 없음

---

### 📁 `layout/` - 레이아웃 컴포넌트

**역할**: 페이지 구조를 담당하는 컴포넌트

**컴포넌트**:
- **`Header.tsx`**: 애플리케이션 헤더
  - Props: `isAdmin`, `onToggleAdmin`, `searchTerm`, `onSearchChange`, `cartItemCount`
  - 검색 입력 필드(네이티브 input), 관리자 모드 전환 버튼(네이티브 button), 장바구니 아이콘 포함

- **`PagesLayout.tsx`**: 전체 페이지 레이아웃
  - `useApp` Hook을 사용하여 모든 상태와 액션을 받음
  - `Header`, `Toast`, `CartPage`, `AdminPage`를 조건부 렌더링
  - 앱의 최상위 레이아웃 컴포넌트

**특징**:
- ✅ 여러 컴포넌트를 조합하여 레이아웃 구성
- ✅ 전역 상태와 액션을 하위 컴포넌트에 전달

---

### 📁 `features/` - 엔티티별 기능 컴포넌트

**역할**: 특정 엔티티를 다루는 컴포넌트

#### `features/product/` - 상품 관련 컴포넌트

- **`ProductCard.tsx`**: 개별 상품을 표시하는 카드
  - Props: `product`, `remainingStock`, `onAddToCart`, `formatPrice`
  - 상품 이미지, 이름, 가격, 재고, 할인 정보 표시
  - 장바구니 추가 버튼 포함

#### `features/cart/` - 장바구니 관련 컴포넌트

- **`Cart.tsx`**: 장바구니 섹션 컴포넌트
  - Props: `cart`, `selectedCoupon`, `total`, `coupons`, `onRemoveItem`, `onUpdateQuantity`, `onApplyCoupon`, `onSetSelectedCoupon`, `onClearCart`, `onOrder`, `formatPrice`, `addNotification`
  - 장바구니 아이템 목록, 쿠폰 선택, 결제 정보 표시
  - `CartItem` 컴포넌트를 사용하여 아이템 표시

- **`CartItem.tsx`**: 장바구니 아이템 컴포넌트
  - Props: `item`, `itemTotal`, `onRemove`, `onUpdateQuantity`, `formatPrice`
  - 개별 장바구니 아이템 표시
  - 수량 조절, 삭제 기능 포함

#### `features/coupon/` - 쿠폰 관련 컴포넌트

- **`CouponSelector.tsx`**: 쿠폰 선택 드롭다운
  - Props: `coupons`, `selectedCoupon`, `onSelect`, `onClear`
  - 쿠폰 선택 및 적용 기능

#### `features/admin/` - 관리자 기능 컴포넌트

- **`AdminPage.tsx`**: 관리자 페이지 메인 컴포넌트
  - Props: Admin 관련 모든 상태와 액션
  - 내부에서 탭 네비게이션을 구현하고, `ProductManagement`, `CouponManagement`를 조건부 렌더링

- **`ProductManagement.tsx`**: 상품 관리 섹션
  - Props: `products`, `editingProduct`, `productForm`, `showProductForm`, `onAddProduct`, `onEditProduct`, `onDeleteProduct`, `onFormChange`, `onFormSubmit`, `onFormCancel`, `formatPrice`, `addNotification`
  - 상품 목록 테이블, 상품 추가/수정/삭제 기능
  - `ProductForm` 컴포넌트 사용

- **`ProductForm.tsx`**: 상품 추가/수정 폼
  - Props: `productForm`, `editingProduct`, `onFormChange`, `onSubmit`, `onCancel`, `addNotification`
  - 상품 정보 입력 폼 (이름, 가격, 재고, 설명, 할인 정책)

- **`CouponManagement.tsx`**: 쿠폰 관리 섹션
  - Props: `coupons`, `couponForm`, `showCouponForm`, `onAddCoupon`, `onDeleteCoupon`, `onFormChange`, `onFormSubmit`, `onFormCancel`, `addNotification`
  - 쿠폰 목록 그리드, 쿠폰 추가/삭제 기능
  - `CouponForm` 컴포넌트 사용

- **`CouponForm.tsx`**: 쿠폰 추가 폼
  - Props: `couponForm`, `onFormChange`, `onSubmit`, `onCancel`, `addNotification`
  - 쿠폰 정보 입력 폼 (이름, 코드, 할인 타입, 할인 값)

- **`types.ts`**: 관리자 관련 타입 정의
  - `ProductFormData`, `CouponFormData`, `AdminTab`
  - `EMPTY_PRODUCT_FORM`, `EMPTY_COUPON_FORM` 상수

**특징**:
- ✅ 특정 엔티티를 다룸 (Product, Cart, Coupon)
- ✅ 엔티티 관련 props를 받음
- ✅ 비즈니스 로직은 Hooks에서 처리

---

### 📁 `pages/` - 페이지 컴포넌트

**역할**: 여러 기능 컴포넌트를 조합하여 특정 페이지 구성

**컴포넌트**:
- **`CartPage.tsx`**: 쇼핑몰 메인 페이지
  - Props: `searchTerm`, `cart`, `selectedCoupon`, `total`, `coupons`, `onAddToCart`, `onRemoveFromCart`, `onUpdateQuantity`, `onApplyCoupon`, `onSetSelectedCoupon`, `onClearCart`, `onOrder`, `getRemainingStockForProduct`, `formatPrice`, `addNotification`
  - `ProductCard`를 그리드로 배치하여 상품 목록 표시
  - `Cart` 컴포넌트와 함께 페이지 구성
  - `useProducts`와 `useDebounce` Hook을 내부에서 사용하여 상품 필터링

**특징**:
- ✅ 여러 기능 컴포넌트를 조합
- ✅ 페이지 단위의 레이아웃 담당
- ✅ 필요한 Hook을 내부에서 사용 가능

---

### 📁 `icons/` - 아이콘 컴포넌트

**역할**: 재사용 가능한 SVG 아이콘 컴포넌트

**컴포넌트**:
- `CartIcon`: 장바구니 아이콘
- `CartIconSimple`: 간단한 장바구니 아이콘
- `CloseIcon`: 닫기 아이콘
- `TrashIcon`: 삭제 아이콘
- `ImageIcon`: 이미지 아이콘
- `PlusIcon`: 더하기 아이콘
- `MinusIcon`: 빼기 아이콘

**사용 예시**:
```typescript
<CartIcon className="w-6 h-6" strokeWidth={2} />
```

**특징**:
- ✅ `className`과 `strokeWidth` prop으로 커스터마이징 가능
- ✅ 범용적으로 사용 가능

---

## 컴포넌트와 Hooks의 관계

### 아키텍처 계층 구조

```
┌─────────────────┐
│   Components    │  ← UI 렌더링만 담당
└────────┬────────┘
         │ 사용
┌────────▼────────┐
│     Hooks       │  ← 상태 관리 + 비즈니스 로직
└────────┬────────┘
         │ 사용
┌────────▼────────┐
│     Models      │  ← 순수함수 (계산 로직)
└─────────────────┘
```

### 역할 분리

| 계층 | 역할 | 예시 |
|------|------|------|
| **Models** | 순수함수로 계산 로직만 담당 | `calculateCartTotal()`, `filterProducts()` |
| **Hooks** | Models를 사용하여 상태 관리 + 사이드 이펙트 처리 | `useCart()`, `useProducts()` |
| **Components** | Hooks를 사용하여 UI 렌더링 | `ProductCard.tsx`, `Cart.tsx` |

### 컴포넌트에서 Hooks 사용 예시

```typescript
// ❌ 나쁜 예: 컴포넌트에서 직접 상태 관리
const ProductCard = () => {
  const [cart, setCart] = useState([]);  // ❌ 비즈니스 로직
  // ...
};

// ✅ 좋은 예: Hooks를 사용하여 데이터와 액션을 받음
const ProductCard = ({ product, onAddToCart }) => {
  // 비즈니스 로직 없음, props만 사용
  return <div>...</div>;
};

// Hooks는 상위 컴포넌트에서 사용
const CartPage = () => {
  const { addToCart } = useCart();  // ✅ Hook 사용
  return <ProductCard onAddToCart={addToCart} />;
};
```

---

## 사용 예시

### 예시 1: UI 컴포넌트 사용

```typescript
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const MyComponent = () => {
  return (
    <div>
      <Input
        value={value}
        onChange={setValue}
        placeholder="입력하세요"
        label="이름"
      />
      <Button onClick={handleSubmit} variant="primary">
        제출
      </Button>
    </div>
  );
};
```

### 예시 2: 엔티티 컴포넌트 사용

```typescript
import { ProductCard } from '../features/product/ProductCard';
import { useCart } from '../../hooks/entities/useCart';

const ProductList = ({ products }) => {
  const { addToCart, getRemainingStockForProduct } = useCart();
  
  return (
    <div>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          remainingStock={getRemainingStockForProduct(product)}
          onAddToCart={addToCart}
          formatPrice={formatPrice}
        />
      ))}
    </div>
  );
};
```

### 예시 3: 페이지 컴포넌트 사용

```typescript
import { CartPage } from '../pages/CartPage';
import { useApp } from '../../hooks/useApp';

const PagesLayout = () => {
  const {
    searchTerm,
    cart,
    addToCart,
    // ... 모든 상태와 액션
  } = useApp();
  
  return (
    <CartPage
      searchTerm={searchTerm}
      cart={cart}
      onAddToCart={addToCart}
      // ... props 전달
    />
  );
};
```

---

## 주의사항

### ✅ 해야 할 것

1. **비즈니스 로직은 Hooks로 분리**
   ```typescript
   // ✅ 좋은 예: Hook에서 로직 처리
   const { addToCart } = useCart();
   <ProductCard onAddToCart={addToCart} />
   ```

2. **UI 컴포넌트는 엔티티를 모르게 작성**
   ```typescript
   // ✅ 좋은 예: 범용 컴포넌트
   <Button onClick={handleClick}>클릭</Button>
   ```

3. **엔티티 컴포넌트는 엔티티 props만 받음**
   ```typescript
   // ✅ 좋은 예: 엔티티 관련 props만
   <ProductCard product={product} onAddToCart={handleAdd} />
   ```

4. **Props 타입 명확히 정의**
   ```typescript
   // ✅ 좋은 예: 명확한 타입 정의
   interface ProductCardProps {
     product: ProductWithUI;
     onAddToCart: (product: ProductWithUI) => void;
   }
   ```

### ❌ 하지 말아야 할 것

1. **컴포넌트에서 직접 상태 관리**
   ```typescript
   // ❌ 나쁜 예: 컴포넌트에서 useState 사용
   const ProductCard = () => {
     const [cart, setCart] = useState([]);  // ❌
   };
   ```

2. **UI 컴포넌트에 엔티티 관련 prop 추가**
   ```typescript
   // ❌ 나쁜 예: Button에 product prop 추가
   <Button product={product} onClick={handleClick} />
   ```

3. **비즈니스 로직을 컴포넌트에 직접 작성**
   ```typescript
   // ❌ 나쁜 예: 컴포넌트에서 계산 로직
   const Cart = ({ items }) => {
     const total = items.reduce((sum, item) => sum + item.price, 0);  // ❌
   };
   ```

4. **순환 의존성 생성**
   ```typescript
   // ❌ 나쁜 예: 순환 의존성
   // ProductCard.tsx
   import { Cart } from '../cart/Cart';
   
   // Cart.tsx
   import { ProductCard } from '../product/ProductCard';
   ```

---

## 컴포넌트 분류 기준

### UI 컴포넌트로 분류하는 기준
- ✅ 어떤 프로젝트에서도 사용 가능
- ✅ 엔티티를 모름
- ✅ 비즈니스 로직 없음
- ✅ 예시: `Button`, `Input`, `Toast`

### 엔티티 컴포넌트로 분류하는 기준
- ✅ 특정 엔티티를 다룸
- ✅ 비즈니스 도메인에 종속적
- ✅ 엔티티 관련 props를 받음
- ✅ 예시: `ProductCard`, `Cart`, `CouponCard`

### 레이아웃 컴포넌트로 분류하는 기준
- ✅ 페이지 구조를 담당
- ✅ 여러 컴포넌트를 조합
- ✅ 전역 레이아웃 담당
- ✅ 예시: `Header`, `PagesLayout`

### 페이지 컴포넌트로 분류하는 기준
- ✅ 여러 기능 컴포넌트를 조합
- ✅ 특정 페이지를 구성
- ✅ 페이지 단위의 레이아웃 담당
- ✅ 예시: `CartPage`

---

## 관련 문서

- `../hooks/README.md`: Hooks 폴더 가이드
- `../models/README.md`: Models 폴더 가이드
- `../../.cursor/docs/`: 리팩토링 가이드 문서

---

**마지막 업데이트**: 2025-01-02

