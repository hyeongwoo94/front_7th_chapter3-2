# 심화과제: Props Drilling 해결 가이드 (Jotai 사용)

## 📋 목표

basic 폴더에서 컴포넌트를 분리하면서 발생한 **Props Drilling 문제**를 **Jotai**를 사용하여 해결합니다.

- Jotai를 사용하여 불필요한 props 전달 제거
- 필요한 props만 전달하도록 개선
- 테스트 코드 통과

---

## 🎯 작업 순서

### 1단계: Jotai 설치 및 현재 상태 분석

#### 1.1 Jotai 설치

```bash
pnpm add jotai
```

#### 1.2 Props Drilling 현황 파악

- [ ] `PagesLayout.tsx`에서 전달하는 props 목록 확인 (현재 20개 이상)
- [ ] 각 props가 어디서 사용되는지 추적
- [ ] Drilling props와 Domain props 구분
  - **Drilling props**: 중간 컴포넌트에서 사용하지 않고 전달만 하는 props
  - **Domain props**: 컴포넌트의 핵심 기능을 위한 props (예: `product`, `onAddToCart`)

#### 1.3 상태 그룹화 계획

- [ ] 관련된 상태들을 그룹화하여 Atom으로 분리
  - `cart`, `selectedCoupon`, `total` → Cart 관련 atoms
  - `products`, `searchTerm` → Product 관련 atoms
  - `isAdmin`, `activeTab` → Admin 관련 atoms
  - `notifications` → Notification 관련 atoms

---

### 2단계: Jotai Atom 구축

#### 2.1 Atom 파일 생성

```
src/advanced/atoms/
├── cartAtoms.ts
├── productAtoms.ts
├── adminAtoms.ts
└── notificationAtoms.ts
```

#### 2.2 cartAtoms.ts 구현

- [ ] `cartAtom` - 장바구니 아이템 배열
- [ ] `selectedCouponAtom` - 선택된 쿠폰
- [ ] `totalAtom` (derived) - 장바구니 총액 계산
- [ ] `totalItemCountAtom` (derived) - 장바구니 아이템 총 개수
- [ ] Write atoms: `addToCartAtom`, `removeFromCartAtom`, `updateQuantityAtom`, `applyCouponAtom`, `completeOrderAtom`

#### 2.3 productAtoms.ts 구현

- [ ] `productsAtom` - 상품 목록
- [ ] `searchTermAtom` - 검색어
- [ ] `filteredProductsAtom` (derived) - 필터링된 상품 목록
- [ ] Write atoms: `addProductAtom`, `updateProductAtom`, `deleteProductAtom`

#### 2.4 adminAtoms.ts 구현

- [ ] `isAdminAtom` - 관리자 모드 여부
- [ ] `activeTabAtom` - 관리자 페이지 탭 (products/coupons)
- [ ] `showProductFormAtom` - 상품 폼 표시 여부
- [ ] `showCouponFormAtom` - 쿠폰 폼 표시 여부
- [ ] `editingProductAtom` - 수정 중인 상품 ID
- [ ] `productFormAtom` - 상품 폼 데이터
- [ ] `couponFormAtom` - 쿠폰 폼 데이터
- [ ] `couponsAtom` - 쿠폰 목록
- [ ] Write atoms: `toggleAdminAtom`, `setActiveTabAtom`, `handleAddProductAtom`, `handleUpdateProductAtom`, `handleDeleteProductAtom`, `handleAddCouponAtom`, `handleDeleteCouponAtom`

#### 2.5 notificationAtoms.ts 구현

- [ ] `notificationsAtom` - 알림 목록
- [ ] Write atoms: `addNotificationAtom`, `removeNotificationAtom`

#### 2.6 Provider 설정

- [ ] `App.tsx`에 `<Provider>` 추가

**예시 코드:**

```typescript
// src/advanced/App.tsx
import { Provider } from "jotai";
import { PagesLayout } from "./components/layout/PagesLayout";

const App = () => {
  return (
    <Provider>
      <PagesLayout />
    </Provider>
  );
};

export default App;
```

#### 2.7 Atom 사용 예시

**기본 Atom 사용:**

```typescript
import { useAtom } from "jotai";
import { cartAtom } from "../atoms/cartAtoms";

const Cart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  // cart 읽기, setCart로 쓰기
};
```

**읽기만 할 때 (최적화):**

```typescript
import { useAtomValue } from "jotai";
import { totalAtom } from "../atoms/cartAtoms";

const CartTotal = () => {
  const total = useAtomValue(totalAtom);
  // total만 읽기 (쓰기 불필요)
};
```

