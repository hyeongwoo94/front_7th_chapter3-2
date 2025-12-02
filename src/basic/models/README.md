# Models 폴더 가이드

이 폴더는 **비즈니스 도메인의 핵심 계산 로직을 순수함수로 구현**한 곳입니다.

---

## 📋 목차

1. [Models 폴더란?](#models-폴더란)
2. [순수함수란?](#순수함수란)
3. [파일 구조](#파일-구조)
4. [각 파일별 함수 설명](#각-파일별-함수-설명)
5. [사용 예시](#사용-예시)
6. [주의사항](#주의사항)

---

## Models 폴더란?

### 역할
- **비즈니스 도메인의 계산 로직**을 담당
- **순수함수**로 구현되어 React와 무관하게 동작
- **재사용 가능**하고 **테스트하기 쉬운** 코드

### 특징
- ✅ React에 의존하지 않음
- ✅ 외부 상태에 의존하지 않음
- ✅ 부수 효과(Side Effect) 없음
- ✅ 같은 입력에 항상 같은 출력

---

## 순수함수란?

### 순수함수의 조건

1. **외부 상태에 의존하지 않음**
   ```typescript
   // ❌ 나쁜 예: 외부 변수에 의존
   let globalCart = [];
   const calculate = () => globalCart.reduce(...);
   
   // ✅ 좋은 예: 파라미터로 받음
   const calculate = (cart: CartItem[]) => cart.reduce(...);
   ```

2. **부수 효과 없음**
   ```typescript
   // ❌ 나쁜 예: 상태 변경 (부수 효과)
   const addItem = (cart: CartItem[], item: Product) => {
     cart.push(item); // 원본 배열 수정
     return cart;
   };
   
   // ✅ 좋은 예: 새 배열 반환 (불변성 유지)
   const addItem = (cart: CartItem[], item: Product) => {
     return [...cart, item]; // 새 배열 반환
   };
   ```

3. **같은 입력에 항상 같은 출력**
   ```typescript
   // ❌ 나쁜 예: 랜덤 값 사용
   const getPrice = (base: number) => base * Math.random();
   
   // ✅ 좋은 예: 항상 같은 결과
   const getPrice = (base: number, rate: number) => base * rate;
   ```

---

## 파일 구조

```
src/basic/models/
├── cart.ts      # 장바구니 관련 계산 로직
├── product.ts    # 상품 관련 계산 로직
└── coupon.ts    # 쿠폰 관련 계산 로직
```

---

## 각 파일별 함수 설명

### 📦 `cart.ts` - 장바구니 관련 계산 로직

#### 1. `getMaxApplicableDiscount`
**역할**: 적용 가능한 최대 할인율 계산
- 상품의 할인 정책 중 수량 조건을 만족하는 최대 할인율 찾기
- 대량 구매(10개 이상) 시 추가 5% 할인 적용
- 최대 할인율은 50%로 제한

**파라미터**:
- `item: CartItem` - 장바구니 아이템
- `cart: CartItem[]` - 전체 장바구니 (대량 구매 확인용)

**반환값**: `number` - 최대 할인율 (0 ~ 1)

---

#### 2. `calculateItemTotal`
**역할**: 개별 아이템의 할인 적용 후 총액 계산
- 상품 가격 × 수량 × (1 - 할인율)
- 소수점 반올림

**파라미터**:
- `item: CartItem` - 장바구니 아이템
- `cart: CartItem[]` - 전체 장바구니 (대량 구매 확인용)

**반환값**: `number` - 할인 적용 후 총액

---

#### 3. `calculateCartTotal`
**역할**: 장바구니 총액 계산 (할인 전/후)
- 모든 아이템의 할인 전 총액 계산
- 모든 아이템의 할인 후 총액 계산
- 쿠폰 적용 (있는 경우)

**파라미터**:
- `cart: CartItem[]` - 장바구니 아이템 배열
- `selectedCoupon: Coupon | null` - 선택된 쿠폰

**반환값**: 
```typescript
{
  totalBeforeDiscount: number;  // 할인 전 총액
  totalAfterDiscount: number;   // 할인 후 총액
}
```

---

#### 4. `getRemainingStock`
**역할**: 남은 재고 계산
- 상품 재고 - 장바구니에 담긴 수량

**파라미터**:
- `product: Product` - 상품
- `cart: CartItem[]` - 장바구니 (현재 주문 수량 확인용)

**반환값**: `number` - 남은 재고 수량

---

#### 5. `addItemToCart`
**역할**: 장바구니에 상품 추가 (순수함수 버전)
- 이미 장바구니에 있으면 수량 +1
- 없으면 새로 추가 (수량 1)

**파라미터**:
- `cart: CartItem[]` - 현재 장바구니
- `product: Product` - 추가할 상품

**반환값**: `CartItem[]` - 새로운 장바구니 배열

**주의**: 재고 확인은 이 함수에서 하지 않음 (Hook에서 수행)

---

#### 6. `removeItemFromCart`
**역할**: 장바구니에서 상품 제거 (순수함수 버전)
- 해당 상품 ID를 가진 아이템 제거

**파라미터**:
- `cart: CartItem[]` - 현재 장바구니
- `productId: string` - 제거할 상품 ID

**반환값**: `CartItem[]` - 새로운 장바구니 배열

---

#### 7. `updateCartItemQuantity`
**역할**: 장바구니 아이템 수량 변경 (순수함수 버전)
- 수량이 0 이하면 아이템 제거
- 그 외에는 수량 업데이트

**파라미터**:
- `cart: CartItem[]` - 현재 장바구니
- `productId: string` - 변경할 상품 ID
- `quantity: number` - 새로운 수량

**반환값**: `CartItem[]` - 새로운 장바구니 배열

**주의**: 재고 확인은 이 함수에서 하지 않음 (Hook에서 수행)

---

### 📦 `product.ts` - 상품 관련 계산 로직

#### 1. `filterProducts`
**역할**: 상품 검색/필터링
- 검색어가 없으면 모든 상품 반환
- 상품명 또는 설명에 검색어가 포함된 상품만 반환
- 대소문자 구분 없음

**파라미터**:
- `products: T[]` - 상품 배열 (Product 또는 ProductWithUI)
- `searchTerm: string` - 검색어

**반환값**: `T[]` - 필터링된 상품 배열

---

### 🎫 `coupon.ts` - 쿠폰 관련 계산 로직

#### 1. `applyCouponToTotal`
**역할**: 쿠폰을 총액에 적용
- `amount` 타입: 총액에서 할인 금액 차감
- `percentage` 타입: 총액에 할인율 적용
- 최소 금액은 0원

**파라미터**:
- `total: number` - 할인 적용 전 총액
- `coupon: Coupon` - 적용할 쿠폰

**반환값**: `number` - 쿠폰 적용 후 총액

---

#### 2. `validateCoupon`
**역할**: 쿠폰 사용 가능 여부 검증
- `percentage` 타입 쿠폰은 최소 주문 금액(10,000원) 이상일 때만 사용 가능
- `amount` 타입 쿠폰은 항상 사용 가능

**파라미터**:
- `total: number` - 현재 총액
- `coupon: Coupon` - 검증할 쿠폰

**반환값**: `boolean` - 사용 가능 여부

---

## 사용 예시

### 예시 1: 장바구니 총액 계산

```typescript
import { calculateCartTotal } from './models/cart';

const cart = [
  { product: { id: 'p1', price: 10000, ... }, quantity: 2 },
  { product: { id: 'p2', price: 20000, ... }, quantity: 1 }
];

const coupon = {
  name: '10% 할인',
  code: 'PERCENT10',
  discountType: 'percentage',
  discountValue: 10
};

const totals = calculateCartTotal(cart, coupon);
// {
//   totalBeforeDiscount: 40000,
//   totalAfterDiscount: 36000
// }
```

### 예시 2: 상품 필터링

```typescript
import { filterProducts } from './models/product';

const products = [
  { id: 'p1', name: '프리미엄 상품', description: '최고급 품질', ... },
  { id: 'p2', name: '일반 상품', description: '실용적인 상품', ... }
];

const filtered = filterProducts(products, '프리미엄');
// [{ id: 'p1', name: '프리미엄 상품', ... }]
```

### 예시 3: 장바구니에 상품 추가

```typescript
import { addItemToCart } from './models/cart';

const cart = [
  { product: { id: 'p1', ... }, quantity: 1 }
];

const newCart = addItemToCart(cart, { id: 'p1', ... });
// [{ product: { id: 'p1', ... }, quantity: 2 }] (수량 증가)

const newCart2 = addItemToCart(cart, { id: 'p2', ... });
// [
//   { product: { id: 'p1', ... }, quantity: 1 },
//   { product: { id: 'p2', ... }, quantity: 1 }  (새로 추가)
// ]
```

---

## 주의사항

### ✅ 해야 할 것

1. **모든 데이터를 파라미터로 받기**
   ```typescript
   // ✅ 좋은 예
   const calculate = (cart: CartItem[]) => { ... };
   ```

2. **불변성 유지 (새 배열/객체 반환)**
   ```typescript
   // ✅ 좋은 예
   const addItem = (cart: CartItem[], item: Product) => {
     return [...cart, item]; // 새 배열 반환
   };
   ```

3. **constants에서 비즈니스 규칙 가져오기**
   ```typescript
   // ✅ 좋은 예
   import { BULK_PURCHASE_QUANTITY } from '../constants';
   ```

### ❌ 하지 말아야 할 것

1. **외부 상태에 의존하기**
   ```typescript
   // ❌ 나쁜 예
   const calculate = () => {
     return globalCart.reduce(...); // 외부 변수 사용
   };
   ```

2. **부수 효과 발생시키기**
   ```typescript
   // ❌ 나쁜 예
   const addItem = (cart: CartItem[], item: Product) => {
     cart.push(item); // 원본 배열 수정
     console.log('추가됨'); // 콘솔 출력
     return cart;
   };
   ```

3. **React Hook 사용하기**
   ```typescript
   // ❌ 나쁜 예
   const useCart = () => {
     const [cart, setCart] = useState([]); // Hook 사용
   };
   ```

---

## 함수 간 의존성

```
getMaxApplicableDiscount
    ↓
calculateItemTotal
    ↓
calculateCartTotal ──→ applyCouponToTotal (coupon.ts)
    ↓
getRemainingStock

addItemToCart
removeItemFromCart
updateCartItemQuantity ──→ removeItemFromCart
```

---

## 테스트 예시

모델 함수들은 순수함수이므로 테스트하기 쉽습니다:

```typescript
import { calculateCartTotal } from './models/cart';

test('calculateCartTotal', () => {
  const cart = [
    { product: { id: 'p1', price: 1000 }, quantity: 2 },
    { product: { id: 'p2', price: 2000 }, quantity: 1 }
  ];
  
  const result = calculateCartTotal(cart, null);
  
  expect(result.totalBeforeDiscount).toBe(4000);
  expect(result.totalAfterDiscount).toBe(4000);
});
```

---

## 관련 문서

- `.cursor/docs/모델-분리-가이드.md`: 모델로 분리해야 하는 것들 상세 가이드
- `.cursor/docs/리팩토링-실행순서.md`: 리팩토링 전체 프로세스
- `.cursor/docs/학습방법.md`: 순수함수 작성 방법

---

**마지막 업데이트**: 2025-01-02

