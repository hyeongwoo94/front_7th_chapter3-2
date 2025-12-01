# Hooks 계층 구현 명세서

이 문서는 `src/basic` 폴더의 Hooks 계층 구현을 위한 상세 명세서입니다.

---

## 📋 목차

1. [Hooks 계층의 목적](#hooks-계층의-목적)
2. [구현할 Hooks 목록](#구현할-hooks-목록)
3. [각 Hook 상세 명세](#각-hook-상세-명세)
4. [Hook 간 의존성](#hook-간-의존성)
5. [구현 체크리스트](#구현-체크리스트)

---

## Hooks 계층의 목적

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

## 구현할 Hooks 목록

1. **`useCart`** - 장바구니 관리
2. **`useProducts`** - 상품 관리
3. **`useCoupons`** - 쿠폰 관리
4. **`useDebounce`** (선택사항) - 디바운스 유틸리티
5. **`useNotifications`** (선택사항) - 알림 관리

---

## 각 Hook 상세 명세

### 1. `useCart` - 장바구니 관리 Hook

#### 파일 위치
`src/basic/hooks/useCart.ts`

#### 목적
장바구니 상태 관리 및 장바구니 관련 모든 비즈니스 로직 처리

#### 사용하는 Models 함수
```typescript
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  calculateCartTotal,
  getRemainingStock
} from '../models/cart';
import { validateCoupon } from '../models/coupon';
```

#### 사용하는 Constants
```typescript
import { MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON } from '../constants';
```

#### 상태 (State)
```typescript
// 1. 장바구니 아이템 배열
const [cart, setCart] = useState<CartItem[]>(() => {
  // localStorage에서 초기값 로드
  const saved = localStorage.getItem('cart');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
});

// 2. 선택된 쿠폰
const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
```

#### 사이드 이펙트 (useEffect)
```typescript
// localStorage 동기화
useEffect(() => {
  if (cart.length > 0) {
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    localStorage.removeItem('cart');
  }
}, [cart]);
```

#### 액션 함수 (useCallback)

##### 1. `addToCart`
**역할**: 장바구니에 상품 추가
**파라미터**: `product: Product`
**반환값**: `{ success: boolean, message: string }` 또는 `void`
**로직**:
1. `getRemainingStock(product, cart)`로 재고 확인
2. 재고가 0 이하면 실패 반환
3. `addItemToCart(cart, product)`로 새 장바구니 생성
4. `setCart`로 상태 업데이트
5. 성공 반환

**주의사항**:
- 재고 확인 필수
- 이미 장바구니에 있는 상품이면 수량 증가
- models의 순수함수 사용

##### 2. `removeFromCart`
**역할**: 장바구니에서 상품 제거
**파라미터**: `productId: string`
**반환값**: `void`
**로직**:
1. `removeItemFromCart(cart, productId)`로 새 장바구니 생성
2. `setCart`로 상태 업데이트

##### 3. `updateQuantity`
**역할**: 장바구니 아이템 수량 변경
**파라미터**: `productId: string`, `quantity: number`
**반환값**: `{ success: boolean, message?: string }` 또는 `void`
**로직**:
1. 수량이 0 이하면 `removeFromCart` 호출
2. 상품의 최대 재고 확인
3. 수량이 재고를 초과하면 실패 반환
4. `updateCartItemQuantity(cart, productId, quantity)`로 새 장바구니 생성
5. `setCart`로 상태 업데이트

**주의사항**:
- 재고 확인 필수
- 수량이 0 이하면 자동으로 제거

##### 4. `applyCoupon`
**역할**: 쿠폰 적용
**파라미터**: `coupon: Coupon`
**반환값**: `{ success: boolean, message: string }` 또는 `void`
**로직**:
1. `calculateCartTotal(cart, coupon)`로 쿠폰 적용 후 총액 계산
2. `validateCoupon(totalAfterDiscount, coupon)`로 쿠폰 사용 가능 여부 확인
3. percentage 쿠폰인 경우 최소 주문 금액 확인
4. 사용 불가능하면 실패 반환
5. `setSelectedCoupon(coupon)`로 쿠폰 설정
6. 성공 반환

**주의사항**:
- 쿠폰 검증 필수
- percentage 쿠폰은 최소 주문 금액 확인

##### 5. `clearCart`
**역할**: 장바구니 비우기
**파라미터**: 없음
**반환값**: `void`
**로직**:
1. `setCart([])`로 장바구니 초기화
2. `setSelectedCoupon(null)`로 쿠폰 초기화

#### 계산된 값 (useMemo)

##### 1. `total`
**역할**: 장바구니 총액 계산 (할인 전/후)
**반환값**: `{ totalBeforeDiscount: number, totalAfterDiscount: number }`
**로직**:
```typescript
const total = useMemo(() => {
  return calculateCartTotal(cart, selectedCoupon);
}, [cart, selectedCoupon]);
```

##### 2. `totalItemCount`
**역할**: 장바구니 총 아이템 수량
**반환값**: `number`
**로직**:
```typescript
const totalItemCount = useMemo(() => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}, [cart]);
```

#### 유틸리티 함수 (useCallback)

##### 1. `getRemainingStockForProduct`
**역할**: 특정 상품의 남은 재고 계산
**파라미터**: `product: Product`
**반환값**: `number`
**로직**:
```typescript
const getRemainingStockForProduct = useCallback((product: Product) => {
  return getRemainingStock(product, cart);
}, [cart]);
```

#### 반환값 (Return)
```typescript
return {
  // 상태
  cart,
  selectedCoupon,
  
  // 계산된 값
  total,
  totalItemCount,
  
  // 액션
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  setSelectedCoupon,
  clearCart,
  
  // 유틸리티
  getRemainingStockForProduct
};
```

---

### 2. `useProducts` - 상품 관리 Hook

#### 파일 위치
`src/basic/hooks/useProducts.ts`

#### 목적
상품 목록 상태 관리 및 상품 CRUD 작업 처리

#### 사용하는 Models 함수
```typescript
import { filterProducts } from '../models/product';
```

#### 사용하는 Constants
```typescript
import { initialProducts, ProductWithUI } from '../constants';
```

#### 상태 (State)
```typescript
// 상품 목록
const [products, setProducts] = useState<ProductWithUI[]>(() => {
  const saved = localStorage.getItem('products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialProducts;
    }
  }
  return initialProducts;
});
```

#### 사이드 이펙트 (useEffect)
```typescript
// localStorage 동기화
useEffect(() => {
  localStorage.setItem('products', JSON.stringify(products));
}, [products]);
```

#### 액션 함수 (useCallback)

##### 1. `addProduct`
**역할**: 새 상품 추가
**파라미터**: `newProduct: Omit<ProductWithUI, 'id'>`
**반환값**: `void` 또는 `{ success: boolean, message: string }`
**로직**:
1. 고유 ID 생성 (`p${Date.now()}`)
2. 새 상품 객체 생성
3. `setProducts(prev => [...prev, product])`로 상태 업데이트

##### 2. `updateProduct`
**역할**: 상품 정보 수정
**파라미터**: `productId: string`, `updates: Partial<ProductWithUI>`
**반환값**: `void`
**로직**:
1. `setProducts(prev => prev.map(...))`로 상품 정보 업데이트

##### 3. `deleteProduct`
**역할**: 상품 삭제
**파라미터**: `productId: string`
**반환값**: `void`
**로직**:
1. `setProducts(prev => prev.filter(...))`로 상품 제거

##### 4. `updateProductStock`
**역할**: 상품 재고 수정
**파라미터**: `productId: string`, `stock: number`
**반환값**: `void`
**로직**:
1. `updateProduct(productId, { stock })` 호출

**참고**: `updateProduct`를 재사용할 수 있으므로 별도 구현 불필요할 수 있음

##### 5. `addProductDiscount`
**역할**: 상품에 할인 규칙 추가
**파라미터**: `productId: string`, `discount: { quantity: number, rate: number }`
**반환값**: `void`
**로직**:
1. 해당 상품 찾기
2. `discounts` 배열에 새 할인 규칙 추가
3. `updateProduct` 호출

##### 6. `removeProductDiscount`
**역할**: 상품의 할인 규칙 삭제
**파라미터**: `productId: string`, `discountIndex: number`
**반환값**: `void`
**로직**:
1. 해당 상품 찾기
2. `discounts` 배열에서 해당 인덱스 제거
3. `updateProduct` 호출

#### 계산된 값 (useMemo)

##### 1. `filteredProducts` (선택사항)
**역할**: 검색어로 필터링된 상품 목록
**파라미터**: `searchTerm: string` (Hook 파라미터로 받음)
**반환값**: `ProductWithUI[]`
**로직**:
```typescript
const filteredProducts = useMemo(() => {
  return filterProducts(products, searchTerm);
}, [products, searchTerm]);
```

**참고**: 검색어는 `useDebounce`와 함께 사용될 수 있음

#### 반환값 (Return)
```typescript
return {
  // 상태
  products,
  
  // 액션
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  addProductDiscount,
  removeProductDiscount,
  
  // 계산된 값 (선택사항)
  filteredProducts
};
```

---

### 3. `useCoupons` - 쿠폰 관리 Hook

#### 파일 위치
`src/basic/hooks/useCoupons.ts`

#### 목적
쿠폰 목록 상태 관리 및 쿠폰 CRUD 작업 처리

#### 사용하는 Models 함수
```typescript
// 쿠폰 관련 순수함수는 models/coupon.ts에 있지만,
// 이 Hook에서는 주로 상태 관리만 담당
```

#### 사용하는 Constants
```typescript
import { initialCoupons } from '../constants';
```

#### 상태 (State)
```typescript
// 쿠폰 목록
const [coupons, setCoupons] = useState<Coupon[]>(() => {
  const saved = localStorage.getItem('coupons');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialCoupons;
    }
  }
  return initialCoupons;
});
```

#### 사이드 이펙트 (useEffect)
```typescript
// localStorage 동기화
useEffect(() => {
  localStorage.setItem('coupons', JSON.stringify(coupons));
}, [coupons]);
```

#### 액션 함수 (useCallback)

##### 1. `addCoupon`
**역할**: 새 쿠폰 추가
**파라미터**: `newCoupon: Coupon`
**반환값**: `{ success: boolean, message: string }` 또는 `void`
**로직**:
1. 중복 쿠폰 코드 확인 (`coupons.find(c => c.code === newCoupon.code)`)
2. 중복이면 실패 반환
3. `setCoupons(prev => [...prev, newCoupon])`로 상태 업데이트
4. 성공 반환

**주의사항**:
- 쿠폰 코드 중복 확인 필수

##### 2. `deleteCoupon`
**역할**: 쿠폰 삭제
**파라미터**: `couponCode: string`
**반환값**: `void`
**로직**:
1. `setCoupons(prev => prev.filter(c => c.code !== couponCode))`로 쿠폰 제거

**주의사항**:
- 삭제된 쿠폰이 현재 선택된 쿠폰이면 `useCart`의 `setSelectedCoupon(null)` 호출 필요
- 이는 `useCart`와의 의존성 문제이므로, `onCouponDeleted` 콜백을 받거나 별도 처리 필요

#### 반환값 (Return)
```typescript
return {
  // 상태
  coupons,
  
  // 액션
  addCoupon,
  deleteCoupon
};
```

---

### 4. `useDebounce` - 디바운스 유틸리티 Hook (선택사항)

#### 파일 위치
`src/basic/hooks/useDebounce.ts`

#### 목적
입력값 디바운스 처리 (검색어 등)

#### 사용하는 Constants
```typescript
import { DEBOUNCE_DELAY } from '../constants';
```

#### 파라미터
```typescript
<T>(value: T, delay: number = DEBOUNCE_DELAY): T
```

#### 반환값
디바운스된 값

#### 구현 예시
```typescript
export const useDebounce = <T,>(value: T, delay: number = DEBOUNCE_DELAY): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

#### 사용 예시
```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm);
```

---

### 5. `useNotifications` - 알림 관리 Hook (선택사항)

#### 파일 위치
`src/basic/hooks/useNotifications.ts`

#### 목적
알림 상태 관리 및 자동 제거 처리

#### 사용하는 Constants
```typescript
import { NOTIFICATION_DURATION } from '../constants';
```

#### 상태 (State)
```typescript
interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

const [notifications, setNotifications] = useState<Notification[]>([]);
```

#### 액션 함수 (useCallback)

##### 1. `addNotification`
**역할**: 알림 추가
**파라미터**: `message: string`, `type: 'error' | 'success' | 'warning' = 'success'`
**반환값**: `void`
**로직**:
1. 고유 ID 생성 (`Date.now().toString()`)
2. 새 알림 객체 생성
3. `setNotifications(prev => [...prev, notification])`로 상태 업데이트
4. `setTimeout`으로 `NOTIFICATION_DURATION` 후 자동 제거

##### 2. `removeNotification`
**역할**: 알림 제거
**파라미터**: `id: string`
**반환값**: `void`
**로직**:
1. `setNotifications(prev => prev.filter(n => n.id !== id))`로 알림 제거

#### 반환값 (Return)
```typescript
return {
  // 상태
  notifications,
  
  // 액션
  addNotification,
  removeNotification
};
```

---

## Hook 간 의존성

### 의존성 다이어그램

```
useCart
  ├─ models/cart.ts (순수함수)
  └─ models/coupon.ts (validateCoupon)

useProducts
  └─ models/product.ts (filterProducts)

useCoupons
  └─ (상태 관리만, models 의존성 없음)

useDebounce
  └─ constants (DEBOUNCE_DELAY)

useNotifications
  └─ constants (NOTIFICATION_DURATION)
```

### Hook 간 통신

#### 1. `useCoupons`와 `useCart`의 통신
**문제**: 쿠폰 삭제 시 선택된 쿠폰도 제거해야 함

**해결 방법 1**: `useCart`에서 `useCoupons`의 `deleteCoupon` 호출 후 처리
```typescript
// useCart 내부
const handleCouponDeleted = useCallback((couponCode: string) => {
  if (selectedCoupon?.code === couponCode) {
    setSelectedCoupon(null);
  }
}, [selectedCoupon]);
```

**해결 방법 2**: `useCoupons`의 `deleteCoupon`이 콜백을 받음
```typescript
// useCoupons
const deleteCoupon = useCallback((
  couponCode: string,
  onDeleted?: (code: string) => void
) => {
  setCoupons(prev => prev.filter(c => c.code !== couponCode));
  onDeleted?.(couponCode);
}, []);
```

**권장**: 해결 방법 1 (Hook 간 직접 통신은 피하고, 상위 컴포넌트에서 조율)

---

## 구현 체크리스트

### 공통 체크리스트
- [ ] 모든 상태가 `useState`로 올바르게 관리되는가?
- [ ] localStorage 동기화가 `useEffect`로 구현되었는가?
- [ ] 모든 액션 함수가 `useCallback`으로 메모이제이션되었는가?
- [ ] 계산된 값들이 `useMemo`로 메모이제이션되었는가?
- [ ] Models의 순수함수를 사용하는가?
- [ ] Constants에서 상수를 가져오는가?
- [ ] 타입이 올바르게 정의되었는가?

### `useCart` 체크리스트
- [ ] 장바구니 상태 관리 (localStorage 연동)
- [ ] `addToCart` - 재고 확인 포함
- [ ] `removeFromCart`
- [ ] `updateQuantity` - 재고 확인 포함
- [ ] `applyCoupon` - 쿠폰 검증 포함
- [ ] `clearCart`
- [ ] `total` 계산 (useMemo)
- [ ] `totalItemCount` 계산 (useMemo)
- [ ] `getRemainingStockForProduct` 유틸리티

### `useProducts` 체크리스트
- [ ] 상품 목록 상태 관리 (localStorage 연동)
- [ ] `addProduct`
- [ ] `updateProduct`
- [ ] `deleteProduct`
- [ ] `updateProductStock` (선택사항)
- [ ] `addProductDiscount`
- [ ] `removeProductDiscount`
- [ ] `filteredProducts` (선택사항)

### `useCoupons` 체크리스트
- [ ] 쿠폰 목록 상태 관리 (localStorage 연동)
- [ ] `addCoupon` - 중복 확인 포함
- [ ] `deleteCoupon`

### `useDebounce` 체크리스트 (선택사항)
- [ ] 제네릭 타입 지원
- [ ] 기본 delay 값 사용
- [ ] cleanup 함수 구현

### `useNotifications` 체크리스트 (선택사항)
- [ ] 알림 상태 관리
- [ ] `addNotification` - 자동 제거 포함
- [ ] `removeNotification`

---

## 구현 순서 권장사항

1. **`useDebounce`** (가장 간단, 의존성 없음)
2. **`useNotifications`** (간단, 의존성 없음)
3. **`useCoupons`** (간단, 상태 관리만)
4. **`useProducts`** (중간, 상태 관리 + CRUD)
5. **`useCart`** (복잡, 여러 models 함수 사용)

---

## 참고 파일

- `src/basic/App.tsx` - 현재 구현된 로직 참고
- `src/basic/models/cart.ts` - 장바구니 순수함수
- `src/basic/models/product.ts` - 상품 순수함수
- `src/basic/models/coupon.ts` - 쿠폰 순수함수
- `src/basic/constants/index.ts` - 상수 정의
- `.cursor/docs/리팩토링-실행순서.md` - 전체 리팩토링 가이드

---

**마지막 업데이트**: 2025-12-01

