# Hooks 폴더 가이드

이 폴더는 **비즈니스 로직과 상태 관리를 담당하는 Custom Hooks**를 포함합니다.

---

## 📋 목차

1. [Hooks 폴더란?](#hooks-폴더란)
2. [Hooks와 Models의 관계](#hooks와-models의-관계)
3. [파일 구조](#파일-구조)
4. [각 Hook 상세 설명](#각-hook-상세-설명)
5. [사용 예시](#사용-예시)
6. [주의사항](#주의사항)

---

## Hooks 폴더란?

### 역할
- **Component에서 비즈니스 로직을 분리**
- **상태 관리와 사이드 이펙트 처리** (localStorage, API 호출 등)
- **Models의 순수함수를 활용하여 비즈니스 로직 구현**
- **재사용 가능한 로직 캡슐화**

### 특징
- ✅ React Hook 규칙 준수
- ✅ `useCallback`, `useMemo`를 통한 성능 최적화
- ✅ Models의 순수함수 활용
- ✅ localStorage 동기화 처리
- ✅ 단일 책임 원칙 (각 Hook은 하나의 엔티티/기능만 담당)

---

## Hooks와 Models의 관계

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
| **Components** | Hooks를 사용하여 UI 렌더링 | `App.tsx`, `ProductCard.tsx` |

### 왜 이렇게 분리하나요?

1. **테스트 용이성**: Models는 순수함수라서 테스트하기 쉬움
2. **재사용성**: Models는 React와 무관하게 어디서든 사용 가능
3. **유지보수성**: 각 계층이 명확한 책임을 가짐
4. **성능 최적화**: Hooks에서 `useMemo`, `useCallback`으로 최적화 가능

---

## 파일 구조

```
src/basic/hooks/
├── useCart.ts         # 장바구니 관리 Hook
├── useProducts.ts     # 상품 관리 Hook
└── useCoupons.ts      # 쿠폰 관리 Hook
```

**참고**: 
- 알림 기능은 단순 UI 로직이므로 `components/ui/Toast.tsx`로 분리되었고, 상태 관리는 `App.tsx`에서 직접 처리합니다.
- 유틸리티 Hook (`useDebounce`)은 `utils/hooks/` 폴더로 분리되었습니다.

---

## 각 Hook 상세 설명

### 📦 `useCart` - 장바구니 관리 Hook

#### 목적
장바구니 상태 관리 및 장바구니 관련 모든 비즈니스 로직 처리

#### 사용하는 Models 함수
```typescript
// models/cart.ts에서 import
import {
  addItemToCart,           // 장바구니에 상품 추가 (순수함수)
  removeItemFromCart,       // 장바구니에서 상품 제거 (순수함수)
  updateCartItemQuantity,   // 장바구니 아이템 수량 변경 (순수함수)
  calculateCartTotal,       // 장바구니 총액 계산 (순수함수)
  getRemainingStock         // 남은 재고 계산 (순수함수)
} from '../models/cart';

// models/coupon.ts에서 import
import { validateCoupon } from '../models/coupon';
```

#### 사용하는 Constants
```typescript
import { MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON } from '../constants';
```

#### 상태 (State)
- `cart: CartItem[]` - 장바구니 아이템 배열 (localStorage 동기화)
- `selectedCoupon: Coupon | null` - 선택된 쿠폰

#### 주요 함수

##### 1. `addToCart(product: Product)`
**역할**: 장바구니에 상품 추가
**사용하는 Models 함수**: `getRemainingStock()`, `addItemToCart()`, `updateCartItemQuantity()`
**로직**:
1. `getRemainingStock()`로 재고 확인
2. 재고가 0 이하면 실패 반환
3. 이미 장바구니에 있으면 `updateCartItemQuantity()`로 수량 증가
4. 없으면 `addItemToCart()`로 새로 추가

##### 2. `removeFromCart(productId: string)`
**역할**: 장바구니에서 상품 제거
**사용하는 Models 함수**: `removeItemFromCart()`
**로직**: `removeItemFromCart()`로 새 장바구니 생성 후 상태 업데이트

##### 3. `updateQuantity(productId: string, quantity: number)`
**역할**: 장바구니 아이템 수량 변경
**사용하는 Models 함수**: `updateCartItemQuantity()`
**로직**:
1. 재고 확인
2. 재고 초과 시 실패 반환
3. `updateCartItemQuantity()`로 새 장바구니 생성 후 상태 업데이트

##### 4. `applyCoupon(coupon: Coupon)`
**역할**: 쿠폰 적용
**사용하는 Models 함수**: `calculateCartTotal()`, `validateCoupon()`
**로직**:
1. `calculateCartTotal()`로 쿠폰 적용 후 총액 계산
2. `validateCoupon()`로 쿠폰 사용 가능 여부 확인
3. 사용 불가능하면 실패 반환
4. 사용 가능하면 쿠폰 설정

##### 5. `total` (useMemo)
**역할**: 장바구니 총액 계산 (할인 전/후)
**사용하는 Models 함수**: `calculateCartTotal()`
**로직**: `calculateCartTotal(cart, selectedCoupon)` 호출

##### 6. `getRemainingStockForProduct(product: Product)`
**역할**: 특정 상품의 남은 재고 계산
**사용하는 Models 함수**: `getRemainingStock()`
**로직**: `getRemainingStock(product, cart)` 호출

#### 반환값
```typescript
{
  // 상태
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  
  // 계산된 값
  total: { totalBeforeDiscount: number; totalAfterDiscount: number };
  totalItemCount: number;
  
  // 액션
  addToCart: (product: Product) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  applyCoupon: (coupon: Coupon) => { success: boolean; message: string };
  setSelectedCoupon: (coupon: Coupon | null) => void;
  clearCart: () => void;
  
  // 유틸리티
  getRemainingStockForProduct: (product: Product) => number;
}
```

---

### 📦 `useProducts` - 상품 관리 Hook

#### 목적
상품 목록 상태 관리 및 상품 CRUD 작업 처리

#### 사용하는 Models 함수
```typescript
// models/product.ts에서 import
import { filterProducts } from '../models/product';
```

#### 사용하는 Constants
```typescript
import { initialProducts, ProductWithUI } from '../constants';
```

#### 상태 (State)
- `products: ProductWithUI[]` - 상품 목록 (localStorage 동기화)

#### 주요 함수

##### 1. `addProduct(newProduct: Omit<ProductWithUI, 'id'>)`
**역할**: 새 상품 추가
**사용하는 Models 함수**: 없음 (상태 관리만)
**로직**: 고유 ID 생성 후 상품 추가

##### 2. `updateProduct(productId: string, updates: Partial<ProductWithUI>)`
**역할**: 상품 정보 수정
**사용하는 Models 함수**: 없음 (상태 관리만)
**로직**: 상품 정보 업데이트

##### 3. `deleteProduct(productId: string)`
**역할**: 상품 삭제
**사용하는 Models 함수**: 없음 (상태 관리만)
**로직**: 상품 제거

##### 4. `filteredProducts` (useMemo)
**역할**: 검색어로 필터링된 상품 목록
**사용하는 Models 함수**: `filterProducts()`
**로직**: `filterProducts(products, searchTerm)` 호출

#### 반환값
```typescript
{
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, stock: number) => void;
  addProductDiscount: (productId: string, discount: { quantity: number; rate: number }) => void;
  removeProductDiscount: (productId: string, discountIndex: number) => void;
}
```

---

### 📦 `useCoupons` - 쿠폰 관리 Hook

#### 목적
쿠폰 목록 상태 관리 및 쿠폰 CRUD 작업 처리

#### 사용하는 Models 함수
```typescript
// 없음 (상태 관리만 담당)
// 쿠폰 관련 계산은 models/coupon.ts에 있지만,
// 이 Hook에서는 주로 상태 관리만 수행
```

#### 사용하는 Constants
```typescript
import { initialCoupons } from '../constants';
```

#### 상태 (State)
- `coupons: Coupon[]` - 쿠폰 목록 (localStorage 동기화)

#### 주요 함수

##### 1. `addCoupon(newCoupon: Coupon)`
**역할**: 새 쿠폰 추가
**사용하는 Models 함수**: 없음 (상태 관리만)
**로직**: 중복 쿠폰 코드 확인 후 추가

##### 2. `deleteCoupon(couponCode: string)`
**역할**: 쿠폰 삭제
**사용하는 Models 함수**: 없음 (상태 관리만)
**로직**: 쿠폰 제거

#### 반환값
```typescript
{
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => { success: boolean; message: string };
  deleteCoupon: (couponCode: string) => void;
}
```

---

## 사용 예시

### 예시 1: useCart 사용

```typescript
import { useCart } from './hooks/useCart';

const MyComponent = () => {
  const {
    cart,
    total,
    addToCart,
    removeFromCart,
    updateQuantity
  } = useCart();

  const handleAddProduct = (product: Product) => {
    const result = addToCart(product);
    if (result.success) {
      console.log('장바구니에 추가됨');
    } else {
      console.error(result.message);
    }
  };

  return (
    <div>
      <p>총액: {total.totalAfterDiscount}원</p>
      {cart.map(item => (
        <div key={item.product.id}>
          {item.product.name} - {item.quantity}개
          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
            +
          </button>
        </div>
      ))}
    </div>
  );
};
```

### 예시 2: useProducts + useDebounce 조합

```typescript
import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useDebounce } from './utils/hooks/useDebounce';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { filteredProducts } = useProducts(debouncedSearchTerm);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="상품 검색..."
      />
      {filteredProducts.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

### 예시 3: 여러 Hooks 조합

```typescript
import { useState, useCallback } from 'react';
import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { Toast, Notification } from './components/ui/Toast';

const App = () => {
  // 알림 상태 관리 (단순 UI 상태는 App.tsx에서 직접 처리)
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const addNotification = useCallback((message: string, type: 'error' | 'success' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, NOTIFICATION_DURATION);
  }, []);

  const { addToCart } = useCart();
  const { products } = useProducts();

  const handleAddToCart = (product: Product) => {
    const result = addToCart(product);
    if (result.success) {
      addNotification(result.message, 'success');
    } else {
      addNotification(result.message, 'error');
    }
  };

  return (
    <div>
      <Toast 
        notifications={notifications} 
        onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} 
      />
      {products.map(product => (
        <button key={product.id} onClick={() => handleAddToCart(product)}>
          장바구니 담기
        </button>
      ))}
    </div>
  );
};
```

---

## 주의사항

### ✅ 해야 할 것

1. **Models의 순수함수를 사용하기**
   ```typescript
   // ✅ 좋은 예
   const total = useMemo(() => {
     return calculateCartTotal(cart, selectedCoupon); // Models 함수 사용
   }, [cart, selectedCoupon]);
   ```

2. **useCallback, useMemo로 성능 최적화**
   ```typescript
   // ✅ 좋은 예
   const addToCart = useCallback((product: Product) => {
     // ...
   }, [cart]);
   ```

3. **localStorage 동기화는 useEffect로 처리**
   ```typescript
   // ✅ 좋은 예
   useEffect(() => {
     localStorage.setItem('cart', JSON.stringify(cart));
   }, [cart]);
   ```

4. **에러 처리 및 사용자 피드백 제공**
   ```typescript
   // ✅ 좋은 예
   const addToCart = useCallback((product: Product) => {
     if (remainingStock <= 0) {
       return { success: false, message: '재고가 부족합니다!' };
     }
     // ...
   }, [cart]);
   ```

### ❌ 하지 말아야 할 것

1. **Models 함수를 직접 수정하기**
   ```typescript
   // ❌ 나쁜 예
   const calculateTotal = () => {
     // Models 함수를 복사해서 수정
     let total = 0;
     cart.forEach(item => {
       total += item.product.price * item.quantity;
     });
     return total;
   };
   
   // ✅ 좋은 예
   const total = useMemo(() => {
     return calculateCartTotal(cart, selectedCoupon); // Models 함수 사용
   }, [cart, selectedCoupon]);
   ```

2. **직접적인 사이드 이펙트 발생**
   ```typescript
   // ❌ 나쁜 예
   const addToCart = (product: Product) => {
     cart.push({ product, quantity: 1 }); // 원본 배열 수정
     console.log('추가됨'); // 콘솔 출력
   };
   
   // ✅ 좋은 예
   const addToCart = useCallback((product: Product) => {
     setCart(prevCart => addItemToCart(prevCart, product)); // 새 배열 반환
   }, []);
   ```

3. **React Hook 규칙 위반**
   ```typescript
   // ❌ 나쁜 예
   if (condition) {
     const [state, setState] = useState(0); // 조건부 Hook
   }
   
   // ✅ 좋은 예
   const [state, setState] = useState(0);
   if (condition) {
     // 조건부 로직
   }
   ```

---

## Models 함수 매핑 테이블

각 Hook이 사용하는 Models 함수를 한눈에 볼 수 있는 테이블입니다.

| Hook | 사용하는 Models 함수 | 파일 위치 |
|------|---------------------|-----------|
| `useCart` | `addItemToCart` | `models/cart.ts` |
| | `removeItemFromCart` | `models/cart.ts` |
| | `updateCartItemQuantity` | `models/cart.ts` |
| | `calculateCartTotal` | `models/cart.ts` |
| | `getRemainingStock` | `models/cart.ts` |
| | `validateCoupon` | `models/coupon.ts` |
| `useProducts` | `filterProducts` | `models/product.ts` |
| `useCoupons` | 없음 | - |

**참고**: 
- 알림 기능은 비즈니스 로직이 아닌 단순 UI 로직이므로 Hook으로 분리하지 않고 `components/ui/Toast.tsx` 컴포넌트로 분리되었습니다.
- 유틸리티 Hook (`useDebounce`)은 `utils/hooks/` 폴더로 분리되었습니다.

---

## Hook 간 의존성

### 의존성 다이어그램

```
useCart
  ├─ models/cart.ts (순수함수)
  │   ├─ addItemToCart
  │   ├─ removeItemFromCart
  │   ├─ updateCartItemQuantity
  │   ├─ calculateCartTotal
  │   └─ getRemainingStock
  └─ models/coupon.ts
      └─ validateCoupon

useProducts
  └─ models/product.ts
      └─ filterProducts

useCoupons
  └─ (상태 관리만, models 의존성 없음)

```

**참고**: 
- 알림 기능은 `components/ui/Toast.tsx`로 분리되었습니다.
- 유틸리티 Hook (`useDebounce`)은 `utils/hooks/` 폴더로 분리되었습니다.

### Hook 간 통신

Hooks는 서로 직접 통신하지 않습니다. 대신 상위 컴포넌트에서 여러 Hooks를 조합하여 사용합니다:

```typescript
// ✅ 좋은 예: 상위 컴포넌트에서 조합
const App = () => {
  const { cart } = useCart();
  const { products } = useProducts();
  // 단순 UI 상태는 App.tsx에서 직접 관리
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // 여러 Hooks를 조합하여 사용
};

// ❌ 나쁜 예: Hook 내부에서 다른 Hook 호출
const useCart = () => {
  const { products } = useProducts(); // ❌ 안티패턴
  // ...
};
```

---

## 테스트 예시

Hooks는 React Testing Library로 테스트할 수 있습니다:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';

test('useCart', () => {
  const { result } = renderHook(() => useCart());
  
  act(() => {
    result.current.addToCart(mockProduct);
  });
  
  expect(result.current.cart.length).toBe(1);
  expect(result.current.totalItemCount).toBe(1);
});
```

---

## 관련 문서

- `../models/README.md`: Models 폴더 가이드
- `.cursor/docs/hooks-명세서.md`: Hooks 구현 명세서
- `.cursor/docs/리팩토링-실행순서.md`: 리팩토링 전체 프로세스

---

**마지막 업데이트**: 2025-12-01

