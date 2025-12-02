# Basic vs Advanced 비교 명세서

## 📋 목차

1. [개요](#개요)
2. [Props Drilling 문제 분석](#props-drilling-문제-분석)
3. [Basic 구조 분석](#basic-구조-분석)
4. [Advanced 구조 분석](#advanced-구조-분석)
5. [Jotai를 통한 해결 과정](#jotai를-통한-해결-과정)
6. [Jotai 원리 및 작동 방식](#jotai-원리-및-작동-방식)
7. [구체적인 비교 예시](#구체적인-비교-예시)
8. [장단점 비교](#장단점-비교)

---

## 개요

이 문서는 **Basic**과 **Advanced** 폴더의 구조적 차이점을 분석하고, **Props Drilling** 문제가 발생하는 이유와 **Jotai**를 사용한 해결 과정을 설명합니다.

### Jotai란?

**Jotai**는 React를 위한 **원자적(Atomic) 상태 관리 라이브러리**입니다. 

- **원자적(Atomic)**: 상태를 작은 단위(Atom)로 나누어 관리
- **전역 상태 관리**: React Context를 활용하여 전역적으로 상태 공유
- **Props Drilling 해결**: 컴포넌트 트리를 거치지 않고 직접 상태에 접근

### 핵심 아이디어: "전역 변수처럼 사용하되, React와 통합"

일반적인 전역 변수와 달리:
- ✅ React의 리렌더링 시스템과 통합
- ✅ 타입 안정성 보장
- ✅ 의존성 추적 및 자동 최적화

### 핵심 차이점

| 구분 | Basic | Advanced |
|------|-------|----------|
| **상태 관리** | React Hooks (useState, useCallback) | Jotai (Atom 기반) |
| **Props 전달** | Props Drilling 발생 | Props 없이 직접 Atom 접근 |
| **컴포넌트 간 통신** | Props를 통한 상위→하위 전달 | Atom을 통한 직접 접근 |
| **코드 복잡도** | Props 인터페이스가 복잡함 | Props 인터페이스 단순화 |

---

## Props Drilling 문제 분석

### Props Drilling이란?

**Props Drilling**은 컴포넌트 트리에서 데이터를 여러 레벨의 중간 컴포넌트를 거쳐 전달해야 하는 문제입니다. 중간 컴포넌트들은 해당 데이터를 사용하지 않지만, 하위 컴포넌트에 전달하기 위해 props를 받아야 합니다.

### Props Drilling이 발생하는 이유

#### 1. **단방향 데이터 흐름 (Unidirectional Data Flow)**

React는 단방향 데이터 흐름을 따릅니다:
- 데이터는 **상위 컴포넌트 → 하위 컴포넌트**로만 전달
- 하위 컴포넌트는 직접 상위 컴포넌트의 상태에 접근할 수 없음

```
App (상태 소유)
  └─ PagesLayout (props 전달만)
      └─ CartPage (props 전달만)
          └─ ProductCard (실제 사용)
```

#### 2. **상태 소유 위치와 사용 위치의 불일치**

- **상태 소유**: `useApp` Hook에서 모든 상태 관리
- **실제 사용**: 깊은 하위 컴포넌트 (`ProductCard`, `CartItem` 등)

#### 3. **컴포넌트 계층 구조**

```
App
  └─ PagesLayout (52개 props)
      ├─ Header (4개 props)
      ├─ CartPage (13개 props)
      │   ├─ ProductCard (4개 props)
      │   └─ Cart (10개 props)
      │       ├─ CartItem (4개 props)
      │       └─ CouponSelector (4개 props)
      └─ AdminPage (20개 props)
          ├─ ProductManagement (10개 props)
          └─ CouponManagement (8개 props)
```

### Basic에서 Props Drilling 발생 예시

#### 예시 1: `PagesLayout.tsx`

```typescript
// Basic: PagesLayout.tsx
export const PagesLayout = () => {
  const {
    // 52개의 상태와 함수를 useApp에서 받음
    searchTerm,
    cart,
    addToCart,
    // ... 49개 더
  } = useApp();

  return (
    <CartPage
      searchTerm={searchTerm}        // ← Props 전달
      cart={cart}                    // ← Props 전달
      onAddToCart={addToCart}        // ← Props 전달
      // ... 10개 더
    />
  );
};
```

#### 예시 2: `CartPage.tsx`

```typescript
// Basic: CartPage.tsx
export const CartPage = ({ 
  searchTerm,        // ← 받은 props
  cart,              // ← 받은 props
  onAddToCart,      // ← 받은 props
  // ... 10개 더
}: CartPageProps) => {
  return (
    <ProductCard
      product={product}
      onAddToCart={onAddToCart}      // ← 다시 전달
      formatPrice={formatPrice}       // ← 다시 전달
      // ...
    />
  );
};
```

#### 예시 3: `ProductCard.tsx`

```typescript
// Basic: ProductCard.tsx
export const ProductCard = ({
  product,
  onAddToCart,      // ← 실제로 사용하는 곳
  formatPrice,      // ← 실제로 사용하는 곳
}: ProductCardProps) => {
  return (
    <button onClick={() => onAddToCart(product)}>
      장바구니 담기
    </button>
  );
};
```

### Props Drilling의 문제점

1. **코드 가독성 저하**
   - 중간 컴포넌트가 불필요한 props를 받아야 함
   - Props 인터페이스가 복잡해짐

2. **유지보수 어려움**
   - Props 구조 변경 시 모든 중간 컴포넌트 수정 필요
   - 타입 정의가 복잡해짐

3. **컴포넌트 재사용성 저하**
   - 특정 props 구조에 종속됨
   - 독립적으로 사용하기 어려움

4. **성능 이슈 (잠재적)**
   - 불필요한 props 전달로 인한 리렌더링 가능성

---

## Basic 구조 분석

### 아키텍처

```
App.tsx
  └─ PagesLayout.tsx (useApp Hook 사용)
      ├─ Header.tsx (props 전달)
      ├─ CartPage.tsx (props 전달)
      │   ├─ ProductCard.tsx (props 사용)
      │   └─ Cart.tsx (props 전달)
      │       ├─ CartItem.tsx (props 사용)
      │       └─ CouponSelector.tsx (props 사용)
      └─ AdminPage.tsx (props 전달)
```

### 상태 관리 흐름

```
useApp Hook
  ├─ useAppUI (UI 상태)
  │   ├─ useNotifications
  │   ├─ searchTerm
  │   └─ isAdmin
  └─ useShoppingMall (비즈니스 로직)
      ├─ useCart
      ├─ useProducts
      ├─ useCoupons
      └─ useAdminForm
```

### 특징

1. **중앙 집중식 상태 관리**
   - `useApp` Hook에서 모든 상태와 함수를 조합
   - `PagesLayout`에서 한 번에 받아서 하위로 전달

2. **Props 기반 통신**
   - 모든 데이터와 함수를 props로 전달
   - 컴포넌트 간 직접 통신 불가

3. **명시적 데이터 흐름**
   - Props를 통해 데이터 흐름이 명확히 보임
   - 디버깅 시 추적 가능

---

## Advanced 구조 분석

### 아키텍처

```
App.tsx (Provider로 감싸기)
  └─ PagesLayout.tsx (Atom 직접 사용)
      ├─ Header.tsx (Atom 직접 사용)
      ├─ CartPage.tsx (Atom 직접 사용)
      │   ├─ ProductCard.tsx (Atom 직접 사용)
      │   └─ Cart.tsx (Atom 직접 사용)
      │       ├─ CartItem.tsx (Atom 직접 사용)
      │       └─ CouponSelector.tsx (Atom 직접 사용)
      └─ AdminPage.tsx (Atom 직접 사용)
```

### 상태 관리 흐름

```
Jotai Atoms
  ├─ cartAtoms.ts
  │   ├─ cartAtom (기본 atom)
  │   ├─ totalAtom (derived atom)
  │   └─ addToCartAtom (write-only atom)
  ├─ productAtoms.ts
  │   ├─ productsAtom
  │   └─ filteredProductsAtom (derived)
  ├─ adminAtoms.ts
  └─ notificationAtoms.ts
```

### 특징

1. **분산된 상태 관리**
   - 각 도메인별로 Atom 파일 분리
   - 컴포넌트에서 필요한 Atom만 직접 사용

2. **Props 없는 통신**
   - 컴포넌트가 Atom을 직접 구독/업데이트
   - 중간 컴포넌트를 거치지 않음

3. **암시적 데이터 흐름**
   - Atom을 통한 전역 상태 공유
   - Props 전달 불필요

---

## Jotai를 통한 해결 과정

### 1단계: Atom 정의

#### 기본 Atom (Primitive Atom)

```typescript
// atoms/cartAtoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// localStorage와 자동 동기화
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

// 일반 상태
export const selectedCouponAtom = atom<Coupon | null>(null);
```

#### Derived Atom (파생 Atom)

```typescript
// atoms/cartAtoms.ts
export const totalAtom = atom((get) => {
  const cart = get(cartAtom);
  const coupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, coupon);
});

export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});
```

#### Write-only Atom (액션 Atom)

```typescript
// atoms/cartAtoms.ts
export const addToCartAtom = atom(
  null,  // read 함수 없음
  (get, set, product: Product) => {
    const cart = get(cartAtom);
    const remainingStock = getRemainingStock(product, cart);
    
    if (remainingStock <= 0) {
      return { success: false, message: '재고가 부족합니다!' };
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      const newCart = updateCartItemQuantity(cart, product.id, newQuantity);
      set(cartAtom, newCart);
    } else {
      const newCart = addItemToCart(cart, product);
      set(cartAtom, newCart);
    }

    return { success: true, message: '장바구니에 담았습니다' };
  }
);
```

### 2단계: Provider 설정

```typescript
// App.tsx
import { Provider } from "jotai";
import { PagesLayout } from "./components/layout/PagesLayout";

const App = () => {
  return (
    <Provider>
      <PagesLayout />
    </Provider>
  );
};
```

### 3단계: 컴포넌트에서 Atom 사용

#### 읽기 (Read)

```typescript
// components/pages/CartPage.tsx
import { useAtomValue } from 'jotai';
import { cartAtom, totalAtom } from '../../atoms/cartAtoms';

export const CartPage = () => {
  const cart = useAtomValue(cartAtom);      // 읽기만
  const total = useAtomValue(totalAtom);   // 읽기만
  
  return <div>{/* ... */}</div>;
};
```

#### 쓰기 (Write)

```typescript
// components/features/product/ProductCard.tsx
import { useSetAtom } from 'jotai';
import { addToCartAtom } from '../../../atoms/cartAtoms';

export const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useSetAtom(addToCartAtom);  // 쓰기만
  
  const handleAddToCart = () => {
    const result = addToCart(product);
    // ...
  };
  
  return <button onClick={handleAddToCart}>장바구니 담기</button>;
};
```

#### 읽기 + 쓰기

```typescript
// components/layout/Header.tsx
import { useAtom, useAtomValue } from 'jotai';
import { searchTermAtom, isAdminAtom } from '../../atoms/adminAtoms';

export const Header = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);  // 읽기 + 쓰기
  const isAdmin = useAtomValue(isAdminAtom);                     // 읽기만
  
  return (
    <input 
      value={searchTerm} 
      onChange={(e) => setSearchTerm(e.target.value)} 
    />
  );
};
```

### 4단계: Props 제거

#### Before (Basic)

```typescript
// PagesLayout.tsx
export const PagesLayout = () => {
  const { cart, addToCart, /* ... */ } = useApp();
  
  return (
    <CartPage
      cart={cart}
      onAddToCart={addToCart}
      // ... 11개 더
    />
  );
};

// CartPage.tsx
export const CartPage = ({ cart, onAddToCart, /* ... */ }: CartPageProps) => {
  return (
    <ProductCard
      onAddToCart={onAddToCart}
      // ...
    />
  );
};
```

#### After (Advanced)

```typescript
// PagesLayout.tsx
export const PagesLayout = () => {
  const isAdmin = useAtomValue(isAdminAtom);
  
  return (
    <div>
      {isAdmin ? <AdminPage /> : <CartPage />}
    </div>
  );
};

// CartPage.tsx
export const CartPage = () => {
  const cart = useAtomValue(cartAtom);
  // 필요한 Atom만 직접 사용
  
  return (
    <ProductCard product={product} />
  );
};

// ProductCard.tsx
export const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useSetAtom(addToCartAtom);
  // 직접 Atom 사용, props 없음
};
```

---

## Jotai 원리 및 작동 방식

### Jotai가 Props Drilling을 해결하는 핵심 원리

#### 비유: 우체통 vs 전화

**Basic 방식 (Props Drilling) = 우체통**
```
편지를 보내려면:
1. 집 → 우체통 (상위 컴포넌트)
2. 우체통 → 중간 집 (중간 컴포넌트)
3. 중간 집 → 중간 집 (또 다른 중간 컴포넌트)
4. 중간 집 → 최종 목적지 (실제 사용 컴포넌트)
```
- 편지(Props)를 여러 집을 거쳐 전달해야 함
- 중간 집들은 편지 내용을 모르지만 전달해야 함

**Advanced 방식 (Jotai) = 전화**
```
전화를 걸려면:
1. 전화번호(Atom)를 알고 있으면 직접 연결
```
- 중간 단계 없이 직접 통신
- 필요한 곳에서 직접 Atom에 접근

#### 실제 작동 원리

**1. 전역 저장소 (Provider)**

```typescript
// App.tsx
<Provider>  {/* ← 전역 저장소 생성 */}
  <PagesLayout />
</Provider>
```

`Provider`는 React Context를 사용하여 전역 저장소를 만듭니다. 이 저장소에 모든 Atom의 상태가 저장됩니다.

**2. Atom 정의 (전역 변수처럼)**

```typescript
// atoms/cartAtoms.ts
export const cartAtom = atom<CartItem[]>([]);  // ← 전역 변수처럼 정의
```

Atom은 전역 변수처럼 정의되지만, React의 리렌더링 시스템과 통합되어 있습니다.

**3. 컴포넌트에서 직접 접근**

```typescript
// ProductCard.tsx
const ProductCard = () => {
  const cart = useAtomValue(cartAtom);  // ← 전역 저장소에서 직접 가져옴
  const addToCart = useSetAtom(addToCartAtom);  // ← 전역 저장소에 직접 저장
};
```

`useAtomValue`와 `useSetAtom`은 전역 저장소(Provider)에서 직접 값을 가져오거나 설정합니다.

#### 왜 Props Drilling이 해결되는가?

**Before (Props Drilling)**
```
App (상태 소유)
  └─ PagesLayout (props 전달만, 사용 안 함)
      └─ CartPage (props 전달만, 사용 안 함)
          └─ ProductCard (실제 사용)
```

**After (Jotai)**
```
App (Provider로 전역 저장소 생성)
  ├─ PagesLayout (Atom 직접 접근)
  ├─ CartPage (Atom 직접 접근)
  └─ ProductCard (Atom 직접 접근) ← 중간 단계 없이!
```

**핵심 차이점**:
- **Basic**: 상태가 상위 컴포넌트에 있고, props로 전달해야 함
- **Advanced**: 상태가 전역 저장소(Provider)에 있고, 어디서든 직접 접근 가능

### Atom의 개념

**Atom**은 Jotai의 핵심 개념으로, 상태의 최소 단위입니다.

```typescript
// 기본 Atom
const countAtom = atom(0);

// Derived Atom (읽기 전용)
const doubledAtom = atom((get) => get(countAtom) * 2);

// Write-only Atom (쓰기 전용)
const incrementAtom = atom(
  null,
  (get, set) => {
    set(countAtom, get(countAtom) + 1);
  }
);
```

### Atom의 종류

#### 1. Primitive Atom (기본 Atom)

```typescript
const valueAtom = atom(0);
const stringAtom = atom('hello');
const objectAtom = atom({ name: 'John' });
```

#### 2. Derived Atom (파생 Atom)

다른 Atom의 값을 기반으로 계산된 값을 제공합니다.

```typescript
const cartAtom = atomWithStorage<CartItem[]>('cart', []);
const totalAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
});
```

**특징**:
- 자동으로 의존성 추적
- 의존하는 Atom이 변경되면 자동으로 재계산
- 메모이제이션 자동 처리

#### 3. Write-only Atom (액션 Atom)

상태를 변경하는 액션만 제공합니다.

```typescript
const addToCartAtom = atom(
  null,  // read 함수 없음
  (get, set, product: Product) => {
    const cart = get(cartAtom);
    const newCart = [...cart, { product, quantity: 1 }];
    set(cartAtom, newCart);
  }
);
```

### Jotai의 작동 원리 (상세)

#### 1. Provider와 Context - 전역 저장소 만들기

```typescript
// App.tsx
<Provider>  {/* ← React Context를 사용한 전역 저장소 */}
  <PagesLayout />
</Provider>
```

**내부 동작**:
```typescript
// Jotai 내부 (간소화된 버전)
const StoreContext = createContext();

function Provider({ children }) {
  const store = useRef(new Map());  // Atom 상태를 저장하는 Map
  
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}
```

- `Provider`는 React Context를 사용하여 전역 저장소를 만듭니다
- 이 저장소에 모든 Atom의 현재 값이 저장됩니다
- 각 Provider는 독립적인 Atom 스토어를 가집니다

**왜 이것이 Props Drilling을 해결하는가?**
- 전역 저장소가 있으면, 어느 컴포넌트에서든 Context를 통해 접근 가능
- Props로 전달할 필요가 없음

#### 2. 구독 메커니즘 - 자동 리렌더링

```typescript
const cart = useAtomValue(cartAtom);
```

**내부 동작** (간소화):
```typescript
function useAtomValue(atom) {
  const store = useContext(StoreContext);
  const [value, setValue] = useState(() => store.get(atom));
  
  useEffect(() => {
    // Atom이 변경되면 자동으로 업데이트
    const unsubscribe = store.subscribe(atom, (newValue) => {
      setValue(newValue);
    });
    return unsubscribe;
  }, [atom]);
  
  return value;
}
```

- `useAtomValue`는 Atom을 **구독(subscribe)**합니다
- Atom 값이 변경되면 컴포넌트가 자동으로 리렌더링됩니다
- React의 `useState`와 유사하지만, 전역 상태를 다룹니다

**Props Drilling과의 차이**:
- **Props**: 상위 컴포넌트가 변경되어야 하위 컴포넌트가 리렌더링
- **Jotai**: Atom이 변경되면 구독한 컴포넌트만 리렌더링 (직접 연결)

#### 3. 의존성 추적 - 자동 재계산

```typescript
const totalAtom = atom((get) => {
  const cart = get(cartAtom);        // 의존성 1
  const coupon = get(selectedCouponAtom);  // 의존성 2
  return calculateCartTotal(cart, coupon);
});
```

**내부 동작**:
```typescript
// Derived Atom이 계산될 때
function computeDerivedAtom(atom) {
  const dependencies = new Set();  // 의존성 추적
  
  const get = (depAtom) => {
    dependencies.add(depAtom);  // 의존성 기록
    return store.get(depAtom);
  };
  
  const value = atom.read(get);
  
  // 의존하는 Atom이 변경되면 자동으로 재계산
  dependencies.forEach(dep => {
    store.subscribe(dep, () => {
      recompute(atom);
    });
  });
}
```

- `get()`을 호출하면 자동으로 의존성을 추적합니다
- 의존하는 Atom이 변경되면 자동으로 재계산됩니다
- **메모이제이션**: 같은 입력에 대해서는 재계산하지 않습니다

**Props Drilling과의 차이**:
- **Props**: 계산된 값을 상위에서 계산해서 전달해야 함
- **Jotai**: 필요한 곳에서 직접 계산된 값을 가져올 수 있음

#### 4. 최적화 - 세밀한 리렌더링

**선택적 구독**:
```typescript
// Component A
const cart = useAtomValue(cartAtom);  // cartAtom만 구독

// Component B  
const total = useAtomValue(totalAtom);  // totalAtom만 구독
```

- 각 컴포넌트는 필요한 Atom만 구독합니다
- `cartAtom`이 변경되어도 `Component B`는 리렌더링되지 않습니다

**Props Drilling과의 차이**:
- **Props**: 상위 컴포넌트가 리렌더링되면 모든 하위 컴포넌트도 리렌더링 가능
- **Jotai**: 변경된 Atom만 구독한 컴포넌트만 리렌더링

### 왜 Jotai가 Props Drilling을 해결하는가? (요약)

1. **전역 저장소 (Provider)**
   - 상태가 전역에 저장되어 있어 어디서든 접근 가능
   - Props로 전달할 필요 없음

2. **직접 접근 (useAtomValue, useSetAtom)**
   - 컴포넌트가 필요한 Atom을 직접 구독/업데이트
   - 중간 컴포넌트를 거치지 않음

3. **자동 동기화**
   - Atom이 변경되면 구독한 컴포넌트만 자동 리렌더링
   - Props 전달 없이도 상태 동기화

4. **의존성 추적**
   - Derived Atom은 자동으로 의존성을 추적하고 재계산
   - Props로 계산된 값을 전달할 필요 없음

### Atom의 장점

1. **세밀한 리렌더링**
   - 특정 Atom만 변경되면 해당 Atom을 구독한 컴포넌트만 리렌더링
   - 불필요한 리렌더링 최소화

2. **타입 안정성**
   - TypeScript와 완벽한 통합
   - Atom 타입이 자동으로 추론됨

3. **코드 분할**
   - Atom을 파일별로 분리 가능
   - 필요한 Atom만 import

4. **테스트 용이성**
   - Atom을 독립적으로 테스트 가능
   - Mock Provider로 테스트 가능

---

## 구체적인 비교 예시

### 예시 1: 장바구니에 상품 추가

#### Basic 방식

```typescript
// 1. useApp Hook에서 함수 정의
const useApp = () => {
  const { addToCart } = useCart();
  return { addToCart };
};

// 2. PagesLayout에서 받아서 전달
const PagesLayout = () => {
  const { addToCart } = useApp();
  return <CartPage onAddToCart={addToCart} />;
};

// 3. CartPage에서 받아서 전달
const CartPage = ({ onAddToCart }: CartPageProps) => {
  return <ProductCard onAddToCart={onAddToCart} />;
};

// 4. ProductCard에서 실제 사용
const ProductCard = ({ onAddToCart }: ProductCardProps) => {
  return <button onClick={() => onAddToCart(product)}>담기</button>;
};
```

**문제점**:
- 4단계를 거쳐야 함
- 중간 컴포넌트들이 불필요한 props를 받아야 함

#### Advanced 방식

```typescript
// 1. Atom 정의
export const addToCartAtom = atom(
  null,
  (get, set, product: Product) => {
    // 로직
  }
);

// 2. ProductCard에서 직접 사용
const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useSetAtom(addToCartAtom);
  return <button onClick={() => addToCart(product)}>담기</button>;
};
```

**장점**:
- 1단계로 직접 접근
- 중간 컴포넌트 수정 불필요

### 예시 2: 장바구니 총액 표시

#### Basic 방식

```typescript
// 1. useApp에서 계산
const useApp = () => {
  const { total } = useCart();
  return { total };
};

// 2. PagesLayout에서 전달
const PagesLayout = () => {
  const { total } = useApp();
  return <CartPage total={total} />;
};

// 3. CartPage에서 전달
const CartPage = ({ total }: CartPageProps) => {
  return <Cart total={total} />;
};

// 4. Cart에서 표시
const Cart = ({ total }: CartProps) => {
  return <div>{total.totalAfterDiscount}원</div>;
};
```

#### Advanced 방식

```typescript
// 1. Derived Atom 정의
export const totalAtom = atom((get) => {
  const cart = get(cartAtom);
  const coupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, coupon);
});

// 2. Cart에서 직접 사용
const Cart = () => {
  const total = useAtomValue(totalAtom);
  return <div>{total.totalAfterDiscount}원</div>;
};
```

### 예시 3: 검색어 입력

#### Basic 방식

```typescript
// PagesLayout
const PagesLayout = () => {
  const { searchTerm, setSearchTerm } = useApp();
  return (
    <Header 
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    />
  );
};

// Header
const Header = ({ searchTerm, onSearchChange }: HeaderProps) => {
  return (
    <input 
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
};
```

#### Advanced 방식

```typescript
// Header
const Header = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};
```

---

## 장단점 비교

### Basic 방식

#### 장점

1. **명시적 데이터 흐름**
   - Props를 통해 데이터 흐름이 명확
   - 디버깅 시 추적 용이

2. **타입 안정성**
   - Props 인터페이스로 타입 체크
   - 컴파일 타임에 오류 발견

3. **컴포넌트 독립성**
   - Props만 받으면 독립적으로 동작
   - 테스트 시 Mock props 전달 가능

4. **React 표준 패턴**
   - React의 권장 패턴
   - 추가 라이브러리 불필요

#### 단점

1. **Props Drilling**
   - 중간 컴포넌트가 불필요한 props를 받아야 함
   - Props 인터페이스가 복잡해짐

2. **유지보수 어려움**
   - Props 구조 변경 시 모든 중간 컴포넌트 수정
   - 코드 변경 범위가 넓음

3. **코드 가독성 저하**
   - 많은 props로 인한 코드 복잡도 증가
   - 중간 컴포넌트의 역할이 불명확해짐

### Advanced 방식 (Jotai)

#### 장점

1. **Props Drilling 해결**
   - 필요한 컴포넌트에서 직접 Atom 접근
   - 중간 컴포넌트 수정 불필요

2. **코드 간결성**
   - Props 인터페이스 단순화
   - 컴포넌트 코드가 간결해짐

3. **세밀한 리렌더링**
   - 변경된 Atom만 구독한 컴포넌트만 리렌더링
   - 성능 최적화 자동 처리

4. **유지보수 용이**
   - Atom만 수정하면 모든 구독 컴포넌트에 반영
   - 코드 변경 범위가 좁음

5. **코드 분할 용이**
   - Atom을 도메인별로 분리
   - 필요한 Atom만 import

#### 단점

1. **암시적 데이터 흐름**
   - Atom을 통한 전역 상태 공유
   - 데이터 흐름 추적이 어려울 수 있음

2. **추가 라이브러리**
   - Jotai 라이브러리 필요
   - 학습 곡선 존재

3. **디버깅 복잡도**
   - Atom 상태 변경 추적이 어려울 수 있음
   - React DevTools와 통합 필요

4. **컴포넌트 의존성**
   - 특정 Atom에 의존
   - 독립적 테스트 시 Mock Provider 필요

---

## 결론

### 언제 Basic 방식을 사용할까?

- **소규모 프로젝트**: Props Drilling이 크게 문제되지 않는 경우
- **명시적 데이터 흐름이 중요한 경우**: 데이터 흐름을 명확히 추적해야 하는 경우
- **추가 라이브러리 없이 구현**: React만으로 해결하고 싶은 경우

### 언제 Advanced 방식을 사용할까?

- **대규모 프로젝트**: Props Drilling이 심각한 문제가 되는 경우
- **복잡한 상태 관리**: 여러 컴포넌트에서 공유하는 상태가 많은 경우
- **성능 최적화가 중요한 경우**: 세밀한 리렌더링이 필요한 경우

### 권장 사항

1. **작은 프로젝트**: Basic 방식으로 시작
2. **Props Drilling이 심각해지면**: Advanced 방식으로 전환
3. **점진적 마이그레이션**: 필요한 부분만 Jotai로 전환 가능

---

**마지막 업데이트**: 2025-12-02

