# Basic 폴더 리팩토링 문제점 정리

## 1. Button 컴포넌트의 실패한 재사용성

### 문제점

- **Button 컴포넌트를 만들었지만 실제로는 재사용하지 못함**
- origin과 스타일을 맞추기 위해 대부분의 버튼을 일반 `button` 태그로 변경해야 했음
- Button 컴포넌트의 variant가 origin의 다양한 스타일을 커버하지 못함

### 증거

```typescript
// Button 컴포넌트가 있지만 사용하지 않음
// src/basic/components/features/admin/ProductManagement.tsx
<button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800">
  새 상품 추가
</button>

// src/basic/components/features/admin/ProductForm.tsx
<button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
  취소
</button>
```

### 원인

1. **과도한 추상화**: origin에는 각 버튼마다 다른 스타일이 많아서 variant로 커버하기 어려움
2. **유연성 부족**: className을 추가해도 Button 컴포넌트의 기본 스타일과 충돌
3. **실제 사용 패턴과 불일치**: origin은 직접 className을 사용하는 패턴

### 해결 방안

- Button 컴포넌트를 제거하거나
- 정말 재사용되는 경우에만 사용 (예: ProductCard의 장바구니 버튼)
- 스타일 유틸리티 함수로 대체

---

## 2. Props Drilling 문제

### 문제점

- **PagesLayout에서 너무 많은 props를 전달**
- 20개 이상의 props를 하위 컴포넌트에 전달
- 컴포넌트 계층이 깊어질수록 props 전달이 복잡해짐

### 증거

```typescript
// src/basic/components/layout/PagesLayout.tsx
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
  addNotification,
} = useApp();

// 이 모든 props를 하위 컴포넌트에 전달
<AdminPage
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  products={products}
  // ... 20개 이상의 props
/>;
```

### 원인

- 모든 상태와 액션을 한 곳(useApp)에서 관리
- Context API나 상태 관리 라이브러리 미사용
- 컴포넌트 분리는 했지만 데이터 흐름은 개선하지 않음

### 해결 방안

- Context API 사용
- 관련된 상태를 그룹화하여 전달
- 필요한 컴포넌트에서 직접 hook 사용

---

## 3. 과도한 컴포넌트 분리

### 문제점

- **작은 기능도 별도 컴포넌트로 분리하여 오히려 복잡도 증가**
- 파일 수가 많아져서 코드 탐색이 어려움
- 단순한 UI도 여러 파일에 분산

### 증거

```
src/basic/components/
├── features/
│   ├── admin/
│   │   ├── AdminPage.tsx
│   │   ├── ProductManagement.tsx
│   │   ├── ProductForm.tsx
│   │   ├── CouponManagement.tsx
│   │   ├── CouponForm.tsx
│   │   └── TabNavigation.tsx
│   ├── cart/
│   │   ├── Cart.tsx
│   │   └── CartItem.tsx
│   ├── coupon/
│   │   ├── CouponCard.tsx
│   │   └── CouponSelector.tsx
│   └── product/
│       ├── ProductCard.tsx
│       ├── ProductList.tsx
│       └── SearchBar.tsx
```

### 원인

- "컴포넌트는 작게" 원칙을 과도하게 적용
- 재사용되지 않는 컴포넌트도 분리
- 단순한 UI도 별도 파일로 분리

### 해결 방안

- 정말 재사용되는 컴포넌트만 분리
- 작은 컴포넌트는 같은 파일에 정의
- 복잡도와 재사용성의 균형 고려

---

## 4. 일관성 없는 컴포넌트 사용

### 문제점

- **어떤 곳은 Button 컴포넌트, 어떤 곳은 일반 button 태그**
- 스타일링 방식이 일관되지 않음
- 같은 기능인데 다른 방식으로 구현

### 증거

```typescript
// ProductCard.tsx - Button 컴포넌트 사용
<Button variant="primary" className="w-full">장바구니 담기</Button>

// ProductManagement.tsx - 일반 button 태그 사용
<button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md">
  새 상품 추가
</button>

// Cart.tsx - 일반 button 태그 사용
<button className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md">
  결제하기
</button>
```

### 원인

- origin과 맞추기 위해 일부만 수정
- 전체적인 일관성 고려 부족
- Button 컴포넌트의 한계로 인한 혼용

### 해결 방안

- 전체적으로 일관된 패턴 적용
- Button 컴포넌트 사용 여부를 명확히 결정
- 스타일 가이드 문서화