**쓰기만 할 때 (최적화):**

```typescript
import { useSetAtom } from "jotai";
import { addToCartAtom } from "../atoms/cartAtoms";

const ProductCard = ({ product }) => {
  const addToCart = useSetAtom(addToCartAtom);
  // addToCart만 사용 (읽기 불필요)

  return <button onClick={() => addToCart(product)}>장바구니 담기</button>;
};
```

**Derived Atom 사용:**

```typescript
import { atom } from "jotai";
import { cartAtom, selectedCouponAtom } from "./cartAtoms";
import { calculateCartTotal } from "../models/cart";

export const totalAtom = atom((get) => {
  const cart = get(cartAtom);
  const coupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, coupon);
});
```

**Write-only Atom 사용:**

```typescript
import { atom } from "jotai";
import { cartAtom } from "./cartAtoms";
import { addItemToCart } from "../models/cart";

export const addToCartAtom = atom(
  null, // 읽기 없음
  (get, set, product: Product) => {
    const cart = get(cartAtom);
    const newCart = addItemToCart(cart, product);
    set(cartAtom, newCart);
  }
);
```

---

### 3단계: 컴포넌트 리팩토링

#### 3.1 App.tsx 수정

- [ ] `Provider`로 `PagesLayout` 감싸기

```typescript
import { Provider } from "jotai";

const App = () => {
  return (
    <Provider>
      <PagesLayout />
    </Provider>
  );
};
```

#### 3.2 PagesLayout 리팩토링

- [ ] `useApp()` hook에서 전역 상태로 이동한 것들 제거
- [ ] Jotai atoms에서 필요한 것만 가져오기
- [ ] props 전달 수 최소화 (20개 이상 → 5개 이하)

**Before:**

```typescript
const { cart, products, coupons, ... } = useApp();
<AdminPage
  activeTab={activeTab}
  products={products}
  // ... 20개 이상의 props
/>
```

**After:**

```typescript
// useApp()에서 전역 상태 제거
<AdminPage />
// 또는 최소한의 props만
```

#### 3.3 AdminPage 리팩토링

- [ ] Jotai atoms에서 필요한 상태 가져오기
  - `useAtom(activeTabAtom)`
  - `useAtom(productsAtom)`
  - `useAtom(couponsAtom)`
  - 등등
- [ ] Drilling props 제거
- [ ] Domain props는 유지 (예: `product`, `onEditProduct`)

#### 3.4 CartPage 리팩토링

- [ ] Jotai atoms에서 cart, products 등 가져오기
  - `useAtom(cartAtom)`
  - `useAtom(filteredProductsAtom)`
- [ ] 불필요한 props 전달 제거

#### 3.5 Header 리팩토링

- [ ] Jotai atoms에서 `isAdmin`, `searchTerm` 가져오기
  - `useAtom(isAdminAtom)`
  - `useAtom(searchTermAtom)`
- [ ] props 전달 제거

#### 3.6 각 Feature 컴포넌트 리팩토링

- [ ] `ProductCard`: Jotai atoms에서 필요한 것만 가져오기
- [ ] `Cart`: Jotai atoms에서 cart 정보 가져오기
- [ ] `ProductManagement`: Jotai atoms에서 products 가져오기
- [ ] `CouponManagement`: Jotai atoms에서 coupons 가져오기

---

### 4단계: Props 정리 및 최적화

#### 4.1 Domain Props 유지

- [ ] 컴포넌트의 핵심 기능을 위한 props는 유지
  - 예: `ProductCard`의 `product` prop
  - 예: `CartItem`의 `item` prop
  - 예: 콜백 props (`onAddToCart`, `onEditProduct` 등)

#### 4.2 Drilling Props 제거

- [ ] 중간 컴포넌트에서 사용하지 않는 props 제거
- [ ] 전역 상태로 관리되는 props 제거

#### 4.3 Props 타입 정리

- [ ] 각 컴포넌트의 Props 인터페이스 업데이트
- [ ] 불필요한 optional props 제거

---

### 5단계: 성능 최적화 (선택사항)

#### 5.1 Jotai 최적화

- [ ] Atom 분리로 세밀한 업데이트 (이미 완료)
- [ ] `useAtomValue` 사용: 읽기만 할 때는 값만 구독
- [ ] `useSetAtom` 사용: 쓰기만 할 때는 setter만 구독
- [ ] Derived atoms 사용: 계산된 상태는 derived atom으로 관리

---

### 6단계: 테스트 및 검증

#### 6.1 기능 테스트

- [ ] 장바구니 추가/제거 기능 확인
- [ ] 상품 검색 기능 확인
- [ ] 관리자 페이지 기능 확인
- [ ] 쿠폰 적용 기능 확인

#### 6.2 테스트 코드 통과

- [ ] `src/advanced/__tests__/origin.test.tsx` 실행
- [ ] 모든 테스트 케이스 통과 확인

#### 6.3 Props Drilling 제거 확인

- [ ] `PagesLayout`에서 전달하는 props 수가 크게 줄었는지 확인
- [ ] 중간 컴포넌트에서 사용하지 않는 props가 제거되었는지 확인

---

## 📝 체크리스트

### 필수 작업

- [ ] Jotai 설치 (`pnpm add jotai`)
- [ ] Atom 파일 생성 및 구현 (cartAtoms, productAtoms, adminAtoms, notificationAtoms)
- [ ] Derived atoms 생성 (total, filteredProducts 등)
- [ ] Write-only atoms 생성 (액션들)
- [ ] App.tsx에 Provider 추가
- [ ] PagesLayout에서 props 수 감소 확인 (20개 이상 → 5개 이하)
- [ ] 각 컴포넌트에서 Jotai atoms 사용
- [ ] Domain props는 유지하고 Drilling props 제거
- [ ] 모든 기능이 정상 작동하는지 확인
- [ ] 테스트 코드 통과

### 권장 작업

- [ ] 성능 최적화 (불필요한 리렌더링 방지)
- [ ] 코드 주석 및 문서화
- [ ] 타입 안정성 확인

---

## 🔍 판단 기준

### 전역 상태로 올려야 할 Props

- ✅ 여러 컴포넌트에서 공유되는 상태
- ✅ 중간 컴포넌트에서 사용하지 않고 전달만 하는 props
- ✅ 앱 전반에 걸쳐 사용되는 UI 상태 (예: `isAdmin`, `notifications`)

### Props로 전달해야 할 Props

- ✅ 컴포넌트의 핵심 기능을 위한 데이터 (예: `product`, `item`)
- ✅ 컴포넌트마다 다른 동작을 해야 하는 콜백 (예: `onAddToCart`, `onEditProduct`)
- ✅ 컴포넌트를 재사용할 때 다른 값을 전달해야 하는 props

---

## 💡 Jotai 참고 자료

### 공식 문서

- [Jotai 공식 문서](https://jotai.org/)
- [Jotai 시작하기](https://jotai.org/docs/basics/getting-started)
- [Atom 패턴 이해](https://jotai.org/docs/basics/concepts)
- [Derived state 관리](https://jotai.org/docs/basics/primitives#derived-atoms)
- [Write-only atoms](https://jotai.org/docs/basics/primitives#write-only-atoms)

### 주요 API

- `atom()` - 기본 atom 생성
- `atom((get) => ...)` - Derived atom (읽기 전용)
- `atom(null, (get, set, ...) => ...)` - Write-only atom
- `useAtom(atom)` - atom 읽기/쓰기
- `useAtomValue(atom)` - atom 읽기만
- `useSetAtom(atom)` - atom 쓰기만

---

## 🎓 학습 목표

이 심화과제를 통해 다음을 학습합니다:

1. **Jotai 전역 상태 관리 이해**

   - Atom 기반 상태 관리 패턴
   - Derived atoms를 통한 계산된 상태 관리
   - Write-only atoms를 통한 액션 관리
   - 전역 상태와 로컬 상태의 구분

2. **Props 설계 능력**

   - 어떤 props를 전역 상태로 올릴지 판단
   - Domain props vs Drilling props 구분
   - 컴포넌트 재사용성과 전역 상태의 균형

3. **아키텍처 개선**
   - Props Drilling 제거로 코드 가독성 향상
   - 컴포넌트 간 결합도 감소
   - 유지보수성 향상

---

## 📌 주의사항

1. **과도한 전역화 금지**

   - 모든 상태를 전역으로 올리지 말 것
   - 컴포넌트 내부에서만 사용되는 상태는 로컬 상태로 유지

2. **Domain Props 유지**

   - 컴포넌트의 핵심 기능을 위한 props는 반드시 유지
   - 예: `ProductCard`의 `product` prop은 필수

3. **성능 고려**

   - Jotai는 자동으로 최적화되지만, `useAtomValue`, `useSetAtom` 사용 권장
   - Derived atoms로 계산된 상태 관리
   - 필요한 Atom만 구독하도록 주의

4. **기능 유지**
   - 리팩토링 후에도 모든 기능이 정상 작동해야 함
   - 테스트 코드를 통과해야 함