---

## 5. 불필요한 추상화

### 문제점

- **단순한 기능도 여러 레이어로 추상화**
- 오히려 코드 이해가 어려워짐
- 유지보수 비용 증가

### 증거

```typescript
// 단순한 검색바도 별도 컴포넌트로 분리
// src/basic/components/features/product/SearchBar.tsx
export const SearchBar = ({ value, onChange, className }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="상품 검색..."
      className={className}
    />
  );
};

// 하지만 실제로는 단순한 input 태그
// origin에서는 직접 input 태그 사용
```

### 원인

- "재사용 가능하게" 원칙을 과도하게 적용
- 실제 재사용 여부를 확인하지 않고 추상화
- YAGNI (You Aren't Gonna Need It) 원칙 위반

### 해결 방안

- 실제로 재사용되는 경우에만 추상화
- 단순한 UI는 직접 구현
- 필요할 때 리팩토링

---

## 6. Hook 구조의 복잡성

### 문제점

- **너무 많은 hook으로 분리**
- hook 간 의존성이 복잡
- useApp이 모든 것을 조합하는 God Object 패턴

### 증거

```
src/basic/hooks/
├── entities/
│   ├── useCart.ts
│   ├── useCoupons.ts
│   └── useProducts.ts
├── useAdminForm.ts
├── useApp.ts (모든 hook을 조합)
├── useAppUI.ts
└── useShoppingMall.ts
```

### 원인

- 관심사 분리를 과도하게 적용
- hook 간 의존성 관리 부족
- useApp이 너무 많은 책임을 가짐

### 해결 방안

- 관련된 hook을 그룹화
- useApp의 책임 축소
- 필요한 곳에서 직접 hook 사용

---

## 7. 타입 정의의 중복

### 문제점

- **같은 타입이 여러 곳에 정의됨**
- 타입 불일치 가능성
- 유지보수 어려움

### 증거

```typescript
// src/basic/components/features/admin/types.ts
export interface ProductFormData { ... }

// src/basic/constants/index.ts
export interface ProductWithUI extends Product { ... }

// src/types.ts
export interface Product { ... }
```

### 원인

- 타입 정의 위치가 명확하지 않음
- 공통 타입과 컴포넌트별 타입 구분 부족

### 해결 방안

- 공통 타입은 한 곳에 정의
- 컴포넌트별 타입은 해당 폴더에 정의
- 타입 재사용 명확화

---

## 8. 스타일 일관성 부족

### 문제점

- **origin과 맞추기 위해 일부만 수정**
- 전체적인 스타일 일관성 부족
- Button 컴포넌트와 직접 className 혼용

### 증거

- 일부 버튼은 Button 컴포넌트 사용
- 일부 버튼은 직접 className 사용
- 아이콘도 컴포넌트와 SVG 직접 사용 혼용

### 해결 방안

- 전체 스타일 가이드 수립
- 일관된 패턴 적용
- 스타일 유틸리티 함수 고려

---

## 요약

### 주요 문제점

1. ❌ **Button 컴포넌트 실패**: 만들었지만 재사용하지 못함
2. ❌ **Props Drilling**: 너무 많은 props 전달
3. ❌ **과도한 분리**: 작은 기능도 별도 컴포넌트로 분리
4. ❌ **일관성 부족**: 같은 기능인데 다른 방식으로 구현
5. ❌ **불필요한 추상화**: 단순한 기능도 여러 레이어로 추상화
6. ❌ **Hook 복잡성**: 너무 많은 hook으로 분리
7. ❌ **타입 중복**: 같은 타입이 여러 곳에 정의
8. ❌ **스타일 일관성**: 전체적인 스타일 일관성 부족

### 개선 방향

1. ✅ **실용적인 재사용**: 정말 재사용되는 경우에만 컴포넌트화
2. ✅ **Context API 활용**: Props drilling 해결
3. ✅ **적절한 분리**: 복잡도와 재사용성의 균형
4. ✅ **일관된 패턴**: 전체적으로 일관된 스타일링 방식
5. ✅ **단순함 우선**: YAGNI 원칙 준수
6. ✅ **Hook 통합**: 관련된 hook 그룹화
7. ✅ **타입 중앙화**: 공통 타입 한 곳에 정의
8. ✅ **스타일 가이드**: 명확한 스타일 가이드 수립
